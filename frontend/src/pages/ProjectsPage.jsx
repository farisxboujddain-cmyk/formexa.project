import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import '../styles/projects.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.list();
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete project.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="projects-page">
      <h1>My Projects</h1>
      {projects.length === 0 ? (
        <p>You haven't created any projects yet.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
