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

### 5.1 Add a New Scheme in Xcode
- Open project in Xcode
- Manage Schemes → Add New Scheme → Name it `Wawamor`

### 5.2 Add a New Target
- File → New → Target → App
- Name: `Wawamor`
- Set signing Team

### 5.3 Update Bundle ID
- New Bundle Identifier: `org.unicef.ec.REMOVED_FACEBOOK_APP_ID1`

### 5.4 Configure Firebase
- Create a Firebase project
- Download `GoogleService-Info.plist`
- Add it to Wawamor Target → Copy Bundle Resources

### 5.5 Add Splash Image
- Create `WawamorSplash` in Assets.xcassets
- Set correct images for different devices

### 5.6 Add Localization Strings
- Create `Localizable_Wawamor.strings`
- Example:
  ```text
  "app_name" = "Wawamor";
  ```

### 5.7 Set Display Name
- Update `Bundle Display Name` to `Wawamor` in Build Settings

### 5.8 Configure Signing
- Set correct Team and signing settings in Wawamor Target

### 5.9 Update Podfile
- Add Wawamor Target:
  ```ruby
  target 'Wawamor' do
  end
  ```

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