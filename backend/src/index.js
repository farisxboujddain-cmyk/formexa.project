require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const paypalRoutes = require('./routes/paypal');
const aiRoutes = require('./routes/ai');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/user');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateJWT } = require('./middleware/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan('combined'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/ai', authenticateJWT, aiRoutes);
app.use('/api/projects', authenticateJWT, projectRoutes);
app.use('/api/user', authenticateJWT, userRoutes);

// API documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'Formexa API v1.0',
    endpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/github',
        'GET /api/auth/github/callback'
      ],
      payments: [
        'POST /api/paypal/create-subscription',
        'POST /api/paypal/webhook',
        'GET /api/subscriptions/status',
        'POST /api/subscriptions/cancel'
      ],
      ai: [
        'POST /api/ai/generate-article',
        'POST /api/ai/generate-image',
        'POST /api/ai/generate-code'
      ],
      projects: [
        'GET /api/projects',
        'POST /api/projects',
        'DELETE /api/projects/:id'
      ]
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`✓ Formexa backend running on port ${PORT} (${NODE_ENV})`);
});

module.exports = app;
