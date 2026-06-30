import { useRef, useState } from "react";
import { uploadFile } from "../services/api";

const MAX_FILE_SIZE_MB = 10;

function UploadSection({ onUpload, onError }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef();

  const handleUpload = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setProgress(0);
    setUploadError(null);

    try {
      // Simulate initial progress
      setProgress(20);

      // Call the API
      const response = await uploadFile(file);
      
      setProgress(100);
      
      // Notify parent component with job_id
      if (onUpload) {
        onUpload(response.job_id);
      }

      // Reset after a brief delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);

    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(error.message || "Upload failed. Please try again.");
      setProgress(0);
      setIsLoading(false);
      
      if (onError) {
        onError(error.message || "Upload failed");
      }
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      const msg = 'Only CSV files are supported.';
      setUploadError(msg);
      if (onError) onError(msg);
      return;
    }

    const fileSizeMB = selectedFile.size / 1024 / 1024;
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      const msg = `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
      setUploadError(msg);
      if (onError) onError(msg);
      return;
    }

    setUploadError(null);
    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setProgress(0);
    setIsLoading(false);
    setUploadError(null);
  };

  return (
    <section id="upload" className="upload-section">
      <div className="upload-section-header">
        <h2>Upload Your Dataset</h2>
        <p>Drag & drop your CSV file or click to browse</p>
      </div>
      <div className="glass-card upload-card">
        <form
          className={`upload-drop-area${dragActive ? " drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current && inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="upload-input"
            onChange={handleChange}
          />
          <div className="upload-drop-content">
            {file ? (
              <>
                <div className="upload-icon">✓</div>
                <span className="upload-file-name">{file.name}</span>
                <span className="upload-file-size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <div className="upload-icon">↓</div>
                <span className="upload-placeholder">Drop your CSV here</span>
                <span className="upload-hint">or click to select</span>
              </>
            )}
          </div>
        </form>

        {file && !isLoading && (
          <p className="upload-helper-text">
            CSV format • Max 10MB • Supports: .csv
          </p>
        )}

        {uploadError && (
          <p className="upload-error-text">
            {uploadError}
          </p>
        )}

        <div className="upload-button-group">
          <button
            className="upload-btn-primary"
            onClick={handleUpload}
            disabled={!file || isLoading}
          >
            {isLoading ? `Uploading ${progress}%...` : "Upload Dataset"}
          </button>
          {file && (
            <button
              className="upload-btn-secondary"
              onClick={handleReset}
              disabled={isLoading}
            >
              Clear
            </button>
          )}
        </div>

        {file && progress > 0 && (
          <div className="upload-progress-wrapper">
            <div className="upload-progress-bar-container">
              <div
                className="upload-progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="upload-progress-info">
              <span className="upload-progress-percent">{Math.round(progress)}%</span>
              <span className="upload-progress-status">
                {progress === 100 ? "Complete" : "Uploading..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UploadSection;
