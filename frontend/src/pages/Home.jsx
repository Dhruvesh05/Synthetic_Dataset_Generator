import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import UploadSection from '../components/UploadSection';
import ProgressSection from '../components/ProgressSection';
import ComparisonSection from '../components/ComparisonSection';
import ResultSection from '../components/ResultSection';
import FinalCtaSection from '../components/FinalCtaSection';
import Footer from '../components/Footer';
import { checkHealth, checkStatus } from '../services/api';
import './Home.css';

function Home() {
  // State management
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState({ state: 'checking', message: 'Connecting to backend...' });

  const pollingIntervalRef = useRef(null);
  const resultsSectionRef = useRef(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await checkHealth();
        setApiHealth({ state: 'online', message: 'Backend connected' });
      } catch (err) {
        setApiHealth({
          state: 'offline',
          message: err.message || 'Backend unavailable. Start backend on port 8000.'
        });
      }
    };

    checkBackend();
  }, []);

  // Polling logic
  useEffect(() => {
    if (!jobId) return;

    const pollStatus = async () => {
      try {
        const response = await checkStatus(jobId);

        setStatus(response.status);
        setProgress(response.progress);

        if (response.status === 'completed') {
          setMetrics(response.metrics);
          setComparison(response.comparison);
          setPreview(response.preview);
          
          // Stop polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          // Scroll to results after a brief delay
          setTimeout(() => {
            if (resultsSectionRef.current) {
              resultsSectionRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
            }
          }, 500);

        } else if (response.status === 'failed') {
          setError(response.error || 'Processing failed');
          
          // Stop polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }

      } catch (err) {
        console.error('Polling error:', err);
        setError(err.message || 'Failed to check status');
        
        // Stop polling on error
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    };

    // Start polling immediately
    pollStatus();

    // Then poll every 2 seconds
    pollingIntervalRef.current = setInterval(pollStatus, 2000);

    // Cleanup on unmount or when jobId changes
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [jobId]);

  // Handle successful upload
  const handleUpload = (newJobId) => {
    console.log('Upload successful, job ID:', newJobId);
    setJobId(newJobId);
    setStatus('queued');
    setProgress(0);
    setMetrics(null);
    setComparison(null);
    setPreview(null);
    setError(null);
  };

  // Handle upload error
  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setStatus('failed');
  };

  return (
    <div className="home-page">
      <Navbar />
      <div id="home">
        <Hero />
      </div>
      
      <main className="home-content">
        <ServicesSection />
        <AboutSection />
        <StatsSection />

        <div className={`api-status-card api-${apiHealth.state}`}>
          <span className="api-status-dot" />
          <span>{apiHealth.message}</span>
        </div>

        <div id="upload">
          <UploadSection onUpload={handleUpload} onError={handleUploadError} />
        </div>

        {/* Show progress when job is active */}
        {jobId && (status === 'queued' || status === 'processing') && (
          <ProgressSection progress={progress} status={status} />
        )}

        {/* Show error if failed */}
        {status === 'failed' && error && (
          <div className="error-section">
            <div className="error-card">
              <div className="error-icon">Error</div>
              <div className="error-title">Processing Failed</div>
              <div className="error-message">{error}</div>
              <button 
                className="error-retry-btn"
                onClick={() => {
                  setJobId(null);
                  setStatus('idle');
                  setError(null);
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Show results when completed */}
        {status === 'completed' && metrics && (
          <div id="results" ref={resultsSectionRef}>
            <div id="analytics">
              <ComparisonSection>
                <ResultSection
                  jobId={jobId}
                  metrics={metrics}
                  comparison={comparison}
                  preview={preview}
                />
              </ComparisonSection>
            </div>
          </div>
        )}

        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
