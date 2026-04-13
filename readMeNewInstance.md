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

### 5.1 Add New Scheme and Target in Xcode
- Open the project `ParentBuddyApp.xcworkspace` in Xcode.
- Go to **Product → Scheme → Manage Schemes…** and click + to create a new scheme.
Name the scheme `Wawamor`.
- Duplicate an existing target → rename the new target to `Wawamor`.
- In the **General** tab of the new target, update the **Display Name** to `Wawamor`.
- In **Signing & Capabilities**, update the **Bundle Identifier** to:
`org.unicef.ec.wawamor`.
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