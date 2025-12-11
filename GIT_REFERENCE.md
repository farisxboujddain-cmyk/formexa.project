# Git & GitHub Quick Reference

## Initial Setup (One-time)

```bash
# Navigate to project directory
cd C:\Users\pcc\Downloads\formexa

# Initialize Git (if not already done)
git init

# Configure Git user info
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Verify configuration
git config --list
```

## Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - Repository name: `formexa`
   - Description: `Production-ready AI SaaS platform with PayPal subscriptions`
   - Visibility: Public (portfolio) or Private
3. Click "Create repository"
4. Copy the HTTPS URL (e.g., https://github.com/farisxboujddain-cmyk/formexa.git)

## Connect Local Repo to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/farisxboujddain-cmyk/formexa.git

# Verify remote
git remote -v

# Expected output:
# origin  https://github.com/farisxboujddain-cmyk/formexa.git (fetch)
# origin  https://github.com/farisxboujddain-cmyk/formexa.git (push)
```

## First Commit & Push

```bash
# Stage all files (respecting .gitignore)
git add .

# Create commit
git commit -m "Initial commit: Formexa SaaS platform with PayPal integration"

# Rename branch to main (GitHub default)
git branch -M main

# Push to GitHub
git push -u origin main

# Verify upload
git log --oneline origin/main
```

## Common Git Workflow

```bash
# Check status
git status

# See what changed
git diff

# View commit history
git log --oneline -10

# Stage changes
git add .
git add src/specific/file.js       # Stage single file
git add src/                        # Stage directory

# Commit changes
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in payment flow"
git commit -m "docs: update API documentation"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

## Branching for Features

```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Make changes and commit
git add .
git commit -m "feat: implement new feature"

# Push feature branch
git push -u origin feature/new-feature-name

# Create Pull Request on GitHub (merge to main)
# Once approved, merge and delete branch

# Switch back to main
git checkout main

# Update main locally
git pull origin main

# Delete local feature branch
git branch -d feature/new-feature-name
```

## Viewing Commits & History

```bash
# View last 5 commits
git log --oneline -5

# View detailed commit info
git log -p -1

# View commits by author
git log --author="Your Name"

# View commits in a range
git log main..feature/branch

# View graph of commits
git log --graph --oneline --all
```

## Undoing Changes

```bash
# Undo unstaged changes
git checkout -- filename.js

# Unstage a file
git reset HEAD filename.js

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert specific commit (create new commit)
git revert commit-hash
```

## Syncing with Remote

```bash
# Fetch latest from GitHub (doesn't merge)
git fetch origin

# Pull latest and merge
git pull origin main

# Push local changes
git push origin main

# Force push (use with caution!)
git push -f origin main
```

## Checking Remote Status

```bash
# View remote information
git remote -v

# Show remote branch info
git branch -r

# Check tracking relationship
git branch -vv
```

## GitHub Actions Secrets (for CI/CD)

Go to GitHub: Your repo → Settings → Secrets and variables → Actions

Add these secrets:
```
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
OPENAI_API_KEY
GOOGLE_GEMINI_API_KEY
MONGODB_URI
JWT_SECRET
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel

# Deploy to production
vercel --prod
```

## Troubleshooting

### "fatal: not a git repository"
```bash
git init
git remote add origin <url>
git pull origin main
```

### "Permission denied (publickey)"
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
cat ~/.ssh/id_ed25519.pub

# Or use HTTPS with personal access token
git clone https://github.com/username/formexa.git
```

### "Updates were rejected because the tip of your current branch is behind"
```bash
git pull origin main
git push origin main
```

### Accidentally committed .env file
```bash
git rm --cached .env
git commit -m "Remove .env file"
git push origin main

# Add to .gitignore if not already there
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Ensure .env is ignored"
git push origin main
```

### Want to see what will be pushed before pushing
```bash
git log main...origin/main
```

## Useful Aliases

Add to `.gitconfig`:
```bash
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all
```

## GitHub Repository Health

```bash
# Find files larger than 5MB
git ls-files -l | awk -F' ' '{print $4}' | while read f; do du -h "$f"; done | sort -rh | head -5

# View total repo size
du -sh .git

# Check for sensitive files
git grep -i "password\|api_key\|secret" -- ':!*.lock'
```

## Updating This Project Later

```bash
# Create new branch for updates
git checkout -b update/feature-name

# Make changes
# ...

# Commit and push
git add .
git commit -m "update: description of changes"
git push origin update/feature-name

# Create PR on GitHub or merge directly
git checkout main
git pull origin main
git merge update/feature-name
git push origin main
```

---

**Remember:** Always commit before switching branches or major changes!

For more help: `git help <command>` or https://git-scm.com/doc
