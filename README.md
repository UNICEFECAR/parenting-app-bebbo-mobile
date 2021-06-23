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
<!-- 4. Create  "src/app/apiConfig.ts"
    - Server part of "Parent Buddy" is Drupal application
    - Administrator of Drupal application should give you values that you should put in apiConfig.ts
    - apiConfig.ts should look like this
```
export const apiConfig = {
    apiUsername: '...',
    apiPassword: '...',
    apiAuthUsername: '...',
    apiAuthPassword: '...',
};
```
5. Configure Firebase services
    - [Create Firebase project](https://console.firebase.google.com/)
    - Add iOS and Android apps to Firebase project the standard way
    - Use Firebase wizards to create these:
        - google-services.json
        - GoogleService-Info.plist
    - Copy files here:
        -  android/app/google-services.json
        - ios/GoogleService-Info.plist
-->

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


<!-- SOURCE CODE OVERVIEW
## Source Code Overview

- Configuration
    - Most of the configuration can be done from “src/app/appConfig.ts”
- Backup
    - Code related to backup is here “src/app/backup.tsx”
    - Backup is done to Google Drive
- Error handling
    - Custom error handling code is here “src/app/errors.ts”
    - Custom error handling is initialized from App component by calling initGlobalErrorHandler()
- Content (articles, etc)
    - Content related helpers: “src/app/content.ts”
    - Content is downloaded from the Drupal
    - Images are saved on mobile file system
    - Articles, home messages etc are save din realm database
- Services related code
    - src/app/facebook.ts
        - Used for login
    - src/app/googleAuth.ts
        - Used for login
    - src/app/googleDrive.ts
        - Used for backup
- Home messages
    - Code related to showing home messages: src/app/homeMessages.ts
- Localization related code
    - src/app/localize.ts
- Syncing data with server
    - Code related to downloading data from the Drupal API: “src/app/syncData.ts”
- Utilities
    - src/app/utils.ts
- Analytics
    - Firebase Analytics is used
    - There is one method that is called for all analytic logs: logAnalitic
        - Its defined in “src/app/utils.ts”
- Custom UI components
    - There are many custom UI components defined here: “src/components”
    - They are divided per feature
        - development
        - doctor-visit
        - growth
        - vaccinations
        - …
- Navigation screens
    - All navigation screens are here “src/screens”
    - They are divided into feature folders
- API related code
    - src/stores/apiStore.ts
    - This is code that communicates with Drupal API
- Entities
    - These are the main entities of the application
    - src/stores/BasicPageEntity.ts
        - Data from Drupal, same structure is in Realm
    - src/stores/CategoryArticlesViewEntity.ts
    - src/stores/ChildEntity.ts
    - src/stores/ContentEntity.ts
        - Data from Drupal, same structure is in Realm
    - src/stores/ContentViewEntity.ts
    - src/stores/DailyMessageEntity.ts
        - Data from Drupal, same structure is in Realm
    - src/stores/MilestoneEntity.ts
        - Data from Drupal, same structure is in Realm
    - src/stores/PollsEntity.ts
        - Data from Drupal, same structure is in Realm
    - src/stores/ConfigSettingsEntity.ts
- Realm related code
    - Configure realms
        - src/stores/dataRealmConfig.ts
        - src/stores/userRealmConfig.ts
    - React contexts
        - src/stores/DataRealmContext.tsx
        - src/stores/UserRealmContext.tsx
        - src/stores/DataUserRealmsContext.tsx
    - Helper functions
        - src/stores/dataRealmStore.ts
        - src/stores/userRealmStore.ts
- UI translation
    - src/translations
- Hard coded data that is specific to language
    - src/translationsData
- Storybook visual tests
    - storybook folder
 -->

<!-- REALM DATABASES 
## Realm Databases

Two Realm databases are created by the application:

- data
    - Contains data downloaded from the Drupal API
    - Structure of the Realm classes is saved here:
        - src/stores/BasicPageEntity.ts
        - src/stores/ContentEntity.ts
        - src/stores/DailyMessageEntity.ts
        - src/stores/MilestoneEntity.ts
        - src/stores/PollsEntity.ts
        - src/stores/ConfigSettingsEntity.ts
- user
    - Contains user specific data
    - Structure of the Realm classes is saved here:
        - src/stores/ChildEntity.ts
-->

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.
