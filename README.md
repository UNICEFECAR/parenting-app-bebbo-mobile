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
Before running ios App on Device, necessary certificate setup from Apple developer Account is required.
After each time pod install,copy [CP-User] [RNFB] Core Configuration && [CP-User] [RNFB] Crashlytics Configuration in each target’s build phases if missing from main target (ParentBuddyApp)

  **Steps to add script:**
   * click on target’s build phases add on + sign.
   * Add new run script phase.
   * Rename it to [CP-User] [RNFB] Core Configuration
   * Copy script from ParentBuddyApp target’s “[CP-User] [RNFB] Core Configuration” 
      script to other selected target’s  “[CP-User] [RNFB] Core Configuration” script 
      in “ParentBuddyAppXk”,“ParentBuddyAppXkDev”,“ParentBuddyAppDev” targets.
   * Copy files path from input files from ParentBuddyApp target and paste to 
      other targets  “[CP-User] [RNFB] Core Configuration” script input files 
      in “ParentBuddyAppXk”,“ParentBuddyAppXkDev”,“ParentBuddyAppDev” targets.
   * click on target’s build phases add on + sign.
   * Add new run script
   * Rename it to  “[CP-User] [RNFB] Crashlytics Configuration”.
   * Copy script from ParentBuddyApp target’s “[CP-User] [RNFB] Crashlytics Configuration” 
      script to other selected target’s  “[CP-User] [RNFB] Crashlytics Configuration” script 
      in “ParentBuddyAppXk”,“ParentBuddyAppXkDev”,“ParentBuddyAppDev” targets.
   * Copy files path from input files from ParentBuddyApp target and paste to other 
      targets “[CP-User] [RNFB] Crashlytics Configuration” script input files 
      in “ParentBuddyAppXk”,“ParentBuddyAppXkDev”,“ParentBuddyAppDev” targets.
   

4. Copy fontello.ttf file from https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/app/assets/fonts/fontello.ttf to node_modules/react-native-vector-icons/Fonts  
Refer this library for custom fonts : https://github.com/oblador/react-native-vector-icons

5. Configure Firebase services
    - [Create Firebase project](https://console.firebase.google.com/)
    - Add iOS and Android apps to Firebase project the standard way
    - Use Firebase wizards to create these:
        - google-services.json
        - GoogleService-Info.plist
    - Copy google-services.json files for Android for various flavours at different locations as mentioned here:
       
         Prod
         
          https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/prod 
          
          
         Prodstaging 
          
          https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/prodstaging 
           
         Xk
          
          https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/xk 
          
             
         xkstaging
          
          https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/xkstaging 
          
          
         
    - Copy GoogleService-Info.plist files for iOS for various flavours at different locations as mentioned here:
    
         Prod
      
          https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/Production
          
          
         Prodstaging
      
          https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/Development
          
          
         Xk
      
           https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/Xk
          
          
         xkstaging
      
           https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/XkDevelopment
          
          

    
6. Configure google Signin and GDrive Import/Export
    * Configure Google Signin and GDrive Import/Export
    * Enable Google Drive API from Cloud Console.
    * Choose Scope For Drive Access
    * Copy details of REVERSED_CLIENT_ID as in the below example from GoogleService-Info.plist 
     and add in .env file as  projectNumber and clientIdKey.
       * Format in GoogleService-Info.plist will be like com.googleusercontent.apps.${projectNumber}-${clientIdKey}

7. Steps required while creating Flavour builds.Follow below steps for Bebbo Prod and ProdStaging
   
      * In apiConstants.ts change buildFor const value to buildForBebbo as follows :
         
         ```
         export const buildFor = buildForBebbo;
         ```
 
      * In tsconfig.json keep dynamicImportsClass value to ./app/bebbo/* as follows :
       
        ```
         "@dynamicImportsClass/*": ["./app/xk/*"]
         ```
       
      * In metro.config.js keep blacklistRe value to /bebbo\/.*/ as follows : 
       
         ```
         blacklistRE: blacklist([/bebbo\/.*/])
         ```
       
      * In babel.config.js keep dynamicImportsClass value to ./app/bebbo as follows : 
        
        ```
        '@dynamicImportsClass': './app/xk'
        ```
       
      * Run below command to generate vector images based on flavour folders :
       
         ```
         npx react-native-vector-image generate
         ```
        
      * Create .env file at project root and add below 6 variables in it :
         
        ```
        apiUrlDevelop = 'https://hostname.com/api' (server api endPoint)
        facebookAppDisplayName=XXXXXXXXXXXX (For Facebook Analytics.Get these details from Facebook developer console)
        facebookAppId=XXXXXXXXXXXX (For Facebook Analytics.Get these details from Facebook developer console)
        facebookClientToken=XXXXXXXXXXXX (For Facebook Analytics.Get these details from Facebook developer console)
        projectNumber=XXXXXXXXXXXX (For Google SignIn. Get it from step 5)
        clientIdKey=XXXXXXXXXXXX (For Google SignIn. Get it from step 5)
        ```
        
  8. Running application based on flavours
  * After you install the application you can create build files for various flavors with below npx commands.
	
     Prod
     ```
	npx react-native run-android --variant=prodRelease --appId org.unicef.ecar.bebbo (apk)
	cd android && ./gradlew bundleProdRelease (aab)
	npx react-native run-ios --scheme ParentBuddyApp (ipa)
     ```

     Prodstaging
     ```
	npx react-native run-android --variant=prodstagingRelease --appId com.datamatics.bebbo (apk)
	cd android && ./gradlew bundleProdstagingRelease (aab)
    npx react-native run-ios --scheme ParentBuddyAppDev (ipa)
     ```

     xk 
     ```
	npx react-native run-android --variant=xkRelease --appId org.unicef.kosovo.foleja (apk)
	cd android && ./gradlew bundleXkRelease (aab)
	npx react-native run-ios --scheme ParentBuddyAppXk (ipa)
     ```

     xkstaging 
    ```
	npx react-native run-android --variant=xkstagingRelease --appId com.datamatics.foleja (apk)
	cd android && ./gradlew bundleXkstagingRelease (aab)
	npx react-native run-ios --scheme ParentBuddyAppXkDev (ipa)
    ```


        
        
<!-- RUNNING -->
## Running

After you install the application you can run it with one of the several npm run scripts.

```sh
npx react-native run-android
npx react-native run-android --variant=release
npx react-native run-ios
npm run ios-device
npm run ios-device-release
npm run ios-iphone-se
npm run ios-release
```

There are several other NPM scripts that can be useful during development. Check package.json for details.
<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.
