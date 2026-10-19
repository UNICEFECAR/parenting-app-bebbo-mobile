# Bebbo Android 16 / API 36 target migration (proposed branch)

## Status and safety

**Proposal, not validated for production.** This patch is based on the `main` branch inspected on 2026-10-14. The connected GitHub integration returned HTTP 403 when asked to create a remote branch. The patch is a local deliverable and has **not** been pushed or built against the complete app. It must be applied to an isolated feature branch, compiled and device-tested before release. No changes to `main` are intended.

## What this patch changes

1. `android/build.gradle`: change `compileSdkVersion` and `targetSdkVersion` from 35 to **36**.
2. `android/build.gradle`: make AGP explicit with `com.android.tools.build:gradle:8.10.1` instead of the original versionless dependency.
3. `android/app/src/main/AndroidManifest.xml`: temporarily set `android:enableOnBackInvokedCallback="false"` for the shared app manifest so the existing React Native back navigation remains usable on Android 16 while migration/testing occurs. This is a temporary Android-supported opt-out, **not** the final predictive-back implementation.

The existing Gradle wrapper 8.12, Android Build Tools 35.0.0, Kotlin 2.0.21, NDK 27.0.12077973, React Native 0.78.2, Hermes, New Architecture, minSdk 24, all flavor definitions, signing, and versionCode/versionName are unchanged.

## Why AGP 8.10.1

The current root `android/build.gradle` declares `classpath("com.android.tools.build:gradle")` without a version. React Native **v0.78.2** declares `agp = "8.8.0"` in its own `packages/react-native/gradle/libs.versions.toml`, and its included Gradle plugin declares an implementation dependency on AGP. This explains the missing version in Bebbo's build file. Android documents AGP 8.10.x as supporting API level 36, with a minimum Gradle wrapper 8.11.1, SDK Build Tools 35.0.0 and Java 17. The existing Gradle 8.12 meets the published requirement.

**Build-time compatibility is not yet verified.** The included React Native 0.78.2 Gradle plugin itself was built against AGP 8.8.0; checking the *effective* classpath and compiling all Android variants is essential. If AGP 8.10.1 introduces plugin incompatibilities, treat those as migration blockers. React Native 0.81 was the first release to officially ship Android 16 support; a React Native upgrade may be required, but should be planned as a separate, more extensive effort after this controlled trial.

## Developer prerequisites

- JDK 17, Android SDK Platform **36**, SDK Build Tools **35.0.0**, and the pinned NDK **27.0.12077973**.
- Working local configuration/credentials and Firebase `google-services.json` files for each flavor being built. **Do not** commit these secrets.
- A clean checkout, Node dependencies installed with `npm ci` (which invokes `patch-package`), and Android SDK licenses accepted.

## Validation commands

From the repository root, on an isolated branch:

```bash
npm ci
cd android
./gradlew --version
./gradlew buildEnvironment  # Check that com.android.tools.build:gradle resolves to 8.10.1
./gradlew :app:help         # Smoke-test Gradle/plugin initialization
ENVFILE=../env/.env.bebbo FLAVOR=bebbo ./gradlew :app:assembleProdDebug
```

Replace the example ENVFILE with the correct path for the local checkout and add the necessary Firebase configuration. Build **release** app bundles with proper signing/configuration in the secured CI pipeline; do not publish a debug build. Verify the manifest in the final output is `targetSdkVersion=36` (`aapt dump badging path/to/app.apk`, or `bundletool`/Android Studio for AAB). Test Gradle configurations and actual artifact outputs rather than assuming a successful Gradle sync is sufficient.

## High-priority Android 16 checks

- **Edge-to-edge and system insets:** Android 16 no longer honors the Android 15 edge-to-edge opt-out. Bebbo already calls `WindowCompat.setDecorFitsSystemWindows(window, false)` in `MainActivity.kt` and uses `SafeAreaProvider`, but `FocusAwareStatusBar.tsx` conditionally calls `useIsFocused()` (a React Rules-of-Hooks risk when insets change), and `app/components/shared/Container.tsx` uses a legacy `styled.SafeAreaView`. Inspect the status bar, navigation bar, keyboard, fullscreen overlays, onboarding, menus, and modals on both gesture and three-button navigation. Fix confirmed UI regressions after screenshots/device testing.
- **Predictive back:** Android 16 changes back dispatch for apps targeting 36. This patch uses the temporary opt-out to preserve multiple `BackHandler` listeners in `app/screens`, particularly TermsPage, PrivacyPolicy, LoadingScreen, Vaccination, HealthCheckups, child/parent profile forms, and fullscreen growth charts. Add a follow-up ticket to adopt predictive back with a supported React Native version, then remove the opt-out after confirming gestures/navigation.
- **Large screens, orientation and resizing:** Android 16 can ignore orientation and resizability restrictions on larger displays. The manifests and `App.tsx` currently enforce portrait; test tablets, foldables, rotations and multi-window, including landscape growth charts. Do not assume portrait locking always works.
- **Notifications and exact alarms:** Test boot receiver, permission prompts, background delivery, deep links, scheduled vaccination/health notifications, and `ExactAlarmModule.kt` on clean installs and upgrades. The manifest includes both exact-alarm permissions, which should be separately reviewed against Google Play policy. No permissions are altered by this patch.
- **Native dependencies and app stability:** Check third-party binaries and the AAB for 16 KB page-size compatibility, Google Play pre-launch reports, fresh/upgrade installation, Realm storage, image/video playback, WebView, Firebase analytics/Crashlytics and the existing `useLegacyPackaging = true`/`libc++_shared.so` packaging workaround. Preserve the existing SoLoader workaround until separately validated.
- **Localization and offline:** Test RTL, language switching, all custom flavors, downloaded articles/images and first-run/offline flows.

## CI/build workflow caveat

At review time, `.github/workflows/android.yml` watches `Development12` and `.github/workflows/Android_Prod.yml` watches `main12`, not this proposed feature branch. These workflows also contain outdated action versions and commands that print generated environment configuration to logs. Do **not** assume a feature-branch push triggers a safe CI build; use a reviewed, secured CI workflow or private local build and avoid printing secrets.

## Variant matrix and release gate

`android/app/build.gradle` defines `prod`, `prodstaging`, `xk`, `xkstaging`, `bangla`, `banglastaging`, `merhababebek`, `wawamor`, `reraiumntwana`, and `bebbopacific`. The two SDK version changes apply to **all** of them. Smoke-test **every** build flavor, with deeper QA for Bebbo, Foleja, Babuni, Merhaba Bebek, Wawamor, Rerai Umntwana and Bebbo Pacific. Check Android API 24, 34, 35 and 36 where devices/emulators are available, including a tablet at API 36.

**Release gate:** clean build/signed artifacts, verified targetSdk 36, UI/navigation regression checks, no critical Crashlytics regressions, no new ANRs, notifications and offline features working, and QA sign-off for the relevant country apps. Keep `main` untouched until code review and release approval.

## Source references

- React Native v0.78.2 version catalog: https://github.com/react/react-native/blob/v0.78.2/packages/react-native/gradle/libs.versions.toml
- Android Gradle Plugin 8.10 compatibility: https://developer.android.com/build/releases/agp-8-10-0-release-notes
- Minimum AGP compatibility table: https://developer.android.com/build/releases/about-agp
- Android 16 behavior changes for target API 36: https://developer.android.com/about/versions/16/behavior-changes-16
- React Native 0.81 Android 16 support: https://reactnative.dev/blog/2025/08/12/react-native-0.81
