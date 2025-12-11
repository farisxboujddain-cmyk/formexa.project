const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireSubscription = (plan) => {
  return async (req, res, next) => {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const planHierarchy = { free: 0, pro: 1, business: 2 };
      if (planHierarchy[user.subscriptionPlan] < planHierarchy[plan]) {
        return res.status(403).json({ error: 'Subscription plan required' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Authentication check failed' });
    }
  };
};

module.exports = { authenticateJWT, requireSubscription };
