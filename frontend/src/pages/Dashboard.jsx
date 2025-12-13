import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GenerateSection from '../components/GenerateSection'
import ProjectsPage from './ProjectsPage'
import '../styles/dashboard.css'

const DashboardPage = () => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('generate')

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>✨ Formexa</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            🤖 AI Generator
          </button>
          <button
            className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            📁 My Projects
          </button>
          <button
            className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ About
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="language-selector">
            <button
              onClick={() => handleLanguageChange('en')}
              className={i18n.language === 'en' ? 'active' : ''}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('ar')}
              className={i18n.language === 'ar' ? 'active' : ''}
            >
              العربية
            </button>
            <button
              onClick={() => handleLanguageChange('fr')}
              className={i18n.language === 'fr' ? 'active' : ''}
            >
              FR
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome to Formexa AI</h1>
          <p>Generate articles, images, and code with AI</p>
        </header>

        {activeTab === 'generate' && (
          <div className="tab-content">
            <GenerateSection />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="tab-content">
            <ProjectsPage />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="tab-content about-section">
            <h2>About Formexa</h2>
            <div className="about-grid">
              <div className="about-card">
                <h3>📝 Article Generation</h3>
                <p>Generate high-quality, SEO-optimized articles using GPT-4</p>
              </div>
              <div className="about-card">
                <h3>🖼️ Image Generation</h3>
                <p>Create stunning images from text descriptions using DALL-E</p>
              </div>
              <div className="about-card">
                <h3>💻 Code Generation</h3>
                <p>Generate clean, working code snippets for any programming language</p>
              </div>
              <div className="about-card">
                <h3>⚡ Instant Results</h3>
                <p>Get AI-powered content in seconds, not minutes</p>
              </div>
              <div className="about-card">
                <h3>🌐 Multi-Language</h3>
                <p>Available in English, Arabic, and French</p>
              </div>
              <div className="about-card">
                <h3>🚀 Always Free</h3>
                <p>Start generating content right now at no cost</p>
              </div>
            </div>

            <div className="pricing-preview">
              <h2>Simple Pricing</h2>
              <div className="pricing-grid">
                <div className="plan">
                  <h3>Free</h3>
                  <p className="price">$0/month</p>
                  <ul>
                    <li>✓ 5 articles/month</li>
                    <li>✓ 2 images/month</li>
                    <li>✓ 5 code snippets/month</li>
                  </ul>
                </div>
                <div className="plan featured">
                  <h3>Pro</h3>
                  <p className="price">$9.99/month</p>
                  <ul>
                    <li>✓ 100 articles/month</li>
                    <li>✓ 50 images/month</li>
                    <li>✓ 100 code snippets/month</li>
                    <li>✓ Priority support</li>
                  </ul>
                </div>
                <div className="plan">
                  <h3>Business</h3>
                  <p className="price">$29.99/month</p>
                  <ul>
                    <li>✓ Unlimited everything</li>
                    <li>✓ API access</li>
                    <li>✓ Dedicated support</li>
                    <li>✓ Custom integrations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardPage
