# Contributing to Bebbo

Thank you for your interest in contributing to Bebbo, a multi-platform
parenting application developed using React Native.

This guide explains how to contribute code, create branches, test changes,
report issues, and submit pull requests.

For project setup, development requirements, environment configuration, platform-specific setup, build and run instructions, release builds, and troubleshooting, refer to the [README](README.md).

For creating or modifying a Bebbo application instance/flavor, including instance configuration, Firebase, Google Sign-In, Android, iOS, signing, and release configuration, refer to the [New Instance Setup Guide](readMeNewInstance.md).

---

# Getting Started

## 1. Clone the Repository

Clone the repository and move into the project directory:

```bash
git clone https://github.com/UNICEFECAR/parenting-app-bebbo-mobile.git
cd parenting-app-bebbo-mobile
```
When starting work on a new feature, create a branch from the `Development` branch:

```bash
git checkout Development
git checkout -b myFeature
```

You can also use a descriptive branch name, for example:

```bash
git checkout -b feat/improve-offline-content
```

---

## 2. Development Requirements
The project currently uses:

- Node.js **18 or later**
- NPM **10.8.2**
- React Native **0.78.2**
- React Native CLI
- Android SDK Platform **35**
- Android SDK Build-Tools **35.0.0**
- Android NDK **27.0.12077973**
- Xcode and CocoaPods for iOS development

The project does **not** use Expo.

Use NPM for dependency installation. Do not use Yarn for this project.

Install dependencies :

```bash
npm install --legacy-peer-deps
```

> **Note:** React Native does not need to be installed globally. The required React Native version is installed locally as a project dependency. Use `npx react-native` for React Native commands.

---

# Running the Application

The following commands run the existing Bebbo development flavor.

## Start Metro
Start Metro from the project root:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native start --reset-cache
```

Keep Metro running in this terminal.

Open a second terminal to run the Android or iOS application.

---

## Run Android

Run:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-android --mode=prodstagingRelease --appId org.unicef.bebbodev
```

## Run iOS

Run:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-ios --scheme ParentBuddyAppDev --mode Release
```

For other flavors/instances and release builds, refer to the [README](README.md).

---

# Creating a New Bebbo Instance

If you need to create a new Bebbo application instance, follow the complete
[New Instance Setup Guide](readMeNewInstance.md).

Do not create instance configuration independently without following the
existing instance structure and the new instance guide.

---

# Development Workflow

## 1. Create a Feature Branch

Always create a feature or bug-fix branch from the `Development` branch.

For example:

```bash
git checkout Development
git checkout -b feat/your-feature-name
```

Other examples:

```bash
git checkout -b fix/offline-content
git checkout -b feat/new-analytics-event
git checkout -b docs/update-build-guide
```

Avoid making feature changes directly on the `Development` branch.

---

## 2. Make Your Changes
Follow the existing project structure and coding conventions.

When making changes:

- Use TypeScript.
- Prefer functional components and React hooks where appropriate.
- Follow existing naming conventions.
- Keep changes focused on the purpose of the branch.
- Avoid unnecessary changes to shared functionality.
- Consider the impact of changes on all supported instances.
- Consider both Android and iOS where applicable.
- Consider offline functionality when changing content-related features.
- Update documentation when development or configuration steps change.

---

## 3. Test Your Changes

Before submitting a pull request, test the changes locally.

Where applicable, test:

- Android
- iOS
- Relevant Bebbo flavors/instances
- Online functionality
- Offline functionality
- Firebase-related functionality
- Localization
- New or modified application configuration

For instance-specific changes, verify that existing instances are not affected.

---

## 4. Run Lint

Before submitting a pull request, run:

```bash
npm run lint
```

Fix any linting errors introduced by your changes.

---

# Pull Request Guidelines
Create a pull request from your feature branch into:

```text
Development
```

Before submitting the pull request, make sure:

- [ ] Your branch is based on `Development`.
- [ ] The change has been tested locally.
- [ ] Relevant Android testing has been completed.
- [ ] Relevant iOS testing has been completed.
- [ ] Relevant Bebbo instances/flavors have been tested.
- [ ] Offline functionality has been tested where applicable.
- [ ] `npm run lint` passes.
- [ ] Documentation has been updated where required.
- [ ] No passwords, tokens, encryption keys, private keys, or other secrets have been committed.
- [ ] No unnecessary generated files or local configuration files have been committed.
- [ ] The PR description clearly explains the changes.
- [ ] Screenshots or videos are included for relevant UI changes.

---

# Commit and Pull Request Naming
Use clear and meaningful commit messages.

Where applicable, follow [Conventional Commits](https://www.conventionalcommits.org/).

Examples:

```text
feat: add offline article filtering
fix: resolve image flickering on activity screen
docs: update new instance setup guide
refactor: simplify content synchronization
chore: update Android build configuration
```

Pull request titles should also clearly describe the purpose of the change.

For example:

```text
feat: add offline content filtering
```

---

# Code Review Process

All pull requests are reviewed by project maintainers before merging.

The review process may include:

1. Checking the implementation against the requirement.
2. Reviewing code quality and maintainability.
3. Checking for regressions.
4. Checking Android and iOS compatibility.
5. Reviewing impact on other Bebbo instances.
6. Checking documentation where applicable.
7. Reviewing security-sensitive changes.

Maintainers may request changes before approving the pull request.

Contributors should address review comments and re-request review after making the requested changes.

Maintainers may push minor fixes directly to a contributor branch when **Allow edits from maintainers** is enabled.

---

# Merging
The following rules apply to pull requests:

- [ ] Only authorized maintainers can merge pull requests.
- [ ] Pull requests must have an approved review before merging.
- [ ] Required CI checks must pass before merging.
- [ ] Contributors should address review comments before merging.
- [ ] **Squash and merge** is preferred to keep the target branch history clean.
- [ ] Do not merge unreviewed changes unless explicitly authorized by the project maintainers.

---

# Reporting Issues

When opening an issue, provide as much relevant information as possible.

Include:

- Description of the issue.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Platform: Android or iOS.
- OS version.
- Device or emulator information.
- Bebbo instance/flavor, for example:
  - `bebboDev`
  - `babuni`
  - `wawamor`
- Application version/build number, where available.
- Screenshots or video, if applicable.
- Relevant error messages or logs.

For crashes, include the relevant stack trace or crash report when possible.

> **Security:** Do not include passwords, API keys, access tokens, encryption keys, private keys, or other sensitive information in issues.

---

# Security and Sensitive Information

The following must never be committed to the public repository:

- Passwords
- API keys
- Access tokens
- Facebook client secrets/tokens where applicable
- Encryption keys
- Encryption IVs
- Android keystore passwords
- iOS signing private keys
- Provisioning credentials
- Production credentials
- Other private configuration values

Android signing passwords should be stored in the user's:

```text
~/.gradle/gradle.properties
```

and not in the project's:

```text
android/gradle.properties
```

Keystores and private signing credentials must be stored securely.

> **Important:** If sensitive information is accidentally committed, do not simply remove it from the latest commit. Notify the appropriate project maintainer so that the credential can be rotated and the repository history can be handled appropriately.

---

# Documentation Changes
If your changes affect project setup, build, development, or troubleshooting,
update the [README](README.md).

If your changes affect the process of creating or configuring a new Bebbo
instance, update the [New Instance Setup Guide](readMeNewInstance.md).

If your changes affect contribution workflow, coding practices, testing,
pull requests, or review procedures, update this `Contributing.md`.

Keep the documentation consistent across these files.

---

# Thank You
Thank you for contributing to Bebbo and helping improve an open-source Digital Public Good for parents, caregivers, and children.

We appreciate contributions in the form of:

- Code
- Bug reports
- Documentation
- Testing
- Accessibility improvements
- Localization
- Performance improvements
- Offline functionality improvements
- New Bebbo instances
- Other improvements to the project

Please use the project's GitHub repository and discussions for collaboration and community communication.