import os
import uuid
import pandas as pd
import torch
from threading import Lock
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from sdv.metadata import SingleTableMetadata
from sdv.single_table import CTGANSynthesizer

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score


# =====================================================
# APP INIT
# =====================================================

app = FastAPI(title="AI Synthetic Data Generator")

frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
)

allowed_origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    # Keep methods/headers explicit for safer defaults while preserving upload flow.
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

# =====================================================
# CONFIGURATION
# =====================================================

TEMP_DIR = "temp"
MAX_ROWS = 3000
EPOCHS = 50
MAX_FILE_SIZE_MB = 10

os.makedirs(TEMP_DIR, exist_ok=True)

# =====================================================
# THREAD SAFE JOB STORE
# =====================================================

jobs = {}
jobs_lock = Lock()

# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {"message": "AI Synthetic Data Generator Running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ai-synthetic-data-generator"
    }


# =====================================================
# CORE PROCESSING FUNCTION
# =====================================================

def process_file(job_id: str, file_path: str):
    try:
        # -------------------------------
        # Start Processing
        # -------------------------------
        with jobs_lock:
            jobs[job_id]["status"] = "processing"
            jobs[job_id]["progress"] = 5

        df = pd.read_csv(file_path)

        if df.empty:
            raise Exception("Uploaded CSV is empty.")

        # -------------------------------
        # Limit size
        # -------------------------------
        if len(df) > MAX_ROWS:
            df = df.sample(MAX_ROWS, random_state=42)

        with jobs_lock:
            jobs[job_id]["progress"] = 20

        # -------------------------------
        # Detect metadata
        # -------------------------------
        metadata = SingleTableMetadata()
        metadata.detect_from_dataframe(df)

        for column in df.columns:
            if df[column].dtype == "object" or df[column].nunique() < 20:
                metadata.update_column(column_name=column, sdtype="categorical")

        with jobs_lock:
            jobs[job_id]["progress"] = 40

        # -------------------------------
        # Train CTGAN
        # -------------------------------
        synthesizer = CTGANSynthesizer(
            metadata=metadata,
            epochs=EPOCHS,
            verbose=False
        )

        synthesizer.fit(df)

        with jobs_lock:
            jobs[job_id]["progress"] = 70

        # -------------------------------
        # Generate synthetic data
        # -------------------------------
        synthetic_df = synthesizer.sample(len(df))

        with jobs_lock:
            jobs[job_id]["progress"] = 80

        # -------------------------------
        # Evaluation Section
        # -------------------------------
        metrics = {}
        comparison = {}

        target_column = df.columns[-1]

        if df[target_column].nunique() <= 20:

            X = df.drop(columns=[target_column])
            y = df[target_column]

            X = pd.get_dummies(X)

            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.3, random_state=42
            )

            # Train on real data
            model_real = RandomForestClassifier()
            model_real.fit(X_train, y_train)
            y_pred_real = model_real.predict(X_test)

            real_accuracy = accuracy_score(y_test, y_pred_real)

            # Train on synthetic data
            synthetic_X = synthetic_df.drop(columns=[target_column])
            synthetic_y = synthetic_df[target_column]
            synthetic_X = pd.get_dummies(synthetic_X)

            synthetic_X = synthetic_X.reindex(columns=X.columns, fill_value=0)

            model_syn = RandomForestClassifier()
            model_syn.fit(synthetic_X, synthetic_y)
            y_pred_syn = model_syn.predict(X_test)

            synthetic_accuracy = accuracy_score(y_test, y_pred_syn)

            precision = precision_score(y_test, y_pred_syn, average="weighted", zero_division=0)
            recall = recall_score(y_test, y_pred_syn, average="weighted", zero_division=0)
            f1 = f1_score(y_test, y_pred_syn, average="weighted", zero_division=0)

            metrics = {
                "real_model": {
                    "accuracy": round(real_accuracy, 4)
                },
                "synthetic_model": {
                    "accuracy": round(synthetic_accuracy, 4),
                    "precision": round(precision, 4),
                    "recall": round(recall, 4),
                    "f1_score": round(f1, 4)
                },
                "accuracy_difference": round(real_accuracy - synthetic_accuracy, 4)
            }

        # -------------------------------
        # Statistical Comparison (Mean)
        # -------------------------------
        comparison = {
            "real_mean": df.mean(numeric_only=True).round(4).to_dict(),
            "synthetic_mean": synthetic_df.mean(numeric_only=True).round(4).to_dict()
        }

        with jobs_lock:
            jobs[job_id]["progress"] = 95

        # -------------------------------
        # Save synthetic file
        # -------------------------------
        output_path = os.path.join(TEMP_DIR, f"{job_id}_synthetic.csv")
        synthetic_df.to_csv(output_path, index=False)

        # -------------------------------
        # Save results to job store
        # -------------------------------
        with jobs_lock:
            jobs[job_id]["status"] = "completed"
            jobs[job_id]["progress"] = 100
            jobs[job_id]["output_path"] = output_path
            jobs[job_id]["metrics"] = metrics
            jobs[job_id]["comparison"] = comparison
            jobs[job_id]["preview"] = {
                "real_sample": df.head(5).to_dict(orient="records"),
                "synthetic_sample": synthetic_df.head(5).to_dict(orient="records")
            }

        # Cleanup GPU
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    except Exception as e:
        with jobs_lock:
            jobs[job_id]["status"] = "failed"
            jobs[job_id]["progress"] = 0
            jobs[job_id]["error"] = str(e)


# =====================================================
# UPLOAD
# =====================================================

@app.post("/upload")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed.")

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)

    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail="File exceeds size limit.")

    job_id = str(uuid.uuid4())
    file_path = os.path.join(TEMP_DIR, f"{job_id}.csv")

    with open(file_path, "wb") as f:
        f.write(contents)

    with jobs_lock:
        jobs[job_id] = {
            "status": "queued",
            "progress": 0,
            "metrics": None,
            "comparison": None,
            "preview": None,
            "error": None
        }

    background_tasks.add_task(process_file, job_id, file_path)

    return {
        "job_id": job_id,
        "message": "File uploaded successfully."
    }


# =====================================================
# STATUS
# =====================================================

@app.get("/status/{job_id}")
def check_status(job_id: str):

    with jobs_lock:
        if job_id not in jobs:
            raise HTTPException(status_code=404, detail="Invalid Job ID.")

        return {
            "job_id": job_id,
            "status": jobs[job_id]["status"],
            "progress": jobs[job_id]["progress"],
            "metrics": jobs[job_id].get("metrics"),
            "comparison": jobs[job_id].get("comparison"),
            "preview": jobs[job_id].get("preview"),
            "error": jobs[job_id].get("error")
        }


# =====================================================
# DOWNLOAD + AUTO DELETE
# =====================================================

@app.get("/download/{job_id}")
def download_file(job_id: str, background_tasks: BackgroundTasks):

    with jobs_lock:
        if job_id not in jobs:
            raise HTTPException(status_code=404, detail="Invalid Job ID.")

        if jobs[job_id]["status"] != "completed":
            raise HTTPException(status_code=400, detail="File not ready.")

        output_path = jobs[job_id]["output_path"]
        input_path = os.path.join(TEMP_DIR, f"{job_id}.csv")

    def cleanup():
        try:
            if os.path.exists(output_path):
                os.remove(output_path)
            if os.path.exists(input_path):
                os.remove(input_path)
        finally:
            with jobs_lock:
                jobs.pop(job_id, None)

    background_tasks.add_task(cleanup)

    return FileResponse(
        path=output_path,
        media_type="text/csv",
        filename="synthetic_data.csv"
    )
