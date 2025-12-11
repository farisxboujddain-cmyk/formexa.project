# 🚀 Formexa - Complete Setup & Deployment Guide

Welcome to **Formexa**, a production-ready AI-powered SaaS platform! This guide will walk you through every step needed to get the project running locally and deployed to GitHub & Vercel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [GitHub Repository Setup](#github-repository-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [GitHub Actions CI/CD](#github-actions-cicd)
7. [Vercel Deployment](#vercel-deployment)
8. [Testing & Debugging](#testing--debugging)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required
- **Git** - https://git-scm.com/download/win
- **Node.js 18+** - https://nodejs.org/
- **npm 9+** - (comes with Node.js)

### Recommended
- **Visual Studio Code** - https://code.visualstudio.com/
- **MongoDB Compass** (for database visualization)
- **Postman** (for API testing)

### Accounts Needed
1. **GitHub** - https://github.com/join
2. **PayPal Developer** - https://developer.paypal.com
3. **OpenAI API** - https://platform.openai.com
4. **Google Cloud** (for Gemini API) - https://cloud.google.com
5. **MongoDB Atlas** (for database) - https://www.mongodb.com/cloud/atlas
6. **Vercel** (for deployment) - https://vercel.com/signup

### Verify Installations

```powershell
# Check Node.js
node --version

# Check npm
npm --version

# Check Git
git --version
```

---

## Local Setup

### Step 1: Navigate to Project Directory

```powershell
cd C:\Users\pcc\Downloads\formexa
```

### Step 2: Install Dependencies

```powershell
# Install all dependencies (backend + frontend)
npm run install-all

# Or manually:
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

This will install:
- Backend dependencies (Express, MongoDB, PayPal SDK, etc.)
- Frontend dependencies (React, Vite, i18next, etc.)

### Step 3: Verify Installation

```powershell
# Check backend
cd backend && npm test && cd ..

# Check frontend
cd frontend && npm run build && cd ..
```

✅ If both commands complete without errors, installation is successful!

---

## GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the form:
   - **Repository name**: `formexa`
   - **Description**: `Production-ready AI SaaS platform with PayPal subscriptions`
   - **Visibility**: Choose **Public** (for portfolio) or **Private**
   - **Skip** "Initialize with README" (we already have one)
3. Click **"Create repository"**

### Step 2: Automatic Setup (Recommended)

**Option A: PowerShell Script (Easiest)**

```powershell
# Run from formexa directory
powershell -ExecutionPolicy Bypass -File setup-github.ps1
```

Follow the prompts and enter:
- Your GitHub username
- Your GitHub email
- Your repository URL: `https://github.com/YOUR_USERNAME/formexa.git`

**Option B: Manual Setup**

```powershell
# Initialize Git
git init

# Configure user
git config user.name "Your Name"
git config user.email "your.email@gmail.com"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/formexa.git

# Stage files
git add .

# Create commit
git commit -m "Initial commit: Formexa SaaS platform with PayPal integration"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Verify Upload

1. Visit: `https://github.com/YOUR_USERNAME/formexa`
2. You should see all project files uploaded
3. Check the `.gitignore` entries (no `.env` or `node_modules`)

---

## Environment Configuration

### Create .env File

```powershell
# Copy template
copy .env.example .env

# Open in VS Code
code .env
```

### Configure Credentials

Fill in your credentials from the accounts you created:

```env
# ===== PayPal (Get from https://developer.paypal.com) =====
PAYPAL_CLIENT_ID=Your_Sandbox_Client_ID_Here
PAYPAL_CLIENT_SECRET=Your_Sandbox_Client_Secret_Here
PAYPAL_WEBHOOK_ID=Your_Webhook_ID_Here
PAYPAL_MODE=sandbox

# ===== OpenAI (Get from https://platform.openai.com) =====
OPENAI_API_KEY=sk_test_XXXXX...

# ===== Google Gemini (Optional) =====
GOOGLE_GEMINI_API_KEY=Your_Gemini_API_Key

# ===== MongoDB (Get from https://www.mongodb.com/cloud/atlas) =====
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/formexa

# ===== Generate a random JWT Secret =====
# Run in terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=Your_32_Char_Random_Secret_Here

# ===== GitHub OAuth (Optional) =====
GITHUB_CLIENT_ID=Your_GitHub_Client_ID
GITHUB_CLIENT_SECRET=Your_GitHub_Client_Secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# ===== Server Config =====
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# ===== Email (Optional) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=formexatech@gmail.com
```

### Generate JWT Secret

```powershell
# PowerShell - Generate secure random key
$bytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
[System.Convert]::ToHexString($bytes)

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Important: Don't Commit .env!

✅ `.env` is already in `.gitignore`
✅ Never push sensitive credentials to GitHub
✅ Use GitHub Secrets for CI/CD instead (see [GitHub Actions CI/CD](#github-actions-cicd))

---

## Running the Application

### Option 1: Run Both Servers Simultaneously

```powershell
npm run dev
```

This runs:
- Backend on http://localhost:3000
- Frontend on http://localhost:5173

### Option 2: Run Separately

**Terminal 1 - Backend**
```powershell
npm run dev:backend
```

**Terminal 2 - Frontend**
```powershell
npm run dev:frontend
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs

### First Test

1. Go to http://localhost:5173
2. Click "Register"
3. Create a test account
4. Browse the app (it uses your free plan)
5. Check backend logs for API calls

---

## GitHub Actions CI/CD

GitHub Actions automatically tests and builds your code on every push!

### Step 1: Add Secrets to GitHub

1. Go to your repo: `https://github.com/YOUR_USERNAME/formexa`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add each:

```
Name: PAYPAL_CLIENT_ID
Value: (your value from .env)

Name: PAYPAL_CLIENT_SECRET
Value: (your value from .env)

Name: OPENAI_API_KEY
Value: (your value from .env)

Name: GOOGLE_GEMINI_API_KEY
Value: (your value from .env)

Name: MONGODB_URI
Value: (your MongoDB connection string)

Name: JWT_SECRET
Value: (your JWT secret from .env)

Name: VERCEL_TOKEN
Value: (get from vercel.com/account/tokens)

Name: VERCEL_ORG_ID
Value: (get from vercel team settings)

Name: VERCEL_PROJECT_ID
Value: (get after creating project on Vercel)
```

### Step 2: Verify CI/CD Runs

1. Make a small change to a file
2. Commit and push:
   ```powershell
   git add .
   git commit -m "test: verify CI/CD pipeline"
   git push origin main
   ```
3. Go to repo → **Actions** tab
4. Watch the workflow run tests and lint code

---

## Vercel Deployment

### Step 1: Create Vercel Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Search for and select `formexa`
4. Click **"Import"**

### Step 2: Configure Environment Variables

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add all variables from `.env.example`:

```
PAYPAL_CLIENT_ID = (value)
PAYPAL_CLIENT_SECRET = (value)
OPENAI_API_KEY = (value)
GOOGLE_GEMINI_API_KEY = (value)
MONGODB_URI = (value)
JWT_SECRET = (value)
PAYPAL_WEBHOOK_ID = (value)
PAYPAL_MODE = production (change from sandbox)
NODE_ENV = production
```

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (~5-10 minutes)
3. Visit your live app: `https://formexa-YOUR-NAME.vercel.app`

### Step 4: Configure PayPal Webhook

1. Go to PayPal Developer Dashboard
2. Apps & Credentials → Webhooks
3. Add webhook URL: `https://formexa-YOUR-NAME.vercel.app/api/paypal/webhook`
4. Select events:
   - BILLING.SUBSCRIPTION.CREATED
   - BILLING.SUBSCRIPTION.ACTIVATED
   - BILLING.SUBSCRIPTION.CANCELLED
   - PAYMENT.SALE.DENIED
5. Save webhook

### Step 5: Test Production Deployment

1. Access your live app
2. Create account with test PayPal account
3. Try to subscribe to Pro/Business plan
4. Verify subscription webhook updates database

---

## Testing & Debugging

### Test Backend API

```powershell
# Using curl (built-in on Windows 10+)
# Test health endpoint
curl http://localhost:3000/api/health

# Test registration
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User"
  }'

# Test login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Test Frontend

```powershell
# Check console for errors: F12 in browser
# Check network tab for failed requests
# Check React DevTools (browser extension)
```

### View Backend Logs

```powershell
# Terminal where backend is running shows:
# - HTTP requests
# - Database queries
# - Errors and warnings
```

### View MongoDB Data

```powershell
# Use MongoDB Compass
# Connect to: mongodb+srv://username:password@cluster.mongodb.net
# Browse databases and collections
# Can view, edit, and delete documents
```

---

## Troubleshooting

### "npm: command not found"

**Cause**: Node.js/npm not installed or not in PATH

**Fix**:
1. Download Node.js from https://nodejs.org/
2. Install with default settings
3. Restart PowerShell
4. Run `node --version` to verify

### "MongoDB connection failed"

**Cause**: Wrong connection string or MongoDB Atlas network access

**Fix**:
1. Check `MONGODB_URI` in `.env`
2. Go to MongoDB Atlas → Network Access
3. Add your IP address (or 0.0.0.0 for development)
4. Check database credentials are correct

### "Cannot find module 'express'"

**Cause**: Dependencies not installed

**Fix**:
```powershell
npm run install-all
```

### "Port 3000 already in use"

**Cause**: Another app using port 3000

**Fix**:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID 1234 /F

# Or change port in .env
PORT=3001
```

### "PayPal API error"

**Cause**: Invalid credentials or wrong mode

**Fix**:
1. Check `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in `.env`
2. Verify they're from Sandbox (not Live)
3. Check `PAYPAL_MODE=sandbox` in `.env`
4. Restart backend: `npm run dev:backend`

### "OpenAI API error"

**Cause**: Invalid API key or rate limit

**Fix**:
1. Check `OPENAI_API_KEY` is correct (starts with `sk_`)
2. Check your OpenAI account has credits
3. Check your rate limit status at https://platform.openai.com/account/billing
4. Wait and retry

### "GitHub push rejected"

**Cause**: Authentication or branch mismatch

**Fix**:
```powershell
# Pull latest changes first
git pull origin main

# Then push
git push origin main

# If authentication fails, use personal access token
# https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
```

### "Vercel deployment failed"

**Cause**: Missing environment variables or build error

**Fix**:
1. Check all secrets are added to Vercel
2. Check build logs at https://vercel.com/dashboard
3. Ensure `.env` is in `.gitignore`
4. Test locally first: `npm run build`

### "Frontend can't reach backend API"

**Cause**: CORS or wrong API URL

**Fix**:
1. Check backend is running: http://localhost:3000/api/health
2. Check `FRONTEND_URL` in backend `.env`
3. Verify frontend `vite.config.js` proxy settings
4. Check browser console for CORS errors

---

## Quick Reference

### Most Used Commands

```powershell
# Install
npm run install-all

# Development
npm run dev              # Both servers
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only

# Testing
npm test                 # All tests
npm run lint             # Lint code

# Deployment
git add .
git commit -m "message"
git push origin main
# (Auto-deploys to Vercel via CI/CD)

# GitHub
git status               # See changes
git log --oneline        # See commits
git branch -a            # See branches
```

### File Locations

- **Backend**: `/backend/src/`
- **Frontend**: `/frontend/src/`
- **Config**: `.env` (not in repo)
- **Database**: MongoDB Atlas (cloud)

### Important URLs

- **App**: http://localhost:5173
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **GitHub**: https://github.com/YOUR_USERNAME/formexa
- **Vercel**: https://vercel.com/dashboard
- **MongoDB**: https://cloud.mongodb.com
- **PayPal Dev**: https://developer.paypal.com

---

## Next Steps

1. ✅ Complete this setup guide
2. ✅ Push to GitHub: `git push origin main`
3. ✅ Deploy to Vercel: vercel.com/new
4. ✅ Configure PayPal webhook
5. ✅ Test production app
6. ✅ Share your app on portfolio/LinkedIn
7. ✅ Continue development & add features

---

## Support

- **Documentation**: See README.md
- **Git Help**: See GIT_REFERENCE.md
- **Contributing**: See CONTRIBUTING.md
- **Email**: formexatech@gmail.com
- **GitHub Issues**: https://github.com/farisxboujddain-cmyk/formexa/issues

---

**Happy coding! 🚀**

For questions or issues, open a GitHub Issue with detailed information about the problem.
