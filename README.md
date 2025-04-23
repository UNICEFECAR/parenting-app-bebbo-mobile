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
Discover the most comprehensive parenting app that provides you with all the tools and expert advice you need, all in one app, to support your child's growth and development from birth to age 6! Personalize this app to access daily toddler games, parenting advice, and tips on taking care of both your child and your own well-being. Navigate easily between multiple child profiles and receive advice tailored to each child's developmental needs.

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

<!--
## Used libraries

Several third party libraries and services are incorporated. These are the most important, the full list can be seen by examining package.json (in the root of the project)

* [Firebase Analytics](https://www.npmjs.com/package/%40react-native-firebase/analytics) service
* [Google SignIn](https://www.npmjs.com/package/@react-native-community/google-signin) service
* [React Navigation](https://reactnavigation.org/) for navigation screens
* [Axios](https://github.com/axios/axios) - HTTP client
* [i18n-js](https://www.npmjs.com/package/i18n-js) - Internationalization
* [lodash.com](https://lodash.com/) - Utilities
* [luxon](https://moment.github.io/luxon/) - Date/time calculations
* [Facebook SignIn](https://github.com/facebook/react-native-fbsdk/)
* [FastImage](https://github.com/DylanVann/react-native-fast-image#readme) - for image performance optimizations
* [Google Drive](https://www.npmjs.com/package/react-native-google-drive-api-wrapper)
* [react-native-localize](https://github.com/zoontek/react-native-localize) - localization
* [react-native-paper](https://callstack.github.io/react-native-paper/) - UI components
* [realm](https://www.npmjs.com/package/realm) - local database
* [victory-native](https://www.npmjs.com/package/victory-native) - for charts
-->

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
npm install --force
```

7. Run below command to generate vector images based on flavour folders:

```
FLAVOR=bebboDev npx react-native-vector-image generate
```

8. Create env/.env.bebboDev file at project root and add below 10 variables in it.
   The variables below contain sample data for example purposes. Do not copy values between brackets:

````apiUrlDevelop = 'https://bebbodev.app/api' (Server api endPoint)
   facebookAppDisplayName=Bebbo (For Facebook Analytics. Get these details from Facebook developer console.)
   facebookAppId=9856432678543908 (For Facebook Analytics. Get these details from Facebook developer console.)
   facebookClientToken=f67tr342356dsa233987kl56784v (For Facebook Analytics. Get these details from Facebook developer console.)
   projectNumber=453789238965 (For Google SignIn. Get it from step 5.)
   clientIdKey= bhjr6wdgddvv3k87tteq9fds6po3nm7 (For Google SignIn. Get it from step 5.)
   webId=abcdefg (The webId from Firebase Console)
   iosId=abcdefghijk (The iosId from Firebase Console)
   encryptionsKey=d64e6a977f5643er90h8y5jk123n8bd88630jh56d34ddec874566342209y34 (Key for encryption)
   encryptionsIVKey=nm4532wsd67cv087452xci876bui9765 (Key for encryption)```
````

NOTE: Please download [env.bebboDev](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) file from the provided Google Drive link.

**iOS setup guide:**

1. For iOS, copy fontello.ttf file from https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/app/assets/fonts/fontello.ttf to node_modules/react-native-vector-icons/Fonts. Refer this library for custom fonts: https://github.com/oblador/react-native-vector-icons.

1. Pod install inside ios folder

```
pod install
```

3. Configure Firebase services

   - [Create Firebase project](https://console.firebase.google.com/)
   - Add iOS and Android apps to Firebase project the standard way
   - Use Firebase wizards to create these:

     - GoogleService-Info.plist

   - Copy GoogleService-Info.plist files for iOS locations as mentioned here:

   Prodstaging

   ```
   https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/Development
   ```

   NOTE: Please download [GoogleService-Info.plist](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) file from the provided Google Drive link.
   **Android setup guide:**

1. For Android, add keystore files into \android\app folder to generate Android build. To add a keystore file to your Android project’s `android/app` folder and configure it for signing. Follow the following steps to add keystore file.

   1.1. _Obtain or create a keystore file_

   If you don’t already have a keystore file, you need to generate one. You can use the `keytool` command to create it:

   - Open a terminal or command prompt.
   - Run the following command to generate a new keystore file:

     ```bash
     keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
     ```

   - Follow the prompts to enter details such as passwords, organizational information, etc.

     1.2. _Add a keystore file to the project_

   - _Navigate to Your Project Directory:_

     - Open your project in your file explorer or terminal.
     - Go to the `android/app` directory of your project.

   - _Copy the Keystore File:_

     - Move or copy your `my-release-key.jks` file into the `android/app` directory.

       1.3. _Configure Gradle for Signing_

   - _Open the `build.gradle` File:_

     - In your project, navigate to `android/app/build.gradle`.

   - _Add Signing Configuration:_

     - Modify the `build.gradle` file to include signing configuration. Add the following code inside the `android` block:

       ```groovy
       android {
           ...
           signingConfigs {
               release {
                   if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                       storeFile file(MYAPP_RELEASE_STORE_FILE)
                       storePassword MYAPP_RELEASE_STORE_PASSWORD
                       keyAlias MYAPP_RELEASE_KEY_ALIAS
                       keyPassword MYAPP_RELEASE_KEY_PASSWORD
                   }
               }
           }
           buildTypes {
               release {
                   signingConfig signingConfigs.release
                   // Optional: Enable ProGuard to shrink and obfuscate code
                   minifyEnabled false
                   proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
               }
           }
       }
       ```

       1.4. _Add Signing Properties:_

   - Create or update the `gradle.properties` file located in the `android/` directory of your project (if the file doesn’t exist, create it).

   - Add the following properties to `gradle.properties`:

     ```properties
     MYAPP_RELEASE_STORE_FILE=my-release-key.jks
     MYAPP_RELEASE_KEY_ALIAS=my-key-alias
     MYAPP_RELEASE_STORE_PASSWORD=your-store-password
     MYAPP_RELEASE_KEY_PASSWORD=your-key-password
     ```

     Replace `your-store-password` and `your-key-password` with the actual passwords you used when creating the keystore.

   NOTE: Please download [debug and release keystore](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) files from the provided Google Drive link. 2. Configure Firebase services

- [Create Firebase project](https://console.firebase.google.com/)
- Add iOS and Android apps to Firebase project the standard way
- Use Firebase wizards to create these:
  - google-services.json
- Copy google-services.json files for Android locations as mentioned here:

  Prodstaging

  ```
  https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/prodstaging
  ```

  NOTE: Please download [googleServices.json](https://drive.google.com/drive/folders/1jVX2T4fqYSxNrVmuVQSMD5j_lKJigXDA?usp=sharing) file from the provided Google Drive link.

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

ENVFILE=env/.env.bebboDev FLAVOR=bebboDev xcodebuild -workspace ios/ParentBuddyApp.xcworkspace -scheme ParentBuddyAppDev -configuration Release -sdk iphoneos -archivePath ios/build/ParentBuddyAppDev.xcarchive archive (archive)

xcodebuild -exportArchive -archivePath ios/build/ParentBuddyAppDev.xcarchive -exportOptionsPlist ExportOptionsBabuni.plist -exportPath ios/build
```

## License

Distributed under the GPL-3.0 license. See `LICENSE` for more information.
