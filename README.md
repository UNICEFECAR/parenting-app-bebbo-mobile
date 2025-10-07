# [Bebbo](https://bebbo.app/) is an interactive mobile application for parenting

## Table of Contents

- [Introduction](#introduction)
- [Technology stack](#technology-stack) <!--* [Used libraries](#used-libraries)-->
- [Getting started](#getting-started)
- [Install Bebbo in localhost](#install-bebbo-in-localhost)
- [How to run](#how-to-run)
- [License](#license)

## Introduction

[Bebbo](https://www.bebbo.app) is a multi-platform mobile application available on both [iOS](https://apps.apple.com/us/app/bebbo/id1588918146) and [Android](https://play.google.com/store/apps/details?id=org.unicef.ecar.bebbo).
Discover the most comprehensive parenting and pregnancy app that provides you with all the tools and expert advice you need, all in one app, to support your journey from pregnancy through your child's growth and development from birth to age 6! Personalize this app to access daily toddler games, parenting advice, pregnancy tips, and guidance on taking care of both your child and your own well-being. Navigate easily between multiple child profiles and receive advice tailored to each child's developmental needs.

Bebbo offers:

- Expert advice and parenting articles covering early learning, health, nutrition, caregiving, and safety, tailored to both your questions and your child’s age.
- Personalized 'learning through play' activities and games that support various critical areas of development, including cognition, language, motor skills, and social-emotional skills.
- Brief instructional videos and evidence-based support for each stage of your child’s development.
- The ability to search Bebbo’s collection of hundreds of activities and articles by topic, age, or area of development.
- The ability to save and share your favorite content.

Bebbo provides you with an interactive set of tools such as:

- Development milestones tracker
- Baby growth tracker
- Vaccination child immunization tracker
- Child health check-up tracker

The app can also operate in an offline mode in environments with limited internet connectivity. It is offered in several languages and is free to use. There are no internal advertisements, and you can share it with a partner.

## Technology stack

- [React Native](https://reactnative.dev/) version 0.72.5 was used to build native mobile applications for both iOS and Android using the same codebase. Several React Native modules have been incorporated in order to speed up the development process. Refer to [package.json](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/package.json) for more details.
- [TypeScript](https://www.typescriptlang.org/) was used as a programming language.
- [NPM](https://nodejs.org/en/) (Node Package Manager) was used to install third party packages and to run various scripts necessary during development.

  - Node version - 21.7.3
  - NPM version - 10.8.2

## Getting started

- Mac or Windows can be used to setup a development environment. iOS and Android apps can be developed using MacBook. Only Android app can be developed using Windows.
- Follow [these instructions](https://reactnative.dev/docs/environment-setup) in order to prepare machine for development, specifically “React Native CLI Quickstart”.
- Follow [these instructions](https://reactnative.dev/docs/set-up-your-environment?os=macos&platform=android) to set up React Native development environment.

## Install Bebbo in localhost

1. Download [Node JS](https://nodejs.org/en/download) version 21.7.3 and install it.

```
node -v
V21.7.3
```

2. Install NPM (Node Package Manager).

```
npm install -g npm@10.8.2
npm -v
10.8.2
```

3. Install React Native.

```
npm install -g react-native@0.72.5
react-native -version
0.72.5
```

4. Clone the repo via GitBash.

```sh
git clone https://github.com/UNICEFECAR/parenting-app-bebbo-mobile.git
cd parenting-app-bebbo-mobile
```

5. When starting work on a new feature branch, branch off from the development branch.

```
git checkout -b myFeature Development
```

6. Install NPM packages. Do not use yarn!

```
npm install --legacy-peer-deps
```

7. Run below command to generate vector images based on flavour folders:

```
FLAVOR=bebboDev npx react-native-vector-image generate
```

8. Create env/.env.bebboDev file at project root and copy the content from [env.bebboDev](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing).

**iOS setup guide:**

1. For iOS, copy fontello.ttf file from https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/android/app/src/main/assets/fonts/fontello.ttf to **node_modules/react-native-vector-icons/Fonts**. Refer this library for custom fonts: https://github.com/oblador/react-native-vector-icons.

   Note : When you run the android app, you need to remove the fontello.ttf file from **node_modules/react-native-vector-icons/Fonts** location and follow step 7 again.
   Delete Pods and clean gradle if required.

2. Pod install using below command

```
cd ios && pod install
```

3. Configure Firebase services

   - Please download [GoogleService-Info.plist](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) file from the provided link and paste it at **/ios/GoogleServices/Development** location inside your project.

**Android setup guide:**

1. Please download [release keystore](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) files from the provided link and paste downloaded release keystore file at **/android/app** location inside your project.

2. Configure Firebase services

   - Please download [googleServices.json](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) file from the provided link and paste downloaded debug and release keystore files at **/android/app/src/prodstaging** location inside your project.

## How to run and generate build

After set up all configuration you run the bebbo dev app with below npx commands.

Run metro bundler

```
FLAVOR=bebboDev react-native start --reset-cache
```

Run and generate build android Bebbo Dev app

```
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-android --variant=prodstagingRelease --appId org.unicef.bebbodev

cd android && ENVFILE=env/.env.bebboDev FLAVOR=bebboDev ./gradlew bundleProdstagingRelease (aab)

cd android && ENVFILE=env/.env.bebboDev FLAVOR=bebboDev ./gradlew assembleProdstagingRelease (apk)
```

Run and generate build iOS Bebbo Dev app

```
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev react-native run-ios --scheme ParentBuddyAppDev --mode Release
```


## Platform-specific Run Commands

### Linux / MacOS 
```bash
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-android --variant=prodstagingRelease --appId org.unicef.bebbodev
```

### Windows 🪟
```bash
set ENVFILE=env/.env.bebboDev && set FLAVOR=bebboDev && npx react-native run-android --variant=prodstagingRelease --appId org.unicef.bebbodev
```

### Notes
- Windows uses `set ... && set ... &&` syntax for environment variables, while Linux/Mac uses inline assignment.  
- If builds fail on Windows, run:
  ```bash
  cd android
  gradlew clean
  cd ..
  ```
- Ensure `ANDROID_HOME` and `JAVA_HOME` are set in Windows system environment variables.


## License

Distributed under the GPL-3.0 license. See `LICENSE` for more information.