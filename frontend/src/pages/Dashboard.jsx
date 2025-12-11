import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore, useSubscriptionStore, useProjectsStore } from '../store'
import { userAPI, aiAPI, projectsAPI, paypalAPI } from '../services/api'
import GenerateSection from '../components/GenerateSection'
import ProjectsList from '../components/ProjectsList'
import SubscriptionStatus from '../components/SubscriptionStatus'
import '../styles/dashboard.css'

const DashboardPage = () => {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const setProjects = useProjectsStore((state) => state.setProjects)
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile()
      setProfile(response.data)
      // Load projects
      const projectsRes = await projectsAPI.list(null, 20, 0)
      setProjects(projectsRes.data.projects)
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>{t('common.appName')}</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            📊 {t('dashboard.overview')}
          </button>
          <button
            className={activeTab === 'generate' ? 'active' : ''}
            onClick={() => setActiveTab('generate')}
          >
            ✨ Generate
          </button>
          <button
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            📁 {t('dashboard.projects')}
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ {t('dashboard.settings')}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => logout()} className="logout-btn">
            {t('common.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1>{t('dashboard.title')}</h1>
          <div className="header-actions">
            <select onChange={(e) => i18n.changeLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </header>

        {/* Tabs Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <SubscriptionStatus subscription={profile} />
              
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>📝 Articles</h4>
                  <p className="stat-value">{profile?.usage.articles || 0}</p>
                  <p className="stat-limit">/{profile?.limits.articles}</p>
                </div>
                <div className="stat-card">
                  <h4>🖼️ Images</h4>
                  <p className="stat-value">{profile?.usage.images || 0}</p>
                  <p className="stat-limit">/{profile?.limits.images}</p>
                </div>
                <div className="stat-card">
                  <h4>💻 Code</h4>
                  <p className="stat-value">{profile?.usage.code || 0}</p>
                  <p className="stat-limit">/{profile?.limits.code}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'generate' && (
            <GenerateSection profile={profile} onGenerated={loadProfile} />
          )}

          {activeTab === 'projects' && (
            <ProjectsList />
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="card">
                <h3>Profile Settings</h3>
                <p>Email: {profile?.email}</p>
                <p>Plan: <span className="badge badge-success">{profile?.subscriptionPlan}</span></p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
