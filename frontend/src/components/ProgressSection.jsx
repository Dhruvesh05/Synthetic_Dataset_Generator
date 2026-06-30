import './ProgressSection.css';

function ProgressSection({ progress, status }) {
  const getStatusText = () => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="glass-card progress-section-wrapper">
      <div className="progress-header">
        <h3 className="progress-title">Processing Status</h3>
        <span className={`progress-status-badge status-${status}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="progress-bar-container">
        <div
          className={`progress-bar-fill status-${status}`}
          style={{ width: `${progress}%` }}
        >
          <span className="progress-shimmer"></span>
        </div>
      </div>

      <div className="progress-info">
        <span className="progress-percentage">{Math.round(progress)}%</span>
        {status === 'processing' && (
          <span className="progress-message">
            Generating synthetic data using CTGAN...
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressSection;
