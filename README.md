# Synthetic Dataset Generator

Web application for generating synthetic tabular datasets from uploaded CSV files.

The project combines a FastAPI backend with a React + Vite frontend. A user uploads a CSV file, the backend learns the dataset structure with a CTGAN model from the SDV library, then generates a synthetic CSV with the same shape. The frontend shows upload progress, processing status, quality metrics, comparison charts, and a download button for the generated file.

## What it does

- Accepts CSV uploads up to 10 MB.
- Limits processing to a maximum of 3000 rows for performance.
- Detects column metadata automatically.
- Trains a CTGAN-based synthesizer on the uploaded table.
- Produces a synthetic CSV with the same number of rows as the sampled input.
- Evaluates the result with a RandomForestClassifier on the last column when it looks like a classification target.
- Returns real-vs-synthetic metrics, mean comparisons, and data previews.
- Lets the user download the generated synthetic dataset.

## AI / ML model used

The synthetic data generator uses `CTGANSynthesizer` from the `sdv` package. CTGAN is a conditional tabular generative adversarial network designed for structured data.

Important note: the RandomForestClassifier in the backend is not the synthetic generator. It is used only to compare how well a model trained on synthetic data performs against one trained on real data.

## How it works

1. The user uploads a CSV file from the frontend.
2. The frontend sends the file to the FastAPI backend at `/upload`.
3. The backend stores the file in a temporary folder and creates a job ID.
4. A background worker reads the CSV, detects metadata, and trains CTGAN.
5. The backend samples synthetic rows, computes evaluation metrics, and saves the output CSV.
6. The frontend polls `/status/{job_id}` until processing is complete.
7. When finished, the results section renders charts, tables, and download controls.
8. The user downloads the synthetic CSV from `/download/{job_id}`.

## Tech stack

### Backend

- FastAPI
- pandas
- SDV
- PyTorch
- scikit-learn
- Uvicorn

### Frontend

- React 19
- Vite
- Axios
- Recharts

## Backend endpoints

- `GET /` - basic service message
- `GET /health` - health check used by the frontend
- `POST /upload` - accepts a CSV file and starts processing
- `GET /status/{job_id}` - returns job progress, metrics, and preview data
- `GET /download/{job_id}` - downloads the generated synthetic CSV

## Local setup

### Backend

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment variables

- `FRONTEND_ORIGINS` - comma-separated list of allowed frontend URLs for CORS.
- `VITE_API_BASE_URL` - backend base URL for the frontend API client.

## Project notes

- Temporary upload and output files are written to `backend/temp`.
- The backend cleans up generated files after the download endpoint is used.
- The frontend includes a live API health indicator and polling-based progress updates.

## Report

See [PROJECT_REPORT.md](PROJECT_REPORT.md) for a deeper explanation of the system, architecture, and workflow.