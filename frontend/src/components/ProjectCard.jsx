import React from 'react';

const ProjectCard = ({ project, onDelete }) => {
  return (
    <div className="project-card">
      <h3>{project.title || 'Untitled Project'}</h3>
      <p><strong>Type:</strong> {project.type}</p>
      {project.type === 'image' && project.content.output && (
        <img src={project.content.output} alt={project.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      )}
      {project.type === 'article' && (
        <p className="project-content">{project.content.output.substring(0, 150)}...</p>
      )}
      {project.type === 'code' && (
        <pre><code>{project.content.output.substring(0, 150)}...</code></pre>
      )}
      <button onClick={() => onDelete(project._id)} className="btn-delete">
        Delete
      </button>
    </div>
  );
};

export default ProjectCard;
