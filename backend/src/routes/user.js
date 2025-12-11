const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      language: user.language,
      billingCycle: user.billingCycle,
      usage: user.usage,
      limits: user.getSubscriptionLimits(),
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', authenticateJWT, async (req, res) => {
  try {
    const { name, avatar, language } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar, language, updatedAt: new Date() },
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        language: user.language
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get usage statistics
router.get('/stats', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const Project = require('../models/Project');

    const projectCount = await Project.countDocuments({ userId: user._id });
    const articleCount = await Project.countDocuments({
      userId: user._id,
      type: 'article'
    });
    const imageCount = await Project.countDocuments({
      userId: user._id,
      type: 'image'
    });
    const codeCount = await Project.countDocuments({
      userId: user._id,
      type: 'code'
    });

    res.json({
      subscriptionPlan: user.subscriptionPlan,
      usage: user.usage,
      limits: user.getSubscriptionLimits(),
      projects: {
        total: projectCount,
        articles: articleCount,
        images: imageCount,
        code: codeCount
      },
      monthlyResetDate: user.usageResetDate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
