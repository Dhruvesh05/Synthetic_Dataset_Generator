import './ServicesSection.css';
import RevealSection from './RevealSection';

const FEATURES = [
  {
    title: 'Privacy-Safe Synthesis',
    description: 'Generate realistic records while reducing risk of exposing personally identifiable information.'
  },
  {
    title: 'Model Quality Metrics',
    description: 'Track utility with clear accuracy, precision, recall, and fidelity deltas from one dashboard.'
  },
  {
    title: 'Fast Processing Pipeline',
    description: 'Upload CSV data and run an end-to-end CTGAN workflow designed for practical iteration speed.'
  },
  {
    title: 'Enterprise-Ready Output',
    description: 'Download synthetic datasets in CSV format for BI, test automation, and ML experimentation.'
  },
  {
    title: 'Transparent Comparison',
    description: 'Compare means and sampled rows side by side to validate distribution-level behavior quickly.'
  },
  {
    title: 'API-Driven Workflow',
    description: 'Integrate backend jobs with frontend progress tracking for a reliable full-stack experience.'
  }
];

function ServicesSection() {
  return (
    <section id="features" className="section section-features">
      <RevealSection>
        <div className="section-heading">
          <p className="eyebrow">Platform Capabilities</p>
          <h2>Everything you need to ship synthetic data workflows</h2>
          <p>
            A clean toolkit for secure data generation, measurable quality checks, and operational simplicity.
          </p>
        </div>
      </RevealSection>

      <div className="feature-grid">
        {FEATURES.map((feature) => (
          <RevealSection key={feature.title} className="feature-reveal">
            <article className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
