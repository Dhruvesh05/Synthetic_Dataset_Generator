# 🎯 Frontend Architecture Overview

## 📁 Component Hierarchy

```
App.jsx
  └── Home.jsx (Main Orchestrator)
       ├── Navbar.jsx
       ├── Hero.jsx
       ├── UploadSection.jsx
       │    └── calls api.uploadFile()
       │    └── returns job_id
       ├── ProgressSection.jsx
       │    └── displays status & progress
       └── ComparisonSection.jsx
            └── ResultSection.jsx
                 ├── Metrics Cards Grid
                 ├── Accuracy Chart (Recharts)
                 ├── Mean Comparison Chart (Recharts)
                 ├── Data Preview Tables
                 └── Download Button
                      └── calls api.downloadFile()
```

---

## 🔄 State Flow

```
┌─────────────────────────────────────────────────────────┐
│                     Home Component                       │
│                                                          │
│  State:                                                  │
│  • jobId: string | null                                 │
│  • status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed'
│  • progress: number (0-100)                             │
│  • metrics: object | null                               │
│  • comparison: object | null                            │
│  • preview: object | null                               │
│  • error: string | null                                 │
└─────────────────────────────────────────────────────────┘
                          │
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ UploadSection│  │ProgressSection│ │ResultSection │
│              │  │               │ │              │
│ Props:       │  │ Props:        │ │ Props:       │
│ • onUpload   │  │ • progress    │ │ • jobId      │
│ • onError    │  │ • status      │ │ • metrics    │
│              │  │               │ │ • comparison │
│ Emits:       │  └──────────────┘ │ • preview    │
│ • job_id     │                   └──────────────┘
└──────────────┘
```

---

## 🔌 API Integration Flow

```
┌──────────────┐
│   User       │
│   Uploads    │
│   CSV        │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  UploadSection.jsx                   │
│  handleUpload() {                    │
│    const response = await            │
│      uploadFile(file);               │
│    onUpload(response.job_id);        │
│  }                                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Home.jsx                            │
│  handleUpload(jobId) {               │
│    setJobId(jobId);                  │
│    setStatus('queued');              │
│    // Starts polling via useEffect   │
│  }                                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  useEffect Polling Loop              │
│                                      │
│  Every 2 seconds:                    │
│  const response = await              │
│    checkStatus(jobId);               │
│                                      │
│  setStatus(response.status);         │
│  setProgress(response.progress);     │
│                                      │
│  if (status === 'completed') {       │
│    setMetrics(response.metrics);     │
│    setComparison(response.comparison);│
│    setPreview(response.preview);     │
│    clearInterval();  // Stop polling │
│  }                                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  ResultSection Renders               │
│  • 6 Metrics Cards                   │
│  • 2 Recharts Bar Charts             │
│  • 2 Data Preview Tables             │
│  • 1 Download Button                 │
└──────────────────────────────────────┘
```

---

## 🎨 Component Responsibilities

### 📤 UploadSection.jsx
**Purpose**: File upload interface  
**Responsibilities**:
- Accept CSV file via drag-drop or click
- Validate file type (.csv only)
- Call `uploadFile()` API
- Handle upload errors
- Emit `job_id` to parent

**Key Features**:
- Drag-and-drop zone
- File size display
- Upload progress simulation
- Error messages

---

### ⏱️ ProgressSection.jsx
**Purpose**: Real-time progress tracking  
**Responsibilities**:
- Display current status (Queued/Processing/Completed/Failed)
- Show progress bar (0-100%)
- Provide visual feedback

**Key Features**:
- Animated progress bar with shimmer
- Color-coded status badges
- Status text descriptions

---

### 📊 ResultSection.jsx
**Purpose**: Display evaluation results  
**Responsibilities**:
- Render 6 metrics cards
- Display 2 Recharts bar charts
- Show data preview tables
- Provide download functionality

**Key Features**:
- Metrics Cards Grid:
  - Real Model Accuracy
  - Synthetic Model Accuracy
  - Accuracy Difference (with High Fidelity badge)
  - Precision
  - Recall
  - F1 Score

- Charts:
  - Accuracy Comparison (Real vs Synthetic)
  - Mean Comparison (Numeric columns)

- Tables:
  - Real data preview (5 rows)
  - Synthetic data preview (5 rows)

- Download:
  - Trigger CSV download
  - Loading state

---

### 🏗️ ComparisonSection.jsx
**Purpose**: Layout wrapper for results  
**Responsibilities**:
- Provide structure for result components
- Display section header
- Apply consistent styling

---

### 🏠 Home.jsx
**Purpose**: Main orchestrator  
**Responsibilities**:
- Manage all application state
- Coordinate component interactions
- Handle polling logic
- Implement error handling
- Control component visibility

**State Management**:
```javascript
const [jobId, setJobId] = useState(null);
const [status, setStatus] = useState('idle');
const [progress, setProgress] = useState(0);
const [metrics, setMetrics] = useState(null);
const [comparison, setComparison] = useState(null);
const [preview, setPreview] = useState(null);
const [error, setError] = useState(null);
```

**Polling Logic**:
```javascript
useEffect(() => {
  if (!jobId) return;
  
  const pollStatus = async () => {
    const response = await checkStatus(jobId);
    // Update state...
    
    if (response.status === 'completed') {
      clearInterval(pollingIntervalRef.current);
    }
  };
  
  pollStatus(); // Immediate
  pollingIntervalRef.current = setInterval(pollStatus, 2000);
  
  return () => clearInterval(pollingIntervalRef.current);
}, [jobId]);
```

---

## 🌐 API Service Layer

### 📡 services/api.js

```javascript
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Upload CSV file
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data; // { job_id, message }
};

// Check job status
export const checkStatus = async (jobId) => {
  const response = await api.get(`/status/${jobId}`);
  return response.data;
  // {
  //   job_id,
  //   status,
  //   progress,
  //   metrics,
  //   comparison,
  //   preview,
  //   error
  // }
};

// Download synthetic CSV
export const downloadFile = async (jobId) => {
  const response = await api.get(`/download/${jobId}`, {
    responseType: 'blob'
  });
  
  // Auto-trigger browser download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'synthetic_data.csv');
  link.click();
};
```

---

## 📊 Data Structures

### Backend Response: `/status/{job_id}`

```typescript
{
  job_id: string,
  status: "queued" | "processing" | "completed" | "failed",
  progress: number, // 0-100
  metrics: {
    real_model: {
      accuracy: number // 0.0 - 1.0
    },
    synthetic_model: {
      accuracy: number,
      precision: number,
      recall: number,
      f1_score: number
    },
    accuracy_difference: number
  },
  comparison: {
    real_mean: { [column: string]: number },
    synthetic_mean: { [column: string]: number }
  },
  preview: {
    real_sample: Array<{ [column: string]: any }>, // 5 rows
    synthetic_sample: Array<{ [column: string]: any }> // 5 rows
  },
  error: string | null
}
```

---

## 🎨 Styling Architecture

### Component-Specific CSS Files
- `ProgressSection.css`
- `ResultSection.css`
- `ComparisonSection.css`
- `Home.css`

### Global Styles
- `styles/global.css` - Base styles, variables, utilities
- `App.css` - App-level styles

### Design System
```css
/* Colors */
--primary-blue: #3b82f6;
--purple: #8b5cf6;
--success-green: #10b981;
--warning-orange: #f59e0b;
--error-red: #ef4444;

/* Spacing */
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
```

---

## 🔐 Error Handling

### Upload Errors
```javascript
try {
  const response = await uploadFile(file);
  onUpload(response.job_id);
} catch (error) {
  setUploadError(
    error.response?.data?.detail || 
    "Upload failed. Please try again."
  );
  onError(error.response?.data?.detail);
}
```

### Polling Errors
```javascript
try {
  const response = await checkStatus(jobId);
  // Process response...
} catch (err) {
  setError('Failed to check status');
  clearInterval(pollingIntervalRef.current);
}
```

### Backend Errors
```javascript
if (status === 'failed' && error) {
  return (
    <div className="error-section">
      <div className="error-card">
        <div className="error-message">{error}</div>
        <button onClick={handleRetry}>Try Again</button>
      </div>
    </div>
  );
}
```

---

## ✅ Best Practices Implemented

1. **Separation of Concerns**: API logic in `services/`, UI in `components/`
2. **Component Composition**: Reusable, single-responsibility components
3. **State Management**: Centralized in Home.jsx, props down, events up
4. **Error Handling**: Try-catch blocks, user-friendly messages
5. **Loading States**: Disabled buttons, spinners, progress indicators
6. **Cleanup**: `useEffect` cleanup for intervals, event listeners
7. **Responsive Design**: Mobile-first, flexible grids
8. **Accessibility**: Semantic HTML, ARIA labels (can be enhanced)
9. **Type Safety**: JSX with PropTypes (can add TypeScript)
10. **Performance**: Conditional rendering, lazy loading potential

---

## 🚀 Performance Optimizations

### Polling Efficiency
- Stop polling on completion/failure
- Cleanup intervals on unmount
- Debounce rapid state updates

### Rendering
- Conditional rendering (only show components when needed)
- Memo potential for expensive charts
- Lazy load Recharts if needed

### Network
- Single API endpoint per poll
- Blob download for large files
- Axios interceptors for auth (future)

---

**This architecture provides a scalable, maintainable foundation for your AI Synthetic Data Evaluation Dashboard!** 🎉
