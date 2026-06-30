import './AboutSection.css';
import RevealSection from './RevealSection';

function AboutSection() {
  return (
    <section id="about" className="section section-about">
      <RevealSection>
        <div className="about-grid">
          <div className="about-content">
            <p className="eyebrow">Why SynGen AI</p>
            <h2>Built for teams that need safe data and fast decisions</h2>
            <p>
              Most synthetic data tools are either complex to operate or difficult to evaluate. SynGen AI focuses on
              one practical flow: upload, generate, validate, and export with clear measurable confidence.
            </p>
          </div>

          <div className="about-points">
            <div className="about-point">
              <h3>Clarity by Design</h3>
              <p>Focused interfaces, concise metrics, and readable comparisons help teams move faster.</p>
            </div>
            <div className="about-point">
              <h3>Security-Aligned</h3>
              <p>Privacy-preserving synthesis supports analytics and testing while reducing exposure risk.</p>
            </div>
            <div className="about-point">
              <h3>Production Mindset</h3>
              <p>The stack is built for practical deployment with API health checks and robust status tracking.</p>
            </div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

export default AboutSection;
