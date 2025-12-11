import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { aiAPI } from '../services/api'

const GenerateSection = ({ profile, onGenerated }) => {
  const { t } = useTranslation()
  const [activeType, setActiveType] = useState('article')
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [saveProject, setSaveProject] = useState(true)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    setLoading(true)
    try {
      let response
      if (activeType === 'article') {
        response = await aiAPI.generateArticle(prompt, title, saveProject)
      } else if (activeType === 'image') {
        response = await aiAPI.generateImage(prompt, '1024x1024', saveProject)
      } else {
        response = await aiAPI.generateCode(prompt, 'javascript', saveProject)
      }

      setResult(response.data)
      onGenerated()
    } catch (error) {
      alert('Generation failed: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="generate-section">
      <div className="generate-options">
        <button
          className={`generate-btn ${activeType === 'article' ? 'active' : ''}`}
          onClick={() => setActiveType('article')}
        >
          📝 {t('dashboard.generateArticle')}
        </button>
        <button
          className={`generate-btn ${activeType === 'image' ? 'active' : ''}`}
          onClick={() => setActiveType('image')}
        >
          🖼️ {t('dashboard.generateImage')}
        </button>
        <button
          className={`generate-btn ${activeType === 'code' ? 'active' : ''}`}
          onClick={() => setActiveType('code')}
        >
          💻 {t('dashboard.generateCode')}
        </button>
      </div>

      <div className="generate-form">
        {activeType === 'article' && (
          <div className="input-group">
            <label>{t('dashboard.title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title (optional)"
            />
          </div>
        )}

        <div className="input-group">
          <label>{t('dashboard.prompt')}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe your ${activeType}...`}
            rows="6"
          />
        </div>

        <div className="input-group checkbox">
          <input
            type="checkbox"
            id="save"
            checked={saveProject}
            onChange={(e) => setSaveProject(e.target.checked)}
          />
          <label htmlFor="save">{t('dashboard.save')}</label>
        </div>

        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('common.generate')}
        </button>
      </div>

      {result && (
        <div className="result-preview">
          <h3>{t('dashboard.preview')}</h3>
          {activeType === 'article' && (
            <div className="article-result">
              <p>{result.content}</p>
            </div>
          )}
          {activeType === 'image' && (
            <img src={result.imageUrl} alt="Generated" />
          )}
          {activeType === 'code' && (
            <pre><code>{result.code}</code></pre>
          )}
        </div>
      )}
    </div>
  )
}

export default GenerateSection
