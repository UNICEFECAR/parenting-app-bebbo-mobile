
<h1>Bebbo - an interactive mobile application for parenting</h1>
    
### Table of Contents

* [Introduction](#introduction)
* [Technology stack](#technology-stack)<!--* [Used libraries](#used-libraries)-->
* [Getting started](#getting-started)
* [Install Bebbo in localhost](#install-bebbo-in-localhost)
* [How to run](#how-to-run)
* [License](#license)
<!-- 
* [Source Code Overview](#source-code-overview)
* [Realm Databases](#realm-databases)
-->

## Introduction

[Bebbo](https://www.bebbo.app) is a multi-platform mobile application available on both [iOS](https://apps.apple.com/us/app/bebbo/id1588918146) and [Android](https://play.google.com/store/apps/details?id=org.unicef.ecar.bebbo). 
Discover the most comprehensive parenting app that provides you with all the tools and expert advice you need, all in one app, to support your child's growth and development from birth to age 6! Personalize this app to access daily toddler games, parenting advice, and tips on taking care of both your child and your own well-being. Navigate easily between multiple child profiles and receive advice tailored to each child's developmental needs.

Bebbo offers:
* Expert advice and parenting articles covering early learning, health, nutrition, caregiving, and safety, tailored to both your questions and your child’s age.
* Personalized 'learning through play' activities and games that support various critical areas of development, including cognition, language, motor skills, and social-emotional skills.
* Brief instructional videos and evidence-based support for each stage of your child’s development.
* The ability to search Bebbo’s collection of hundreds of activities and articles by topic, age, or area of development.
* The ability to save and share your favorite content.

Bebbo provides you with an interactive set of tools such as:
* Development milestones tracker
* Baby growth tracker
* Vaccination child immunization tracker
* Child health check-up tracker

The app can also operate in an offline mode in environments with limited internet connectivity. It is offered in several languages and is free to use. There are no internal advertisements, and you can share it with a partner.

## Technology stack

* [React Native](https://reactnative.dev/)
    * Project is set with Latest version of react native:
       * React native - 0.72.5
    * Several React Native modules have been incorporated in order to speed up the development.
    * Refer to [package.json](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/package.json) for more details.
* [TypeScript](https://www.typescriptlang.org/)
    * TypeScript was used as a programming language.
    * The same source code compiles into iOS and Android applications.
* [NPM](https://nodejs.org/en/)
    * NPM (Node Package Manager) was used to install third party packages and to run various scripts necessary during development.
        * Node version - 21.7.3
        * NPM version  - 10.3.0
<!--
* [Storybook](https://storybook.js.org/)
    * Storybook was used to create visual tests for many components and services used in the application.
-->

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

* Either Mac or Windows can be used for development.
* Follow [these instructions](https://reactnative.dev/docs/environment-setup) in order to prepare machine for development, specifically “React Native CLI Quickstart”.
* Follow [these instructions](https://reactnative.dev/docs/set-up-your-environment?os=macos&platform=android) to Set up Environment for React Native Development.

## Install Bebbo in localhost

1. Clone the repo via GitBash
```sh
git clone https://github.com/UNICEFECAR/parenting-app-bebbo-mobile.git
```
2. Install NPM packages (DO NOT USE yarn!)
```sh
npm install
```
3. Only on Mac, go to "ios" folder, and run
```sh
pod install
```
Before running iOS App on Device, necessary certificate setup from Apple developer account is required.
After each time pod install, copy [CP-User] [RNFB] Core Configuration && [CP-User] [RNFB] Crashlytics Configuration in each target’s build phases if missing from main target (ParentBuddyApp). You can use the below targets.

  **Project Target:**
   1. ParentBuddyApp - Bebbo Production target
   2. ParentBuddyAppDev - Bebbo Development target
   3. ParentBuddyAppXk - Foleja Production target
   4. ParentBuddyAppXkDev - Foleja Development target

  **Steps to add script:**
   * Click on target’s build phases add on + sign.
   * Add new run script phase.   
   
     ![alt text](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/referenceImages/ReadMe/AddScript.png)
    
   * Rename it to [CP-User] [RNFB] Core Configuration   
   
     ![alt text](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/referenceImages/ReadMe/Copy_Core_ConfigurationScript.png)
      
   * Copy script from ParentBuddyApp target’s “[CP-User] [RNFB] Core Configuration” 
      script to other selected target’s  “[CP-User] [RNFB] Core Configuration” script 
      in “ParentBuddyAppXk”,“ParentBuddyAppXkDev”,“ParentBuddyAppDev” targets.
      
     ![alt text](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/referenceImages/ReadMe/Copy_Core_ConfigurationScript.png)
      
   * Copy files path from input files from ParentBuddyApp target and paste to 
      other targets  “[CP-User] [RNFB] Core Configuration” script input files 
      in “ParentBuddyAppXk”,“ParentBuddyAppXkDev”,“ParentBuddyAppDev” targets.
     
     ![alt text](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/referenceImages/ReadMe/Copy_Core_Input_ConfigurationFile.png)
      
   * Click on target’s build phases add on + sign.
   * Add new run script
     
     ![alt text](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/referenceImages/ReadMe/AddScript.png)
      
   * Rename it to  “[CP-User] [RNFB] Crashlytics Configuration”.
     
     ![alt text](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/referenceImages/ReadMe/Copy_Crashalytics_Script.png)
      
   * Copy script from ParentBuddyApp target’s “[CP-User] [RNFB] Crashlytics Configuration” 
      script to other selected target’s  “[CP-User] [RNFB] Crashlytics Configuration” script 
      in “ParentBuddyAppXk”,“ParentBuddyAppXkDev”,“ParentBuddyAppDev” targets.
     
     ![alt text](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/referenceImages/ReadMe/Copy_Crashalytics_Script.png)
      
   * Copy files path from input files from ParentBuddyApp target and paste to other 
      targets “[CP-User] [RNFB] Crashlytics Configuration” script input files 
      in “ParentBuddyAppXk”,“ParentBuddyAppXkDev”,“ParentBuddyAppDev” targets.
     
     ![alt text](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/referenceImages/ReadMe/Copy_Input_Crashalytics_File.png)      

4. For iOS, copy fontello.ttf file from https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/blob/main/app/assets/fonts/fontello.ttf to node_modules/react-native-vector-icons/Fonts  
Refer this library for custom fonts: https://github.com/oblador/react-native-vector-icons.

5. For Android, add keystore files into \android\app folder to generate Android build.
      To add a keystore file to your Android project’s `android/app` folder and configure it for signing, follow these steps:

    5.1. *Obtain or Create a Keystore File*
    
    If you don’t already have a keystore file, you need to generate one. You can use the `keytool` command to create it:
    
    - Open a terminal or command prompt.
    - Run the following command to generate a new keystore file:
    
      ```bash
      keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
      ```
    
    - Follow the prompts to enter details such as passwords, organizational information, etc.

    5.2. *Add the Keystore File to Your Project*
    
    - *Navigate to Your Project Directory:*
      - Open your project in your file explorer or terminal.
      - Go to the `android/app` directory of your project.
    
    - *Copy the Keystore File:*
      - Move or copy your `my-release-key.jks` file into the `android/app` directory.

    5.3. *Configure Gradle for Signing*
    
    - *Open the `build.gradle` File:*
      - In your project, navigate to `android/app/build.gradle`.
    
    - *Add Signing Configuration:*
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

- **Add Signing Properties:**
  - Create or update the `gradle.properties` file located in the `android/` directory of your project (if the file doesn’t exist, create it).

  - Add the following properties to `gradle.properties`:

    ```properties
    MYAPP_RELEASE_STORE_FILE=my-release-key.jks
    MYAPP_RELEASE_KEY_ALIAS=my-key-alias
    MYAPP_RELEASE_STORE_PASSWORD=your-store-password
    MYAPP_RELEASE_KEY_PASSWORD=your-key-password
    ```

    Replace `your-store-password` and `your-key-password` with the actual passwords you used when creating the keystore.

6. Configure Firebase services
    - [Create Firebase project](https://console.firebase.google.com/)
    - Add iOS and Android apps to Firebase project the standard way
    - Use Firebase wizards to create these:
        - google-services.json
        - GoogleService-Info.plist
    - Copy google-services.json files for Android for various flavours at different locations as mentioned here:
    
       Prod
       ```
           https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/prod 
       ```
       Prodstaging 
       ```
       https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/prodstaging 
        ```
       Xk
       ```
       https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/xk
       ```
       xkstaging
       ```
       https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/android/app/src/xkstaging 
       ```    
    - Copy GoogleService-Info.plist files for iOS for various flavours at different locations as mentioned here:
    
       Prod
       ```
       https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/Production
       ```
       Prodstaging
       ```
       https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/Development
       ```
       Xk
       ```
       https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/Xk
       ```
       xkstaging
       ```
       https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/tree/main/ios/GoogleServices/XkDevelopment
       ```
               
7. Configure google Signin and GDrive Import/Export
    * Configure Google Signin and GDrive Import/Export
    * Enable Google Drive API from Cloud Console.
    * Choose Scope For Drive Access
    * Copy details of REVERSED_CLIENT_ID as in the below example from GoogleService-Info.plist 
     and add in .env file as  projectNumber and clientIdKey.
       * Format in GoogleService-Info.plist will be like com.googleusercontent.apps.${projectNumber}-${clientIdKey}

8. Steps required while creating Flavour builds for both Bebbo and Foleja. 

   **1.** Follow below steps for **Bebbo Prod and ProdStaging**:
   
      * In apiConstants.ts change buildFor const value to buildForBebbo as follows:
         
         ```
         export const buildFor = buildForBebbo;
         ```
 
      * In tsconfig.json keep dynamicImportsClass value to ./app/bebbo/* as follows:
       
        ```
         "@dynamicImportsClass/*": ["./app/bebbo/*"]
         ```
       
      * In metro.config.js keep blacklistRe value to /xk\/.*/ as follows: 
       
         ```
         blacklistRE: blacklist([/xk\/.*/])
         ```
       
      * In babel.config.js keep dynamicImportsClass value to ./app/bebbo as follows: 
        
        ```
        '@dynamicImportsClass': './app/bebbo'
        ```
       
      * Run below command to generate vector images based on flavour folders:
       
         ```
         npx react-native-vector-image generate
         ```
        
      * Create .env file at project root and add below 6 variables in it.
        The variables below contain sample data for example purposes. Do not copy values between brackets:
         
        ```
        apiUrlDevelop = 'https://bebbo.app/api' (Server api endPoint)
        facebookAppDisplayName=Bebbo (For Facebook Analytics. Get these details from Facebook developer console.)
        facebookAppId=9856432678543908 (For Facebook Analytics. Get these details from Facebook developer console.)
        facebookClientToken=f67tr342356dsa233987kl56784v (For Facebook Analytics. Get these details from Facebook developer console.)
        projectNumber=453789238965 (For Google SignIn. Get it from step 5.)
        clientIdKey= bhjr6wdgddvv3k87tteq9fds6po3nm7 (For Google SignIn. Get it from step 5.)
        encryptionsKey=d64e6a977f5643er90h8y5jk123n8bd88630jh56d34ddec874566342209y34 (Key for encryption)
        encryptionsIVKey=nm4532wsd67cv087452xci876bui9765 (Key for encryption)
        ```

    **2.** Follow below steps for **Foleja Prod and ProdStaging**:
   
      * In apiConstants.ts change buildFor const value to buildForFoleja as follows:
         
         ```
         export const buildFor = buildForFoleja;
         ```
 
      * In tsconfig.json keep dynamicImportsClass value to ./app/xk/* as follows:
       
        ```
         "@dynamicImportsClass/*": ["./app/xk/*"]
         ```
       
      * In metro.config.js keep blacklistRe value to /bebbo\/.*/ as follows: 
       
         ```
         blacklistRE: blacklist([/bebbo\/.*/])
         ```
       
      * In babel.config.js keep dynamicImportsClass value to ./app/xk as follows: 
        
        ```
        '@dynamicImportsClass': './app/xk'
        ```
       
      * Run below command to generate vector images based on flavour folders:
       
         ```
         npx react-native-vector-image generate
         ```
        
      * Create .env file at project root and add below 6 variables in it.
        The variables below contain sample data for example purposes. Do not copy values between brackets:
         
        ```
        apiUrlDevelop = 'https://hostname.com/api' (Server api endPoint)
        facebookAppDisplayName=AppDisplayName (For Facebook Analytics. Get these details from Facebook developer console.)
        facebookAppId=9856432678543908 (For Facebook Analytics. Get these details from Facebook developer console.)
        facebookClientToken=f67tr342356dsa233987kl56784v (For Facebook Analytics. Get these details from Facebook developer console.)
        projectNumber=453789238965 (For Google SignIn. Get it from step 5.)
        clientIdKey= bhjr6wdgddvv3k87tteq9fds6po3nm7 (For Google SignIn. Get it from step 5.)
        encryptionsKey=d64e6a977f5643er90h8y5jk123n8bd88630jh56d34ddec874566342209y34 (Key for encryption)
        encryptionsIVKey=nm4532wsd67cv087452xci876bui9765 (Key for encryption)
        ```
        
---

## Steps to Generate Required Keys and Tokens

### 1. Create Facebook App ID and Client Token

#### Create a Facebook Developer Account
- Visit [Facebook for Developers](https://developers.facebook.com/).
- Log in with your Facebook account or create a new account.

#### Create a New App
- Navigate to "My Apps" and click "Create App."
- Select the appropriate app type, such as "Consumer."
- Enter the app name as "Bebbo" and follow the instructions to complete the setup.

#### Obtain the Facebook App ID
- Once the app is created, the **App ID** will be visible on your app dashboard. This is your `facebookAppId`.

#### Generate a Client Token
- Go to "Settings" > "Basic" in your app dashboard.
- Scroll down to find the "Client Token" section. Click "Show" to view and copy your `facebookClientToken`.

### 2. Generate Google Client ID

#### Create a Google Developer Account
- Visit the [Google Cloud Console](https://console.cloud.google.com/).
- Sign in with your Google account.

#### Create a New Project
- In the Google Cloud Console, click "Select a Project" > "New Project."
- Name your project (e.g., "Bebbo Production") and click "Create."

#### Enable Google Sign-In API
- Navigate to "APIs & Services" > "Library."
- Search for "Google Sign-In API" and enable it for your project.

#### Create OAuth 2.0 Client ID
- Go to "APIs & Services" > "Credentials."
- Click "Create Credentials" and choose "OAuth 2.0 Client ID."
- Configure the consent screen and then generate your `clientIdKey`.

### 3. Generate AES-256 Encryption Key and IV Key

#### Generate Encryption Key
You can use various tools or libraries to generate a 256-bit encryption key. Here’s how to do it using OpenSSL:

```bash
openssl rand -hex 32
```
- The output will be a 64-character hexadecimal string. This is your `encryptionsKey`.

#### Generate Initialization Vector (IV)
Similarly, generate a 128-bit IV:

```bash
openssl rand -hex 16
```
- The output will be a 32-character hexadecimal string. This is your `encryptionsIVKey`.

---
  ## How to run
  After you install the application you can create build files for various flavors with below npx commands.
	
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

## License

Distributed under the GPL-3.0 license. See `LICENSE` for more information.
