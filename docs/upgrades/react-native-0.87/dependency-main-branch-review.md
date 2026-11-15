# Main-branch dependency and security review — 15 November 2026

Current `main` `f2e1bd4428ab2f37b0dc975dc6508a3a9c01d89f` is compared read-only with the fixes source based on `6a1e88e8a876293294642c1ecfa91e3322a51694`. Neha’s `RNSDKUpgrade` branch and main are not modified. This report supplements the original PR comparison; it does not credit all existing upgrade work to this latest pass.

All 115 direct main dependencies and 112 selected direct dependencies were compared, with both npm locks audited. The 39 outdated-package families were also queried within compatible major/minor ranges, since a global latest tag can hide maintained patches. Native build inputs, all seven external workflow Actions and the CocoaPods/Ruby constraints were reviewed separately. This is a dependency assessment, not a full binary or penetration-test certificate.

| Snapshot | Low | Moderate | High | Critical |
| --- | --- | --- | --- | --- |
| Current main | 11 | 17 | 28 | 1 |
| Reviewed branch | 11 | 0 | 0 | 0 |

These are npm package/advisory entries, including transitive effects; not counts of proven remotely exploitable app bugs. The main critical entry is shell-quote. The PR upgrade and earlier fixes already address the higher-severity npm matches; the newly selected patches do not reduce the remaining count of 11 low entries. Those trace to the disputed deepmerge advisory with no published fixed release. Registry signature checking reports no invalid or missing signatures; this does not certify every maintainer, attestation or native binary.

## Applied changes in the requested four-part format

### C107 — Gradle build-host security

**1. Area of change:** Gradle build-host security

**2. Bug or issue:** Gradle 9.8.1 remains affected by the November catalog code-generation and daemon-registry advisories, including one critical and two high findings. This was an omission in the earlier dependency review.

**3. Detailed change:** Upgrade the complete wrapper to 9.9.1, regenerate the launch scripts/JAR with the official distribution, verify the distribution and wrapper JAR SHA256 values against first-party sources, retain URL validation and add an isolated valid/invalid catalog regression. The non-executable invalid value is accepted by 9.8.1 but rejected during validation by 9.9.1.

**4. Files impacted:** `android/gradle/wrapper/gradle-wrapper.properties`, `android/gradle/wrapper/gradle-wrapper.jar`, `android/gradlew`, `android/gradlew.bat`, `scripts/check-gradle-catalog-security.py`, `scripts/__tests__/security-config.test.cjs`, `.github/workflows/native-verification.yml`

### C108 — Application Kotlin build-cache security

**1. Area of change:** Application Kotlin build-cache security

**2. Bug or issue:** The selected application KGP 2.2.10 falls below the KAPT unsafe-deserialisation fix. Merely compiling RN build plugins with 2.4.21 does not select the application plugin.

**3. Detailed change:** Select stable Kotlin 2.4.21 and explicitly version the root buildscript plugin dependency. Pin the supported AsyncStorage KSP override to 2.3.14: its bundled lookup otherwise falls back to KSP 1.0.28 and fails native task creation against Kotlin 2.4. Retain Room and its generated legacy-storage migration; do not bypass processing. The final native matrix recompiles the migration processor and app. KSP 2.3.14 also fixes the concurrent execution regression in 2.3.13. Keep AGP 9.2.1, Java 21, SDK/NDK and supported devices unchanged. Record and validate the actual resolved application KGP in CI; reject an older or unverified selection. The vendor fully-tested Gradle range ends at 9.7; later versions are allowed with possible warnings, so the security-required Gradle 9.9.1 combination is verified by the native matrix rather than described as vendor-certified.

**4. Files impacted:** `android/build.gradle`, `scripts/__tests__/security-config.test.cjs`, `scripts/android-dependency-inventory.gradle`, `scripts/audit-maven-dependencies.py`, `.github/workflows/native-verification.yml`

### C109 — i18next security hardening

**1. Area of change:** i18next security hardening

**2. Bug or issue:** Failed-load, language-hierarchy and plural-rule caches can grow with unlimited language/namespace input. Server middleware is the primary exposed upstream scenario; this app does not contain that middleware.

**3. Detailed change:** Upgrade 27.1.1 to 27.1.2. Exercise over 1,000 failed loads and generated language codes against the actual installed library. Verify bounded caches and that offline translations, interpolation, empty strings and custom country locale IDs still work using the app’s cleanCode/fallback policies. The first test fails on 27.1.1 and both pass on 27.1.2.

**4. Files impacted:** `package.json`, `package-lock.json`, `scripts/__tests__/i18next-security.test.cjs`

### C110 — Notification permission and delegate stability

**1. Area of change:** Notification permission and delegate stability

**2. Bug or issue:** TurboModule permission requests may run on the native-modules thread while Android changes the UI hierarchy. Duplicate/cyclic iOS delegate chains can also recurse.

**3. Detailed change:** Upgrade NotifyKit 10.10.0 to 10.10.1. Its Android POST_NOTIFICATIONS request moves onto the UI thread while preserving rejection behaviour. Its iOS callback forwarding contains synchronous delegate cycles. Run the package’s real Android main-thread/error-path regression on API 33 and 36 in CI. AGP 9 only creates the default tested build type’s unit tasks; enable the release unit-test component for this invocation with the documented command-line property, without changing production Gradle defaults. CocoaPods inputs are regenerated on macOS; the legacy alarm reader and notification IDs are not rewritten.

**4. Files impacted:** `package.json`, `package-lock.json`, `ios/Podfile.lock`, `.github/workflows/native-verification.yml`

### C111 — iOS Lottie bridge compatibility

**1. Area of change:** iOS Lottie bridge compatibility

**2. Bug or issue:** The native constantsToExport override had an implicitly unwrapped optional return type rather than the required non-optional dictionary.

**3. Detailed change:** Upgrade Lottie RN 7.5.0 to 7.5.1. Keep the returned VERSION value, animation APIs, splash/manual-dismiss behaviour and lottie-ios 4.6.0. The native package changes only the override signature and package version.

**4. Files impacted:** `package.json`, `package-lock.json`, `ios/Podfile.lock`

### C112 — Maintained Skia 2 native fixes

**1. Area of change:** Maintained Skia 2 native fixes

**2. Bug or issue:** The original 2.15.1 selection predates native view-ID, Metal ownership and temporary wrapper-lifetime backports, plus pixel-grid/retained-buffer corrections. The global latest tag obscures maintained 2.x patches.

**3. Detailed change:** Upgrade to 2.15.5 within the supported Victory 43 / Skia 2 pairing, retaining Ganesh and older-device support. Do not introduce Skia 3/Graphite or raise the app minimum OS. The lock also updates CanvasKit WASM 0.41.0 to 0.41.1 for the package’s web path. Native rendering/physical GPU acceptance remains distinct from compilation.

**4. Files impacted:** `package.json`, `package-lock.json`, `ios/Podfile.lock`

### C113 — Java setup action security

**1. Area of change:** Java setup action security

**2. Bug or issue:** setup-java 6.2.0 embeds an affected fast-xml-parser line.

**3. Detailed change:** Pin setup-java 6.3.0 to verified immutable commit d1374f8ac74474200d16ef8ecee22c7ae7a51880. Its bundled parser is 5.12.0. Explicitly keep problem-matcher enabled because this release changes the default; compiler annotations and the Java 21 selection are retained.

**4. Files impacted:** `.github/workflows/native-verification.yml`

### C114 — Continuous resolved native dependency verification

**1. Area of change:** Continuous resolved native dependency verification

**2. Bug or issue:** An npm audit cannot verify Maven runtime packages or establish which Kotlin plugin Gradle actually selected. Partial scans can otherwise appear clean.

**3. Detailed change:** Add a read-only inventory of all ten release runtime classpaths plus root buildscript coordinates. Scope the init script to builds containing the app project: React Native’s included build has no :app. Exercise the real script on an isolated composite build; the regression fails before this guard and passes afterwards. Run the scope, resolved-dependency and permission checks before the expensive app compile so failures surface early. Reject incomplete resolution, empty/missing variants and unpatched selected KGP. Query exact runtime coordinates plus the selected KGP against OSV and fail on advisory matches, malformed/partial/paginated responses or request failures. Preserve the inventory/report as CI artifacts. Other buildscript, Apple/C++ and service coverage remains explicitly excluded.

**4. Files impacted:** `scripts/android-dependency-inventory.gradle`, `scripts/check-gradle-inventory-scope.py`, `scripts/audit-maven-dependencies.py`, `scripts/__tests__/test_maven_audit.py`, `.github/workflows/native-verification.yml`

### C115 — Main-branch dependency comparison and acceptance follow-up

**1. Area of change:** Main-branch dependency comparison and acceptance follow-up

**2. Bug or issue:** The prior comparison used PR #1115 rather than current main; some console inspections and actual access blockers were not recorded in the consolidated report.

**3. Detailed change:** Compare all direct main/fixes selections and both locked npm graphs, inspect newer within-major candidates as well as latest tags, check immutable Actions and Ruby/native constraints, record fresh registry/signature/Ruby results, and document the new bounded Firebase observations. Keep production/device/governance acceptance separate from source fixes.

**4. Files impacted:** `docs/upgrades/react-native-0.87/dependency-main-branch-review.md`, `docs/upgrades/react-native-0.87/evidence/dependency-main-branch-review.json`, `docs/upgrades/react-native-0.87/crash-history.md`, `docs/upgrades/react-native-0.87/native-dependency-security.md`, `docs/upgrades/react-native-0.87/README.md`

## Complete direct dependency decision register

Versions below are actual top-level locked versions, not only manifest ranges. A missing package can indicate a deliberate removal or native-module replacement. “No newer tag reported” refers to the registry comparison, not proof that no future release or undisclosed vulnerability exists.

| Package | Main lock | Fixes before this pass | Selected lock | Family latest / latest tag | Decision |
| --- | --- | --- | --- | --- | --- |
| @attarchi/react-native-lottie-splash-screen | 2.0.4 | 3.0.0 | 3.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @babel/core | 7.28.3 | 7.29.13 | 7.29.13 | 7.29.13 / 8.1.2 | Retain the maintained/tested Babel 7 line; the available family patch is already selected. Babel 8 requires a separate configuration/peer migration. |
| @babel/preset-env | 7.28.3 | 7.29.14 | 7.29.14 | 7.29.14 / 8.0.7 | Retain the maintained/tested Babel 7 line; the available family patch is already selected. Babel 8 requires a separate configuration/peer migration. |
| @babel/runtime | 7.28.3 | 7.29.14 | 7.29.14 | 7.29.14 / 8.1.2 | Retain the maintained/tested Babel 7 line; the available family patch is already selected. Babel 8 requires a separate configuration/peer migration. |
| @d11/react-native-fast-image | — | 8.13.0 | 8.13.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @dr.pogodin/react-native-fs | — | 2.40.4 | 2.40.4 | 2.41.0 / 2.41.0 | Retain 2.40.4: 2.41.0 changes the native binary data bridge and depends on RN 0.88 ArrayBuffer support; backup compatibility takes priority. |
| @klarna/react-native-vector-drawable | 0.5.1 | 0.5.1 | 0.5.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @native-html/iframe-plugin | 2.6.1 | 2.6.1 | 2.6.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @native-html/table-plugin | 5.3.1 | 5.3.1 | 5.3.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @react-native-async-storage/async-storage | 2.2.0 | 3.1.1 | 3.1.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @react-native-camera-roll/camera-roll | 7.10.2 | 7.10.2 | 7.10.2 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @react-native-community/cli | 15.0.1 | 20.2.0 | 20.2.0 | 20.2.0 / 21.0.0 | Retain RN 0.87-compatible CLI 20.2.0; 21 belongs to the next framework/tooling line. Remaining npm low findings trace to deepmerge with no published fix. |
| @react-native-community/cli-platform-android | 15.0.1 | 20.2.0 | 20.2.0 | 20.2.0 / 21.0.0 | Retain RN 0.87-compatible CLI 20.2.0; 21 belongs to the next framework/tooling line. Remaining npm low findings trace to deepmerge with no published fix. |
| @react-native-community/cli-platform-ios | 15.0.1 | 20.2.0 | 20.2.0 | 20.2.0 / 21.0.0 | Retain RN 0.87-compatible CLI 20.2.0; 21 belongs to the next framework/tooling line. Remaining npm low findings trace to deepmerge with no published fix. |
| @react-native-community/datetimepicker | 8.4.4 | 9.3.0 | 9.3.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @react-native-community/netinfo | 11.4.1 | 12.0.1 | 12.0.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @react-native-community/push-notification-ios | 1.11.0 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| @react-native-documents/picker | 10.1.5 | 12.0.3 | 12.0.3 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @react-native-firebase/analytics | 22.4.0 | 26.4.1 | 26.4.1 | 26.4.2 / 27.1.1 | Retain aligned 26.4.1. The 26.4.2 app patch changes the unused App Distribution Gradle plugin; major 27 changes Apple integration. Selected Apple SDK 12.19.3 already contains the reviewed trust-store fix. |
| @react-native-firebase/app | 22.4.0 | 26.4.1 | 26.4.1 | 26.4.2 / 27.1.1 | Retain aligned 26.4.1. The 26.4.2 app patch changes the unused App Distribution Gradle plugin; major 27 changes Apple integration. Selected Apple SDK 12.19.3 already contains the reviewed trust-store fix. |
| @react-native-firebase/crashlytics | 22.4.0 | 26.4.1 | 26.4.1 | 26.4.2 / 27.1.1 | Retain aligned 26.4.1. The 26.4.2 app patch changes the unused App Distribution Gradle plugin; major 27 changes Apple integration. Selected Apple SDK 12.19.3 already contains the reviewed trust-store fix. |
| @react-native-firebase/messaging | 22.4.0 | 26.4.1 | 26.4.1 | 26.4.2 / 27.1.1 | Retain aligned 26.4.1. The 26.4.2 app patch changes the unused App Distribution Gradle plugin; major 27 changes Apple integration. Selected Apple SDK 12.19.3 already contains the reviewed trust-store fix. |
| @react-native-google-signin/google-signin | 15.0.0 | 17.0.0 | 17.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @react-native-vector-icons/fontello | — | 14.0.0 | 14.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @react-native/babel-preset | 0.78.2 | 0.87.1 | 0.87.1 | 0.87.1 / 0.88.1 | Retain the current 0.87.1 framework/configuration line; no newer 0.87 patch is published. Avoid a separate RN 0.88 migration without a specific required fix. |
| @react-native/eslint-config | 0.78.2 | 0.87.1 | 0.87.1 | 0.87.1 / 0.88.1 | Retain the current 0.87.1 framework/configuration line; no newer 0.87 patch is published. Avoid a separate RN 0.88 migration without a specific required fix. |
| @react-native/jest-preset | — | 0.87.1 | 0.87.1 | 0.87.1 / 0.88.1 | Retain the current 0.87.1 framework/configuration line; no newer 0.87 patch is published. Avoid a separate RN 0.88 migration without a specific required fix. |
| @react-native/metro-config | 0.78.2 | 0.87.1 | 0.87.1 | 0.87.1 / 0.88.1 | Retain the current 0.87.1 framework/configuration line; no newer 0.87 patch is published. Avoid a separate RN 0.88 migration without a specific required fix. |
| @react-native/typescript-config | 0.78.2 | 0.87.1 | 0.87.1 | 0.87.1 / 0.88.1 | Retain the current 0.87.1 framework/configuration line; no newer 0.87 patch is published. Avoid a separate RN 0.88 migration without a specific required fix. |
| @react-navigation/bottom-tabs | 6.6.1 | 7.21.0 | 7.21.0 | 7.22.0 / 7.22.0 | New 7.x releases were inspected. Changes concern visual transitions, drawer placement and web/new tab options, not an identified security correction. Retain the tested navigation set pending focused gesture/modal/RTL device acceptance. |
| @react-navigation/drawer | 6.7.2 | 7.14.4 | 7.14.4 | 7.14.5 / 7.14.5 | New 7.x releases were inspected. Changes concern visual transitions, drawer placement and web/new tab options, not an identified security correction. Retain the tested navigation set pending focused gesture/modal/RTL device acceptance. |
| @react-navigation/native | 6.1.18 | 7.5.1 | 7.5.1 | 7.5.2 / 7.5.2 | New 7.x releases were inspected. Changes concern visual transitions, drawer placement and web/new tab options, not an identified security correction. Retain the tested navigation set pending focused gesture/modal/RTL device acceptance. |
| @react-navigation/stack | 6.4.1 | 7.12.1 | 7.12.1 | 7.12.2 / 7.12.2 | New 7.x releases were inspected. Changes concern visual transitions, drawer placement and web/new tab options, not an identified security correction. Retain the tested navigation set pending focused gesture/modal/RTL device acceptance. |
| @reduxjs/toolkit | 2.8.2 | 2.14.0 | 2.14.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @robinbobin/react-native-google-drive-api-wrapper | 2.2.4 | 2.2.6 | 2.2.6 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @sayem314/react-native-keep-awake | 1.3.1 | 2.0.0 | 2.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @shopify/react-native-skia | 2.2.4 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| @types/d3-scale | 4.0.9 | 4.0.9 | 4.0.9 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @types/d3-shape | 3.1.7 | 3.2.0 | 3.2.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @types/flexsearch | 0.7.6 | 0.7.6 | 0.7.6 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @types/jest | 29.5.14 | 29.5.14 | 29.5.14 | 29.5.14 / 30.0.0 | Retain current tested toolchain line. New major configuration/type/transform migrations do not address an identified higher-severity finding in this branch. |
| @types/luxon | 3.7.1 | 3.7.6 | 3.7.6 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @types/node | 24.3.0 | 24.3.0 | 24.3.0 | 24.19.2 / 26.6.6 | Retain tested 24.3.0 declarations; later declaration-only releases do not fix a runtime vulnerability here. |
| @types/react | 19.1.11 | 19.3.0 | 19.3.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @types/react-native-dotenv | 0.2.2 | 0.2.2 | 0.2.2 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @types/react-native-vector-icons | 6.4.18 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| @types/react-redux | 7.1.34 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| @types/react-test-renderer | 19.1.0 | 19.1.0 | 19.1.0 | 19.3.1 / 19.3.1 | Retain tested 19.1.0 declarations with the current renderer; no identified security correction in the newer typings. |
| @types/redux-logger | 3.0.13 | 3.0.13 | 3.0.13 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| @types/styled-components | 5.1.34 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| @types/styled-components-react-native | 5.2.5 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| @types/uuid | 10.0.0 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| axios | 1.18.1 | 1.21.1 | 1.21.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| babel-plugin-module-resolver | 5.0.2 | 5.0.3 | 5.0.3 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| babel-plugin-transform-remove-console | 6.9.4 | 6.9.4 | 6.9.4 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| d3-shape | 3.2.0 | 3.2.1 | 3.2.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| deprecated-react-native-prop-types | 5.0.0 | 5.0.0 | 5.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| eslint | 8.57.1 | 8.57.1 | 8.57.1 | 8.57.1 / 10.15.0 | Retain current tested toolchain line. New major configuration/type/transform migrations do not address an identified higher-severity finding in this branch. |
| i18next | 25.4.2 | 27.1.1 | 27.1.2 | 27.1.2 / 27.1.2 | Apply 27.1.2 cache-bound security hardening; preserve custom locale casing, offline resources, empty strings and configured fallbacks. The published issue primarily concerns server integrations; this app has no HTTP middleware. |
| intl | 1.2.5 | 1.2.5 | 1.2.5 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| intl-pluralrules | 2.0.1 | 2.0.1 | 2.0.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| jest | 29.7.0 | 29.7.0 | 29.7.0 | 29.7.0 / 30.5.2 | Retain current tested toolchain line. New major configuration/type/transform migrations do not address an identified higher-severity finding in this branch. |
| lottie-react-native | 6.7.2 | 7.5.0 | 7.5.1 | 7.5.1 / 7.5.1 | Apply 7.5.1: correct the iOS constantsToExport override type; animation API and lottie-ios 4.6.0 unchanged. |
| luxon | 3.7.1 | 3.7.2 | 3.7.2 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| minisearch | 7.1.2 | 7.2.0 | 7.2.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| moment | 2.30.1 | 2.31.0 | 2.31.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| patch-package | 8.0.1 | 8.0.1 | 8.0.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| prettier | 2.8.8 | 2.8.8 | 2.8.8 | 2.8.8 / 3.10.1 | Retain current tested toolchain line. New major configuration/type/transform migrations do not address an identified higher-severity finding in this branch. |
| react | 19.0.0 | 19.2.3 | 19.2.3 | 19.3.1 / 19.3.1 | Retain the tested RN 0.87 / React 19.2.3 renderer pairing. The 19.2.9 transport security fixes concern react-server-dom-* packages, absent from this lock. |
| react-i18next | 15.7.2 | 18.0.1 | 18.0.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native | 0.78.2 | 0.87.1 | 0.87.1 | 0.87.1 / 0.88.1 | Retain the current 0.87.1 framework/configuration line; no newer 0.87 patch is published. Avoid a separate RN 0.88 migration without a specific required fix. |
| react-native-actions-sheet | 0.9.7 | 11.0.0 | 11.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-aes-crypto | 3.2.1 | 3.3.0 | 3.3.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-app-intro-slider | 4.0.4 | 4.0.4 | 4.0.4 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-config | 1.5.5 | 1.7.2 | 1.7.2 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-dotenv | 3.4.11 | 3.4.12 | 3.4.12 | 3.4.12 / 5.0.0 | Retain 3.4.12: current 3.x patch is retained; major 5 changes require explicit multi-flavour environment regression proof. |
| react-native-error-boundary | 2.0.0 | 3.1.0 | 3.1.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-fast-image | 8.6.3 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| react-native-fbsdk-next | 13.4.1 | 13.4.3 | 13.4.3 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-fs | 2.20.0 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| react-native-gesture-handler | 2.28.0 | 2.33.1 | 2.33.1 | 2.33.1 / 3.5.0 | Retain maintained/tested 2.33.1; major 3 changes gesture integration and has no identified app-specific security fix needed here. |
| react-native-get-random-values | 1.11.0 | 2.1.0 | 2.1.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-image-crop-picker | 0.51.1 | 0.52.0 | 0.52.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-keyboard-aware-scroll-view | 0.9.5 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| react-native-keyboard-controller | — | 1.23.0 | 1.23.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-linear-gradient | 2.8.3 | 2.8.3 | 2.8.3 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-localize | 3.5.2 | 3.7.2 | 3.7.2 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-modal-datetime-picker | 18.0.0 | 18.0.0 | 18.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-notify-kit | — | 10.10.0 | 10.10.1 | 10.10.1 / 10.10.1 | Apply 10.10.1: main-thread Android permission requests and guarded iOS notification-delegate forwarding; current API/minimum OS retained. |
| react-native-orientation-locker | 1.7.0 | 1.7.0 | 1.7.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-outside-press | 1.2.2 | 1.2.2 | 1.2.2 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-permissions | 5.4.2 | 5.6.3 | 5.6.3 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-popup-menu | 0.18.0 | 0.19.0 | 0.19.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-progress-circle | 2.1.0 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| react-native-push-notification | 8.1.1 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| react-native-reanimated | 3.19.1 | 4.7.1 | 4.7.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-rename | 3.2.17 | 3.2.17 | 3.2.17 | 3.3.2 / 3.3.2 | Retain exact 3.2.17. The 3.3.2 trial introduced additional affected glob paths; no project rename is needed. |
| react-native-render-html | 6.3.4 | 6.3.4 | 6.3.4 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-restart | 0.0.27 | 0.0.29 | 0.0.29 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-safe-area-context | 5.6.1 | 5.11.1 | 5.11.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-scoped-storage | 1.9.5 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| react-native-screens | 4.15.2 | 4.30.1 | 4.30.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-share | 12.2.0 | 12.3.1 | 12.3.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-skia | — | 2.15.1 | 2.15.5 | 2.15.5 / 3.10.2 | Apply maintained 2.15.5 backports: native view IDs, Metal device ownership, temporary paint lifetimes, stable Canvas refs, pixel sizing and Android retained buffers. Retain Skia 2 / Ganesh and older devices. |
| react-native-svg | 15.12.1 | 15.16.1 | 15.16.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-svg-transformer | 1.5.3 | 1.5.3 | 1.5.3 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-timeline-flatlist | 0.8.0 | 1.0.1 | 1.0.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-tracking-transparency | 0.1.2 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| react-native-url-polyfill | 2.0.0 | 4.0.0 | 4.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-vector-icons | 10.3.0 | — | — | No separate family query needed / No newer tag reported | Removed or replaced by the original upgrade; retained neither as a second native module nor a stale direct dependency. |
| react-native-vector-image | 0.4.5 | 0.6.1 | 0.6.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-version-info | 1.1.1 | 1.1.1 | 1.1.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-video | 6.19.0 | 6.19.3 | 6.19.3 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-webview | 13.15.0 | 17.1.0 | 17.1.0 | 17.1.0 / 14.0.1 | Retain 17.1.0: current upstream 17.x release is verified even though the npm latest tag points to 14.0.1. Do not downgrade by tag alone. |
| react-native-worklets | — | 0.13.1 | 0.13.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-native-youtube-iframe | 2.4.1 | 2.4.1 | 2.4.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-redux | 9.2.0 | 9.3.1 | 9.3.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| react-test-renderer | 19.0.0 | 19.2.3 | 19.2.3 | 19.3.1 / 19.3.1 | Retain 19.2.3 with React; do not mix renderer minor versions merely because the registry publishes a newer line. |
| realm | 20.2.0 | 20.2.0 | 20.2.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| redux-logger | 3.0.6 | 3.0.6 | 3.0.6 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| redux-persist | 6.0.0 | 6.0.0 | 6.0.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| redux-saga | 1.3.0 | 1.5.1 | 1.5.1 | 1.6.0 / 1.6.0 | Retain 1.5.1: 1.6.0 adds a named middleware export; this app uses the working default export. |
| reselect | 5.1.1 | 5.3.0 | 5.3.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| styled-components | 6.1.19 | 6.6.0 | 6.6.0 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| typescript | 5.0.4 | 5.9.3 | 5.9.3 | 5.9.3 / 7.0.2 | Retain current tested toolchain line. New major configuration/type/transform migrations do not address an identified higher-severity finding in this branch. |
| uuid | 11.1.0 | 14.0.3 | 14.0.3 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |
| victory-native | 36.9.2 | 43.0.1 | 43.0.1 | No separate family query needed / No newer tag reported | Retain reviewed version; no additional security/stability update was identified by the current registry/audit comparison. |

## Main npm advisory comparison

| Package | Main severity | Main matched range | Current resolved versions | Current audit disposition |
| --- | --- | --- | --- | --- |
| @babel/core | low | <=7.29.0 | 7.29.13 | No current npm match |
| @babel/plugin-transform-modules-systemjs | high | 7.12.0 - 7.29.0 | 7.29.8 | No current npm match |
| @grpc/grpc-js | high | <=1.13.5 | 1.13.6 | No current npm match |
| @jest/core | low | >=25.2.0-alpha.86 | 29.7.0 | low |
| @react-native-community/cli | low | >=11.0.0-alpha.0 | 20.2.0 | low |
| @react-native-community/cli-config | low | >=11.0.0-alpha.0 | 20.2.0 | low |
| @react-native-community/cli-doctor | moderate | >=11.0.0-alpha.0 | 20.2.0 | low |
| @react-native-community/cli-platform-android | moderate | 12.0.0-alpha.0 - 15.1.0 | 20.2.0 | No current npm match |
| @react-native-community/cli-platform-apple | moderate | <=20.1.1 | 20.2.0 | No current npm match |
| @react-native-community/cli-platform-ios | moderate | 13.2.0 - 20.1.1 | 20.2.0 | No current npm match |
| @react-native/eslint-config | moderate | 0.74.84 - 0.82.0-rc.5 | 0.87.1 | No current npm match |
| @react-navigation/bottom-tabs | high | <=7.0.0-rc.37 | 7.21.0 | No current npm match |
| @react-navigation/core | high | <=7.22.0 \|\| 8.0.0-alpha.0 - 8.0.0-alpha.9 | 7.24.0 | No current npm match |
| @react-navigation/drawer | high | <=7.0.0-rc.34 | 7.14.4 | No current npm match |
| @react-navigation/elements | high | <=2.0.0-rc.26 | 2.9.45 | No current npm match |
| @react-navigation/native | high | <=3.0.0-alpha.12 \|\| 3.0.1 - 3.6.5 \|\| 4.0.0-alpha.0 - 6.1.18 | 7.5.1 | No current npm match |
| @react-navigation/stack | high | <=7.0.0-rc.29 | 7.12.1 | No current npm match |
| @svgr/plugin-svgo | low | >=5.5.0 | 8.1.0 | low |
| @typescript-eslint/eslint-plugin | moderate | 6.16.0 - 8.72.2 | 8.72.1 | No current npm match |
| @typescript-eslint/parser | moderate | 6.16.0 - 8.72.2 | 8.72.1 | No current npm match |
| @typescript-eslint/type-utils | moderate | 6.16.0 - 8.72.2 | 8.72.1 | No current npm match |
| @typescript-eslint/typescript-estree | moderate | 6.16.0 - 8.72.2 | 8.72.1 | No current npm match |
| @typescript-eslint/utils | moderate | 6.16.0 - 8.72.2 | 8.72.1 | No current npm match |
| axios | high | 1.0.0 - 1.19.0 | 1.21.1 | No current npm match |
| babel-plugin-module-resolver | moderate | >=5.0.1 | 5.0.3 | No current npm match |
| brace-expansion | high | 2.0.0 - 2.1.6 | 2.1.7 | No current npm match |
| browserslist | high | <=4.28.6 | 4.29.5 | No current npm match |
| compression | high | <1.8.2 | 1.8.2 | No current npm match |
| create-jest | low | >=29.7.0 | 29.7.0 | low |
| decode-uri-component | high | <=0.5.0 | Removed | No current npm match |
| deepmerge | low | >=4.2.0 | 4.3.1 | low |
| fast-xml-parser | moderate | <=5.11.2 | 5.12.0 | No current npm match |
| follow-redirects | high | 1.16.0 - 1.16.1 | 1.16.2 | No current npm match |
| form-data | high | 4.0.0 - 4.0.5 | 4.0.6 | No current npm match |
| glob | moderate | 9.0.0 - 14.0.1 | 14.0.2, 7.2.3, 8.1.0 | No current npm match |
| image-size | high | 0.6.3 - 2.0.2 | Removed | No current npm match |
| jest | low | >=25.2.0-alpha.86 | 29.7.0 | low |
| jest-cli | low | >=25.2.0-alpha.86 | 29.7.0 | low |
| jest-config | low | >=25.2.0-alpha.86 | 29.7.0 | low |
| joi | high | <=17.13.8 | 17.13.9 | No current npm match |
| js-yaml | high | 4.0.0 - 4.3.1 | 4.3.2 | No current npm match |
| minimatch | high | <=3.1.3 \|\| 5.0.0 - 5.1.7 \|\| 7.0.0 - 11.0.0 | 11.0.1, 3.1.5, 5.1.9 | No current npm match |
| moment | moderate | 2.29.2 - 2.30.1 | 2.31.0 | No current npm match |
| nanoid | high | <=3.3.17 | 3.3.20 | No current npm match |
| node-forge | high | <=1.4.2 | Removed | No current npm match |
| postcss | high | <=8.5.22 | Removed | No current npm match |
| protobufjs | moderate | 7.5.0 - 7.6.4 | 7.6.5 | No current npm match |
| query-string | high | 5.0.0 - 9.4.1 | Removed | No current npm match |
| react-native-svg-transformer | low | >=0.20.0 | 1.5.3 | low |
| shell-quote | critical | <=1.10.0 | 1.11.0 | No current npm match |
| source-map-js | high | 1.0.0 - 1.2.1 | 1.2.2 | No current npm match |
| styled-components | moderate | 6.1.3 - 6.4.0-prerelease.14 | 6.6.0 | No current npm match |
| svgo | high | 3.0.0 - 3.3.4 | 3.3.5 | No current npm match |
| tmp | high | <0.2.6 | 0.2.7 | No current npm match |
| undici | high | 7.0.0 - 7.30.0 | 7.30.2 | No current npm match |
| uuid | moderate | <11.1.1 | 14.0.3 | No current npm match |
| ws | high | 6.0.0 - 6.2.3 \|\| 7.0.0 - 7.5.10 | 6.2.6, 7.5.13 | No current npm match |

## Native and build tooling decisions

| Input | Main / older reviewed input | Current decision |
| --- | --- | --- |
| Gradle | Main 8.12; review previously 9.8.1 | 9.9.1, official distribution SHA256 d8a18a7a841dd5df825d35a685fad6f2d7f12ac0c280e57b67c27b4a520ba228; wrapper JAR SHA256 621008afc4f5d59357fcf06ffa644dd5aade5e091bdc363742710445f73cdaf8 |
| Application Kotlin | Main 2.0.21; original PR 2.2.10 | 2.4.21 with explicit root classpath selection and resolved-version CI gate; AsyncStorage KSP override 2.3.14 preserves legacy Room processing |
| Android platform / AGP / NDK | Main SDK 35 / implicit AGP / NDK 27.0 | Retain reviewed SDK 37, AGP 9.2.1 and NDK 27.1.12297006 |
| Gson / Guava | Earlier Android runtime advisory matches | Retain reviewed constraints 2.13.2 / 33.7.2-android; refresh exact resolved runtime/selected-KGP checks in CI |
| CocoaPods / xcodeproj | Main has no committed Gemfile.lock or Podfile.lock | Retain 1.16.2 / 1.27.0. New CocoaPods 1.17 still constrains Active Support below 8, so it does not fix the deferred advisory |
| Active Support | Locked 7.2.4; one Ruby advisory remains | Fixed versions require 8.x, excluded by compatible CocoaPods/Core. Retain documented build-only deferral; no exposed Action Cable server is present |
| concurrent-ruby | Older reviewed 1.3.3 | Retain patched/latest 1.3.8. Fresh exact query of 45 gems leaves only the Active Support advisory |
| CocoaPods central/binary coverage | No exact main pod graph available | OSV rejects the CocoaPods ecosystem request (HTTP 400); no clean Apple advisory scan is claimed. Locked versions, native compilation and first-party SDK release checks do not constitute full C/C++/Apple binary coverage |
| GitHub Actions | Seven external actions reviewed | Upgrade setup-java to pinned v6.3.0; six other selected immutable refs match current release/branch metadata |
| React / framework | RN 0.87.1 and React 19.2.3 already selected | Retain. 19.2.9 RSC transport fixes target absent react-server-dom-* packages; no RN 0.88 framework migration is needed for the identified fixes |
| Skia / filesystem | Skia 2.15.1 / FS 2.40.4 | Apply maintained Skia 2.15.5; reject FS 2.41.0’s RN 0.88 binary-bridge change |
| Firebase | Aligned 26.4.1 / Apple SDK 12.19.3 | Retain reviewed CocoaPods integration and trust-store fix. No Firestore or App Distribution feature is added |

## Verification and remaining limits

Local full suite: 562 Jest tests / 75 suites, 38 Node tooling tests, 34 Python checks, strict TypeScript and 96 vector resources pass. Full ESLint has zero errors and 2,053 existing warnings. The actual inventory init script also passes an isolated composite-build regression that fails against its previous unguarded version. The Gradle catalog control succeeds on 9.9.1 and invalid input is rejected; the invalid-value regression fails against 9.8.1. The i18next cache regression fails against 27.1.1 and both cache/offline-locale tests pass on 27.1.2. macOS regenerates all three changed pod entries and preserves the lock on a second deployment-mode installation.

The final 37-job matrix must validate the published source: 20 unsigned native jobs, 16 release JS bundles and unit checks, including the new catalog, Maven and Android permission-thread gates. The temporary lock-resolution workflow and its temporary app-check skip conditions are removed/restored respectively before publication. A lock-generation run is not an app/native release sign-off. The consolidated document records the observed final CI result after completion.

Physical GPU/chart, RTL/large-text/accessibility, signed installed-app upgrades, actual historical/provider backup flows, production endpoints/ATS and live analytics/symbol delivery remain distinct acceptance. Console access is restored for bounded Crashlytics inspection, but the linked Rerai Analytics property denies DebugView access. No tracking configuration, production app registration or issue state was changed.

## Primary sources

- https://docs.gradle.org/9.9.1/release-notes.html
- https://github.com/gradle/gradle/security/advisories/GHSA-3cfg-jpcr-gfp3
- https://github.com/gradle/gradle/security/advisories/GHSA-gqrr-4j89-5267
- https://github.com/gradle/gradle/security/advisories/GHSA-pcp8-98xm-c6pr
- https://github.com/gradle/gradle-distributions/releases/tag/v9.9.1
- https://github.com/advisories/GHSA-r937-wjx7-w2jp
- https://kotlinlang.org/docs/gradle-configure-project.html
- https://developer.android.com/build/kotlin-support
- https://developer.android.com/build/releases/agp-9-0-0-release-notes
- https://kotlinlang.org/docs/ksp-overview.html
- https://github.com/google/ksp/releases/tag/2.3.14
- https://github.com/i18next/i18next/releases/tag/v27.1.2
- https://github.com/marcocrupi/react-native-notify-kit/releases/tag/v10.10.1
- https://github.com/lottie-react-native/lottie-react-native/releases/tag/v7.5.1
- https://github.com/wcandillon/react-native-skia/releases/tag/v2.15.2
- https://github.com/wcandillon/react-native-skia/releases/tag/v2.15.5
- https://wcandillon.github.io/react-native-skia/docs/getting-started/migration/
- https://github.com/actions/setup-java/releases/tag/v6.3.0
- https://github.com/birdofpreyru/react-native-fs/releases/tag/v2.41.0
- https://rubygems.org/api/v2/rubygems/cocoapods-core/versions/1.17.0.json
- https://github.com/react/react/security/advisories/GHSA-xqc2-xf4c-x3h3
