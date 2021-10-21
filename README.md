# parenting-app-bebbo-mobile<!-- PROJECT LOGO -->
<br />
<p align="center">
<!--  <a href="https://github.com/github_username/repo_name">
    <img src="https://github.com/byteout/halo-beba/blob/master/android/app/src/main/res/drawable/icon.png?raw=true" alt="Logo" width="80" height="80">
  </a>
-->
  <h3 align="center">Beboo Mobile App for Parenting</h3>

  <p align="center">
    Interactive guide for parents
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
  * [Libraries Used](#libraries-used)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Running](#running)
<!-- * [Source Code Overview](#source-code-overview)
* [Realm Databases](#realm-databases) -->
* [License](#license)

<!-- ABOUT THE PROJECT -->
## About The Project

This is a multi platform mobile application for both iOS and Android.

### Built With

* [React Native](https://reactnative.dev/)
    * Several RN modules have been used in order to speed up the development.
    * Check package.json for details
* [TypeScript](https://www.typescriptlang.org/)
    * TypeScript was used as a programming language
    * Same source code compiles to both iOS and Android applications
* [NPM](https://nodejs.org/en/)
    * NPM (Node Package Manager) was used to install third party packages and to run various scripts necessary during development.
<!--* [Storybook](https://storybook.js.org/)
    * Storybook was used to create visual tests for many components and services used in the application.

### Libraries Used

Many third party libraries and services were used. These are the most important, the full list can be seen by examining package.json (in the root of the project)

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
<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* Both Mac and Windows can be used for development.
* Follow [these instructions](https://reactnative.dev/docs/environment-setup) in order to prepare machine for development, specifically “React Native CLI Quickstart”.


### Installation

1. Clone the repo
```sh
git clone https://github.com/github_username/repo_name.git
```
2. Install NPM packages (DONT USE yarn!)
```sh
npm install
```
3. Only on Mac, go to "ios" folder, and run
```sh
pod install
```

4. Configure Firebase services
    - [Create Firebase project](https://console.firebase.google.com/)
    - Add iOS and Android apps to Firebase project the standard way
    - Use Firebase wizards to create these:
        - google-services.json
        - GoogleService-Info.plist
    - Copy files here:
        -  android/app/google-services.json
        - ios/GoogleService-Info.plist

5. configure google Signin and GDrive Import/Export
    - Enable Google Drive API from Cloud Console.
    - Choose Scope For Drive Access
    - Copy Access key from GoogleInfo.plist and add in ios/info.plist as
    ```sh
        <key>CFBundleURLTypes</key>
        <array>
        <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
        <string>com.googleusercontent.apps.{{firebase_project_number}}-{{client_id_key}}</string>
        </array>
        </dict>
        </array>        
```
<!-- RUNNING -->
## Running

After you install the application you can run it with one of the several npm run scripts.

```
npm run android
npm run android-release
npm run ios
npm run ios-device
npm run ios-device-release
npm run ios-iphone-se
npm run ios-release
```

There are several other NPM scripts that can be useful during development. Check package.json for details.
<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.
