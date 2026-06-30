# 🚀 Quick Start Guide

## Prerequisites
- Python 3.8+ with FastAPI and dependencies installed
- Node.js 16+ with npm
- Both terminals ready

## Step 1: Start Backend
```bash
cd backend
uvicorn main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 3: Open Application
Open your browser and navigate to: **http://localhost:5173**

## Step 4: Test the Flow

### A. Upload CSV
1. Click the upload area or drag-and-drop a CSV file
2. Click "Upload Dataset" button
3. Watch the progress bar appear

### B. Monitor Progress
- Status changes: Queued → Processing → Completed
- Progress bar animates from 0% to 100%
- Estimated time: 1-3 minutes depending on data size

### C. View Results
When status = "Completed", you'll see:

**Metrics Cards:**
- Real Model Accuracy
- Synthetic Model Accuracy  
- Accuracy Difference (with badge)
- Precision
- Recall
- F1 Score

**Charts:**
- Accuracy Comparison (bar chart)
- Mean Comparison (bar chart for numeric columns)

**Data Preview:**
- Real data table (first 5 rows)
- Synthetic data table (first 5 rows)

### D. Download Synthetic Data
1. Click "Download Synthetic Data" button
2. File saves as `synthetic_data.csv`

---

## 🧪 Test with Sample Data

If you don't have a CSV, create one:

```csv
age,income,employed,credit_score
25,45000,1,650
30,55000,1,700
45,75000,1,750
22,35000,0,600
50,85000,1,800
```

Save as `test_data.csv` and upload.

---

## 🔍 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change port in main.py and api.js
uvicorn main:app --reload --port 8001
```

**Missing dependencies:**
```bash
pip install fastapi uvicorn pandas sdv scikit-learn torch
```

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically try 5174, 5175, etc.
- Update CORS in backend/main.py if needed

**Dependencies not installed:**
```bash
npm install
```

**Recharts not found:**
```bash
npm install recharts
```

### CORS Errors

If you see CORS errors in browser console:

1. Check backend `main.py` line 24:
```python
allow_origins=["http://localhost:5173"]
```

2. Update if frontend port changed:
```python
allow_origins=["http://localhost:5174"]  # or whatever port
```

---

## ✅ Expected Behavior

1. **Upload**: File uploads → Returns job_id → Progress starts
2. **Polling**: Frontend checks status every 2 seconds automatically
3. **Progress**: Bar animates from 0% → 100%
4. **Results**: Automatically appear when complete
5. **Download**: Button downloads CSV file

---

## 📊 What to Look For

✅ Progress bar should update smoothly  
✅ Status badges should change color  
✅ Metrics should display actual values from backend  
✅ Charts should render with real data  
✅ Tables should show your CSV data  
✅ Download should trigger file save  

---

## 🎯 Next Steps

Once everything works:
- Try different CSV files
- Check metrics accuracy
- Compare real vs synthetic data visually
- Verify download contains synthetic data

---

**Need help? Check the console for error messages!**
