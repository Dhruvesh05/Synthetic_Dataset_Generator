import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { downloadFile } from '../services/api';
import './ResultSection.css';

function ResultSection({ jobId, metrics, comparison, preview }) {
  const [isVisible, setIsVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (metrics) {
      setIsVisible(true);
    }
  }, [metrics]);

  if (!metrics || !comparison || !preview) {
    return null;
  }

  const accuracyDiff = metrics.accuracy_difference;
  const isHighFidelity = Math.abs(accuracyDiff) <= 0.05;

  // Prepare accuracy comparison data
  const accuracyData = [
    {
      name: 'Accuracy Comparison',
      'Real Model': (metrics.real_model.accuracy * 100).toFixed(2),
      'Synthetic Model': (metrics.synthetic_model.accuracy * 100).toFixed(2),
    },
  ];

  // Prepare mean comparison data
  const meanComparisonData = Object.keys(comparison.real_mean).map((key) => ({
    column: key,
    'Real Mean': comparison.real_mean[key],
    'Synthetic Mean': comparison.synthetic_mean[key],
  }));

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadFile(jobId);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Get columns from preview data
  const columns = preview.real_sample.length > 0 ? Object.keys(preview.real_sample[0]) : [];

  return (
    <div className={`result-section ${isVisible ? 'visible' : ''}`}>
      {/* Metrics Cards Section */}
      <div className="metrics-cards-grid">
        <div className="metric-card">
          <div className="metric-label">Real Model Accuracy</div>
          <div className="metric-value">{(metrics.real_model.accuracy * 100).toFixed(2)}%</div>
          <div className="metric-icon">RM</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Synthetic Model Accuracy</div>
          <div className="metric-value">{(metrics.synthetic_model.accuracy * 100).toFixed(2)}%</div>
          <div className="metric-icon">SM</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Accuracy Difference</div>
          <div className="metric-value">{(accuracyDiff * 100).toFixed(2)}%</div>
          <div className={`metric-badge ${isHighFidelity ? 'badge-success' : 'badge-warning'}`}>
            {isHighFidelity ? 'High Fidelity' : 'Performance Gap'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Precision</div>
          <div className="metric-value">{(metrics.synthetic_model.precision * 100).toFixed(2)}%</div>
          <div className="metric-icon">PR</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Recall</div>
          <div className="metric-value">{(metrics.synthetic_model.recall * 100).toFixed(2)}%</div>
          <div className="metric-icon">RC</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">F1 Score</div>
          <div className="metric-value">{(metrics.synthetic_model.f1_score * 100).toFixed(2)}%</div>
          <div className="metric-icon">F1</div>
        </div>
      </div>

      {/* Accuracy Comparison Chart */}
      <div className="chart-section">
        <h3 className="chart-title">Accuracy Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Bar dataKey="Real Model" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Synthetic Model" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mean Comparison Chart */}
      {meanComparisonData.length > 0 && (
        <div className="chart-section">
          <h3 className="chart-title">Mean Comparison (Numeric Columns)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={meanComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="column" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="Real Mean" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Synthetic Mean" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Preview Section */}
      <div className="preview-section">
        <h3 className="preview-title">Data Preview (First 5 Rows)</h3>
        <div className="preview-grid">
          {/* Real Data Table */}
          <div className="preview-table-wrapper">
            <h4 className="table-title">Real Data</h4>
            <div className="table-container">
              <table className="preview-table">
                <thead>
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.real_sample.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {columns.map((col, colIdx) => (
                        <td key={colIdx}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Synthetic Data Table */}
          <div className="preview-table-wrapper">
            <h4 className="table-title">Synthetic Data</h4>
            <div className="table-container">
              <table className="preview-table">
                <thead>
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.synthetic_sample.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {columns.map((col, colIdx) => (
                        <td key={colIdx}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="download-section">
        <button
          className="download-button"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <span className="spinner"></span>
              Downloading...
            </>
          ) : (
            <>
              <span className="download-icon">DL</span>
              Download Synthetic Data
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ResultSection;
