---

# Bebbo Guide: Setting Up a New Instance

## Objective
This guide outlines the steps for adding a new Bebbo instance.  
For full setup details, refer to:
- **BEBBO APP ADMIN MANUAL FOR NEW APP.docx**
- **Bebbo project README** (for local setup)

---

## Folder Structure
A new instance follows this structure:

```
Project-Root/
├── env/
│   └── .env.wawamor           # Wawamor-specific environment variables
├── app/instances/
│   └── wawamor/
│       ├── assets/            # Images and offline content
│       ├── config/            # Config files
│       ├── styles/            # Theme and typography
│       └── firebaseEvents.ts  # Firebase tracking
├── tsconfig.wawamor.json      # TypeScript config for Wawamor
├── package.json               # Instance-specific scripts
├── babel.config.js            # Environment variable setup
```

---

## Step 1: Preparing a New Instance Folder

### 1.1 Duplicate an Existing Instance
- Copy an existing folder (e.g., `app/instances/babuni`)
- Rename it to `app/instances/wawamor`

### 1.2 Modify Instance-Specific Files
- `config/appConfig.ts` → Update API URL, feature flags, settings
- `styles/theme.ts` → Update brand colors, fonts, UI styles
- `assets/localization.ts` → Update localized content
- `firebaseEvents.ts` → Update Firebase event names

### 1.3 Add Configuration to Project Root
- Add `tsconfig.wawamor.json`
- Add `env/.env.wawamor`

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
- **Important:** Don't rename keys like `aboutBebboDrawerMenu` or `searchInBebboText`

### 2.3 Update Offline Content
- Update articles, health tips, vaccinations inside `offlinecontent/`

---

## Step 3: Adding Environment Variables

Create `env/.env.wawamor` with:

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

Create `tsconfig.wawamor.json`:

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
- New Bundle Identifier: `org.unicef.ec.wawamor`

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
- Copy existing instance (e.g., `android/app/src/bangla`) to `android/app/src/wawamor`
- Update:
  - `res/raw/splash.json`
  - Files in `res/values/`
  - AndroidManifest.xml:
    ```xml
    <data android:host="www.wawamor.ec" android:pathPrefix="/"/>
    ```

- Add `google-services.json` for Firebase

### 6.2 Generate Keystore
Run:

```bash
keytool -genkeypair -v -keystore android/app/wawamor.keystore \
  -storepass wawamorstorepass -keypass wawamorkeypass \
  -alias wawamorkey -keyalg RSA -keysize 2048 -validity 10000
```

### 6.3 Update Gradle Files

- `android/gradle.properties`:
  ```properties
  WAWAMOR_STORE_FILE=android/app/wawamor.keystore
  WAWAMOR_STORE_PASSWORD=wawamorstorepass
  WAWAMOR_KEY_ALIAS=wawamorkey
  WAWAMOR_KEY_PASSWORD=wawamorkeypass
  ```

- `android/app/build.gradle`:

  ```gradle
  signingConfigs {
      wawamor {
          storeFile file(WAWAMOR_STORE_FILE)
          storePassword WAWAMOR_STORE_PASSWORD
          keyAlias WAWAMOR_KEY_ALIAS
          keyPassword WAWAMOR_KEY_PASSWORD
      }
  }
  productFlavors {
      wawamor {
          applicationId "org.unicef.ec.wawamor"
          signingConfig signingConfigs.wawamor
      }
  }
  ```

### 6.4 Build & Run

```bash
cd android
./gradlew clean
cd ..
ENVFILE=env/.env.wawamor FLAVOR=wawamor react-native run-android --variant=wawamorDebug
```

---

## Step 7: Running the New Instance

### 7.1 Add Scripts to `package.json`

```json
"scripts": {
  "run:wawamor:android": "ENVFILE=env/.env.wawamor FLAVOR=wawamor react-native run-android --variant=wawamorDebug --appId org.unicef.ec.wawamor",
  "run:wawamor:ios": "ENVFILE=env/.env.wawamor FLAVOR=wawamor react-native run-ios --scheme Wawamor --mode Release"
}
```

### 7.2 Run the App

```bash
npm run run:wawamor:android    # Android
npm run run:wawamor:ios        # iOS
```

---