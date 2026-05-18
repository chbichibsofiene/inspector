import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Welcome.css';

// Highly-optimized, hardware-accelerated animated counter using requestAnimationFrame & quadratic easing
const StatCounter = ({ target, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) return;

    const startTime = performance.now();

    let animationFrameId;
    const updateCount = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const discoverSectionRef = useRef(null);
  const statsRef = useRef(null);
  const [hasVisitedStats, setHasVisitedStats] = useState(false);

  // Trigger statistics counting when they scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasVisitedStats(true);
          observer.disconnect(); // Animate only once
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToDiscover = () => {
    discoverSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
          <button className="nav-link nav-login" onClick={() => navigate('/login')}>{t('login')}</button>
          <button className="nav-link nav-register" onClick={() => navigate('/register')}>{t('register')}</button>
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
          <button className="cta-primary" onClick={scrollToDiscover}>
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

        {/* Dynamic Scroll Indicator */}
        <div className="scroll-indicator" onClick={scrollToDiscover}>
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="scroll-arrow">
            <span></span>
            <span></span>
          </div>
        </div>
      </main>

      {/* Discover / Briefing & Statistics Section */}
      <section className="discover-section" ref={discoverSectionRef}>
        <div className="discover-content">
          <div className="section-header">
            <h2 className="discover-section-title">{t('discoverTitle')}</h2>
            <p className="discover-section-subtitle">{t('discoverSubtitle')}</p>
          </div>

          {/* Objectives Grid */}
          <div className="objectives-grid">
            <div className="objective-card">
              <div className="card-icon-wrapper supervision-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="card-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H9.75M9.665 10.435A9 9 0 1 1 12.5 18H15m-3-3v3m0-12v.008H12V3.75" />
                </svg>
              </div>
              <h3 className="objective-card-title">{t('objectiveSupervision')}</h3>
              <p className="objective-card-desc">{t('objectiveSupervisionDesc')}</p>
            </div>

            <div className="objective-card">
              <div className="card-icon-wrapper training-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="card-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M12 13.49v.01" />
                </svg>
              </div>
              <h3 className="objective-card-title">{t('objectiveTraining')}</h3>
              <p className="objective-card-desc">{t('objectiveTrainingDesc')}</p>
            </div>

            <div className="objective-card">
              <div className="card-icon-wrapper evaluation-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="card-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c-.19-.443-.8-.443-.99 0L7.95 8.163l-5.184.753c-.488.07-.68.67-.328 1.01l3.75 3.655-.886 5.163c-.084.488.428.86.866.63L11 16.797l4.63 2.433c.438.23.95-.142.866-.63l-.886-5.163 3.75-3.655c.353-.34.16-.94-.328-1.01l-5.184-.753L11.48 3.5z" />
                </svg>
              </div>
              <h3 className="objective-card-title">{t('objectiveEvaluation')}</h3>
              <p className="objective-card-desc">{t('objectiveEvaluationDesc')}</p>
            </div>
          </div>

          {/* Interactive Stat Dashboard */}
          <div className="stats-dashboard-container" ref={statsRef}>
            <div className="stat-card">
              <div className="stat-circle">
                <div className="stat-glow glow-blue"></div>
                <h3 className="stat-number">
                  {hasVisitedStats ? <StatCounter target="30" suffix="+" /> : "0+"}
                </h3>
              </div>
              <p className="stat-label">{t('statsInspectors')}</p>
            </div>

            <div className="stat-card">
              <div className="stat-circle">
                <div className="stat-glow glow-green"></div>
                <h3 className="stat-number">
                  {hasVisitedStats ? <StatCounter target="169" suffix="+" /> : "0+"}
                </h3>
              </div>
              <p className="stat-label">{t('statsTeachers')}</p>
            </div>

            <div className="stat-card">
              <div className="stat-circle">
                <div className="stat-glow glow-yellow"></div>
                <h3 className="stat-number">
                  {hasVisitedStats ? <StatCounter target="1000" suffix="+" /> : "0+"}
                </h3>
              </div>
              <p className="stat-label">{t('statsActivities')}</p>
            </div>
          </div>

          {/* Ready to start action banner */}
          <div className="action-banner">
            <h3>{t('readyToTransform')}</h3>
            <div className="banner-buttons">
              <button className="cta-primary banner-cta" onClick={() => navigate('/register')}>
                {t('requestAccessBtn')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
