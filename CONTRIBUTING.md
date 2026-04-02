## 📄 `Contributing to Bebbo Mobile App`

Thank you for your interest in contributing to the Bebbo Mobile App project, a multi-platform parenting app developed with React Native. This document explains the workflow for contributing code, reporting issues, submitting pull requests and understanding our review and merge process.

Please read this guide before starting any work.

---

## Project Setup

Before contributing, please set up the project locally by following the instructions in the README file:

README:
https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/README.md

Make sure the app builds and runs successfully before starting development.

---

## Contribution Workflow

The contribution workflow depends on whether you have write access to the repository.

### External Contributors (No Write Access)
1. Fork the repository to your GitHub account
2. Clone your fork locally
3. Add the original repository as upstream
4. Create a new branch from `development`
5. Make your changes
6. Commit and push to your fork
7. Create a Pull Request to the `development` branch of the main repository

Example:
```bash
git clone https://github.com/<your-username>/parenting-app-bebbo-mobile.git
cd parenting-app-bebbo-mobile
git remote add upstream https://github.com/UNICEFECAR/parenting-app-bebbo-mobile.git
git checkout development
git pull upstream development
git checkout -b feature/your-feature-name
```

### Internal Contributors (Write Access)
1. Clone the main repository
2. Create a branch from development
3. Make changes
4. Push the branch
5. Create a Pull Request to the `development` branch.

Example:
```bash
git clone https://github.com/UNICEFECAR/parenting-app-bebbo-mobile.git
cd parenting-app-bebbo-mobile
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```
## Branching Strategy

We follow a Git flow based branching strategy.

| Branch | Purpose |
|-------|---------|
| main | Production releases |
| development | Ongoing development |
| feature/* | New features |
| bugfix/* | Bug fixes |
| hotfix/* | Production fixes |

### Rules
- Do NOT commit directly to `main`
- Do NOT commit directly to `development`
- Always create a feature/bugfix branch from `development`
- All Pull Requests must target the `development` branch
- Only maintainers merge Pull Requests

## Branch Naming Examples

Use the following naming conventions for branches:

feature/chatbot-improvements  
feature/offline-content-sync  
bugfix/notification-navigation  
bugfix/android-startup-crash  
hotfix/playstore-build-fix  

### Format
`<type>/<short-description>`

Types:
- feature → New feature
- bugfix → Bug fix
- hotfix → Production fix
- refactor → Code refactoring
- docs → Documentation updates

## Pull Request Guidelines

Before submitting a Pull Request, please ensure the following:

- The app builds successfully
- No lint errors
- No debug logs remain
- Changes are tested on Android and iOS (if applicable)
- PR description clearly explains the change
- Related issue is linked (if applicable)
- Screenshots are included for UI changes

### Pull Request Title Format

[Feature] Added chatbot analytics  
[Bugfix] Fixed notification navigation issue  
[Hotfix] Android crash on startup  

### Pull Request Description Should Include
- What was changed
- Why the change was needed
- Screenshots (if UI change)
- Steps to test

## Commit Message Guidelines

Write clear and descriptive commit messages.

### Recommended Format
`<type>: <short description>`

Examples:

feat: Added chatbot analytics logging  
fix: Fixed Android notification crash  
refactor: Improved event sync service  
docs: Updated contributing guidelines  

### Commit Types
- feat → New feature
- fix → Bug fix
- refactor → Code improvement
- docs → Documentation
- style → Formatting changes
- test → Testing
- chore → Maintenance

### Avoid commit messages like:
fix  
changes  
update  
done  
misc    

## Code Style Guidelines

Please follow the existing project coding style.

General guidelines:
- Use functional components
- Use React hooks
- Keep components small and reusable
- Avoid very large files
- Use meaningful variable and function names
- Remove console logs before committing
- Avoid commented unused code
- Follow ESLint rules
- Write reusable components where possible
- Keep business logic separate from UI components
- Use TypeScript types where applicable
- Use consistent file and folder naming

## Reporting Issues

When reporting issues, please include:

- Device name
- OS version
- App version
- Steps to reproduce
- Screenshots or logs
- Expected behavior
- Actual behavior

This helps us reproduce and fix issues faster.

## Feature Requests

For new features or major changes, please open an issue first to discuss the approach before starting implementation.

Please include:
- Feature description
- Why the feature is needed
- Possible implementation approach (if any)
- Screenshots or references (if applicable)

## Code Reviews

All changes must go through Pull Request review before merging.

Maintainers may:
- Request changes
- Suggest improvements
- Ask for additional testing
- Request code refactoring

In some cases maintainers may push minor fixes directly to the contributor branch when "Allow edits from maintainers" is enabled.
Pull Requests will be merged only after approval from maintainers.
