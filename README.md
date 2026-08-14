# Bebbo

[Bebbo](https://bebbo.app/) is an interactive mobile application for parenting.

## Table of Contents

- [Introduction](#introduction)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Configure Environment Variables](#3-configure-environment-variables)
  - [Generate Vector Images](#4-generate-vector-images)
  - [Configure Firebase](#5-configure-firebase)
  - [iOS Additional Setup](#6-ios-additional-setup)
  - [Android Additional Setup](#7-android-additional-setup)
- [Running Bebbo](#running-bebbo)
  - [Start Metro](#start-metro)
  - [Run Android](#run-android)
  - [Run iOS](#run-ios)
- [Generate Release Builds](#generate-release-builds)
  - [Android AAB](#android-aab)
  - [Android APK](#android-apk)
  - [iOS Release Build](#ios-release-build)
- [Creating a New Instance](#creating-a-new-instance)
- [Troubleshooting](#troubleshooting)
- [Maintainers](#maintainers)
- [Community](#community)
- [Contributors](#contributors)
- [License](#license)

---

## Introduction

[Bebbo](https://www.bebbo.app) is a multi-platform mobile application available on both [iOS](https://apps.apple.com/us/app/bebbo/id1588918146) and [Android](https://play.google.com/store/apps/details?id=org.unicef.ecar.bebbo).

Discover the most comprehensive parenting and pregnancy app that provides you with all the tools and expert advice you need, all in one app, to support your journey from pregnancy through your child's growth and development from birth to age 6.

Personalize the app to access daily toddler games, parenting advice, pregnancy tips, and guidance on taking care of both your child and your own well-being. Navigate easily between multiple child profiles and receive advice tailored to each child's developmental needs.

### Bebbo offers

- Expert advice and parenting articles covering early learning, health, nutrition, caregiving, and safety, tailored to both your questions and your child’s age.
- Personalized "learning through play" activities and games that support various critical areas of development, including cognition, language, motor skills, and social-emotional skills.
- Brief instructional videos and evidence-based support for each stage of your child’s development.
- The ability to search Bebbo’s collection of hundreds of activities and articles by topic, age, or area of development.
- The ability to save and share favorite content.

### Bebbo provides interactive tools such as

- Development milestones tracker
- Baby growth tracker
- Vaccination and child immunization tracker
- Child health check-up tracker

The app can also operate in offline mode in environments with limited internet connectivity. It is offered in several languages and is free to use. There are no internal advertisements, and content can be shared with a partner.

---

## Technology Stack

- [React Native](https://reactnative.dev/) version **0.78.2** is used to build native mobile applications for both iOS and Android using the same codebase.
- [TypeScript](https://www.typescriptlang.org/) is used as the primary programming language.
- [NPM](https://www.npmjs.com/) is used to install third-party packages and run development scripts.
- Firebase is used for application services and analytics.
- The project uses React Native CLI and does not use Expo.

Refer to [`package.json`](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/package.json) for the complete list of dependencies.

### Node and NPM versions

The project currently uses:

- Node.js: **21.7.3**
- NPM: **10.8.2**
- React Native: **0.78.2**

> React Native does not need to be installed globally. It is installed as a project dependency when running `npm install`. Use `npx react-native` to run the locally installed version.

---

# Prerequisites

Before setting up the project, install the required development tools for your platform.

## All platforms

- Git
- Node.js **21.7.3**
- NPM **10.8.2**

You can download Node.js from:

https://nodejs.org/en/download

Verify the installed versions:

```bash
node -v
npm -v
```
Expected output

```bash
v21.7.3
10.8.2
```

## Android Development

For Android development, install:

- Android Studio
- Android SDK
- Android SDK Platform 35
- Android SDK Build-Tools 35.0.0
- Android NDK 27.0.12077973
- A compatible JDK version
- Android Emulator or a physical Android device

The project configuration currently uses:

```text
compileSdkVersion = 35
targetSdkVersion = 35
buildToolsVersion = 35.0.0
ndkVersion = 27.0.12077973
```

Configure `ANDROID_HOME` according to the [React Native environment setup documentation](https://reactnative.dev/docs/set-up-your-environment).
> **Note:** Android development can be performed on both Windows and macOS.

## iOS Development

iOS development requires macOS.

Install:

- Xcode
- Xcode Command Line Tools
- CocoaPods
- iOS Simulator or a physical iOS device

Follow the [React Native environment setup documentation](https://reactnative.dev/docs/set-up-your-environment) for the required platform configuration.

> **Note:** iOS applications cannot be built or run locally on Windows.

# Getting Started

## 1. Clone the Repository

Clone the repository and move into the project directory:

```bash
git clone https://github.com/UNICEFECAR/parenting-app-bebbo-mobile.git
cd parenting-app-bebbo-mobile
```

When starting work on a new feature, create a branch from the `development` branch:

```bash
git checkout development
git checkout -b myFeature
```

---

## 2. Install Dependencies
Install the project dependencies using NPM:

```bash
npm install --legacy-peer-deps
```

> **Note:** Do not install React Native globally. The required React Native version is installed locally as part of the project dependencies. Use `npx react-native` for React Native commands.

Do not use Yarn for this project.

---

## 3. Configure Environment Variables
Bebbo uses environment-specific configuration files.

For the Bebbo development instance, create:

```text
env/.env.bebboDev
```

### Example `.env.bebboDev`

Use your own Firebase/project values when setting up an independent development environment.

```env
apiUrlDevelop='https://dev.bebbo.app/api'

facebookAppDisplayName=Bebbo
facebookAppId=YOUR_FACEBOOK_APP_ID
facebookClientToken=YOUR_FACEBOOK_CLIENT_TOKEN
projectNumber=YOUR_FIREBASE_PROJECT_NUMBER
clientIdKey=YOUR_CLIENT_ID_KEY
webId=YOUR_FIREBASE_WEB_APP_ID
iosId=YOUR_IOS_APP_ID
encryptionsKey=YOUR_ENCRYPTION_KEY
encryptionsIVKey=YOUR_ENCRYPTION_IV_KEY
```

### Environment variable description

| Variable | Description |
|---|---|
| `apiUrlDevelop` | Development API base URL |
| `facebookAppDisplayName` | Facebook application display name |
| `facebookAppId` | Facebook App ID |
| `facebookClientToken` | Facebook Client Token |
| `projectNumber` | Firebase project number used to construct Google OAuth client IDs |
| `clientIdKey` | Google OAuth iOS client ID suffix used to configure the iOS URL scheme |
| `webId` | Google OAuth Web Client ID suffix used to construct the Web Client ID |
| `iosId` | Google OAuth iOS Client ID suffix used to construct the iOS Client ID |
| `encryptionsKey` | Encryption key used to encrypt user data |
| `encryptionsIVKey` | Initialization vector (IV) used by the user-data encryption process |

> **Note:** `clientIdKey` and `iosId` may have the same value because both are used for the Google OAuth iOS configuration. `clientIdKey` is used to construct the iOS Google Sign-In URL scheme, while `iosId` is used to construct the iOS OAuth Client ID. Keep both values consistent with the Google OAuth configuration for the iOS application.

### External/Open-Source Developers

External developers should use their own development configuration wherever possible.

In particular:

- Create your own Firebase project.
- Create your own Android and iOS applications inside the Firebase project.
- Download the corresponding Firebase configuration files.
- Use your own Firebase project number and application IDs.
- Create and configure your own Facebook application if Facebook integration is required.
- Use appropriate development values for application encryption configuration.

The values shown above are placeholders and must be replaced with valid values for your development environment.

### Internal Developers

Internal developers who need to use the Bebbo development configuration can request access to the project's internal configuration folder.

The folder contains the development environment files and Firebase configuration files required for the Bebbo development instance.

Access should be granted to the developer's individual account rather than sharing a common Google/Firebase account.

---

## 4. Generate Vector Images
Before running the application, generate the vector images for the required flavor:

```bash
FLAVOR=bebboDev npx react-native-vector-image generate
```

This command should be run whenever the vector image assets need to be regenerated.

---

## 5. Configure Firebase
Firebase is required for the application's Firebase services and analytics.

### Option A: External/Open-Source Developers

For an independent development environment:

1. Create a new Firebase project from the [Firebase Console](https://console.firebase.google.com/).
2. Add an Android application to the Firebase project.
3. Add an iOS application to the Firebase project.
4. Use the Android package/application ID configured for your development flavor.
5. Use the iOS bundle identifier configured for your development flavor.
6. Download the Firebase configuration files.

### Android
Download:

```text
google-services.json
```

Place it in the appropriate Android flavor directory:

```text
android/app/src/<flavor>/
```

For the Bebbo development flavor, use the directory configured for the `prodstaging` flavor in the project.

### iOS
Download:

```text
GoogleService-Info.plist
```

Add it to the appropriate iOS development target in Xcode.

For the existing Bebbo development configuration, the file is located under the project's iOS Firebase configuration directory.

> **Note:** Firebase configuration is application-specific. If you create your own Firebase project, make sure the package name and iOS bundle identifier match the application configuration in this repository.

---

## 6. iOS Additional Setup
### Fontello

The application uses a custom `fontello.ttf` font.

Copy:

```text
android/app/src/main/assets/fonts/fontello.ttf
```

to:

```text
node_modules/react-native-vector-icons/Fonts/
```

Refer to the [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) project for information about custom fonts.

> **Note:** This font copy is required for the iOS setup. Before running the Android application, remove the copied `fontello.ttf` from `node_modules/react-native-vector-icons/Fonts/` and regenerate the vector images using the command from the previous section.

### Install CocoaPods Dependencies
From the project root:

```bash
cd ios
pod install
cd ..
```

If you encounter pod-related issues, see the Troubleshooting section.

---

## 7. Android Additional Setup

For a local development build, Android requires a configured development environment and Firebase configuration.

If you are an internal developer and need the Bebbo development signing configuration, obtain the appropriate development/release keystore through the project's internal configuration process.

### Android Signing Configuration

The Android signing passwords are **not stored in the project repository**. They must be configured in the developer's local Gradle user properties file:

```text
~/.gradle/gradle.properties
```

Add the required signing properties to the user's Gradle properties file. For example:

```properties
WAWAMOR_STORE_PASSWORD=<secure-value>
WAWAMOR_KEY_PASSWORD=<secure-value>
```

The corresponding keystore file should be available at the location configured by the project's Gradle signing configuration.

> **Important:** Do not add keystore passwords or other private credentials to the project's `android/gradle.properties` file or commit them to Git.

> The keystore itself should also not be committed to the public repository. Internal developers should obtain the required keystore through the project's internal configuration process.

> For a new instance, the signing property names and keystore configuration must match the signing configuration defined in `android/app/build.gradle`.



---

# Running Bebbo
The commands below use the existing Bebbo development flavor:

```bash
FLAVOR=bebboDev
ENVFILE=env/.env.bebboDev
```

The project uses custom build flavors and variants. The commands below intentionally use the configured Bebbo development build configuration.

---

## Start Metro
Start the Metro bundler from the project root:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native start --reset-cache
```

Keep Metro running in this terminal.

Open a **second terminal** to run the Android or iOS application.

---

## Run Android
Make sure an Android emulator is running or an Android device is connected.

Run:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-android --mode=prodstagingRelease --appId org.unicef.bebbodev
```

### Windows

On Windows, set environment variables using `set`:

```cmd
set ENVFILE=env/.env.bebboDev && set FLAVOR=bebboDev && npx react-native run-android --mode=prodstagingRelease --appId org.unicef.bebbodev
```

If the Android build fails, try cleaning Gradle:
```bash
cd android
gradlew clean
cd ..
```

Make sure `ANDROID_HOME` and `JAVA_HOME` are configured in the Windows environment variables.

---

## Run iOS

Make sure an iOS Simulator is running or an iOS device is configured in Xcode.

Run:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-ios --scheme ParentBuddyAppDev --mode Release
```

If the iOS build fails because of CocoaPods or dependency issues:

```bash
cd ios
pod install
cd ..
```

---

# Generate Release Builds
## Android AAB

To generate an Android App Bundle:

```bash
cd android
ENVFILE=../env/.env.bebboDev FLAVOR=bebboDev ./gradlew bundleProdstagingRelease
cd ..
```

The generated `.aab` file will be available under the appropriate directory in:

```text
android/app/build/outputs/bundle/
```

---

## Android APK
To generate an Android APK:

```bash
cd android
ENVFILE=../env/.env.bebboDev FLAVOR=bebboDev ./gradlew assembleProdstagingRelease
cd ..
```

The generated `.apk` file will be available under:

```text
android/app/build/outputs/apk/
```

---

## iOS Release Build

### Run the iOS Release configuration

To run the Bebbo Dev iOS Release configuration:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-ios --scheme ParentBuddyAppDev --mode Release
```
### Create an iOS Release Build

The iOS release build can be created entirely from the command line using `xcodebuild`.

The project includes an `ExportOptions.plist` file that contains the required export configuration.

Run the following command from the project root:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev xcodebuild -workspace ios/ParentBuddyApp.xcworkspace -scheme ParentBuddyAppDev -configuration Release -sdk iphoneos -archivePath ios/build/BebboDev.xcarchive archive -allowProvisioningUpdates && xcodebuild -exportArchive -archivePath ios/build/BebboDev.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath ios/build -allowProvisioningUpdates
```
This command performs two steps:

1. Creates an iOS archive:

   ```text
   ios/build/BebboDev.xcarchive
   ```
2. Exports the archive using `ExportOptions.plist` to:

   ```text
   ios/build/
   ```
The exported iOS build can then be found in the `ios/build/` directory.

> `xcodebuild` is included with Xcode and allows the iOS application to be archived and exported without manually using the Xcode UI.

> The committed `ExportOptions.plist` is configured for the Bebbo project's release-testing build and uses automatic signing. It includes the Bebbo Apple Developer Team ID.

> Developers using their own Apple Developer account or team will need to update `ExportOptions.plist` with their own signing configuration, including their Apple Developer Team ID where required.

> The `ExportOptions.plist` file does not contain Apple signing certificates, private keys, or passwords. Access to the appropriate Apple Developer account and signing credentials is still required to create a signed iOS distribution build.
---

# Creating a New Instance
Bebbo supports multiple instances/flavors using a shared codebase.

If you want to create a new Bebbo instance, for example a new country, language, or branded application, follow the dedicated:

[New Instance Setup Guide](readMeNewInstance.md)

The guide covers:

- Creating the new instance folder
- Instance-specific configuration
- Environment variables
- Localization
- Offline content
- Assets
- TypeScript configuration
- iOS targets and schemes
- iOS Firebase configuration
- Android flavors
- Android Firebase configuration
- Android signing/keystore configuration
- Build configuration
- Running the new instance

---

# Troubleshooting
## Metro Cache Issues

If the application behaves unexpectedly after code or configuration changes, reset the Metro cache:

```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native start --reset-cache
```

---

## Android Gradle Issues

Clean the Android build:

```bash
cd android
./gradlew clean
cd ..
```

On Windows:

```cmd
cd android
gradlew clean
cd ..
```

Then try running the application again.

---

## iOS Pod Issues
From the project root:

```bash
cd ios
pod install
cd ..
```

If required, remove Pods and reinstall dependencies:

```bash
cd ios
rm -rf Pods
pod install
cd ..
```

---

## Android SDK Issues

If Android Studio or Gradle cannot find the Android SDK, verify that `ANDROID_HOME` is configured correctly.

Also make sure the required Android SDK Platform and Build Tools versions are installed:

```text
Android SDK Platform 35
Android SDK Build-Tools 35.0.0
Android NDK 27.0.12077973
```

---

## Missing Environment File
If you receive an error related to environment variables, make sure this file exists:

```text
env/.env.bebboDev
```

The environment file must contain all variables required by the application.

---

## Firebase Configuration Issues

If Firebase services do not work:

### Android

Verify that the correct:

```text
google-services.json
```

has been added to the appropriate Android flavor directory.

### iOS

Verify that:

```text
GoogleService-Info.plist
```

has been added to the correct iOS target in Xcode.

Also verify that the package name/bundle identifier matches the Firebase application configuration.

---

# Maintainers
The Bebbo Mobile App is actively maintained by UNICEF (United Nations Children's Fund) in collaboration with various partners. It is part of the larger Bebbo project, a digital parenting platform aimed at providing parents and caregivers with essential early childhood development resources.

Bebbo is a DPGA-recognized Digital Public Good.

For ongoing maintenance, please reach out to the following maintainers:

- [Saurabh Agarwal](https://github.com/saurabhEDU)
- [Neha Ruparel](https://github.com/neharuparel)

---

# Community

UNICEF Bebbo has a friendly and lively open-source community.

Communication happens primarily through [GitHub Discussions](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/discussions), and we welcome interested contributors to join the conversation.

---

# Contributors

We acknowledge the contributors who helped improve the project:

- [@Kumar Saurabh](https://github.com/Kumar-s75)
- [@Anithpavan](https://github.com/Anithpavan)

---

# License

Distributed under the GPL-3.0 license. See [`LICENSE`](LICENSE) for more information.
