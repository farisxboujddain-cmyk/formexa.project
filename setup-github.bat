@echo off
REM ===== Formexa GitHub Setup Script for Windows (PowerShell) =====
REM Run this script from the formexa directory to automatically push to GitHub

echo.
echo ===== Formexa GitHub Setup =====
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "backend\package.json" (
    echo ERROR: Please run this script from the formexa root directory
    pause
    exit /b 1
)

echo ✓ Git is installed
echo.

REM Check if repo is already initialized
if exist ".git" (
    echo Repository already initialized
    echo.
) else (
    echo Initializing Git repository...
    git init
    echo ✓ Git repository initialized
    echo.
)

REM Configure Git user
echo Configuring Git user...
set /p git_name="Enter your Git username (or press Enter to skip): "
set /p git_email="Enter your Git email (or press Enter to skip): "

if not "%git_name%"=="" (
    git config user.name "%git_name%"
    git config user.email "%git_email%"
    echo ✓ Git user configured
) else (
    echo Skipped Git user configuration
)
echo.

REM Check for existing remote
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo Remote 'origin' already exists:
    git remote get-url origin
    set /p change_remote="Do you want to change it? (y/n): "
    if /i "%change_remote%"=="y" (
        git remote remove origin
    ) else (
        goto SKIP_REMOTE
    )
)

REM Add remote
echo.
echo Enter your GitHub repository URL
echo Example: https://github.com/yourusername/formexa.git
echo.
set /p github_url="GitHub URL: "

if not "%github_url%"=="" (
    git remote add origin %github_url%
    echo ✓ Remote repository added
    echo.
) else (
    echo ERROR: GitHub URL is required
    pause
    exit /b 1
)

:SKIP_REMOTE

REM Stage all files
echo Staging files...
git add .
echo ✓ Files staged
echo.

REM Create commit
echo Creating initial commit...
git commit -m "Initial commit: Formexa SaaS platform with PayPal integration"

if %errorlevel% neq 0 (
    echo No changes to commit (repository might already be committed)
) else (
    echo ✓ Commit created
)
echo.

REM Rename branch to main
echo Setting branch to main...
git branch -M main
echo ✓ Branch set to main
echo.

REM Push to GitHub
echo Pushing to GitHub...
echo This may prompt you for authentication...
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===== SUCCESS! =====
    echo.
    echo ✓ Project pushed to GitHub!
    echo.
    echo Next steps:
    echo 1. Visit: https://github.com/farisxboujddain-cmyk/formexa
    echo 2. Configure GitHub Secrets for CI/CD:
    echo    - Go to Settings ^> Secrets and variables ^> Actions
    echo    - Add: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, OPENAI_API_KEY, etc.
    echo 3. Deploy to Vercel: https://vercel.com/new
    echo.
) else (
    echo.
    echo ===== ERROR =====
    echo Push to GitHub failed. Please check:
    echo 1. Your GitHub URL is correct
    echo 2. You have permission to push to the repository
    echo 3. Your Git authentication is configured
    echo.
    echo Troubleshooting:
    echo - For SSH issues: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
    echo - For HTTPS issues: Use a Personal Access Token
    echo.
)

pause
