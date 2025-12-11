const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const Project = require('../models/Project');

// Get user projects
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { type, limit = 20, skip = 0 } = req.query;

    const filter = { userId: req.user.id };
    if (type) filter.type = type;

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { title, description, tags, isPublic } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, tags, isPublic, updatedAt: new Date() },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
