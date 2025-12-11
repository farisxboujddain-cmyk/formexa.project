# ===== Formexa GitHub Setup Script for Windows PowerShell =====
# Run this script from the formexa directory to automatically push to GitHub
# Usage: powershell -ExecutionPolicy Bypass -File setup-github.ps1

Write-Host "`n===== Formexa GitHub Setup =====" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/download/win"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "backend\package.json")) {
    Write-Host "✗ ERROR: Please run this script from the formexa root directory" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if repo is already initialized
if (Test-Path ".git") {
    Write-Host "Repository already initialized" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
    Write-Host ""
}

# Configure Git user
Write-Host "Configuring Git user..." -ForegroundColor Cyan
$gitName = Read-Host "Enter your Git username (or press Enter to skip)"
$gitEmail = Read-Host "Enter your Git email (or press Enter to skip)"

if ($gitName -and $gitEmail) {
    git config user.name $gitName
    git config user.email $gitEmail
    Write-Host "✓ Git user configured" -ForegroundColor Green
} else {
    Write-Host "Skipped Git user configuration" -ForegroundColor Yellow
}
Write-Host ""

# Check for existing remote
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0 -and $existingRemote) {
    Write-Host "Remote 'origin' already exists:" -ForegroundColor Yellow
    Write-Host "  $existingRemote" -ForegroundColor Yellow
    $changeRemote = Read-Host "Do you want to change it? (y/n)"
    
    if ($changeRemote -eq "y" -or $changeRemote -eq "yes") {
        git remote remove origin
        Write-Host "✓ Old remote removed" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Skipping remote configuration" -ForegroundColor Yellow
        goto SKIP_REMOTE
    }
}

# Add remote
Write-Host ""
Write-Host "Enter your GitHub repository URL" -ForegroundColor Cyan
Write-Host "Example: https://github.com/yourusername/formexa.git"
Write-Host ""
$githubUrl = Read-Host "GitHub URL"

if ($githubUrl) {
    git remote add origin $githubUrl
    Write-Host "✓ Remote repository added" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✗ ERROR: GitHub URL is required" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

SKIP_REMOTE:

# Stage all files
Write-Host "Staging files..." -ForegroundColor Cyan
git add .
Write-Host "✓ Files staged" -ForegroundColor Green
Write-Host ""

# Create commit
Write-Host "Creating initial commit..." -ForegroundColor Cyan
$commitOutput = git commit -m "Initial commit: Formexa SaaS platform with PayPal integration" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Note: No new changes to commit (repository might already be committed)" -ForegroundColor Yellow
} else {
    Write-Host "✓ Commit created" -ForegroundColor Green
}
Write-Host ""

# Rename branch to main
Write-Host "Setting branch to main..." -ForegroundColor Cyan
git branch -M main
Write-Host "✓ Branch set to main" -ForegroundColor Green
Write-Host ""

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "This may prompt you for authentication..." -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "===== SUCCESS! =====" -ForegroundColor Green
    Write-Host ""
    Write-Host "✓ Project pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Visit: https://github.com/farisxboujddain-cmyk/formexa" -ForegroundColor White
    Write-Host "2. Configure GitHub Secrets for CI/CD:" -ForegroundColor White
    Write-Host "   - Go to Settings > Secrets and variables > Actions" -ForegroundColor White
    Write-Host "   - Add: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, OPENAI_API_KEY, etc." -ForegroundColor White
    Write-Host "3. Deploy to Vercel: https://vercel.com/new" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "===== ERROR =====" -ForegroundColor Red
    Write-Host "Push to GitHub failed. Please check:" -ForegroundColor Red
    Write-Host "1. Your GitHub URL is correct" -ForegroundColor White
    Write-Host "2. You have permission to push to the repository" -ForegroundColor White
    Write-Host "3. Your Git authentication is configured" -ForegroundColor White
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Cyan
    Write-Host "- For SSH issues: https://docs.github.com/en/authentication/connecting-to-github-with-ssh" -ForegroundColor White
    Write-Host "- For HTTPS issues: Use a Personal Access Token" -ForegroundColor White
    Write-Host ""
}

Read-Host "Press Enter to exit"
