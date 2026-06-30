# Synthetic Dataset Generator - Project Report

## 1. Project summary

Synthetic Dataset Generator is a full-stack web application for creating synthetic versions of tabular CSV datasets. It is built for users who want to upload a real dataset, generate a privacy-preserving synthetic dataset, inspect quality metrics, and download the result.

The application is intentionally simple from the user perspective:

- upload a CSV file
- wait for processing
- review the results
- download the synthetic dataset

Behind that flow, the backend performs metadata detection, CTGAN training, synthetic sampling, and evaluation against the original data.

## 2. What the project does

The application solves a common data engineering and privacy problem: how to create realistic test data without distributing the original dataset.

It can be used to:

- create demo data for applications
- share schema-like data without exposing private records
- test frontend or backend systems with realistic rows
- compare how similar synthetic data is to the original data

The project is not a chatbot, image generator, or text model. It is a tabular data synthesis system.

## 3. Architecture overview

The codebase is split into two major parts.

### Backend

The FastAPI backend lives in `backend/main.py`. It handles:

- upload validation
- temporary file storage
- background processing
- CTGAN training and sampling
- progress tracking
- quality metrics
- synthetic file download

### Frontend

The React + Vite frontend lives under `frontend/src`. It handles:

- dataset upload UI
- live backend health status
- progress polling
- visualization of metrics and comparisons
- download action

## 4. How the backend works

### Upload flow

When a CSV file is uploaded, the backend:

1. validates the file extension
2. checks the file size limit of 10 MB
3. stores the raw file in `backend/temp`
4. creates a job ID
5. launches background processing

### Processing flow

The core processing logic does the following:

1. loads the CSV into a pandas DataFrame
2. rejects empty files
3. samples down to at most 3000 rows for performance
4. builds a `SingleTableMetadata` object
5. marks object columns and low-cardinality columns as categorical
6. trains a `CTGANSynthesizer`
7. samples a synthetic DataFrame with the same row count as the input sample
8. calculates statistics and optional predictive metrics
9. saves the synthetic file to `backend/temp/{job_id}_synthetic.csv`

### Job tracking

The backend keeps an in-memory `jobs` dictionary protected by a thread lock. This store tracks:

- `queued`
- `processing`
- `completed`
- `failed`

It also stores progress percentages, metrics, comparisons, previews, and error messages.

## 5. AI / ML model used

The synthetic data generator uses `CTGANSynthesizer` from the SDV library.

### Why CTGAN matters

CTGAN stands for Conditional Tabular GAN. It is a generative adversarial network designed for structured tabular data where:

- column types can differ
- categorical and numeric columns both matter
- preserving joint relationships is important

This makes CTGAN a good fit for CSV-based business datasets.

### What CTGAN does here

The model learns the distribution and relationships in the uploaded table and then generates new rows that resemble the original data.

### What it does not do

The CTGAN model is not used to predict labels or classify rows. It is used only for data synthesis.

### Evaluation model

The backend also trains a `RandomForestClassifier`, but only for evaluation.

- One model is trained on real data.
- Another model is trained on synthetic data.
- Their classification scores are compared.

So the project uses two ML components:

- CTGAN for generation
- RandomForest for comparison

## 6. Frontend workflow

The frontend is a landing page-style application with a data workflow embedded into it.

### Main UI sections

- hero and navigation
- services/about/stats sections
- upload card
- processing progress card
- results comparison area
- final call-to-action and footer

### Upload and polling

The upload component accepts only CSV files and limits the file size to 10 MB. After upload:

- the frontend stores the returned `job_id`
- it begins polling `/status/{job_id}` every 2 seconds
- progress and status are updated live
- once processing finishes, charts and tables render automatically

### Result display

When the backend completes the job, the frontend shows:

- real model accuracy
- synthetic model accuracy
- accuracy difference
- precision
- recall
- F1 score
- mean comparisons for numeric columns
- first 5 rows of real and synthetic data
- download button for the synthetic CSV

## 7. API design

### `GET /`

Returns a simple service message to show the API is running.

### `GET /health`

Used by the frontend to confirm the backend is reachable.

### `POST /upload`

Accepts a multipart CSV upload and starts a background processing job.

Response includes:

- `job_id`
- confirmation message

### `GET /status/{job_id}`

Returns current job state:

- `status`
- `progress`
- `metrics`
- `comparison`
- `preview`
- `error`

### `GET /download/{job_id}`

Downloads the generated synthetic CSV. After the download is prepared, cleanup removes the temporary input and output files and clears the job from memory.

## 8. Validation and limits

The backend includes a few practical limits:

- CSV only
- 10 MB maximum upload size
- 3000 row processing cap

These are sensible defaults for a demo-quality web app because CTGAN training can become slow on large tables.

The frontend mirrors these constraints to reduce user error before upload.

## 9. Data quality outputs

The application does not only generate a CSV. It also returns evidence that helps users judge whether the synthetic output is reasonable.

### Metrics

If the last column appears to be a classification target, the backend computes:

- real model accuracy
- synthetic model accuracy
- precision
- recall
- F1 score
- accuracy difference

### Comparisons

The backend also reports:

- mean values for numeric columns in the real dataset
- mean values for numeric columns in the synthetic dataset

### Previews

The backend sends the first 5 rows of both datasets so the frontend can show a quick side-by-side preview.

## 10. Operational behavior

### CORS

The backend allows frontend origins through the `FRONTEND_ORIGINS` environment variable. This keeps local development flexible when Vite changes ports.

### Temporary storage

Input and output files are written into `backend/temp` and are removed after download cleanup.

### GPU support

If PyTorch detects CUDA, the backend clears the GPU cache after a job completes.

## 11. Repository layout

At a high level, the important parts are:

- `backend/main.py` - API and processing logic
- `backend/requirements.txt` - Python dependencies
- `frontend/src/pages/Home.jsx` - main UI state and orchestration
- `frontend/src/components` - UI sections and result display
- `frontend/src/services/api.js` - frontend API client
- `ARCHITECTURE.md` - component flow reference
- `QUICK_START.md` - local startup instructions

## 12. Strengths of the project

- Clear end-to-end workflow from upload to download
- Uses a real tabular generative model rather than a mock generator
- Includes visible progress and health checks
- Returns both a file and quality signals
- Easy to run locally for demos or experimentation

## 13. Current limitations

- Job state is stored in memory, so jobs are lost when the backend restarts.
- There is no authentication or multi-user persistence layer.
- The evaluation metrics are only meaningful when the last column behaves like a classification target.
- Large datasets are intentionally capped for responsiveness.

## 14. Suggested improvements

If you want to extend the project later, the highest-value upgrades would be:

- persistent job storage in a database
- background queue for larger jobs
- better dataset profiling before CTGAN training
- richer quality metrics for non-classification datasets
- file history and user authentication
- Docker and deployment setup

## 15. Conclusion

This project is a practical synthetic data generator for CSV/tabular data. Its core value comes from using CTGAN to learn and reproduce table structure, while the frontend makes the workflow easy to understand and operate.

If you want a short summary for a portfolio or GitHub profile, the one-line version is:

Synthetic Dataset Generator is a FastAPI + React app that uses SDV's CTGAN model to generate synthetic CSV data, evaluate similarity, and provide a downloadable output.