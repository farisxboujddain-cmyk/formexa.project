const rateLimit = require('express-rate-limit');

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Per-plan rate limiters
const planLimiters = {
  free: rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 50, // 50 API calls per day
    keyGenerator: (req) => req.user?.id || req.ip,
    skip: (req) => req.user?.subscriptionPlan !== 'free'
  }),
  pro: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // 1000 API calls per hour
    keyGenerator: (req) => req.user?.id || req.ip,
    skip: (req) => req.user?.subscriptionPlan !== 'pro'
  }),
  business: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10000, // 10000 API calls per minute
    keyGenerator: (req) => req.user?.id || req.ip,
    skip: (req) => req.user?.subscriptionPlan !== 'business'
  })
};

// Apply plan-specific limiter
const applyPlanLimiter = (req, res, next) => {
  const plan = req.user?.subscriptionPlan || 'free';
  const limiter = planLimiters[plan];
  limiter(req, res, next);
};

module.exports = { globalLimiter, applyPlanLimiter, planLimiters };
