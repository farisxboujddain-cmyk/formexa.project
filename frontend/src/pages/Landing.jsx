import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import '../styles/landing.css'

const LandingPage = () => {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      {/* Header */}
      <header className="navbar">
        <div className="container navbar-content">
          <h1 className="logo">{t('common.appName')}</h1>
          <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <Link to="/">{t('common.appName')}</Link>
            <Link to="/pricing">{t('common.pricing')}</Link>
            <Link to="/login">{t('common.login')}</Link>
            <Link to="/register" className="btn-primary">{t('common.register')}</Link>
            
            {/* Language Switcher */}
            <div className="language-switcher">
              <button onClick={() => i18n.changeLanguage('en')}>EN</button>
              <button onClick={() => i18n.changeLanguage('ar')}>AR</button>
              <button onClick={() => i18n.changeLanguage('fr')}>FR</button>
            </div>
          </nav>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>AI-Powered Content in Seconds</h2>
          <p>{t('common.tagline')}</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started Free</Link>
            <Link to="/pricing" className="btn-secondary">View Plans</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Features</h2>
          <div className="grid grid-3">
            <div className="card">
              <h3>📝 Articles</h3>
              <p>Generate high-quality articles from simple prompts</p>
            </div>
            <div className="card">
              <h3>🖼️ Images</h3>
              <p>Create stunning images using DALL-E</p>
            </div>
            <div className="card">
              <h3>💻 Code</h3>
              <p>Generate code snippets in any language</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>{t('footer.email')}</p>
          <p>{t('footer.github')}</p>
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
