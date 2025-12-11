import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProjectsStore } from '../store'
import { projectsAPI } from '../services/api'

const ProjectsList = () => {
  const { t } = useTranslation()
  const projects = useProjectsStore((state) => state.projects)
  const [filter, setFilter] = useState('all')

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.type === filter)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await projectsAPI.delete(id)
      useProjectsStore.setState((state) => ({
        projects: state.projects.filter(p => p._id !== id)
      }))
    } catch (error) {
      alert('Failed to delete project')
    }
  }

  if (projects.length === 0) {
    return <p>{t('dashboard.noProjects')}</p>
  }

  return (
    <div className="projects-list">
      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'article' ? 'active' : ''}
          onClick={() => setFilter('article')}
        >
          📝 Articles
        </button>
        <button
          className={filter === 'image' ? 'active' : ''}
          onClick={() => setFilter('image')}
        >
          🖼️ Images
        </button>
        <button
          className={filter === 'code' ? 'active' : ''}
          onClick={() => setFilter('code')}
        >
          💻 Code
        </button>
      </div>

      <div className="grid grid-2">
        {filteredProjects.map((project) => (
          <div key={project._id} className="card project-card">
            <h4>{project.title}</h4>
            <p className="project-type">{project.type}</p>
            <p className="project-date">
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
            <div className="project-actions">
              <button className="btn-secondary" onClick={() => {
                // Copy to clipboard or preview
                alert('Content preview:\n' + project.content.output.substring(0, 100) + '...')
              }}>
                Preview
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleDelete(project._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsList
