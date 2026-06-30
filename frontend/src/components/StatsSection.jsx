import './StatsSection.css';
import RevealSection from './RevealSection';

const STATS = [
  { value: '< 2 min', label: 'Average pipeline kickoff' },
  { value: '6 core', label: 'Model utility metrics tracked' },
  { value: '100%', label: 'Web-based workflow accessibility' }
];

const TESTIMONIALS = [
  {
    quote: 'We were able to validate data quality in a single dashboard and cut iteration time significantly.',
    author: 'Data Science Lead',
    company: 'Fintech Team'
  },
  {
    quote: 'The interface is clean, fast, and easy for non-ML stakeholders to understand during reviews.',
    author: 'Analytics Manager',
    company: 'Operations Group'
  }
];

function StatsSection() {
  return (
    <section id="proof" className="section section-proof">
      <RevealSection>
        <div className="section-heading">
          <p className="eyebrow">Proof and Trust</p>
          <h2>Data quality and usability, visible at a glance</h2>
          <p>Clear metrics and straightforward reporting make synthetic data outcomes easier to communicate.</p>
        </div>
      </RevealSection>

      <div className="stats-grid">
        {STATS.map((item) => (
          <RevealSection key={item.label}>
            <article className="stat-card">
              <p className="stat-value">{item.value}</p>
              <p className="stat-label">{item.label}</p>
            </article>
          </RevealSection>
        ))}
      </div>

      <div className="testimonial-grid">
        {TESTIMONIALS.map((item) => (
          <RevealSection key={item.author}>
            <article className="testimonial-card">
              <p className="testimonial-quote">"{item.quote}"</p>
              <p className="testimonial-author">{item.author}</p>
              <p className="testimonial-company">{item.company}</p>
            </article>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
