import './ComparisonSection.css';

function ComparisonSection({ children }) {
  return (
    <section className="comparison-section">
      <div className="comparison-container">
        <div className="comparison-header">
          <h2 className="comparison-title">Evaluation Results</h2>
          <p className="comparison-subtitle">
            Comprehensive analysis of synthetic data quality and model performance
          </p>
        </div>
        <div className="comparison-content">
          {children}
        </div>
      </div>
    </section>
  );
}

export default ComparisonSection;
