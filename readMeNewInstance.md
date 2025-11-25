---

# REMOVED_FACEBOOK_APP_ID1 Guide: Setting Up a New Instance

## Objective
This guide outlines the steps for adding a new REMOVED_FACEBOOK_APP_ID1 instance.  
For full setup details, refer to:
- **BEBBO APP ADMIN MANUAL FOR NEW APP.docx**
- **REMOVED_FACEBOOK_APP_ID1 project README** (for local setup)

---

## Folder Structure
A new instance follows this structure:

```
Project-Root/
├── env/
│   └── .env.REMOVED_FACEBOOK_APP_ID1           # Wawamor-specific environment variables
├── app/instances/
│   └── REMOVED_FACEBOOK_APP_ID1/
│       ├── assets/            # Images and offline content
│       ├── config/            # Config files
│       ├── styles/            # Theme and typography
│       └── firebaseEvents.ts  # Firebase tracking
├── tsconfig.REMOVED_FACEBOOK_APP_ID1.json      # TypeScript config for Wawamor
├── package.json               # Instance-specific scripts
├── babel.config.js            # Environment variable setup
```

---

## Step 1: Preparing a New Instance Folder

### 1.1 Duplicate an Existing Instance
- Copy an existing folder (e.g., `app/instances/babuni`)
- Rename it to `app/instances/REMOVED_FACEBOOK_APP_ID1`

### 1.2 Modify Instance-Specific Files
- `config/appConfig.ts` → Update API URL, feature flags, settings
- `styles/theme.ts` → Update brand colors, fonts, UI styles
- `assets/localization.ts` → Update localized content
- `firebaseEvents.ts` → Update Firebase event names

### 1.3 Add Configuration to Project Root
- Add `tsconfig.REMOVED_FACEBOOK_APP_ID1.json`
- Add `env/.env.REMOVED_FACEBOOK_APP_ID1`

---

## Step 2: Updating Assets & Localization

| Folder/File            | Purpose |
|-------------------------|---------|
| `images/`               | Icons, logos, backgrounds |
| `locale/`               | Translation files |
| `offlinecontent/`       | Offline articles, tips, taxonomies |
| `splash.json`           | Splash animation configuration |
| `localization.ts`       | Defines app texts |
| `standardDeviation.json`| Statistical data |

### 2.1 Add Images
- Replace logos and icons in `assets/images/`

### 2.2 Update Localization Files
- Modify `locale/en.ts`, `locale/es.ts`
- **Important:** Don't rename keys like `aboutREMOVED_FACEBOOK_APP_ID1DrawerMenu` or `searchInREMOVED_FACEBOOK_APP_ID1Text`

### 2.3 Update Offline Content
- Update articles, health tips, vaccinations inside `offlinecontent/`

---

## Step 3: Adding Environment Variables

Create `env/.env.REMOVED_FACEBOOK_APP_ID1` with:

| Variable                 | Description |
|---------------------------|-------------|
| `apiUrlDevelop`           | API Base URL (development) |
| `facebookAppDisplayName`  | Facebook login display name |
| `facebookAppId`           | Facebook App ID |
| `facebookClientToken`     | Facebook Client Token |
| `projectNumber`           | Firebase project number |
| `clientIdKey`             | Backend auth client key |
| `webId`                   | Web ID for Firebase |
| `iosId`                   | iOS App instance ID |
| `encryptionsKey`          | Encryption key |
| `encryptionsIVKey`        | Encryption IV key |

---

## Step 4: Configuring TypeScript

Create `tsconfig.REMOVED_FACEBOOK_APP_ID1.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@styles/*": ["app/instances/REMOVED_FACEBOOK_APP_ID1/styles/*"],
      "@images/*": ["app/instances/REMOVED_FACEBOOK_APP_ID1/assets/images/*"]
    }
  }
}
```

---

## Step 5: Setting Up iOS Instance

### 5.1 Add New Scheme and Target in Xcode
- Open the project `ParentBuddyApp.xcworkspace` in Xcode.
- Go to **Product → Scheme → Manage Schemes…** and click + to create a new scheme.
Name the scheme `Wawamor`.
- Duplicate an existing target → rename the new target to `Wawamor`.
- In the **General** tab of the new target, update the **Display Name** to `Wawamor`.
- In **Signing & Capabilities**, update the **Bundle Identifier** to:
`org.unicef.ec.REMOVED_FACEBOOK_APP_ID1`.
- Set the correct **Team** and **Code Signing settings** for the Wawamor target.
- When the target is duplicated, a copy of the **Info.plist** file is created.
Open it in Xcode and update all values for the new instance.
- Update the **Podfile** to include the new target:
  ```ruby
  target 'Wawamor' do
  end
  ```
- In Finder, duplicate the `InfoPlist_Wawamor` folder and the `Wawamor.entitlements` file.
Rename them to match the new instance name.
- In Xcode, select the **ParentBuddyApp** project →
Go to Project → ParentBuddyApp → Info tab → Localizations → click + →
Add the required language(s).
When prompted, select InfoPlist.strings as the resource file.
- In Xcode, right-click **ParentBuddyApp → Add Files to "ParentBuddyApp"…**
Add the renamed `InfoPlist_Wawamor` folder.
Make sure the `Wawamor` target is selected. 
- Open the newly added `InfoPlist_Wawamor` folder → select InfoPlist.
In the right panel, update the localization settings.
Xcode will automatically generate `InfoPlist.strings` files for selected languages.
- Again right-click **ParentBuddyApp → Add Files…** and add the new `Wawamor.entitlements` file.
Do **not** assign it to any target.
- In the Wawamor target → Build Settings, update:
  - **Info.plist File** path
  - **Code Signing Entitlements** path
    to point to the new instance files you created.

### 5.2 Add Splash Image and Icons
- Create `Wawamor` folder inside `ios -> Wawamor`. Add Assets, Splashimg and Launchscreen as per the requirement for the instance. Add this `Wawamor` folder in Xcode.
- Create folder `Wawamor` at `ios -> LottieSplash -> Wawamor`. Add updated `splash.json` inside it.

### 5.3 Configure Firebase
- Create a Firebase project
- Download `GoogleService-Info.plist`
- Add it to `Wawamor` Target → Copy Bundle Resources

---

## Step 6: Setting Up Android Instance

### 6.1 Add Resources
- Copy existing instance (e.g., `android/app/src/bangla`) to `android/app/src/REMOVED_FACEBOOK_APP_ID1`
- Update:
  - `res/raw/splash.json`
  - Files in `res/values/`
  - AndroidManifest.xml:
    ```xml
    <data android:host="www.REMOVED_FACEBOOK_APP_ID1.ec" android:pathPrefix="/"/>
    ```

- Add `google-services.json` for Firebase

### 6.2 Generate Keystore
Run:

```bash
keytool -genkeypair -v -keystore android/app/REMOVED_FACEBOOK_APP_ID1.keystore \
  -storepass REMOVED_FACEBOOK_APP_ID1storepass -keypass REMOVED_FACEBOOK_APP_ID1keypass \
  -alias REMOVED_FACEBOOK_APP_ID1key -keyalg RSA -keysize 2048 -validity 10000
```

### 6.3 Update Gradle Files

- `android/gradle.properties`:
  ```properties
  WAWAMOR_STORE_FILE=android/app/REMOVED_FACEBOOK_APP_ID1.keystore
  WAWAMOR_STORE_PASSWORD=REMOVED_FACEBOOK_APP_ID1storepass
  WAWAMOR_KEY_ALIAS=REMOVED_FACEBOOK_APP_ID1key
  WAWAMOR_KEY_PASSWORD=REMOVED_FACEBOOK_APP_ID1keypass
  ```

- `android/app/build.gradle`:

  ```gradle
  signingConfigs {
      REMOVED_FACEBOOK_APP_ID1 {
          storeFile file(WAWAMOR_STORE_FILE)
          storePassword WAWAMOR_STORE_PASSWORD
          keyAlias WAWAMOR_KEY_ALIAS
          keyPassword WAWAMOR_KEY_PASSWORD
      }
  }
  productFlavors {
      REMOVED_FACEBOOK_APP_ID1 {
          applicationId "org.unicef.ec.REMOVED_FACEBOOK_APP_ID1"
          signingConfig signingConfigs.REMOVED_FACEBOOK_APP_ID1
      }
  }
  ```

### 6.4 Build & Run

```bash
cd android
./gradlew clean
cd ..
ENVFILE=env/.env.REMOVED_FACEBOOK_APP_ID1 FLAVOR=REMOVED_FACEBOOK_APP_ID1 react-native run-android --variant=REMOVED_FACEBOOK_APP_ID1Debug
```

---

## Step 7: Running the New Instance

### 7.1 Add Scripts to `package.json`

```json
"scripts": {
  "run:REMOVED_FACEBOOK_APP_ID1:android": "ENVFILE=env/.env.REMOVED_FACEBOOK_APP_ID1 FLAVOR=REMOVED_FACEBOOK_APP_ID1 react-native run-android --variant=REMOVED_FACEBOOK_APP_ID1Debug --appId org.unicef.ec.REMOVED_FACEBOOK_APP_ID1",
  "run:REMOVED_FACEBOOK_APP_ID1:ios": "ENVFILE=env/.env.REMOVED_FACEBOOK_APP_ID1 FLAVOR=REMOVED_FACEBOOK_APP_ID1 react-native run-ios --scheme Wawamor --mode Release"
}
```

### 7.2 Run the App

```bash
npm run run:REMOVED_FACEBOOK_APP_ID1:android    # Android
npm run run:REMOVED_FACEBOOK_APP_ID1:ios        # iOS
```

---