function Hero() {
  const scrollToUpload = () => {
    const element = document.getElementById('upload');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-bg-gradient"></div>

      <div className="hero-content-wrapper">
        <div className="hero-badge">
          <span className="badge-text">Enterprise Synthetic Data Platform</span>
        </div>
        
        <h1 className="hero-title">
          Build privacy-safe synthetic datasets
          <span className="hero-title-gradient"> with confidence</span>
        </h1>
        
        <p className="hero-subtext">
          Upload CSV data, run CTGAN generation, evaluate quality metrics, and download production-ready output
          through a clean and reliable workflow.
        </p>
        
        <div className="hero-features">
          <div className="hero-feature-item">
            <span className="feature-text">Privacy-first</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-text">Quality metrics</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-text">Fast pipeline</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-text">CSV export</span>
          </div>
        </div>
        
        <div className="hero-cta-group">
          <button className="hero-cta-btn hero-cta-primary" onClick={scrollToUpload}>
            <span>Start with Upload</span>
          </button>
          <button className="hero-cta-btn hero-cta-secondary" onClick={() => {
            const analytics = document.getElementById('analytics');
            if (analytics) analytics.scrollIntoView({ behavior: 'smooth' });
          }}>
            <span>View Results Flow</span>
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value">10MB</div>
            <div className="stat-label">Max upload size</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">CTGAN</div>
            <div className="stat-label">Generation engine</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">Realtime</div>
            <div className="stat-label">Status tracking</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
