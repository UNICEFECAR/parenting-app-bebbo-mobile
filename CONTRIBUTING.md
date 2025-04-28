## 📄 `Contributing to Bebbo`

Thank you for your interest in contributing to Bebbo, a multi-platform parenting app developed with React Native. This guide outlines how to get started, report issues, submit pull requests, and understand our review and merge process.

---

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/UNICEFECAR/parenting-app-bebbo-mobile.git
```

### 2. Setup Environment

- Node: 21.7.3
- NPM: 10.8.2
- React Native: 0.72.5

Use NPM only, not Yarn.

```bash
npm install --legacy-peer-deps
```

### 3. Create your environment file

Copy the contents of [`.env.bebboDev`](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) from the shared Google Drive into:

```
env/.env.bebboDev
```

---

## iOS Setup

1. Install CocoaPods:

```bash
cd ios && pod install
```

2. Download and place [GoogleService-Info.plist](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) into:

```
ios/GoogleServices/Development
```

3. Font setup:

Copy `fontello.ttf` from:

```
android/app/src/main/assets/fonts/fontello.ttf
```

to:

```
node_modules/react-native-vector-icons/Fonts
```

---

## Android Setup

1. Place the [release keystore](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) file into:

```
android/app/
```

2. Place [googleServices.json](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) into:

```
android/app/src/prodstaging/
```

3. Generate vector images:

```bash
FLAVOR=bebboDev npx react-native-vector-image generate
```

---

## Running the App

### Metro bundler:

```bash
FLAVOR=bebboDev react-native start --reset-cache
```

### Android:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-android --variant=prodstagingRelease --appId org.unicef.bebbodev
```

### iOS:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev react-native run-ios --scheme ParentBuddyAppDev --mode Release
```

---

## How to Contribute

### 1. Branch from Development

```bash
git checkout -b feat/your-feature-name Development
```

### 2. Code Style

- Use TypeScript
- Use functional components and hooks
- Follow naming conventions
- Lint before pushing: `npm run lint`

---

## Pull Request Checklist

Before submitting your PR, make sure:

- [ ] Your branch is based on `Development`
- [ ] You tested the feature in both iOS and Android
- [ ] You verified it works across relevant flavors
- [ ] Your code is linted (`npm run lint`)
- [ ] You wrote or updated documentation if needed
- [ ] PR title follows [Conventional Commits](https://www.conventionalcommits.org/)

---

## Reporting Issues

When opening an issue, please include:

- Description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Platform and OS version
- Screenshot or video (if applicable)
- App flavor (`bebboDev`, `Foleja`, etc.)

---

## Code Review Process

1. Every pull request must be reviewed by at least one maintainer.
2. Larger or sensitive changes may require multiple reviewers.
3. Address all feedback and comments before re-requesting review.
4. Keep commits clean and meaningful.

---

## Merging

- Only maintainers can merge
- Merges are done via squash and merge
- CI checks must pass before merging
- Avoid merging without an approved review

---

## Thank You
