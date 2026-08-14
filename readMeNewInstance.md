# Bebbo Guide: Setting Up a New Instance

## Objective

This guide explains how to add a new Bebbo instance/flavor to the mobile application.

In this guide:

- `babuni` is used as an example of an existing instance.
- `wawamor` is the new instance being created.

The exact configuration may vary depending on the requirements of the new instance.

For general project setup and build instructions, refer to the main project [README](README.md).

For the complete administrative process for creating a new Bebbo application, also refer to:

- **BEBBO APP ADMIN MANUAL FOR NEW APP.docx**

---

# 1. Create the New Instance

A new instance requires configuration in several areas of the project:

- Application instance configuration
- Environment variables
- TypeScript configuration
- Assets and localization
- Offline content
- Firebase
- Android flavor
- Android signing configuration
- iOS target and scheme
- iOS signing configuration
- Build and run configuration

The new instance should be based on an existing instance with similar requirements.

For example, `babuni` can be used as the starting point:

```text
app/instances/babuni
```
Copy it to:

```text
app/instances/wawamor
```

---

# 2. Instance Folder Structure
The new instance should follow the existing instance structure:

```text
app/instances/
└── wawamor/
    ├── assets/
    │   ├── images/
    │   ├── locale/
    │   ├── offlinecontent/
    │   ├── splash.json
    │   ├── localization.ts
    │   └── standardDeviation.json
    ├── config/
    ├── styles/
    └── firebaseEvents.ts
```

The exact files may vary depending on the existing instance being copied.

---

# 3. Prepare the Instance Configuration

## 3.1 Duplicate an Existing Instance
Copy an existing instance, for example:

```text
app/instances/babuni
```

and rename it:

```text
app/instances/wawamor
```

Review all copied files and update values that are specific to the new instance.

---

## 3.2 Update Instance-Specific Configuration
Review and update the following files as applicable:

```text
app/instances/wawamor/config/appConfig.ts
app/instances/wawamor/styles/theme.ts
app/instances/wawamor/assets/localization.ts
app/instances/wawamor/firebaseEvents.ts
```

Update:

- API configuration
- Feature flags
- Application settings
- Brand colors
- Fonts and typography
- Localized application text
- Firebase event configuration
- Instance-specific behaviour

Do not change shared functionality unless the new instance requires it.

---

# 4. Add Assets and Offline Content
The following areas normally require instance-specific updates:

| Folder/File | Purpose |
| --- | --- |
| `assets/images/` | Logos, icons, backgrounds and other images |
| `assets/locale/` | Translation files |
| `assets/offlinecontent/` | Offline articles, tips, taxonomies and related content |
| `assets/splash.json` | Splash animation configuration |
| `assets/localization.ts` | Application-specific text and labels |
| `assets/standardDeviation.json` | Statistical/reference data where applicable |

## 4.1 Images

Replace the copied instance images with the new application's:

- Logo
- App icons
- Backgrounds
- Other instance-specific graphics

---

## 4.2 Localization
Add or update the required language files.

For example:

```text
locale/en.ts
locale/es.ts
```

Use the languages required by the new instance.

> **Important:** Do not rename existing localization keys such as `aboutBebboDrawerMenu` or `searchInBebboText`. The application code depends on these keys.

---

## 4.3 Offline Content

Update the instance's offline content with the content required for the new application.

This may include:

- Articles
- Activities
- Health content
- Vaccination content
- Taxonomies
- Other offline resources

The offline content should be reviewed and tested before creating a release build.

---

# 5. Configure Environment Variables
Create the following file:

```text
env/.env.wawamor
```

The exact values depend on the new instance's backend, Firebase, Google Sign-In and other service configuration.

### Example `.env.wawamor`

```env
apiUrlDevelop='https://YOUR-API-URL/api'

facebookAppDisplayName=YOUR_APP_NAME
facebookAppId=YOUR_FACEBOOK_APP_ID
facebookClientToken=YOUR_FACEBOOK_CLIENT_TOKEN

projectNumber=YOUR_GOOGLE_FIREBASE_PROJECT_NUMBER

clientIdKey=YOUR_GOOGLE_OAUTH_IOS_CLIENT_ID_SUFFIX
webId=YOUR_GOOGLE_OAUTH_WEB_CLIENT_ID_SUFFIX
iosId=YOUR_GOOGLE_OAUTH_IOS_CLIENT_ID_SUFFIX

encryptionsKey=YOUR_ENCRYPTION_KEY
encryptionsIVKey=YOUR_ENCRYPTION_IV_KEY
```

### Environment Variable Description
```
| Variable | Description |
| --- | --- |
| `apiUrlDevelop` | Development API base URL |
| `facebookAppDisplayName` | Facebook application display name |
| `facebookAppId` | Facebook App ID |
| `facebookClientToken` | Facebook Client Token |
| `projectNumber` | Firebase project number used to construct Google OAuth client IDs |
| `clientIdKey` | Google OAuth iOS client ID suffix used to construct the iOS Google Sign-In URL scheme |
| `webId` | Google OAuth Web Client ID suffix used to construct the Web Client ID |
| `iosId` | Google OAuth iOS Client ID suffix used to construct the iOS Client ID |
| `encryptionsKey` | Encryption key used to encrypt exported user data |
| `encryptionsIVKey` | Initialization vector (IV) used by the user-data encryption process |
```
> **Note:** `clientIdKey` and `iosId` may have the same value because both are used for the Google OAuth iOS configuration. `clientIdKey` is used to construct the iOS Google Sign-In URL scheme, while `iosId` is used to construct the iOS OAuth Client ID. Keep both values consistent with the Google OAuth configuration for the iOS application.

### Security

Do not commit real:

- Facebook tokens
- Encryption keys
- Encryption IVs
- Keystore passwords
- Other private credentials

Use the appropriate internal configuration mechanism for development and release credentials.

---

# 6. Configure TypeScript
Create:

```text
tsconfig.wawamor.json
```

### Example

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@styles/*": ["app/instances/wawamor/styles/*"],
      "@images/*": ["app/instances/wawamor/assets/images/*"]
    }
  }
}
```

Update the paths according to the actual aliases required by the new instance.

---

# 7. Configure Firebase
Each new instance should have its own Firebase application configuration where required.

## 7.1 Create Firebase Project

Create a Firebase project from the [Firebase Console](https://console.firebase.google.com/).

Add:

- Android application
- iOS application
- Web application, if required by the application configuration

Use the correct package name and iOS bundle identifier for the new instance.

---

## 7.2 Android Firebase Configuration
Download:

```text
google-services.json
```

Place it in the Android flavor directory used by the new instance:

```text
android/app/src/wawamor/
```

The exact location should match the Android flavor/resource structure in the project.

---

## 7.3 iOS Firebase Configuration

Download:

```text
GoogleService-Info.plist
```

Add it to the new iOS target and make sure it is included in the target's **Copy Bundle Resources**.

---

# 8. Configure Google Sign-In
The new instance must have the appropriate Google OAuth configuration if Google Sign-In is enabled.

The application constructs Google OAuth client IDs using:

```text
projectNumber
webId
iosId
```

The iOS URL scheme is constructed using:

```text
projectNumber
clientIdKey
```

For example, the iOS URL scheme is generated in the form:

```text
com.googleusercontent.apps.<projectNumber>-<clientIdKey>
```

Make sure the values correspond to the Google OAuth configuration created for the new application.

If `clientIdKey` and `iosId` refer to the same Google OAuth iOS client, they may contain the same value.

---

# 9. Generate Vector Images
After adding or updating the instance assets, generate the vector images for the new flavor.

From the project root:

```bash
FLAVOR=wawamor npx react-native-vector-image generate
```

Run this whenever the vector image assets need to be regenerated.

---
# Step 10: Setting Up the iOS Instance

In this example:

- **Existing instance:** `Babuni`
- **New instance:** `Wawamor`
- **Wawamor iOS Scheme:** `Wawamor`
- **Wawamor iOS Target:** `Wawamor`
- **Wawamor Bundle Identifier:** `org.unicef.ec.wawamor`

Use the existing `Babuni` iOS target and files as the reference when creating the new `Wawamor` instance.

## 10.1 Add New Scheme and Target in Xcode

1. Open the iOS workspace:

   ```text
   ios/ParentBuddyApp.xcworkspace
   ```

   > **Important:** Open the `.xcworkspace` file, not the `.xcodeproj` file.

2. Go to **Product → Scheme → Manage Schemes…**

3. Click **+** to create a new scheme.

4. Name the new scheme:

   ```text
   Wawamor
   ```

5. In the Xcode project navigator, select the **ParentBuddyApp** project.

6. Under **TARGETS**, duplicate the existing `Babuni` target.

7. Rename the duplicated target to:

   ```text
   Wawamor
   ```

8. Select the new **Wawamor** target and open the **General** tab.

9. Update the **Display Name** to:

   ```text
   Wawamor
   ```

10. Under **Signing & Capabilities**, configure the appropriate Apple Developer **Team**.

11. Update the **Bundle Identifier** to:

    ```text
    org.unicef.ec.wawamor
    ```

12. Configure the appropriate code signing certificate and provisioning profile for the Wawamor application.

13. When the `Babuni` target is duplicated, an instance-specific copy of the `Info.plist` should be created.

    Rename the corresponding Babuni `Info.plist` file or folder to the Wawamor version, for example:

    ```text
    InfoPlist_Babuni
    ```

    to:

    ```text
    InfoPlist_Wawamor
    ```

14. Open the new Wawamor `Info.plist` in Xcode and update all values that are specific to the new instance.

    Review values such as:

    - Application name
    - Permission descriptions
    - URL schemes
    - Deep-link configuration
    - Any Babuni-specific values
    - Any other instance-specific configuration

15. In the Wawamor target, go to **Build Settings → Packaging**.

16. Update **Info.plist File** so that it points to the new Wawamor `Info.plist`.

---

## 10.2 Configure Google Sign-In

The application uses Google Sign-In configuration values from the instance environment file.

The iOS URL scheme uses the following format:

```text
com.googleusercontent.apps.$(projectNumber)-$(clientIdKey)
```

Make sure the Wawamor target has the appropriate URL scheme configured.

The corresponding values should be configured in:

```text
env/.env.wawamor
```

The `clientIdKey` and `iosId` values may be the same in the existing application configuration. Do not change these values unless a new Google OAuth configuration is required for the new instance.

If Wawamor uses a separate Google or Firebase project, make sure the Google OAuth configuration is consistent with that project.

---

## 10.3 Configure the Wawamor Entitlements File

In Finder, duplicate the existing Babuni entitlements file:

```text
ios/Babuni/Babuni.entitlements
```

and rename it for Wawamor:

```text
ios/Wawamor/Wawamor.entitlements
```

> Use the actual location of the existing Babuni entitlements file in the repository if the folder structure differs.

Add the new `Wawamor.entitlements` file to the Xcode project.

When adding the file:

1. Right-click **ParentBuddyApp → Add Files to "ParentBuddyApp"…**
2. Select `Wawamor.entitlements`.
3. Do not assign the file to an unrelated target.

In the **Wawamor** target, go to **Build Settings → Signing**.

Update:

```text
Code Signing Entitlements
```

so that it points to the new Wawamor entitlements file.

For example:

```text
Wawamor/Wawamor.entitlements
```

Review **Signing & Capabilities** for the Wawamor target and make sure any capabilities required by the application are configured.

---

## 10.4 Configure InfoPlist Localization

If the application uses localized `InfoPlist.strings` files, create the Wawamor version based on the existing Babuni configuration.

1. In Xcode, select the **ParentBuddyApp** project.

2. Go to **Project → ParentBuddyApp → Info → Localizations**.

3. Click **+** and add the languages required by the Wawamor instance.

4. When Xcode asks which resource should be localized, select:

   ```text
   InfoPlist.strings
   ```

5. In Finder, duplicate the existing Babuni `InfoPlist` localization folder.

   For example:

   ```text
   InfoPlist_Babuni
   ```

   Create:

   ```text
   InfoPlist_Wawamor
   ```

6. Rename the files inside the folder as required for Wawamor.

7. In Xcode, right-click **ParentBuddyApp → Add Files to "ParentBuddyApp"…**

8. Add the new:

   ```text
   InfoPlist_Wawamor
   ```

   folder.

9. Make sure the **Wawamor** target is selected when adding the files.

10. Open the newly added `InfoPlist_Wawamor` folder and select the localized `InfoPlist.strings` files.

11. In the right-side **File Inspector**, verify and update the localization settings.

12. Update localized application-specific values, such as the application name.

Xcode will maintain the `InfoPlist.strings` files for the selected languages.

> Do not rename localization keys such as existing application keys unless the corresponding application code is also updated.

---

## 10.5 Update the Podfile

Open:

```text
ios/Podfile
```

Add the new Wawamor target following the same structure used by the existing Babuni target.

For example:

```ruby
target 'Wawamor' do
end
```

If the existing Babuni target contains additional configuration, follow the same configuration for Wawamor where applicable.

After updating the Podfile, run:

```bash
cd ios
pod install
cd ..
```

Make sure `pod install` completes successfully before attempting to build the Wawamor target.

---

## 10.6 Add Wawamor App Icons and iOS Assets

Create the Wawamor iOS folder:

```text
ios/Wawamor
```

Use the existing Babuni folder structure as a reference.

Add the Wawamor-specific:

- App icons
- Images
- Launch screen assets
- Other iOS-specific assets required by the instance

For example, the structure may contain:

```text
ios/
└── Wawamor/
    ├── Assets/
    ├── Splashimg/
    └── Launchscreen/
```

Add the `Wawamor` folder to the Xcode project.

Make sure the appropriate files are included in the **Wawamor** target.

Replace the Babuni branding with the Wawamor branding where required.

---

## 10.7 Configure the Lottie Splash Screen

The application uses a Lottie splash animation.

Create the Wawamor folder under:

```text
ios/LottieSplash/Wawamor
```

Add the Wawamor-specific:

```text
splash.json
```

The expected structure is:

```text
ios/
└── LottieSplash/
    ├── Babuni/
    │   └── splash.json
    └── Wawamor/
        └── splash.json
```

Add the new Wawamor folder and files to Xcode if required by the existing project structure.

Use the existing Babuni splash configuration as a reference when configuring Wawamor.

---

## 10.8 Configure Firebase

Create a Firebase project for the Wawamor application.

In Firebase:

1. Create a new Firebase project, or use the appropriate project provided for the Wawamor instance.

2. Add an **iOS application** to the Firebase project.

3. Use the Wawamor Bundle Identifier:

   ```text
   org.unicef.ec.wawamor
   ```

4. Download:

   ```text
   GoogleService-Info.plist
   ```

5. Add the downloaded `GoogleService-Info.plist` to the Wawamor iOS target.

In Xcode:

1. Right-click **ParentBuddyApp → Add Files to "ParentBuddyApp"…**
2. Select the Wawamor `GoogleService-Info.plist`.
3. Make sure the **Wawamor** target is selected.
4. Select the Wawamor target and go to **Build Phases → Copy Bundle Resources**.
5. Verify that `GoogleService-Info.plist` is included.

> **Important:** Do not use the Babuni `GoogleService-Info.plist` for Wawamor. The Firebase configuration must correspond to the Wawamor iOS Bundle Identifier.

---

## 10.9 Configure iOS Firebase and Environment Values

Update:

```text
env/.env.wawamor
```

with the Firebase and application-specific values for the Wawamor instance.

At minimum, verify the following values:

```text
projectNumber
webId
iosId
```

These values must correspond to the Google or Firebase configuration used by the Wawamor instance.

The following values are also required by the application:

```text
clientIdKey
encryptionsKey
encryptionsIVKey
```

Refer to the **Environment Variables** section of this guide for the purpose and configuration of these values.

> **Security:** Do not commit private production credentials, signing passwords, private keys, or other secrets to the repository.

---

## 10.10 Configure the Wawamor Scheme

Select **Product → Scheme → Manage Schemes…**

Verify that the following scheme exists:

```text
Wawamor
```

Select the `Wawamor` scheme and verify that it uses the correct:

- Wawamor target
- Build configuration
- Signing configuration
- Bundle Identifier
- Environment configuration

The scheme should point to the newly created Wawamor target rather than the existing Babuni target.

---

## 10.11 Verify the Wawamor iOS Configuration

Before building the new instance, verify the following:

- [ ] `Wawamor` scheme created
- [ ] `Wawamor` target created by duplicating `Babuni`
- [ ] Display Name updated to `Wawamor`
- [ ] Bundle Identifier set to `org.unicef.ec.wawamor`
- [ ] Apple Developer Team configured
- [ ] Signing configuration configured
- [ ] Wawamor `Info.plist` created
- [ ] Wawamor `Info.plist` path configured in Build Settings
- [ ] Wawamor entitlements file created
- [ ] Code Signing Entitlements points to the Wawamor entitlements file
- [ ] Required localizations added
- [ ] `InfoPlist_Wawamor` localization resources added
- [ ] Wawamor target added to `ios/Podfile`
- [ ] `pod install` completed successfully
- [ ] Wawamor app icons and assets added
- [ ] Wawamor launch screen assets added
- [ ] Wawamor Lottie splash folder created
- [ ] Wawamor `splash.json` added
- [ ] Wawamor Firebase iOS application created
- [ ] Wawamor `GoogleService-Info.plist` downloaded
- [ ] `GoogleService-Info.plist` added to the Wawamor target
- [ ] Firebase configuration included in **Copy Bundle Resources**
- [ ] Google Sign-In URL scheme configured
- [ ] `env/.env.wawamor` configured
- [ ] `projectNumber`, `webId`, and `iosId` verified
- [ ] `clientIdKey` verified
- [ ] Encryption configuration verified
- [ ] Wawamor scheme points to the Wawamor target

After completing the configuration, run:

```bash
ENVFILE=env/.env.wawamor FLAVOR=wawamor npx react-native run-ios --scheme Wawamor --mode Release
```

For creating an iOS release or archive build, follow the **iOS Release Build** section in the main `README.md`.

---

# 11. Configure Android
## 11.1 Create Android Flavor Resources

Use an existing instance as a template.

For example, copy:

```text
android/app/src/babuni/
```

to:

```text
android/app/src/wawamor/
```

Update the copied files for the new instance.

This may include:

```text
res/raw/splash.json
res/values/
AndroidManifest.xml
```

Update the application-specific values, including:

- Application name
- Colors
- Strings
- Icons
- Splash configuration
- Deep links
- Other instance-specific resources

For example, if the new instance uses:

```text
www.wawamor.ec
```

the Android manifest deep link configuration may contain:

```xml
<data
    android:host="www.wawamor.ec"
    android:pathPrefix="/" />
```

Use the actual domain configured for the new instance.

---

# 12. Configure Android Firebase
Add the Firebase configuration file:

```text
google-services.json
```

to:

```text
android/app/src/wawamor/
```

Verify that the Firebase package name matches the Android application ID configured for the new flavor.

---

# 13. Generate Android Keystore

Each production Android application should have its own signing keystore.

Generate a new keystore:

```bash
keytool -genkeypair -v \
  -keystore android/app/wawamor.keystore \
  -alias wawamorkey \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You will be prompted to provide the required passwords and certificate information.

Store the keystore and passwords securely.

> **Important:** Do not commit the keystore or its passwords to the public repository.

The keystore must be backed up securely because the same signing key is required for future updates to the Android application.

---

# 14. Configure Android Signing

Android release builds require a signing keystore and signing configuration.

The keystore file can be placed in the project as required by the existing project structure, but **keystore passwords and other sensitive signing credentials must not be committed to the repository**.

### 14.1 Create or Obtain the Wawamor Keystore

If a new Wawamor signing key is required, generate a keystore using:

```bash
keytool -genkeypair -v \
  -keystore android/app/wawamor.keystore \
  -storepass <secure-store-password> \
  -keypass <secure-key-password> \
  -alias wawamorkey \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```
For production applications, keep the keystore and passwords securely backed up.

> **Important:** The Android keystore and its passwords are sensitive credentials. Do not commit keystore passwords or private signing credentials to GitHub.

### 14.2 Configure User-Level Gradle Properties

The project does **not** store the keystore passwords in the project's:

```text
android/gradle.properties
```

Instead, sensitive signing properties should be configured in the developer's **user-level Gradle properties file**:

```text
~/.gradle/gradle.properties
```

For example:
```properties
WAWAMOR_STORE_PASSWORD=<secure-store-password>
WAWAMOR_KEY_PASSWORD=<secure-key-password>
```

On macOS/Linux, this file is normally located at:

```text
~/.gradle/gradle.properties
```

On Windows, it is normally located at:

```text
%USERPROFILE%\.gradle\gradle.properties
```

> **Important:** Do not commit the user-level `gradle.properties` file to the repository.

### 14.3 Configure the Keystore in the Project
The non-sensitive signing configuration can be configured according to the existing project structure.

For example:

```properties
WAWAMOR_STORE_FILE=android/app/wawamor.keystore
WAWAMOR_KEY_ALIAS=wawamorkey
```

The sensitive values should remain in the user's:

```text
~/.gradle/gradle.properties
```

For example:

```properties
WAWAMOR_STORE_PASSWORD=<secure-store-password>
WAWAMOR_KEY_PASSWORD=<secure-key-password>
```

Make sure the property names match exactly between the Gradle configuration and the user-level `gradle.properties`.

### 14.4 Update `android/app/build.gradle`

Add the Wawamor signing configuration following the existing project's Gradle structure.

For example:

```groovy
signingConfigs {
    wawamor {
        storeFile file(WAWAMOR_STORE_FILE)
        storePassword WAWAMOR_STORE_PASSWORD
        keyAlias WAWAMOR_KEY_ALIAS
        keyPassword WAWAMOR_KEY_PASSWORD
    }
}
```

Then configure the Wawamor product flavor:

```groovy
productFlavors {
    wawamor {
        applicationId "org.unicef.ec.wawamor"
        signingConfig signingConfigs.wawamor
    }
}
```

Use the actual application ID and signing configuration required by the new instance.
---

# 15. Verify Android Build Configuration
Make sure the new flavor is correctly registered wherever flavors are configured in:

```text
android/app/build.gradle
```

Check:

- Product flavor
- Application ID
- Signing configuration
- Firebase configuration
- Manifest
- Resources
- Build variants

The resulting variant name depends on the project's flavor/build-type configuration.

For example, if the project uses:

```text
wawamorDebug
```

the corresponding command would be:

```bash
ENVFILE=env/.env.wawamor FLAVOR=wawamor npx react-native run-android --variant=wawamorDebug
```

Use the actual variant shown in Android Studio/Gradle for the new instance.

---

# 16. Add Package.json Scripts
If the project uses package scripts for the new instance, add scripts similar to the existing instances.

For example:

```json
{
  "scripts": {
    "run:wawamor:android": "ENVFILE=env/.env.wawamor FLAVOR=wawamor npx react-native run-android --variant=wawamorDebug --appId org.unicef.ec.wawamor",
    "run:wawamor:ios": "ENVFILE=env/.env.wawamor FLAVOR=wawamor npx react-native run-ios --scheme Wawamor --mode Release"
  }
}
```

Make sure the variant, scheme and application ID exactly match the configuration created for the new instance.

---

# 17. Run the New Instance

## 17.1 Start Metro
From the project root:

```bash
ENVFILE=env/.env.wawamor FLAVOR=wawamor npx react-native start --reset-cache
```

Keep Metro running in this terminal.

---

## 17.2 Run Android

Make sure an Android emulator is running or an Android device is connected.

For example:

```bash
ENVFILE=env/.env.wawamor FLAVOR=wawamor npx react-native run-android --variant=wawamorDebug --appId org.unicef.ec.wawamor
```

Use the actual variant configured for the new instance.

---

## 17.3 Run iOS

Make sure an iOS Simulator or configured iOS device is available.

For example:

```bash
ENVFILE=env/.env.wawamor FLAVOR=wawamor npx react-native run-ios --scheme Wawamor --mode Release
```

---

# 18. Create Android Release Builds
After the new flavor is configured and tested, create release builds using the appropriate Gradle tasks.

For example:

### Android App Bundle

```bash
cd android
ENVFILE=../env/.env.wawamor FLAVOR=wawamor ./gradlew bundleWawamorRelease
cd ..
```

### Android APK

```bash
cd android
ENVFILE=../env/.env.wawamor FLAVOR=wawamor ./gradlew assembleWawamorRelease
cd ..
```

The exact Gradle task name depends on the configured flavor and build types.

Generated files will normally be available under:

```text
android/app/build/outputs/
```

---

# 19. Create iOS Release Builds
Once the new iOS target and scheme are configured, an archive can be created using `xcodebuild`.

For example:

```bash
ENVFILE=env/.env.wawamor FLAVOR=wawamor xcodebuild \
  -workspace ios/ParentBuddyApp.xcworkspace \
  -scheme Wawamor \
  -configuration Release \
  -sdk iphoneos \
  -archivePath ios/build/Wawamor.xcarchive \
  archive \
  -allowProvisioningUpdates
```

The archive will be created at:

```text
ios/build/Wawamor.xcarchive
```

To export the archive, use an `ExportOptions.plist` configured for the new application's Apple Developer signing/distribution configuration.

For example:

```bash
xcodebuild \
  -exportArchive \
  -archivePath ios/build/Wawamor.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath ios/build \
  -allowProvisioningUpdates
```

> **Note:** Developers using their own Apple Developer account may need to create or update `ExportOptions.plist` with their own Team ID and signing/distribution configuration.

---

# 20. Final Verification Checklist
Before considering the new instance complete, verify the following.

### Application Configuration

- [ ] `app/instances/wawamor/` created
- [ ] Instance configuration updated
- [ ] Theme and branding updated
- [ ] Localization updated
- [ ] Offline content updated
- [ ] Firebase events reviewed
- [ ] `tsconfig.wawamor.json` created
- [ ] `env/.env.wawamor` configured

### Firebase

- [ ] Firebase project created
- [ ] Android application added
- [ ] iOS application added
- [ ] `google-services.json` configured
- [ ] `GoogleService-Info.plist` configured
- [ ] Firebase package/bundle identifiers verified
- [ ] Firebase Analytics verified, if required

### Google Sign-In

- [ ] Google OAuth configuration created
- [ ] `projectNumber` configured
- [ ] `webId` configured
- [ ] `iosId` configured
- [ ] `clientIdKey` configured
- [ ] iOS URL scheme verified
- [ ] Google Sign-In tested

### Android

- [ ] Android flavor created
- [ ] Application ID configured
- [ ] Android resources updated
- [ ] `AndroidManifest.xml` updated
- [ ] Firebase configuration added
- [ ] Signing configuration added
- [ ] Keystore generated and securely backed up
- [ ] Debug build tested
- [ ] Release APK tested
- [ ] Release AAB generated successfully

### iOS

- [ ] iOS target created
- [ ] iOS scheme created
- [ ] Bundle identifier configured
- [ ] Signing Team configured
- [ ] `Info.plist` configured
- [ ] Entitlements configured
- [ ] App icons configured
- [ ] Splash screen configured
- [ ] Firebase configuration added
- [ ] Localizations configured
- [ ] Pods installed
- [ ] Release build tested
- [ ] Archive created successfully
- [ ] Archive exported successfully

### Final Testing

- [ ] Application launches successfully
- [ ] Correct branding is displayed
- [ ] Correct language/content is displayed
- [ ] API connectivity works
- [ ] Offline mode works
- [ ] Firebase events are recorded in the intended Firebase project
- [ ] Google Sign-In works, if enabled
- [ ] Deep links work, if enabled
- [ ] Data export/import works, if enabled
- [ ] Android release build tested
- [ ] iOS release build tested
