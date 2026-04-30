import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Decorative Dots */}
      <div className="dot dot-blue"></div>
      <div className="dot dot-green"></div>
      <div className="dot dot-yellow"></div>
      
      {/* Navbar Area */}
      <nav className="welcome-nav">
        <div className="nav-logo">
          <img src="/logo.png" alt="Inspector Platform Logo" className="welcome-logo" />
          <h2>Inspector Platform</h2>
        </div>
        <div className="nav-actions">
          <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="welcome-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Supervise, train, and evaluate your teachers with <br />
            <span className="brand-text">Inspector Platform</span>
          </h1>
          <p className="hero-description">
            Transform pedagogical management into an efficient process with our comprehensive inspection and mentoring platform.
          </p>
          <button className="cta-primary" onClick={() => navigate('/login')}>
            Discover the platform &rarr;
          </button>
        </div>

        {/* Image Showcase */}
        <div className="hero-visual">
          <div className="image-backdrop"></div>
          <img 
            src="/images/picture.png" 
            alt="Plateforme Illustration" 
            className="hero-image"
          />
        </div>
      </main>
    </div>
  );
};

export default Welcome;
