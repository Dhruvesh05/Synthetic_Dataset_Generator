import './FinalCtaSection.css';
import RevealSection from './RevealSection';

function FinalCtaSection() {
  const scrollToUpload = () => {
    const element = document.getElementById('upload');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="contact" className="section section-final-cta">
      <RevealSection>
        <div className="final-cta-card">
          <p className="eyebrow">Ready to Start</p>
          <h2>Generate your first synthetic dataset today</h2>
          <p>Upload a CSV file and evaluate quality using a clean, production-friendly workflow.</p>
          <button type="button" className="btn btn-primary" onClick={scrollToUpload}>
            Start with Upload
          </button>
        </div>
      </RevealSection>
    </section>
  );
}

export default FinalCtaSection;
