import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="welcome-container">
      {/* Decorative Dots */}
      <div className="dot dot-blue"></div>
      <div className="dot dot-green"></div>
      <div className="dot dot-yellow"></div>
      
      {/* Navbar Area */}
      <nav className="welcome-nav">
        <div className="nav-logo">
          <img src="/logo.png" alt="Pedagogy Center Logo" className="welcome-logo" />
          <h2>{t('pedagogyCenter')}</h2>
        </div>
        <div className="nav-actions">
          <button className="nav-link" onClick={() => navigate('/login')}>{t('login')}</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="welcome-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {t('heroTitle')} <br />
            <span className="brand-text">{t('pedagogyCenter')}</span>
          </h1>
          <p className="hero-description">
            {t('heroDescription')}
          </p>
          <button className="cta-primary" onClick={() => navigate('/login')}>
            {t('discoverPlatform')} &rarr;
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
