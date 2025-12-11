# Formexa — Production-Ready SaaS Platform

**Formexa** is an AI-powered SaaS platform offering article, image, and code generation with PayPal subscription management, multi-language support (English, Arabic, French), and role-based rate limiting.

## Features

### 🎨 Core Platform
- **AI Generation**: Articles, Images, Code Snippets via OpenAI & Google Gemini
- **Project Management**: Save & organize generated content per user
- **Authentication**: Email & GitHub OAuth with JWT-based sessions
- **Multi-Language**: English (default), Arabic (RTL), French with real-time language switcher
- **Dashboard**: User profile, subscription status, usage analytics

### 💳 PayPal Subscriptions
- **Plans**: Free / Pro / Business (monthly & yearly billing)
- **Webhook Integration**: Automatic subscription lifecycle management
- **Secure Verification**: Server-side payment validation
- **Rate Limiting**: Per-plan API request limits enforced server-side

### 🚀 Production Ready
- Vercel Serverless Functions support
- GitHub Actions CI/CD
- Environment-based configuration (zero secrets in repo)
- Comprehensive error handling & logging
- Rate limiting & fraud prevention

## Tech Stack

**Backend**: Node.js + Express  
**Database**: MongoDB + Mongoose  
**Frontend**: React 18 + Vite  
**Auth**: JWT + GitHub OAuth + Email/Password  
**Payments**: PayPal JavaScript SDK + Webhooks  
**AI**: OpenAI GPT-4 + Google Gemini  
**i18n**: i18next + RTL support  
**Deployment**: Vercel (serverless) + GitHub

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB URI (Atlas or local)
- PayPal Sandbox credentials
- OpenAI & Google Gemini API keys
- GitHub OAuth credentials

### Installation

1) **Clone & Setup**
```bash
git clone https://github.com/farisxboujddain-cmyk/formexa
cd formexa
npm install

# Frontend
cd frontend
npm install
cd ..
```

2) **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3) **Start Development**
```bash
# Terminal 1 (Backend on port 3000)
npm run dev

# Terminal 2 (Frontend on port 5173)
cd frontend
npm run dev
```

4) **Access the Platform**
- Frontend: http://localhost:5173
- API Docs: http://localhost:3000/api/docs

## Environment Variables

All secrets are read from environment variables. Never hardcode credentials.

```env
# PayPal (Sandbox)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...

# AI APIs
OPENAI_API_KEY=...
GOOGLE_GEMINI_API_KEY=...

# Database
MONGODB_URI=...

# Auth
JWT_SECRET=... (min 32 chars)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

See `.env.example` for the complete list.

## Project Structure

```
formexa/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas (User, Subscription, Project, etc.)
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth, rate limit, error handling
│   │   ├── services/         # PayPal, AI, Email
│   │   ├── config/           # Database, PayPal config
│   │   ├── utils/            # Helpers
│   │   └── index.js          # Express server
│   ├── vercel.json           # Vercel serverless config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page-level components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API clients
│   │   ├── i18n/             # Translation files (en, ar, fr)
│   │   ├── utils/            # Helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json           # Vercel deployment
│   └── package.json
├── .env.example
├── .gitignore
├── vercel.json               # Root Vercel config
└── README.md
```

## API Endpoints (Overview)

### Auth
- `POST /api/auth/register` — Email registration
- `POST /api/auth/login` — Email login
- `GET /api/auth/github` — GitHub OAuth redirect
- `GET /api/auth/github/callback` — GitHub OAuth callback

### Subscriptions & Payments
- `POST /api/paypal/create-subscription` — Initiate PayPal subscription
- `POST /api/paypal/webhook` — PayPal webhook receiver
- `GET /api/subscriptions/status` — Get current subscription status
- `POST /api/subscriptions/cancel` — Cancel subscription

### AI Generation
- `POST /api/ai/generate-article` — Generate article (OpenAI GPT-4)
- `POST /api/ai/generate-image` — Generate image (OpenAI DALL-E)
- `POST /api/ai/generate-code` — Generate code snippet (Gemini or GPT-4)

### Projects
- `GET /api/projects` — List user's projects
- `POST /api/projects` — Create project
- `DELETE /api/projects/:id` — Delete project

### User
- `GET /api/user/profile` — Get user profile & subscription status
- `PUT /api/user/profile` — Update profile

## Subscription Plans

| Plan | Price (Monthly) | Yearly | Articles/mo | Images/mo | Code/mo | Support |
|------|-----------------|--------|-------------|-----------|---------|---------|
| Free | $0 | N/A | 5 | 2 | 5 | Community |
| Pro | $9.99 | $99.90 | 100 | 50 | 100 | Email |
| Business | $29.99 | $299.90 | Unlimited | Unlimited | Unlimited | Priority |

## Deployment

### Vercel (Recommended)

1) **Push to GitHub** (already in repo)
2) **Connect to Vercel**
   - Go to vercel.com → New Project
   - Import GitHub repo
   - Set environment variables in Vercel dashboard
   - Deploy

3) **Webhook Configuration**
   - In PayPal dashboard, set webhook URL to: `https://your-app.vercel.app/api/paypal/webhook`

### Docker (Optional)
```bash
docker build -t formexa .
docker run -p 3000:3000 --env-file .env formexa
```

## Testing

```bash
# Backend tests
npm test

# Frontend tests
cd frontend && npm test
```

## Security Notes

- ✅ All secrets stored in `.env` (never committed)
- ✅ JWT-based sessions (no cookies exposed)
- ✅ PayPal server-side verification (prevent fraud)
- ✅ Rate limiting per subscription plan
- ✅ CORS configured per environment
- ✅ MongoDB injection prevention via Mongoose
- ✅ Password hashing (bcrypt)
- ✅ HTTPS enforced in production

## License

MIT License — See LICENSE file

## Support

- **Email**: formexatech@gmail.com
- **GitHub**: https://github.com/farisxboujddain-cmyk/formexa
- **Issues**: Open an issue on GitHub

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)
- PayPal Sandbox account
- OpenAI API key
- Google Gemini API key (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/farisxboujddain-cmyk/formexa.git
cd formexa
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
# PayPal (Sandbox)
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id
PAYPAL_MODE=sandbox

# AI APIs
OPENAI_API_KEY=sk_...
GOOGLE_GEMINI_API_KEY=...

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/formexa

# Authentication
JWT_SECRET=your_32_char_minimum_secret_key_here
GITHUB_CLIENT_ID=your_github_oauth_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Server
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### Running Development Server

**Option 1: Run both frontend and backend simultaneously**
```bash
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

### Testing

```bash
# Run all tests
npm test

# Test backend only
npm run test:backend

# Test frontend only
npm run test:frontend
```

### Linting

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/github` - GitHub OAuth
- `GET /api/auth/github/callback` - GitHub OAuth callback

### Payments & Subscriptions
- `POST /api/paypal/create-subscription` - Create subscription
- `GET /api/paypal/status` - Get subscription status
- `POST /api/paypal/cancel` - Cancel subscription
- `POST /api/paypal/webhook` - PayPal webhook receiver

### AI Generation
- `POST /api/ai/generate-article` - Generate article
- `POST /api/ai/generate-image` - Generate image
- `POST /api/ai/generate-code` - Generate code

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - Get usage stats

## Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  subscriptionPlan: enum ['free', 'pro', 'business'],
  subscriptionStatus: enum ['active', 'inactive', 'cancelled'],
  usage: { articles: Number, images: Number, code: Number },
  language: enum ['en', 'ar', 'fr'],
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  userId: ObjectId,
  title: String,
  type: enum ['article', 'image', 'code'],
  content: { input: String, output: String },
  aiProvider: enum ['openai', 'gemini'],
  createdAt: Date,
  updatedAt: Date
}
```

### Subscription
```javascript
{
  userId: ObjectId,
  plan: enum ['free', 'pro', 'business'],
  paypalSubscriptionId: String,
  status: enum ['active', 'inactive', 'cancelled'],
  price: Number,
  events: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check Atlas connection string
- Verify username/password in MONGODB_URI

### PayPal Webhook Not Triggering
- Use ngrok to expose local server: `ngrok http 3000`
- Update PayPal webhook URL to ngrok URL + `/api/paypal/webhook`
- Verify webhook ID matches in `.env`

### Frontend Can't Connect to Backend
- Check if backend is running on port 3000
- Verify FRONTEND_URL in backend `.env`
- Clear browser cache and restart frontend

### OpenAI API Rate Limited
- Check your API quota at platform.openai.com
- Upgrade account or wait for quota reset
- Implement better caching/queuing

## Environment Variables Checklist

Before deploying, ensure all these are set:

- [ ] PAYPAL_CLIENT_ID
- [ ] PAYPAL_CLIENT_SECRET
- [ ] PAYPAL_WEBHOOK_ID
- [ ] OPENAI_API_KEY
- [ ] GOOGLE_GEMINI_API_KEY
- [ ] MONGODB_URI
- [ ] JWT_SECRET (min 32 chars)
- [ ] GITHUB_CLIENT_ID
- [ ] GITHUB_CLIENT_SECRET
- [ ] PORT (default: 3000)
- [ ] NODE_ENV (development/production)

## Performance Optimization

### Frontend
- Images are lazy-loaded
- Code splitting with React Router
- CSS is minified in production
- i18n translations are cached

### Backend
- Database indexes on userId, createdAt
- Rate limiting per subscription plan
- Caching for frequently accessed data
- Connection pooling for MongoDB

## Security Best Practices

✅ All secrets in environment variables
✅ Password hashing with bcryptjs
✅ JWT-based authentication
✅ CORS configured per environment
✅ Input validation on all endpoints
✅ SQL injection prevention (Mongoose)
✅ Rate limiting implemented
✅ Error messages don't leak sensitive info

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Code standards
- Git workflow
- Pull request process
- Bug reporting
- Feature requests

## GitHub Deployment

See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) for step-by-step instructions on:
- Initializing Git
- Creating GitHub repository
- Pushing code
- GitHub Actions CI/CD
- Vercel deployment

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Custom API integrations
- [ ] Batch generation API
- [ ] Advanced content templates
- [ ] Webhook integrations
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Advanced search & filtering

## Support & Contact

- **Email**: formexatech@gmail.com
- **GitHub**: https://github.com/farisxboujddain-cmyk/formexa
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

Built with ❤️ by Formexa Team
