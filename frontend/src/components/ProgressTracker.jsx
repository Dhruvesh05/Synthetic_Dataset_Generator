import { useState, useEffect } from 'react';

function ProgressTracker({ jobId = 'JOB-2024-001', status = 'processing', progress = 45, estimatedTime = '2m 30s' }) {
  const [isProcessing, setIsProcessing] = useState(status === 'processing');

  useEffect(() => {
    setIsProcessing(status === 'processing');
  }, [status]);

  const getStatusColor = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'queued':
        return 'status-queued';
      case 'processing':
        return 'status-processing';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-queued';
    }
  };

  const getStatusLabel = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'queued':
        return 'Queued';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="progress-tracker-section">
      <div className="progress-tracker-container">
        <div className="tracker-header">
          <div className="tracker-title-group">
            <h3 className="tracker-title">Data Processing Job</h3>
            <p className="tracker-job-id">ID: {jobId}</p>
          </div>
          <div className={`tracker-status-badge ${getStatusColor(status)} ${isProcessing ? 'pulse-active' : ''}`}>
            <span className="status-dot"></span>
            <span className="status-text">{getStatusLabel(status)}</span>
          </div>
        </div>

        <div className="tracker-stats-row">
          <div className="tracker-stat">
            <span className="stat-label">Progress</span>
            <span className="stat-value">{progress}%</span>
          </div>
          <div className="tracker-stat">
            <span className="stat-label">Estimated Time</span>
            <span className="stat-value">{estimatedTime}</span>
          </div>
        </div>

        <div className="tracker-progress-section">
          <div className="tracker-progress-bar-container">
            <div
              className="tracker-progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="tracker-progress-info">
            <span className="progress-label">Processing Data</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
        </div>

        <div className="tracker-details-grid">
          <div className="tracker-detail-item">
            <span className="detail-label">Total Files</span>
            <span className="detail-value">145</span>
          </div>
          <div className="tracker-detail-item">
            <span className="detail-label">Processed</span>
            <span className="detail-value">{Math.round(145 * (progress / 100))}</span>
          </div>
          <div className="tracker-detail-item">
            <span className="detail-label">Speed</span>
            <span className="detail-value">12.5/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker;
