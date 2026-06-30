import React from "react";
import "./../styles/global.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <a href="#" className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">SynthAI</span>
          </a>
        </div>
        
        <div className="navbar-center">
          <a href="#generate" className="nav-link">
            <span className="nav-icon">🚀</span>
            <span>Generate</span>
          </a>
          <a href="#features" className="nav-link">
            <span className="nav-icon">⭐</span>
            <span>Features</span>
          </a>
          <a href="#about" className="nav-link">
            <span className="nav-icon">💡</span>
            <span>About</span>
          </a>
        </div>
        
        <div className="navbar-right">
          <a href="#generate" className="navbar-cta">
            <span>Get Started</span>
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
