# GitHub Deployment Guide for Formexa

## Step 1: Initialize Git Repository Locally

```bash
cd C:\path\to\formexa
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
```

## Step 2: Add All Files and Create Initial Commit

```bash
git add .
git commit -m "Initial commit: Formexa SaaS platform with PayPal integration"
```

## Step 3: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `formexa`
3. Description: "Production-ready AI SaaS platform with PayPal subscriptions"
4. Choose: **Public** (for portfolio) or **Private** (for confidentiality)
5. Click "Create repository"

## Step 4: Push to GitHub

Copy the HTTPS URL from your new GitHub repo and run:

```bash
git remote add origin https://github.com/farisxboujddain-cmyk/formexa.git
git branch -M main
git push -u origin main
```

## Verification

Check if files uploaded successfully:
```bash
git log --oneline
git remote -v
```

Visit: `https://github.com/farisxboujddain-cmyk/formexa`

---

## File Structure Uploaded

```
formexa/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── paypal.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Subscription.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── paypal.js
│   │   │   ├── ai.js
│   │   │   ├── projects.js
│   │   │   └── user.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GenerateSection.jsx
│   │   │   ├── ProjectsList.jsx
│   │   │   └── SubscriptionStatus.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── index.js
│   │   ├── i18n/
│   │   │   ├── config.js
│   │   │   └── locales/
│   │   │       ├── en.json
│   │   │       ├── ar.json
│   │   │       └── fr.json
│   │   ├── styles/
│   │   │   ├── landing.css
│   │   │   ├── pricing.css
│   │   │   ├── auth.css
│   │   │   └── dashboard.css
│   │   ├── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── .env.example
├── .gitignore
├── README.md
└── vercel.json
```

---

## Next: Configure GitHub Secrets for CI/CD (Optional)

Go to your repo → Settings → Secrets and variables → Actions

Add these secrets (for automated testing/deployment):
- `MONGODB_URI`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `OPENAI_API_KEY`
- `GOOGLE_GEMINI_API_KEY`
- `JWT_SECRET`

---

## Deployment to Vercel

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your `formexa` repo
4. Set environment variables (copy from `.env.example`)
5. Deploy!

Vercel will auto-detect `vercel.json` and deploy both frontend and backend.

---

## Clone Repository Later

```bash
git clone https://github.com/farisxboujddain-cmyk/formexa.git
cd formexa
npm install
cd frontend && npm install && cd ..
```

---

## Troubleshooting

**Error: "fatal: not a git repository"**
```bash
git init
git remote add origin https://github.com/farisxboujddain-cmyk/formexa.git
```

**Error: "Permission denied (publickey)"**
- Generate SSH key: `ssh-keygen -t ed25519`
- Add to GitHub: Settings → SSH Keys → New SSH key
- Or use HTTPS with personal access token

**Error: ".env file should not be committed"**
- ✅ Already in `.gitignore`
- Files ignored: `.env`, `node_modules/`, `.DS_Store`, etc.

---

## Making Updates

```bash
# Make changes to files
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel auto-deploys on push to main!

