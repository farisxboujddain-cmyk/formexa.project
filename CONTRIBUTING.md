# Contributing to Formexa

Thank you for your interest in contributing to Formexa! We welcome contributions of all kinds: bug fixes, feature requests, documentation improvements, and more.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/formexa.git
   cd formexa
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Install dependencies**:
   ```bash
   npm run install-all
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Fill in your credentials
   ```

## Development Workflow

### Backend Development
```bash
npm run dev:backend
# Runs on http://localhost:3000
```

### Frontend Development
```bash
npm run dev:frontend
# Runs on http://localhost:5173
```

### Both Simultaneously
```bash
npm run dev
# Uses concurrently to run both
```

## Code Standards

### JavaScript/React
- Use ES6+ syntax
- Follow the existing code style
- Add JSDoc comments for functions
- Keep components under 200 lines when possible

### Git Commits
```bash
# Use conventional commit messages
git commit -m "feat: add new AI model support"
git commit -m "fix: resolve payment webhook timeout"
git commit -m "docs: update API documentation"
git commit -m "style: format code with prettier"
git commit -m "test: add unit tests for auth"
```

## Pull Request Process

1. **Update your branch** with latest changes:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Reference any related issues (#123)
   - Screenshots for UI changes
   - Test results

5. **Wait for review** and address feedback

## Reporting Bugs

Use GitHub Issues to report bugs. Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- Your environment (OS, Node version, etc.)

## Feature Requests

Submit feature requests as GitHub Issues with:
- Clear description of the feature
- Use case / motivation
- Possible implementation approach
- Any examples or references

## Documentation

- Update `README.md` for user-facing changes
- Add code comments for complex logic
- Update API docs if endpoints change
- Create/update guides for new features

## Branching Strategy

- `main` - production-ready code
- `develop` - staging branch
- `feature/*` - new features
- `fix/*` - bug fixes
- `docs/*` - documentation only

## Questions?

Feel free to:
- Open a GitHub Discussion
- Email: formexatech@gmail.com
- Check existing issues/PRs

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment.

Thank you for contributing to Formexa! 🚀
