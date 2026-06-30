function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Features', url: '#features' },
    { name: 'Upload', url: '#upload' },
    { name: 'Results', url: '#analytics' },
    { name: 'Contact', url: '#contact' },
  ];

  return (
    <footer className="footer">
      <div className="footer-top-border"></div>
      
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <span className="logo-text">SynGen AI</span>
            </div>
            <p className="footer-description">
              Privacy-preserving synthetic data generation for modern product and data teams.
            </p>
          </div>

          <div className="footer-section footer-links">
            <nav className="footer-nav">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="footer-link"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p className="copyright-text">
              © {currentYear} SynGen AI. All rights reserved.
            </p>
            <div className="footer-badges">
              <span className="badge">Secure by design</span>
              <span className="badge">SaaS-ready UI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
