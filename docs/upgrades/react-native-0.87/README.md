# React Native 0.87 migration

See [review fixes and release acceptance gates](review-fixes.md) for the follow-up to PR #1115.

This branch targets React Native 0.87.1 with React 19.2.3, AGP 9.2.1,
Gradle 9.4.1, Kotlin 2.2.10, and Android compile/target SDK 37.
RN 0.88 is also a stable release; 0.87 was selected to reduce the jump to
the newest release while migrating the app's older native dependencies.

## Local tools

Use Node 22 (minimum 22.13) and JDK 17. The previous Node 21 installation
does not meet RN's requirements. With nvm installed:

```sh
nvm install
nvm use
npm ci --legacy-peer-deps
```

Run `npm run assets:generate` after changing SVG sources; `npm run assets:check` verifies all flavours.

Install Android SDK Platform 37, Build Tools 37.0.0, and NDK
27.1.12297006 through Android Studio. Some dependencies may also request
AGP's default NDK 28.2.13676358.

For Android Bebbo compilation, from the repository root:

```sh
cd android
ENVFILE=env/.env.bebbo FLAVOR=bebbo ./gradlew :app:assembleProdDebug
```

Android now selects an explicit Node executable for bundling, preferring the
Homebrew Node 22 installation on macOS to avoid Gradle resolving the old Node
binary. Other installations can set `NODE_BINARY` to an absolute executable
path or pass `-PnodeBinary=/absolute/path/to/node` to Gradle. The command-line
tools and Metro still need Node 22 on the terminal's `PATH`.

For iOS, run `bundle install` from the repository root after npm install, then
`ENVFILE=env/.env.bebbo FLAVOR=bebbo bundle exec pod install` from `ios`.
The CLI also invokes CocoaPods through Bundler. Gemfile pins CocoaPods 1.16.2
and xcodeproj 1.27.0 so it can read synchronized Xcode groups; a newer global
`pod` executable alone does not update the CLI's bundled version. The `nkf` gem
provides `kconv`, required by CFPropertyList under Ruby 3.4.
If migrating an existing Pods lock that pins Lottie 4.4.1, first run
`FLAVOR=bebbo bundle exec pod update lottie-ios --no-repo-update` in `ios`.
The checked-in `ios/.xcode.env` selects Homebrew Node 22 on Apple Silicon or
Intel Macs, falling back to Node on PATH. The checked-in `.xcode.env.local`
inherits this setting; do not restore its old `/usr/local/bin/node` override.
That executable was Node 21 on this machine and caused Metro's `styleText`
format-array error during the Xcode Release bundle phase, even though the
terminal already used Node 22.

## Compatibility changes

- RN uses the modern ReactHost application entry point. The custom
  ExactAlarmPackage remains registered. All iOS flavour plists explicitly
  enable the new architecture, including plists with custom filenames that
  RN's CocoaPods script does not discover.
- Reanimated 4 and Worklets replace Reanimated 3; Babel uses the Worklets
  plugin. Skia, screens, gesture handler, Lottie and affected picker/image
  libraries were aligned with the newer RN APIs.
- Navigation 7 avoids accessing the removed InteractionManager API.
  App deferred work uses cancellable idle callbacks. Idle callbacks do
  not provide the old guarantee of waiting for all interactions to end.
- Home remains mounted when changing bottom tabs. Tools and drawer screens
  retain their previous unmount-on-blur behavior through guards based on the
  selected route in their own navigator, not inherited focus. Covering the
  dashboard with a root detail/form screen must not unmount its children.
  Nested child navigation compatibility is enabled on NavigationContainer.
- Details returns explicitly pop to the existing root route and address its
  nested drawer/tab/tool destination, merging params at each level. Existing
  category, selected-child, back-click and favourites-tab params are preserved,
  including returns through stacked related articles. Details and Development
  register Android back handlers only while focused and use current params.
- Metro uses the supported blockList option without private config imports.
- Android run scripts use CLI's `--mode` argument.
- Redux Saga is updated to 1.5.1. The 1.3 import-condition wrapper produced
  an undefined default export with Metro, crashing at createSagaMiddleware
  before the app mounted.
- Android bundle tasks also track package manifests, the lockfile, Metro/Babel
  configuration, environment files and the selected flavour. RN excludes
  node_modules from its source inputs; without these inputs an older Saga 1.3
  release bundle survived the dependency update and reproduced the startup crash.
- Height/weight Save actions use `pop: true` alongside `merge: true` to return
  to the existing form under Navigation 7. Otherwise navigating to the previous
  route creates another form instance and loses its unsaved local state.
- ProGuard explicitly keeps Firebase ComponentRegistrar no-argument constructors.
  Release logs showed NoSuchMethodException during reflective registrar discovery,
  followed by "FirebaseCrashlytics component is not present" on the first
  post-onboarding Crashlytics log call. After the keep rule and release rebuild,
  the constructor is retained in the mapping and Firebase/Crashlytics initialization
  succeeds on the emulator. The complete onboarding-to-Home flow still requires
  device verification; the checked emulator was at country/language confirmation.
- Development information articles return through the shared popTo helper to
  the existing Development tab, preserving the original screen and its selected
  child parameters. Child save/delete and content-refresh completion paths also
  pop to the existing Manage Profile screen instead of pushing a duplicate.
  An earlier article-opening crash reported Fabric addViewAt/index=2 count=0.
  The original intermittent crash was not reliably reproduced. The overly broad
  blur guards and broken back action were corrected, then the release APK was
  rebuilt and installed. Three open/back cycles on the 19–24 months information
  article, including scrolling and hardware/header back, kept the same process
  alive and generated no new crash. This does not establish that the navigation
  regression was the sole cause of the earlier Fabric crash.
- AGP's old Kotlin plugin and DSL compatibility switches are retained, as
  in the RN template, while older native modules are being migrated.

## Package patches

The RN 0.78.2 and Lottie 6.7.2 patches are retained in `retired-patches/`
for reference, outside patch-package's active directory. They cannot be
applied to the new package versions. The old RN patch changed iOS Switch
behavior and must be checked on iOS 26 during device testing.

Active patches preserve the previous application fixes and additionally:

- Import the public AssetRegistry API in vector-image. Its generator uses
  Metro's exported `private/` entry points (with Server's default export),
  RN's current asset-registry entry point, and disables watching for its
  one-shot generation process. RGBA colours are converted to Android ARGB order
  so regenerated drawable colours retain their intended transparency.
- Use the optimizing default ProGuard configuration in splash/notifications.
- Replace JCenter declarations in notifications and scoped storage.
- Access currentActivity through ReactApplicationContext in splash and the
  document picker's remaining affected Kotlin call.
- Use ReactHost in the push library's token refresh, incoming-message and
  notification-action handlers. Android crash logs confirmed that the old
  getReactNativeHost call threw during Firebase onNewToken, closing the app
  during startup. The patched Android debug APK compiles successfully;
  token refresh and notification delivery still need device testing.

## Verification and device testing

Run `npm test -- --runInBand --watchman=false` for the regression tests.

Checks performed on this branch:

- npm install with `--legacy-peer-deps`: passed; all seven patches apply.
- `npm ls --depth=0`: passed.
- Jest: 62 tests passed across deferred work/cancellation, measurement returns,
  Details/Manage Profile return destinations and route preservation, Drive sign-in,
  backup/restore compatibility and failure handling, and tab/drawer lifecycles. The lifecycle integration tests verify that a covering root route
  preserves mounted children while switching sibling routes unmounts guarded
  children. The latest navigation return changes still need native rebuild and
  emulator verification; the requested release build was not approved.
- A Metro-bundled Redux Saga runtime check initialized the middleware,
  started a watcher, and dispatched its resulting effect successfully.
- Bebbo Android and iOS production JS bundles: passed.
- Foleja Android production JS bundle: passed.
- Bebbo vector-image generator: passed using Node 22; generated 66 files
  in temporary iOS/Android output directories without replacing app assets.
- Bebbo `assembleProdDebug`: passed for all four configured ABIs.
- Android debug APK: target SDK 37 confirmed; 16 KB ZIP alignment check passed.
  ZIP alignment alone does not verify every native library's ELF alignment.
- Bebbo iOS Simulator Debug build: passed for arm64 and x86_64, without signing.
- Bebbo `minifyProdReleaseWithR8`: passed. This is not a full release APK build.
- After fixing stale bundle inputs, Bebbo `assembleProdRelease` passed with
  Crashlytics mapping upload excluded. The release source map contains the
  new Saga entry and no old import-condition wrapper. Installing over the
  emulator's existing app and cold launching reached country/language
  confirmation, remained running, and produced no new crash-buffer entry.
- Full TypeScript check: still fails with app-wide errors (including Realm,
  route parameters, date values and theme declarations). These require a
  separate review; this migration does not claim a clean TypeScript baseline.

The machine's global Node installation was not replaced; validation used a
checksum-verified Node 22.23.4 downloaded under `/tmp`. Gradle 9.4.1 was also
checksum-verified and run directly after the initial wrapper download timed out.
Use the tools above to reproduce the build through the checked-in wrapper.
Successful compilation does not establish native/runtime compatibility.

Exercise onboarding, manage profiles, language changes/restart, all tabs and
drawer routes, chart taps, animations, images, camera/gallery, date/document
pickers, notifications/exact alarms, Realm data persistence, and backup/restore.
Check both an upgrade over an existing installation and a fresh install.
Repeat native builds for the other flavours and a release build with R8.

RTL and a full security-alert cleanup remain separate follow-up work. The
Android Drive authorization migration is described below; iOS retains its
existing Google Sign-In integration.

## Smaller dependency updates

The following approved updates are pinned in `package.json` and
`package-lock.json`. No application API changes, translation changes, or new
patches were needed. Firebase and the other deferred upgrades are unchanged.

| Package | Previous installed version | Updated version | Focused manual check |
| --- | --- | --- | --- |
| react-native-fbsdk-next | 13.4.1 | 13.4.3 | Confirm Meta events and iOS tracking permission allow/deny. |
| react-native-video | 6.19.0 | 6.19.3 | Open a directly hosted video article; play, pause, seek, fullscreen and return. |
| luxon | 3.7.1 | 3.7.2 | Check child ages, growth dates and vaccination/reminder dates and times. |
| minisearch | 7.1.2 | 7.2.0 | Search articles and activities using full/partial words and a non-English language; clear search. |
| react-native-localize | 3.5.2 | 3.7.2 | Check initial language suggestion and that a saved app language survives device-language changes. |
| react-native-permissions | 5.4.2 | 5.6.3 | Try camera/gallery with allowed, denied and iOS limited-photo access. |
| react-native-share | 12.2.0 | 12.3.1 | Export a backup to Files, cancel and retry sharing, then import the exported file. |

`npm ci --legacy-peer-deps` completed with all seven existing patches
applied. The seven existing regression suites passed (62 tests). CocoaPods
installed successfully and refreshed the five affected native package versions
in the local, Git-ignored `ios/Podfile.lock`. No new test files were added.
Bebbo Android `assembleProdRelease` passed for all configured architectures,
including R8, with Crashlytics mapping upload excluded. The iOS Simulator
Release build also passed. Android validation used a temporary Gradle init
script to select Node 22 explicitly after Gradle resolved the old Node binary;
no project build settings were changed for this validation.
The checks above still require device verification; compilation and regression
tests do not exercise those native interactions.

Release notes reviewed before selecting these versions:

- https://github.com/thebergamo/react-native-fbsdk-next/releases
- https://github.com/TheWidlarzGroup/react-native-video/releases
- https://github.com/moment/luxon/blob/master/CHANGELOG.md
- https://github.com/lucaong/minisearch/blob/master/CHANGELOG.md
- https://github.com/zoontek/react-native-localize/releases
- https://github.com/zoontek/react-native-permissions/releases
- https://github.com/react-native-share/react-native-share/releases

## Redux dependency updates

Updated `@reduxjs/toolkit` from 2.8.2 to 2.14.0, `react-redux` from 9.2.0
to 9.3.1, and `reselect` from 5.1.1 to 5.3.0. The versions are pinned in
`package.json` and resolved in `package-lock.json`. Removed the redundant
`@types/react-redux` dependency because React Redux includes its own types.
Toolkit now resolves Immer 11.2.9. No store, reducer, selector, hook, persistence
schema, native configuration, or patch changes were required.

Validation: `npm ci --legacy-peer-deps` completed and all seven active
patches applied. All 62 existing tests passed. A temporary validation script
outside the repository exercised the app's actual store, slices and selectors,
including child switching, favourites, Daily Reads state, selector memoization,
Redux Saga dispatch, persistence/rehydration and React Redux Provider/hook
updates. That script substituted in-memory storage for native Realm storage,
an isolated Saga watcher for API effects, and a locale helper for native
utilities; it does not establish native database or network compatibility.
No new test files were added to the repository. Android Release JS/Hermes
bundling passed. Native builds and simulator interactions were not repeated
for this JavaScript-only update.
The full TypeScript check still fails with the same diagnostics as the saved
pre-update review log; no diagnostic lines were added or removed.

For manual verification, switch/add/edit children, add/remove favourites,
check Daily Reads and content loading, change language, then restart the app
and confirm saved state returns.

Release notes:

- https://github.com/reduxjs/redux-toolkit/releases/tag/v2.14.0
- https://github.com/reduxjs/react-redux/releases/tag/v9.3.1
- https://github.com/reduxjs/reselect/releases/tag/v5.3.0

## Config and Google Drive wrapper updates

Pinned `react-native-config` 1.7.2 (previously 1.5.5) and
`@robinbobin/react-native-google-drive-api-wrapper` 2.2.6 (previously installed
2.2.4). The lockfile also updates the wrapper's MIME constants to 2.0.3 and
Radashi to 12.9.8. No application-source or patch changes were required.
The existing Drive 60-second timeout and omitted first-page `pageToken` remain
in place. Google authentication, scopes, encryption, backup names and data
formats were not changed by this update.

Installation used `npm ci --legacy-peer-deps`; all seven existing patches
applied, and all 62 existing tests passed. CocoaPods installed 159 pods and
refreshed the local Git-ignored `ios/Podfile.lock` for Config's native update.
An isolated script exercised the installed Drive wrapper with simulated HTTP
responses, verifying MIME constants, list URL construction, pagination, folder
creation, multipart upload payload/authorization headers and deletion. It did
not access a Google account. Config's iOS environment reader selected the
requested Bebbo and Foleja environment files correctly, without printing values.
These checks used temporary scripts outside the repository; no test files were
added.

The Bebbo Android `assembleProdRelease` build passed for all configured
architectures, including R8, with Crashlytics mapping upload excluded. The iOS
Simulator Release build passed for arm64 and x86_64. Both rebuilt apps were
installed over their existing emulator/simulator installations, preserving
data, and launched successfully. A successful live Drive backup/restore still
requires manual verification with a Google account; simulated HTTP checks do
not establish that end-to-end result. Device/archive builds and native builds
of the other flavours were not run in this batch.

Manual verification after installing the rebuilt apps:

- Check the correct flavour opens and content loads from its expected environment.
- From Home and Settings, back up to Drive, then repeat to replace a backup.
- Restore an existing backup and verify children, measurements and reminders.
- Cancel Google sign-in and retry; check offline/error handling and that loading
  clears. Existing local file export/import should also be checked.
- Repeat on Android and iOS, including an additional flavour before release.

## Native Android Drive authorization

Android uses Google's `AuthorizationClient` through the app's own TurboModule,
with an Android-only Codegen specification in `app/specs`. The package config
generates `NativeDriveAuthorizationSpec`; `DriveAuthorizationPackage` registers
the implementation with the existing ReactHost. Google Play services Auth is
explicitly set to 22.0.0. The public Google Sign-In package is excluded from
Android autolinking because SDK 22 removes its legacy GoogleSignIn APIs; the
package remains installed/autolinked for iOS. JavaScript loads its iOS API only
on iOS. The Android confirmation button uses the existing translated Google
Drive label and icon, while iOS keeps the original Google sign-in button.

The system account picker runs on the first authorization. After successful
Drive consent, only the chosen account name is stored in app-private
preferences, pinning subsequent requests to that account. Tokens are never
persisted by this app. Existing OAuth projects, signing configuration, Drive
scopes (`drive.file` and `drive.appfolder`), encryption, folder names, file
formats and backup/restore operations remain unchanged. Google's equivalent
`drive.appdata` scope response is accepted. A first migration attempt may ask
the user to select the same account previously used for backups.

`googleAuth.ensureSignedIn()` retains the backup service's interface. It now
authorizes Drive on Android. Per-request token acquisition is noninteractive:
if fresh consent is required, the current operation fails safely and the user
can retry from Home, Settings or import. Account/consent cancellation resolves
without a token, partial permissions are rejected, concurrent requests are
blocked/joined, and pending requests are released on host/module destruction.
The native Google authorization network request has a 60-second timeout; the
timer is stopped before displaying Google's consent UI. Limited native logs
report completion/failure/status codes without account names or tokens.
Android sign-out clears the last token from Google's cache and forgets the
selected account without revoking permissions or deleting Drive data.

Drive HTTP 401 errors clear the rejected cached token for a future attempt.
Uploads are not automatically retried. No tokens, account names, encryption
keys or backup contents are logged by the new authorization module. Existing
translated error messages are reused.

The existing authentication, Drive and backup suites cover Android routing,
unchanged iOS sign-in, cancellation/retry, empty tokens, concurrent requests,
noninteractive token renewal, revoked authorization, rejected tokens and no
Drive writes after failed authorization (73 tests across seven suites).
These tests simulate the native Google response; live checks are listed separately.

Bebbo Android Release passed with R8 (Crashlytics mapping upload excluded),
and the final iOS Simulator Release build passed. Both were installed over
existing emulator/simulator apps and launched without clearing data. APK
inspection confirmed the native DriveAuthorization module is present and
RNGoogleSigninModule is absent on Android. The emulator showed the system
account picker; cancellation returned to the app and a subsequent attempt
opened the picker again. A live Home backup using the emulator's Google account
completed and displayed "Data backed up successfully." A second Home backup
also succeeded using the remembered account. The full TypeScript check remains blocked by existing
app-wide errors; none were reported in the changed authentication/service/UI
files. Restore compatibility and per-flavour signing
checks remain manual acceptance items below.

Manual acceptance checks on a device/emulator with Google Play services:

- Install over the previous app; select its existing Google account and restore
  a backup created before migration. Verify children, measurements and reminders.
- Back up from Home and Settings, repeat to replace it, then restore the result.
- Cancel the account picker and consent separately, retry, and confirm loading
  clears without an upload or removal of the previous backup.
- Deny some/all requested scopes; verify no Drive writes and retry after consent.
- Restart and repeat; remove/revoke the chosen Google account; verify safe failure
  and account selection on a later attempt. Check offline and expired-token cases.
- Verify both debug and release OAuth signing registrations and each flavour.
- Repeat iOS backup/restore to confirm its existing integration is unaffected.

This integration avoids a paid wrapper but still requires maintenance when
Google, Android or React Native APIs change. It does not certify DPG compliance.

References:

- https://developer.android.com/identity/authorization
- https://developers.google.com/android/reference/com/google/android/gms/auth/api/identity/AuthorizationClient
- https://developers.google.com/workspace/drive/api/guides/api-specific-auth

## Drawer width after the navigation upgrade

`HomeDrawerNavigator.tsx` explicitly retains React Navigation 6's responsive
drawer sizing: a 280dp maximum on phones and 320dp on tablets, bounded by the
smaller screen dimension minus the platform app-bar height. Window dimensions
are read with a hook so rotation and resizing recalculate the width. The newer
drawer-layout default allows up to 360dp, which made the menu visibly wider.
This shared navigator applies the correction to every flavour.
The Android Release build passed and was installed over the existing emulator
app without clearing data; the narrower drawer was checked visually. Navigator
transpilation and phone/tablet/rotation width calculations also passed. Other
screens have not undergone a complete visual regression pass.

The Bebbo/Rerai Umntwana screenshot comparison also includes pre-existing
typography differences: Bebbo's Heading3 uses 25dp line height and 2dp padding,
while Rerai Umntwana uses 20dp without that padding; Heading5 uses 18dp versus
16dp. Those existing flavour styles have not been changed. There is only one
drawer navigator in the app; the same drawer width correction therefore covers
Home, Notifications, Settings, Favourites, User Guide and the other drawer routes.

## Firebase 26.4.1

All four React Native Firebase packages (App, Analytics, Crashlytics and
Messaging) are pinned together to 26.4.1, replacing installed 22.4.0. The
Android Google Services and Crashlytics Gradle plugins follow this release's
SDK metadata: 4.5.0 and 3.0.8 respectively. Existing SDK 37 and Google Drive's
explicit Play services Auth 22 dependency are retained.

`firebaseAnalytics.ts` centralizes modular Crashlytics breadcrumbs and errors;
`AppNavigation.tsx` no longer uses the removed namespaced Crashlytics API.
Analytics user properties omit undefined values while retaining explicit null
values that clear a property. Event names and parameters are unchanged. The
unused namespaced analytics helper was removed from `EventSyncService.ts`;
the existing online/offline event paths still use `logAnalyticsEvent`.

The no-op background message handler now registers once in `index.js`, before
mounting navigation, including headless launches. The navigation notification
effect unsubscribes foreground/open listeners, cancels deferred redirects and
ignores late initial-notification results after cleanup. Notification payload
routing and the onboarding gate are retained.

`ios/Podfile` explicitly sets `$RNFirebaseDisableSPM = true`: Firebase 26
otherwise chooses SPM on this RN version, which conflicts with the existing
static framework configuration. CocoaPods is retained, with the SDK 12.19
compatible pod requirement supplied by 26.4.1. Native Firebase products can
have different patch numbers because Apple publishes patches per pod.

One consolidated `firebase.test.ts` covers event forwarding, undefined/null
properties, modular Crashlytics calls and telemetry error containment. The
service suite passes 77 tests across eight suites. Full TypeScript validation
still reports app-wide errors; the Firebase service/test changes type-check.

Android Release passed including R8 (Crashlytics mapping upload excluded).
It was installed over the existing emulator app, reached Home, and the recent
AndroidRuntime/ReactNativeJS error log contained no startup errors.
iOS Simulator Release passed using CocoaPods and the updated SDK 12.19 pods;
the app was installed without clearing data and reached Home. CocoaPods
regenerated the Firebase Core/Crashlytics build scripts in the Xcode project.
An independent visual issue was observed on iOS: custom icons render as missing
glyphs because fontello.ttf is absent from the app bundle. The committed Xcode
project already lacks this font resource reference; the Firebase changes do
not add/remove font resources. This is addressed by the later Fontello migration below.
Manual acceptance must include Analytics DebugView, an intentional nonfatal
Crashlytics report, offline event synchronization, and push receipt/opening in
foreground/background/closed states. Real iOS APNs delivery requires a physical
device; simulator startup does not establish push delivery. Repeat relevant
checks for every flavour and both permission-granted/denied states.

References:

- https://rnfirebase.io/migrating-to-v26
- https://github.com/invertase/react-native-firebase/blob/v26.4.1/packages/app/CHANGELOG.md
- https://github.com/invertase/react-native-firebase/blob/v26.4.1/packages/app/package.json

## WebView 17.1.0

`react-native-webview` is pinned to 17.1.0, replacing installed 13.15.0.
`react-native-youtube-iframe` stays at 2.4.1. Its WebView message handler,
injected JavaScript/ref commands and the app's inline/fullscreen video props
remain available in the upgraded package. The HTML iframe plugin's WebView
integration was also reviewed. No application component API changes or native
compatibility patches were required at this stage.

The app already meets the intervening major-release platform requirements:
Android API 24+, New Architecture and React Native 0.80+. WebView's iOS minimum
is 15.1. The existing SDK targets/deployment configuration are retained.
CocoaPods resolved the 17.1.0 pod. TypeScript diagnostics match the pre-update
baseline; existing VideoPlayer/DetailsScreen errors are not introduced by this
dependency update.

Manual acceptance must cover YouTube and Vimeo loading/play/pause, inline and
fullscreen playback, fullscreen exit/back navigation, rotation, offline/retry,
and embedded HTML/iframes in Details, About, Terms and Privacy on Android and
iOS. Also check multiple videos/WebViews because the 17.0.x Android fixes
address prop isolation and the timing of JavaScript messaging setup.

Bebbo Android Release passed including R8 (Crashlytics mapping upload excluded),
and iOS Simulator Release passed. Application component files and native
compatibility patches were not changed for this update.
Both builds were installed over the existing apps and reached normal screens.
On Android, opening the Child Development information article loaded a native
WebView/YouTube embed and successfully played the video. Back navigation to
Child Development was checked, with no recent AndroidRuntime/ReactNativeJS
errors. Fullscreen/rotation, Vimeo, other embedded pages and iOS video playback
remain manual acceptance checks; iOS startup alone does not verify playback.

Reference: https://github.com/react-native-webview/react-native-webview/releases

## Android HTML GIF images

The "4 weeks pregnant" illustration uses
`https://bebbo.app/sites/default/files/2025-10/pregnancy-week-4-rev.gif`.
The reported failure predates this upgrade and affects Android; iOS displays
the image. Online HTML images use react-native-render-html's native RN Image
renderer, rather than WebView. Its blank bordered box with italic alt text is
the image-error fallback.

`android/app/build.gradle` adds `com.facebook.fresco:animated-gif:3.7.0`, matching
RN 0.87.1's Fresco version in `react-native/gradle/libs.versions.toml`. Android
GIF decoding is optional and was previously absent from the app dependencies.
This shared dependency applies to all Android flavours. No iOS or HTML
renderer changes are included. Temporary diagnostic logging was removed.

The decoder alone did not resolve the article. The supplied API object for
article 64961 revealed a second issue: its body references an HTTP Drupal
image-style URL, while the configured CMS uses HTTPS. Release Android blocks
that HTTP request. `Utils.ts` now upgrades image src URLs on the same CMS host
to HTTPS when the CMS is configured for HTTPS. Paths and query tokens are
preserved; external HTTP URLs and local/data image sources are not rewritten.
Relative and protocol-relative image URLs resolve against the CMS base URL.
The normalization is applied when rendering, without altering saved CMS data.

The Release build with the decoder passed; APK inspection found libgifimage.so
for all four configured ABIs. Sixteen focused checks against the actual HTML
utility passed, including the supplied URL, query-token preservation, relative
URLs, unrelated hosts, data/file/content/blob sources and HTTP development CMS
configuration. The final Android Release build passed, was installed without
clearing data, and article 64961 was opened directly. Its pregnancy illustration
rendered visibly on the emulator after the HTTPS correction. Animation timing
was not separately measured. The existing Utils.ts type diagnostic is unchanged
from the pre-fix baseline. A Metro reload does not install native codecs.

Reference: https://reactnative.dev/docs/image#gif-and-webp-support-on-android

## NetInfo 12.0.1 and DatePicker 9.3.0

`@react-native-community/netinfo` is pinned to 12.0.1 (previously installed
11.4.1), and `@react-native-community/datetimepicker` is pinned to 9.3.0
(previously 8.6.0). The npm lockfile and CocoaPods lockfile resolve these exact
versions. The CocoaPods lockfile is ignored by this repository and was updated
locally by pod install. The modal date/time wrapper remains at 18.0.0.

NetInfo now includes its native New Architecture integration. Version 12 uses
NEHotspotNetwork for iOS Wi-Fi information; 12.0.1 links NetworkExtension through
its podspec. The existing iOS deployment target satisfies its iOS 14 minimum.
The app's connectivity hook, direct fetch calls, connected/reachable handling
and sync logic use supported APIs and were retained. No Wi-Fi SSID/BSSID lookup
or configuration was found in the connectivity hook/services/navigation code,
so no new Wi-Fi entitlement or permission is added.

DatePicker 9 removes positiveButtonLabel, negativeButtonLabel and
neutralButtonLabel. Neither the application nor the installed modal wrapper
uses those props. The existing onChange callback is deprecated but still
supported, including selection and dismissal events. Existing date limits,
spinner modes, locales and confirm/cancel handlers are retained. Version 9.3
adds optional Swift Package Manager support; this app continues using CocoaPods.

All seven existing patches apply. The eight existing regression suites pass
(77 tests), and TypeScript reports no additional diagnostics against the
pre-update baseline. These tests do not replace native picker/connectivity
acceptance checks. Bebbo Android Release passed including R8 (Crashlytics
mapping upload excluded), and Bebbo iOS Simulator Release passed. No new
application source changes or native compatibility patches were required.

Manual acceptance on both platforms must cover offline startup, loss/recovery
of connectivity, background/foreground transitions, downloads and queued event
sync. Check birth/delivery dates, vaccination dates and reminder times, growth
and health-checkup dates, confirm/cancel, reopening and minimum/maximum limits.

References:
- https://github.com/react-native-netinfo/react-native-netinfo/releases/tag/v12.0.0
- https://github.com/react-native-netinfo/react-native-netinfo/releases/tag/v12.0.1
- https://github.com/react-native-datetimepicker/datetimepicker/releases/tag/v9.0.0
- https://github.com/react-native-datetimepicker/datetimepicker/releases/tag/v9.3.0

## AsyncStorage 3.1.1 and translation packages

AsyncStorage is pinned to 3.1.1 (previously installed 2.2.0), i18next to 27.1.1
(previously installed 25.4.2), and react-i18next to 18.0.1 (previously installed
15.7.2), using npm's stable dist-tags at update time. The npm lockfile records
the new dependencies. CocoaPods updates its locally ignored lockfile from
RNCAsyncStorage to AsyncStorage, including the SharedAsyncStorage framework.

`app/localization/initI18next.ts` reads APP_LANG with a promise and explicitly
sets callbackApi: false on its async language detector. Missing values and
storage read failures retain the previous device-language/default-country
selection and Redux dispatch. Language-cache write failures are caught rather
than becoming unhandled rejected promises. The default AsyncStorage import is
retained to access the legacy storage data; no newly named storage or key
migration is introduced. Existing Home/update-cache getItem and setItem calls
remain supported. Realm, its Redux persistence adapter, storage keys and
translation resource files are unchanged.

The obsolete compatibilityJSON: v3 option is removed. Explicit cleanCode: false,
returnEmptyString: true and fallbackLng: ['dev'] preserve the previous locale
casing, intentionally blank translations and fallback setting. The existing
useSuspense: false, escapeValue: false and whitespace postprocessor are retained.
String translation keys remain supported; no selector conversion is needed.

Focused temporary checks compare the actual old/new initialization code and
i18next implementations against all eight flavours: 27,277 translation outputs
match across 59 locale entries, with additional blank/missing/interpolation and
exact-casing checks. Thirty-two detector scenarios cover saved/missing language,
device/default fallback and storage read errors, plus cache writes/rejections;
they also exercise the new detector through actual i18next/react-i18next init.
The eight existing regression suites pass (77 tests), all seven patches apply,
and TypeScript adds no diagnostics against the pre-update baseline. These checks
do not replace native storage persistence or visual/device acceptance tests.

Bebbo Android Release passed including R8 (Crashlytics mapping upload excluded);
iOS Simulator Release passed. Both builds were installed over the existing apps
without uninstalling or clearing data and reached Home. Android had no recent
fatal error in the checked log window. On iOS, all four pre-existing AsyncStorage
manifest entries retained identical value fingerprints after launch, including
APP_LANG; the existing child profile remained visible. Full user-driven language
switching, offline restart and cache-update flows remain manual acceptance checks.
No Android build settings, iOS project settings or native patches changed for
this batch. The previously documented iOS missing-icon-font issue remains visible
and is outside this storage/translation update.

Manual acceptance: update over an existing installation without clearing data;
verify saved language, update/cache flags and unchanged child profiles. Switch
country/language, restart online/offline, verify supported custom locale codes
and translated placeholders, blank/missing labels and plural/age wording on both
Android and iOS. Full RTL visual auditing remains a separate task.

References:
- https://react-native-async-storage.github.io/latest/migration-to-3/
- https://www.i18next.com/misc/migration-guide
- https://www.i18next.com/misc/creating-own-plugins#languagedetector
- https://github.com/i18next/react-i18next/blob/master/CHANGELOG.md

## Maintained FastImage fork 8.13.0

Replace react-native-fast-image 8.6.3 with @d11/react-native-fast-image 8.13.0,
pinned to the stable npm release checked on 2026-11-11. The original package is
removed from the manifest and lockfile, and all 14 application imports use the
maintained fork. The application file bodies are otherwise unchanged: URL
normalization, immutable/cacheOnly policy, priority, preload calls, loading/error
handling, bundled/default fallbacks, resize modes and layouts are retained.

CocoaPods resolves RNFastImage 8.13.0 from the new package path and updates its
image decoding dependencies, including SDWebImage 5.21.7 and the fork's WebP,
AVIF and SVG coders. The locally ignored Podfile.lock records these changes.
Android uses the fork's Glide 4.16.0 and included decoders. No new compatibility
patch, Android build-setting change, Podfile edit or iOS project-setting change
was required. CocoaPods' privacy-manifest ordering-only change was removed after
confirming its declarations were semantically identical.

Verification:
- Android Bebbo Release including R8 passes (Crashlytics mapping upload excluded).
- iOS Simulator Bebbo Release passes; both platforms were installed without
  uninstalling or clearing the existing app data.
- The eight existing regression suites pass (77 tests), and all seven patches
  apply. A virtual pre-update TypeScript baseline using the saved application
  files and original FastImage declarations has the same 158 diagnostics as
  the updated project; no diagnostic was added by this migration.
- Focused temporary checks cover 12 image-source cases, public cache/priority/
  resize constants, preload forwarding, online/offline/default/bundled rendering,
  error fallback and native load-event forwarding. All 14 changed application
  bodies match their originals after undoing only the import replacement.
- iOS Home cards render visibly with the Fabric image component. All 73 existing
  SDWebImage cache files retained identical content fingerprints after upgrade.
- Android Pixel 9 article-list images render online. After Wi-Fi and mobile data
  are disabled and the app is cold-started, Home shows its no-internet message
  and renders its image cards through the offline cache/bundled pipeline. The
  emulator's original connectivity settings were restored after this check.
  This check does not distinguish cache hits from bundled fallbacks per card.

Manual acceptance still includes offline iOS/reconnect behaviour, uncached-image
fallbacks, profile photos/content URIs, image-heavy scrolling, GIF animation and
images inside article details/favourites/related content across flavours. The
HTML Android GIF decoder/HTTPS correction is retained and uses RN Image, separate
from FastImage. The previously documented iOS icon-font issue remains unchanged.
No Realm or notification migration is included in this batch.

References:
- https://github.com/dream-horizon-org/react-native-fast-image
- https://github.com/dream-horizon-org/react-native-fast-image/releases

## Maintained filesystem fork 2.40.4

Replace react-native-fs 2.20.0 with @dr.pogodin/react-native-fs 2.40.4. The newest
published release checked on 2026-11-11 is 2.41.0, but its release notes warn that
its new ArrayBuffer-based native APIs require React Native 0.88 support and are
likely incompatible with older RN versions. Pin 2.40.4 for this RN 0.87.1 app;
do not automatically advance to 2.41.x without reviewing the RN requirement.

All 22 application/test files that referenced the old module now use the fork.
Default RNFS imports become namespace imports; existing named imports retain
their form. The eight flavour appConfig files, shared backup/Drive helpers,
image downloader, child setup/profile and Settings screens, Quick Links, types,
realmSafe helper and existing backup/Drive test mocks are covered. Source checks
confirm every application/test body is unchanged beyond imports/mock names, and
all string configuration values match for eight flavours on Android and iOS.
Backup filenames, encodings, encryption, download options/authorization headers,
image paths and Realm behaviour are retained. realmSafe changes only its RNFS
import; Realm itself, schemas and persistence logic are not migrated. Scoped
Storage remains unchanged in this batch.

The Podfile's explicit RNFS entry becomes ReactNativeFs at the scoped package
path; the locally ignored Podfile.lock resolves the new pod. CocoaPods aggregates
the fork's additional file-timestamp reason 0A2A.1 and disk-space reason 85F4.1
into ios/ParentBuddyApp/PrivacyInfo.xcprivacy. Existing reasons are retained, with
no tracking/data-collection declaration changes. No Android build-setting change
or new compatibility patch is required.

Verification:
- All seven existing patches apply. The eight existing regression suites pass
  (77 tests), including Drive/backup failure handling; TypeScript adds no
  diagnostic against the captured pre-update baseline.
- Android and iOS Simulator Release verification builds pass. Temporary native
  checks pass on both platforms for existence, Unicode UTF-8 reads/writes,
  file:// reads, base64 round trips, file copying/deletion, download job/promise
  shape, HTTPS downloads with a synthetic request header and actual GIF bytes.
  Downloads use a public CMS fixture with a synthetic header, not a live Drive
  access token. This does not verify Google account authorization or a full
  cloud backup/restore cycle.
- Native fixtures use an isolated temporary folder and remove it afterward.
  The temporary diagnostic module and index.js import are removed before the
  final production builds; no new persistent test file is added.
- The final clean Android Release (including R8, excluding Crashlytics mapping
  upload) and iOS Simulator Release builds pass. Both final bundles were inspected
  to confirm the diagnostic strings are absent, then installed over the existing
  apps without clearing data.

Manual acceptance: create and restore both a local exported backup and a Drive
backup, including one produced by the old app; cancel the picker/sign-in and
check error/loading states. Download/open offline content, change/remove a child
photo, and confirm existing profiles, photos and files still work after updating
without uninstalling. Full Drive/local restore must be tested using disposable
sample data rather than replacing a valuable existing profile for a smoke check.

References:
- https://github.com/birdofpreyru/react-native-fs#project-history--roadmap
- https://github.com/birdofpreyru/react-native-fs/releases/tag/v2.40.4
- https://github.com/birdofpreyru/react-native-fs/releases/tag/v2.41.0

## Migration references

- https://reactnative.dev/versions
- https://reactnative.dev/blog/2026/08/11/react-native-0.87
- https://developer.android.com/build/releases/agp-9-2-0-release-notes
- https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/

## Review of pending changes

The review compared tracked source/configuration changes against HEAD, checked
new helpers and existing regression suites, verified the package manifest against
the lockfile, and checked the seven active patches against installed sources.
All 19 migrated deferred callback bodies are unchanged. The ten changed iOS
plists preserve their previous keys and values except for enabling the new
architecture. Generated image references and PDF structures were checked; this
is not visual/device verification.

Drive's installed wrapper defines `accessToken`, not `apiToken`. The app already
assigned and used `accessToken` for its requests before this upgrade; the old
GET-options helper used an inconsistent property name. No Google permission
scopes, backup encryption keys or configured folder/file names were changed.

The review corrected remaining Manage Profile returns after child saves/deletes
and content refresh. It also corrected Android's ARGB conversion for SVG `rgba()`
colours in the existing vector-image patch and regenerated drawable. The old
Lottie null guards are present upstream in 7.5.0. The retired iOS Switch patch
requires device checks against the new native implementation.

## Local notification replacement — Notify Kit 10.10.0

Replaced `react-native-push-notification` 8.1.1 and its `@react-native-community/push-notification-ios` dependency with `react-native-notify-kit` 10.10.0. This is the free Apache-2.0 community continuation of Notifee; the original Notifee repository is also archived. Upstream references: [repository and installation](https://github.com/marcocrupi/react-native-notify-kit), [releases](https://github.com/marcocrupi/react-native-notify-kit/releases), [notification configuration](https://docs.page/marcocrupi/react-native-notify-kit/react-native/reference/setnotificationconfig).

### Behaviour and migration

- The existing `LocalNotifications` public methods, including the original `schduleNotification` spelling, remain available. Vaccination, health-check, development and growth reminder callers retain their current arguments and scheduling rules.
- Preserves last-nine-digit notification IDs, the Android `reminders` channel and its existing user settings, notification icon, flavour-specific native notification colour, title/body and `notitype`/`uuid` tap data.
- Serializes asynchronous scheduling and cancellation so existing loops and cancel-then-reschedule flows retain their order. Android uses AlarmManager, including idle delivery; exact timing remains subject to Android permission and device restrictions.
- On first app launch after upgrade, the native migration reads Android's `rn_push_notification` preferences or iOS pending legacy calendar requests. It persists the replacement reminder ledger before scheduling and only then removes legacy alarms/requests. Migration is retried after failure. Android cancellation uses the old receiver component and request codes, without retaining the old library.
- iOS migration identifies only the app's old local reminders and does not cancel replacements created under the same identifier. Other flavours have separate app storage and alarm ownership.
- The persisted ledger retains future reminders. iOS queues its nearest 64 requests (the OS limit) and refills on app resume; overflow cannot be guaranteed delivery if the app is never reopened. Android retains the existing automatic reminder selection plus manually created reminders.
- Clearing delivered reminders also clears the iOS badge, including when opening the app manually.
- Registers local foreground/background handlers in `index.js`, buffers presses until onboarding/navigation are ready, and deduplicates initial/background/foreground press callbacks. Delivery itself does not navigate. Existing route selection and active-child switching remain in `AppNavigation.tsx`.
- Firebase Messaging still handles remote notifications. `handleRemoteNotifications: false` prevents Notify Kit from taking over iOS remote taps; existing FCM foreground alerts, background handler and payload routing are retained. No server payload migration or iOS notification service extension is introduced.
- No new translated strings or privacy declaration reasons are needed. Existing privacy declaration changes from the filesystem upgrade are retained.

### Files for this replacement

- `package.json`, `package-lock.json`: replace the two old dependencies; register the iOS native migration module for code generation.
- `app/services/LocalNotifications.js`: Notify Kit adapter, serialized operations, persisted reminder migration/refill and buffered tap handling.
- `app/navigation/AppNavigation.tsx`: subscribe to local presses and flush on navigation readiness; keep existing notification destinations.
- `app/services/Utils.ts`: use the replacement API for iOS notification permission requests; retain Android's existing permission request.
- `index.js`: register notification handlers before app mounting/headless processing.
- `app/specs/NativeLegacyNotifications.ts`: shared TurboModule migration contract.
- `android/app/src/main/java/org/unicef/ecar/bebbo/LegacyNotificationsModule.kt`, `LegacyNotificationsPackage.kt`, `MainApplication.kt`: read/cancel old alarms, expose the native flavour colour and register the migration module.
- `android/app/src/main/AndroidManifest.xml`: remove the old package's receivers/service/metadata; retain Firebase icon/colour metadata and existing permissions. Notify Kit supplies its own receivers through manifest merging.
- `ios/ParentBuddyApp/LegacyNotifications.mm`, `ios/ParentBuddyApp.xcodeproj/project.pbxproj`: migrate pending iOS requests and include the module in all app targets.
- `app/types/env.d.ts`: remove the obsolete ambient declaration for the old package.
- `patches/react-native-push-notification+8.1.1.patch`: removed with the old dependency.
- `app/services/__tests__/localNotifications.test.ts`: one consolidated regression suite for migration, scheduling, cancellation, press buffering/deduplication and iOS queue overflow.
- This README records the migration and verification. CocoaPods dependencies were installed locally; `ios/Podfile.lock` is ignored by the existing repository rules.

### Verified on 11 November 2026

- `npm ci --legacy-peer-deps`: remaining patches apply successfully.
- All service regression suites pass: **9 suites, 87 tests**, including 10 notification tests.
- Bebbo Android `prodRelease` and iOS `ParentBuddyApp` Release simulator builds pass with temporary diagnostic code removed. Crashlytics mapping upload was excluded from the Android verification build.
- Installed and ran diagnostic Release builds on the Pixel 9 emulator and iPhone 17 simulator without clearing their existing app data. Native readback confirmed permission state, migration completion, removal of legacy pending alarms, routing metadata for all four reminder types, individual cancellation and exactly one scheduled test reminder. A timed notification was delivered on both platforms.
- Android alarm inspection confirms future Bebbo reminders use Notify Kit's receiver; the old Bebbo receiver appears only in cancelled-alarm history. The other installed flavour retains its own alarms.
- Rebooted the Android emulator and confirmed **49 future reminders** were restored by the new receiver before opening the app, with **zero** pending alarms for the old Bebbo receiver.
- A real Android reminder tap after killing the background app opened **Add new measurement**, confirming cold-start growth routing.
- Temporary diagnostic JS was removed before the final builds. TypeScript still reports pre-existing project errors; it is not a clean project-wide check. No errors are reported for the new native spec or notification regression suite.

### Remaining manual acceptance checks

1. Test iOS notification taps in foreground/background/terminated states on a physical device; repeat for vaccination, health-check and development, including switching to a different child's reminder.
2. Send real Firebase messages with the sender’s actual payloads on both platforms (the CMS does not currently send these notifications), including foreground alerts and background/terminated-state taps. Local simulator tests do not verify APNs/FCM end to end.
3. Test a fresh install with permission allowed and denied, then enable notifications in system settings. On Android, also test exact-alarm permission restrictions and a physical device's battery-saving mode.
4. Edit/delete reminders, delete a child, toggle reminder settings, and change language/child age; confirm the old reminder is cancelled and any replacement has the expected text/date.
5. Test upgrading an installed production version without clearing data. Migration runs when the upgraded app is first opened; reminders due before that first launch cannot be migrated by JavaScript.

## Replace Android Scoped Storage with the existing document picker

Remove `react-native-scoped-storage` 1.9.5 and its compatibility patch. The app already uses `@react-native-documents/picker` 10.1.7, whose `pick`, `keepLocalCopy` and `saveDocuments` APIs cover all active Scoped Storage calls. No additional native dependency, custom Android bridge, storage permission or translation is needed. References: [API](https://react-native-documents.github.io/docs/doc-picker-api), [Save As](https://react-native-documents.github.io/docs/sponsor-only/picker/save-as-dialog), [repository/issues](https://github.com/react-native-documents/document-picker).

### Implementation

- `app/services/backupDocuments.ts` centralizes Android backup file I/O. The system picker selects one document; a private local copy handles `content://` providers, including remote providers when available. JSON backups are read as UTF-8, legacy binary backups as base64. Only the private copy is removed after reading.
- Exports retain the previous Android `JSON.stringify(ciphertext)` UTF-8 bytes and suggested `mybackup.json` filename. A temporary private file is passed to the native Save As dialog. Success requires the native copy to finish without a reported error; the source file is cleaned afterward, including on cancellation/failure.
- Cancelling either picker is a neutral result. Other failures use existing `generalError` / `settingExportError` strings, and loading flags reset in `finally`.
- `QuickLinksRow.tsx` and `SettingScreen.tsx` use the shared export helper. `ChildSetup.tsx`, `AddChildSetup.tsx`, `AddChildInfoSetup.tsx` and `SettingScreen.tsx` use the shared import helper.
- Legacy Android imports no longer open the picker a second time: the same selected file supplies the base64 content. Uppercase `.JSON` extensions are handled as JSON. Android temporary JSON writes now serialize the parsed data rather than an unresolved decryption Promise.
- Two obsolete `DocumentPicker.isCancel` calls in the affected screens use the installed picker's error-code API instead. Unused default imports were removed.
- Old persisted URI permission results were assigned to unused variables. The app always asks for a document for each import/export; no folder permission mapping or migration is necessary, and existing grants are not revoked.
- iOS file selection/sharing and Google Drive authorization/network backup paths retain their existing implementation. Realm versions, schemas, encryption keys and data mapping are unchanged. Shared screen imports now resolve the helper instead of Scoped Storage.
- `package.json` / `package-lock.json` remove the dependency; `patches/react-native-scoped-storage+1.9.5.patch` is removed. `backup.test.ts` extends the existing suite instead of adding another test file.

### Verification

- All **9 service test suites / 97 tests** pass, including 10 added document-I/O cases: exact JSON bytes, base64 single selection, uppercase extensions, cancellation, provider/read errors, delayed export completion and native write failure.
- Android Bebbo `prodRelease` and iOS `ParentBuddyApp` Release simulator verification builds pass. Android Crashlytics mapping upload is excluded from the verification build.
- All five remaining compatibility patches apply. The dependency tree and generated Android package list no longer include Scoped Storage.
- TypeScript has no additional diagnostic messages against the previous baseline; existing project errors remain. The two obsolete picker cancellation diagnostics are removed.
- CocoaPods introduces no new privacy declaration reasons. The existing filesystem privacy declarations are retained without ordering-only changes.
- Final clean builds were installed on the Android emulator and iOS simulator. Both bundles were inspected to confirm temporary diagnostic strings were absent.
- Native Android Save As and JSON selection were exercised with a disposable Unicode fixture; selected content matched the exported bytes. No fixture was restored over an existing profile. ADB disconnected during the subsequent checks, so native binary/cancellation scenarios are not counted as verified; their regression cases pass. Temporary diagnostics were removed before the final builds.

Manual acceptance should include Settings and Home local exports, restoring an older encrypted JSON backup using disposable profiles, onboarding import, a genuine legacy Realm backup, file providers such as Drive, picker cancellation, and provider/offline/storage-full errors. Binary transport checks do not prove that every historical Realm schema can be opened by the current Realm version.


## Custom Fontello icons: maintained package migration

- Replace deprecated `react-native-vector-icons` with `@react-native-vector-icons/fontello` **14.0.0**, and remove the obsolete `@types/react-native-vector-icons` dependency. The package provides its own types; no Expo dependency or paid package is required.
- `app/components/shared/Icon.tsx` changes only its factory import. All 68 glyph names/codepoints, the `fontello` family, sizes, colours and styled/RTL wrappers retain their existing configuration.
- Move `app/assets/fonts/fontello.ttf` to the standard `rnvi-fonts/fontello/fontello.ttf` directory and remove the duplicate `android/app/src/main/assets/fonts/fontello.ttf`. The font bytes are unchanged (SHA256 `bf53a1abd9fdd89fae7742d0732a8e51c8a7e8ca77f292dee4c623f001ecf86a`). Gradle and the new CocoaPod automatically bundle this single project-owned font source.
- Remove the old explicit `RNVectorIcons` pod from `ios/Podfile`. The new package autolinks. All ten iOS target Info.plists already register `fontello.ttf`, so no plist edits or additional Xcode font references are needed. Roboto fonts are unchanged.
- Update the root README to replace the old manual copy/remove instructions. Do not modify fonts in `node_modules` when switching platforms. Run `npm ci --legacy-peer-deps`, then `cd ios && bundle exec pod install` after installing dependencies for an iOS build.
- `FLAVOR=bebbo npx react-native-vector-image generate` remains unchanged for SVG/vector-image assets. This is a separate package; switching between platforms does not require regenerating images because of the icon font migration. When changing the Fontello font itself, update the TTF and its glyph-map JSON together, rerun CocoaPods and rebuild both apps.

References: [Fontello setup](https://github.com/oblador/react-native-vector-icons/blob/master/packages/fontello/README.md), [migration guide](https://github.com/oblador/react-native-vector-icons/blob/master/MIGRATION.md).

Verification: all 9 existing service suites / 97 tests pass; a direct factory check confirms all 68 glyph mappings and the original font identity. TypeScript reports no new icon-component diagnostics against the existing project baseline. Android Bebbo `prodRelease` (Crashlytics mapping upload excluded) and iOS `ParentBuddyApp` Release simulator builds pass. Both were installed over existing apps without clearing profiles and reached Home. Screenshots confirm header, profile, edit, share/save and all five bottom-tab icons render on both platforms, including the previously missing iOS custom glyphs. Each packaged app contains exactly one `fontello.ttf`, matching the original bytes; iOS also registers it in `UIAppFonts`. All ten source iOS plists retain the font registration; other flavour builds were not run. CocoaPods does not change the privacy manifest declarations.

Manual acceptance: check drawer expand/collapse, profile/form back arrows, notifications and tool icons on both platforms; check RTL when an RTL language is available. The shared RTL styling was not changed.


## Combined runtime compatibility updates (11 November 2026)

### Included versions

| Dependency | Previously installed | Updated |
| --- | --- | --- |
| `@react-native-google-signin/google-signin` | 15.0.0 | 17.0.0 |
| `@sayem314/react-native-keep-awake` | 1.3.1 | 2.0.0 |
| `react-native-error-boundary` | 2.0.0 | 3.1.0 |
| `react-native-get-random-values` | 1.11.0 | 2.1.0 |
| `react-native-url-polyfill` | 2.0.0 | 4.0.0 |
| `uuid` | 11.1.1 | 14.0.3 |
| `react-native-restart` | 0.0.27 | 0.0.29 |
| `react-native-timeline-flatlist` | 0.8.0 | 1.0.1 |
| `react-native-popup-menu` | 0.18.0 | 0.19.0 |
| `react-native-dotenv` | 3.4.11 | 3.4.12 |
| `axios` | 1.21.0 | 1.21.1 |
| `babel-plugin-module-resolver` | 5.0.2 | 5.0.3 |

- `package.json` and `package-lock.json` pin these versions. Remove redundant `@types/uuid`: UUID provides its own types.
- `babel.config.js` caches by `FLAVOR` as well as Babel environment and uses `allowlist`/`blocklist`. Keep dotenv on 3.4.12: version 5 leaves command-line-only `process.env.FLAVOR` unresolved, breaking Metro's dynamic asset/theme requires, and changes existing empty environment values to `undefined`. No `.env` content or encryption values are changed. All eight flavours' substitutions and all 16 flavour/development-production environment-output combinations match the previous plugin, including empty values.
- `index.js` installs URL and secure-random polyfills before importing App and its dependent modules. Existing UUID v4 call sites continue generating UUID v4 values; existing stored IDs and storage formats are unchanged.
- Google Sign-In remains iOS-only in this app. Android continues to use the custom Drive Authorization TurboModule, with Google Sign-In Android autolinking disabled. Existing `configure`, sign-in response handling, token APIs, OAuth client IDs and button call sites remain compatible.
- CocoaPods updates GoogleSignIn from 8.0.0 to 10.1.0 and its required AppAuth/GTMAppAuth/GTMSessionFetcher/AppCheckCore dependencies; CocoaPods remains the dependency manager. On an existing checkout with the old pod lock, run `cd ios && bundle exec pod update GoogleSignIn --no-repo-update` before building. `Podfile.lock` remains ignored by the repository. No source Podfile, Xcode project or privacy declaration changes are required by this batch.
- Existing keep-awake component, restart API, error-boundary custom fallback, timeline props and notification popup-menu call sites are retained. Major version numbers do not alone imply app call-site changes; native modules are verified by rebuilding both platforms.
- Replace patched `react-native-progress-circle` with `app/components/shared/ProgressCircle.tsx`, using the existing `react-native-svg` dependency. Keep the same 70-point diameter, six-point ring width, colours and translated child percentage label at its only call site (`ChildDevelopment.tsx`). Clamp invalid/out-of-range progress; mirror the ring for RTL without mirroring the label. Remove the old dependency and its compatibility patch; four patches remain.

### Verification and acceptance

- All 9 existing service suites / 97 tests pass. No additional TypeScript diagnostic messages relative to the previous baseline; existing project-wide errors remain.
- Final Bebbo Android `prodRelease` (excluding Crashlytics mapping upload) and `ParentBuddyApp` iOS Release simulator builds pass after the dotenv compatibility correction. Both final builds were installed over existing apps without clearing profiles and reached Home. Android Child Development was opened and its 31-percent SVG ring/label rendered correctly. Recent Android runtime logs contain no fatal/TypeError/ReferenceError matches. iOS Home rendering was inspected; native iOS account-based sign-in and progress-ring interaction remain manual acceptance checks.
- Isolated checks using the actual JavaScript packages cover the secure-random bridge contract, 100 unique UUID v4 values and Drive query/page-token URL round trips. The native random module is mocked for these isolated checks. Direct component checks also cover progress ring dimensions, zero/partial/full/invalid values, the percentage label and RTL ring direction.
- Manual acceptance: Google Drive sign-in/cancel/sign-out/relaunch, backup and restore on iOS with a real account; Android Drive regression; language/country restart; loading/download screen stay-awake and subsequent sleep; notifications popup actions; growth/health/vaccination timelines; child-development progress at 0/partial/100 percent and RTL; error fallback/retry; content/API loading. Successful native compilation and launch do not prove account-based authentication or every screen interaction.

### Separate migrations retained

- Realm remains unchanged by request. React Native/React-aligned tooling and Firebase 27 are outside this batch.
- Keep splash 2.0.4: the reviewed 3.0.0 archive pins Lottie dependencies older than this app's selected versions, so this needs a dedicated startup migration.
- Keep Vector Image 0.4.5 and its patch for now: the reviewed 0.6.1 implementation switches rendering to React Native Image, changes its native dependency setup, and still needs the existing ARGB conversion correction. Review asset generation and all vector-image call sites together before changing it.
- Keyboard-controller replacement requires reviewing the existing nested scroll views in the health/vaccination/growth forms; treat this as a dedicated form-behaviour migration. Action sheets, styled components and RTL remain grouped for the later UI work.

Upstream references: [Google Sign-In releases](https://github.com/react-native-google-signin/google-signin/releases), [Error Boundary](https://github.com/carloscuesta/react-native-error-boundary), [dotenv](https://github.com/dotenvx/react-native-dotenv), [random values](https://github.com/LinusU/react-native-get-random-values), [URL polyfill releases](https://github.com/charpeni/react-native-url-polyfill/releases), [UUID releases](https://github.com/uuidjs/uuid/releases).


## Remaining native-package batch: keyboard, picker, splash and vector assets

### Scope and versions

- Replace `react-native-keyboard-aware-scroll-view` 0.9.5 with `react-native-keyboard-controller` **1.23.0**. Existing Reanimated/Worklets versions remain unchanged.
- Upgrade `@react-native-documents/picker` **10.1.7 → 12.0.3**. Its existing `pick`, `keepLocalCopy`, `saveDocuments` and cancellation APIs remain compatible with `backupDocuments.ts` and the iOS import paths. The native `reactApplicationContext.currentActivity` correction is now upstream, so remove the 10.1.7 patch without replacing it.
- Upgrade `@attarchi/react-native-lottie-splash-screen` **2.0.4 → 3.0.0**. Keep the existing animation and branding. Scope npm overrides to this package so its older pinned Lottie dependencies resolve to the app's selected `lottie-react-native` **7.5.0** and matching `lottie-ios` **4.6.0**, avoiding duplicate/incompatible Lottie versions.
- Upgrade `react-native-vector-image` **0.4.5 → 0.6.1**. Keep `@klarna/react-native-vector-drawable` **0.5.1**, its latest published version, and retain the existing Android native vector renderer through the compatibility patch. iOS still uses native Image/PDF rendering; no Expo installation is needed for the bare React Native generator path.
- Remove unused `react-native-tracking-transparency`. Tracking consent remains implemented in `AppNavigation.tsx` through `react-native-permissions`; keep the AppTrackingTransparency permission pod and existing plist descriptions.
- Registry checks confirm Orientation Locker **1.7.0**, Version Info **1.1.1** and Camera Roll **7.10.2** already match their latest published versions. Retain these packages and all current call sites.
- Action sheets, styled components, Victory, Realm, React Native/Firebase versions, build tools and small utilities are unchanged in this batch.

### App and native integration

- `App.tsx`: add `KeyboardProvider` inside the existing Safe Area Provider, with `preload={false}` to avoid preloading/flickering the keyboard during startup.
- `AddChildHealthCheckup.tsx` / `AddChildVaccination.tsx`: replace the keyboard scroll import, remove the redundant outer gesture-handler ScrollView, and transfer its flex style to the new keyboard-aware scroller. Retain form contents, state, date controls, save handlers, translated strings and navigation/return parameters. Set a 20-point focused-input gap above the keyboard.
- `AddNewChildgrowth.tsx`: replace the keyboard import and the outer nested ScrollView with a bounded flex View. Keep the header outside the one keyboard-aware form scroller. Save/delete logic, state and route handling are unchanged.
- `ios/ParentBuddyApp/AppDelegate.swift`: import the splash package's new Swift module/class and use its new show API; avoid starting the animation twice. Retain the existing branded overlay and two-second removal, explicitly hide the package's loading view at handover.
- `ios/ParentBuddyApp-Bridging-Header.h`: remove the obsolete `RNSplashScreen.h` import; Orientation remains imported. `ios/Dynamic.swift`: remove the old completion API call that no longer exists in splash 3.
- Update the splash patch for AGP/Kotlin/currentActivity compatibility and an explicit force-hide option on the Swift show API. The option prevents the new package from hiding the animation early when the app controls its splash duration.
- Update the vector-image patch for React Native 0.87's public `react-native/asset-registry` entry point, Metro non-watching server mode and Android ARGB conversion; retain the Android VectorDrawable component rather than passing vector XML to the bitmap decoder. All app VectorImage imports remain unchanged.
- `package.json` / `package-lock.json`: versions, scoped Lottie overrides, dependency removals. Replace the old splash/vector patches with versioned patches for 3.0.0/0.6.1. Three compatibility patches remain, including the unchanged HTML renderer patch.

### Build workflow

Continue using Node 22 and `npm ci --legacy-peer-deps`. Run CocoaPods after installation (`cd ios && bundle exec pod install`). For SVG assets the command remains `FLAVOR=bebbo npx react-native-vector-image generate`; add `--reset-cache` when regenerating after a flavour/source change. The Fontello font remains automatically bundled from `rnvi-fonts/fontello/fontello.ttf`; do not copy fonts into or out of node_modules. The updated vector generator was run successfully with `--reset-cache`; all previously generated resources match their pre-update bytes.

### Verification

- All 9 existing service suites / 97 tests pass, including backup document I/O, cancellation and return-navigation regression cases. No new TypeScript diagnostics relative to the previous baseline; the project still has pre-existing diagnostics.
- CocoaPods installs the new picker, keyboard and splash versions and removes the unused tracking package. Privacy manifest declarations and the source Xcode project remain unchanged.
- Bebbo Android `prodRelease` (Crashlytics mapping upload excluded) and `ParentBuddyApp` iOS Release simulator builds pass. Installed both over existing apps without clearing profiles. Cold startup reaches Home on both; iOS screenshots capture the branded animated splash and successful handover.
- On Android, opened an unsaved health-check form, entered a temporary comment, navigated to Height and back, then Weight and back. The comment and measured selection remained intact. Discarded the form without saving any measurements. The original emulator software-keyboard setting was restored after testing. The emulator kept its hardware-input mode, so software-keyboard overlap/automatic scrolling is not counted as verified.
- Opened the updated Android system document picker through Settings → Upload saved data → File Manager, then cancelled. Settings returned without an error or stuck loading overlay; no backup was selected/restored.
- All three remaining compatibility patches pass `patch-package --error-on-fail`. Previously generated SVG resources remain byte-identical after running the updated generator.
- Manual acceptance still needed: software-keyboard focus/scroll/dismissal on all three forms on Android and iOS; date selection and save/edit flows; vaccination and growth form returns; local backup Save As/import (including older encrypted JSON and Realm files) on both platforms and cloud file providers; a fresh install and cold/warm splash for other flavours; vector illustrations on walkthrough/Terms/Chat and other screens. Other flavour binaries and physical devices were not tested in this batch.

Sources: [Keyboard Controller setup](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/installation), [Document Picker releases](https://github.com/react-native-documents/document-picker/releases), [Vector Image](https://github.com/oblador/react-native-vector-image), [Lottie Splash](https://github.com/attarchi/react-native-lottie-splash-screen).


### Android intrinsic SVG sizing correction

After the Vector Image update, the Android backup/import sheet showed its labels but no File Manager or Drive icons. The retained native VectorDrawable renderer needs explicit layout dimensions, whereas iOS Image obtains them from its source. Restore the old intrinsic-size behaviour centrally in `patches/react-native-vector-image+0.6.1.patch`: use the SVG asset width/height as the default style, followed by the caller's style so explicit overrides still win. This covers every existing VectorImage call site, including Settings and Home quick links, without per-screen icon sizing changes. The iOS branch is unchanged.

`android/app/build.gradle` also declares `patches/*.patch` as JS-bundle inputs. React Native excludes node_modules from these inputs, so a patch-only JS correction otherwise leaves `createBundleProdReleaseJsAndAssets` up-to-date and can ship the older bundle. A dependency reinstall or clean build is not required after each future patch edit.

Direct package checks cover Android intrinsic dimensions, explicit style overrides, resizeMode forwarding and unchanged iOS source/style handling. All 97 service tests pass. Android Release rebuild passes; its bundle source map includes the sizing correction. Installed that build on the emulator and visually confirmed both File Manager and Google Drive icons on the Settings import sheet. The fix also applies centrally to other intrinsic-sized VectorImage instances. No iOS code-path changes were made for this correction.


## Targeted dependency security fixes

See [the security review](security-review.md) for dependency paths, scoped overrides, remaining advisories and verification. The npm audit snapshot improves from 38 entries (16 high) to 21 entries (zero high/critical). The remaining entries trace to deepmerge, glob and minimatch tooling advisories; they remain open. Native Firebase and styled-components versions are unchanged. Babel stays on major 7, with its patched minimum set to 7.29.13. No forced audit fix or major build-tool upgrade is included.

## Victory Native growth-chart migration

Upgrade Victory Native from the resolved 36.9.2 release to 43.0.1. Replace
`@shopify/react-native-skia` 2.14.0 with `react-native-skia` 2.15.1, as required
by [Victory's Skia migration](https://nearform.com/open-source/victory-native/docs/skia-package-migration).
Do not install both Skia package names together. Declare `d3-shape` 3.2.0 and
its TypeScript declarations directly: it is already used by Victory, and the
shared renderer uses its natural area interpolation to retain a separate Y0
at every reference point. Add d3-scale declarations for Victory's scale types.

`app/components/growth/GrowthChart.tsx` replaces the legacy SVG Victory
components with CartesianChart/Skia geometry. Reference bands keep their own
X coordinates and upper/lower curves; measurements retain their exact values
and use the existing age/measurement conversion. Natural interpolation,
blue measurement lines, white dots, selected orange outlines, and portrait/
landscape reference colours are retained. Disable the new API's default grid
lines to match the existing design. Native Text overlays retain translated
units, digit conversion and system font fallback. Native Pressables toggle a
persistent tooltip on each measurement, avoiding reference-curve hit testing
and Victory's nearest-X press-state behaviour. Tooltip positions are bounded
within the chart; endpoint dots render outside the plot clip so they remain
whole. Chart selection clears when data or dimensions change.

`app/components/growth/growthChartData.ts` prepares a finite domain from both
reference boundaries and measurements, preserves off-grid/duplicate-X values,
sorts copies rather than mutating source data, and handles empty content.
Growth calculations, interpretation services, taxonomy/reference JSON,
navigation routes, form saving and the existing parent-screen loading delays
are unchanged. No translation keys are added.

Verification: all 112 service tests pass, including 15 focused chart tests in
one consolidated `growthChart.test.tsx` suite. No new TypeScript diagnostics
relative to the preceding security batch; existing project errors remain.
Android prodRelease and iOS Release simulator builds pass. An isolated,
temporary in-memory fixture verified native chart rendering on both platforms,
including iOS weight/height curves and Arabic digits, and Android premature-age
labels and dot tooltip open/close interaction. The fixture does not save profile
data and is removed after checking. iOS rendering also confirms default grid
lines are removed. npm audit remains at 21 findings, zero high/critical.

Still manually verify the actual full-screen landscape/back flow on both
platforms and dot presses on iOS using saved growth records. Unit tests cover
zero/one/multiple points, source immutability, domain limits, tooltip clamping,
independent selections, premature-date forwarding and selection reset on resize;
these do not replace physical-device gesture or visual checks. Reinstall Pods
and rebuild native apps after installing the new package versions. Podfile.lock
is locally regenerated for the renamed Skia dependency (this repository ignores
that lockfile).


### Growth chart visual parity correction

Restore the legacy data-based scale extent instead of CartesianChart's automatic
Y-axis nice rounding, which added visible 0/35 ticks to the weight chart. Copies
of the scales retain their pixel ranges and use the exact reference/measurement
extents consistently for shaded areas, lines, dots, labels and touch targets.
Measurement values, age conversion and interpretation calculations do not change.
Restore small tick marks and the original horizontal unit-label position.

Replace the fixed 190-point-wide tooltip with a text-measured compact flyout and
a triangular pointer. Clamp the flyout within the chart and place it below a
point when there is insufficient room above. Each measurement toggles its own
flyout independently, allowing multiple open tooltips as in legacy Victory.
Regression coverage includes exact unrounded extents, point values, independent
selection, pointer spacing and flyout flipping near the top edge.

The reference fill uses the exterior upper/lower curves as one base plus the middle range, avoiding thin antialiasing seams between three adjacent fills. If reference rows do not align, the renderer retains the original separate-band fallback. Source rows and duplicate X values are preserved.

Final visual-correction verification: Android prodRelease and iOS Release simulator builds pass. Installed both; Android was visually checked using the existing 4 kg / 44 cm and 10 kg / 70 cm measurements, with both compact pointed tooltips open together. The plotted values were not edited. iOS startup passes; the updated tooltip appearance still needs a manual iOS visual check. All 112 service tests pass with no additional TypeScript diagnostics.

## Design batch 1: action sheets and styled components

Upgrade `react-native-actions-sheet` from 0.9.x to 11.0.0 and
`styled-components` from 6.1.x to 6.6.0. Follow the upstream
[sheet migration guide](https://rnas.vercel.app/guides/migrate) and retain
the existing Reanimated/Worklets dependencies. No new native dependency,
translation key, font family, font size or theme colour is introduced.

Add `app/components/shared/AppActionSheet.tsx` and migrate all six consumers:
`QuickLinksRow`, `SettingScreen`, `ChildSetup`, `ChildImportSetup`,
`EditParentDetails` and `EditChildProfile`. Use stable refs and the current
show/hide methods. Home's backup shortcut opens its own sheet through a ref.
Use the library's ScrollView with a viewport-relative height limit so longer
option lists remain accessible. Existing content and destination choices remain.

File/photo pickers and Drive confirmation dialogs wait for the sheet's close
callback instead of fixed 350 ms delays. Version 11 reports iOS closure after
native Modal dismissal. The wrapper prevents a second presentation during
closing and cancels pending follow-up actions when its screen unmounts.
Native backdrop dismissal participates in the same guard. File picker errors
reuse the existing general-error translation and cancellation remains quiet.

Remove the conflicting styled-components v5 type packages and extend both
root/native DefaultTheme declarations using the same existing theme shape.
Declare the previously transitive Node types explicitly and retain Jest/Node
globals in tsconfig. Remove the obsolete styled-components PostCSS override:
the new release no longer uses that dependency. Other security overrides remain.

Verification: all 118 service tests pass across 11 suites. One consolidated
`designComponents.test.tsx` suite covers delayed dismissal, duplicate taps,
unmount cancellation, backdrop dismissal, reopening and shared typography.
No new TypeScript diagnostics relative to the preceding batch; existing
project errors remain. Changed components compile for all eight flavours.
Android prodRelease and iOS Release simulator builds pass and both apps launch.
Android visual checks cover Home backup and Settings backup/import sheet layout and icons,
Drive confirmation after dismissal, returning from file selection without a
hung loader, and relationship selection without saving the profile. iOS has
startup verification; its sheet/picker interactions still need manual checking.
npm audit remains at 21 findings (11 low, 10 moderate, zero high/critical).

Manual follow-up: test relationship selection during onboarding and profile
editing, Home/Settings file and Drive backup, cancelling import, and child photo
camera/gallery options on both platforms. Include smaller screens, landscape,
large accessibility text and long translated option labels. Full RTL switching,
directional styles/icons and the screen-by-screen visual audit are the next
design pass; this batch does not enable or change language direction.

## Design batch 2: RTL foundation

Add `app/localization/layoutDirection.ts` to determine direction using real
language metadata (`luxonLocale` before the CMS language/resource IDs), with
compatibility for the existing GRarb/GRda IDs. Script subtags remain meaningful:
az-Arab is RTL and az-Latn is LTR. Do not infer direction from the phone alone.

`App.tsx` configures persistence and checks native direction after rehydration,
before mounting navigation. Direction changes flush the saved language and
resume route before the existing native restart mechanism runs. Restart in both
directions; unchanged direction does not restart. A persistence failure prevents
restart, and startup failures use the existing translated retry/error screen.
`AppNavigation.tsx` restores the saved loading parameters, consumes the resume
flag, and explicitly supplies navigator direction. `HomeDrawerNavigator.tsx`
places the drawer on the leading side.

Replace the duplicated locale checks/timers in CountryLanguageConfirmation,
LanguageSelection and the single-language LoadingScreen path. Onboarding and
country/language changes resume the same content-loading destination. A locale
or country change no longer counts as unchanged merely because two CMS entries
share a backend language code. Initial single-language downloads wait for the
language/direction setup. Existing content APIs and translations remain.

Use logical `text-align: start` for leading-aligned shared text across all eight
flavours and shared form/button/filter/radio/checkbox labels. Preserve centred
text, font families/sizes, colours and numeric values. Fabric in RN 0.87 mirrors
physical left/right text alignment; selecting right again in RTL can invert it
twice. The older HTML CSS parser does not accept `start`, so its text styles use
the compatible leading-edge value through `appTextAlign`, with an explicit HTML
direction and the renderer's RTL list support. Keep existing table/iframe props.
Native TextInputs retain their existing separate direction-aware alignment.

Mirror the Fontello navigation arrows (`ic_back`, `ic_angle_left`,
`ic_angle_right`) through the common Icon component. Keep other pictograms and
logos unchanged. Retain the growth chart's existing LTR plotting container;
there is no chart geometry or measurement calculation change in this batch.

Files changed for this RTL batch:

- `App.tsx`, `app/localization/layoutDirection.ts`.
- `app/navigation/AppNavigation.tsx`, `app/navigation/HomeDrawerNavigator.tsx`.
- `app/screens/localization/CountryLanguageConfirmation.tsx`,
  `app/screens/localization/LanguageSelection.tsx`, `app/screens/LoadingScreen.tsx`.
- `app/instances/{babuni,bebbo,bebboDev,bebboPacific,foleja,merhabaBebek,reraiUmntwana,wawamor}/styles/typography.tsx`.
- `app/components/shared/{ButtonGlobal,CheckboxStyle,ChildSetupStyle,FilterStyle,Icon,radio}.tsx`.
- `app/components/ChildDevelopmentCollapsibleItem.tsx`,
  `app/components/NotificationsCategories.tsx`.
- `app/screens/{PrivacyPolicy,TermsPage}.tsx`,
  `app/screens/home/{Aboutus,ChatBot,DetailsScreen}.tsx`,
  `app/screens/home/bottomTabs/ChildDevelopment.tsx`.
- `app/services/__tests__/designComponents.test.tsx` and this document.

Verification: all 133 service tests pass in the existing 11 suites. Coverage
includes Arabic/Dari and other language/script detection, both native direction
transitions, persistence before restart, resume parameters, duplicate restart
protection, failed flush and logical/centred typography. No new TypeScript
diagnostics relative to the preceding design batch; existing project errors
remain. Changed components compile for all eight flavours. Android prodRelease
and iOS Release simulator builds pass.

An isolated temporary Arabic preview, using the actual shared components and
existing GRarb translations, was installed on both platforms in native RTL
mode. It verified leading-aligned headings/labels, centred buttons, mirrored
arrows, unmirrored favourite icons, Arabic TextInput and HTML paragraphs/lists.
The Android relationship sheet was opened and visually checked. This caught and
corrected the Fabric alignment inversion on both platforms. The preview never
mounted the app store/persistence or saved profile/content data. It was removed
and the original entry point restored before rebuilding the normal apps.
Installed those normal builds on both devices: startup detected native RTL test
mode, restarted into the saved English/LTR layout, and showed Home with the
existing child profiles. No Arabic test language or fixture remains enabled.

The production language list and CMS language definitions remain unchanged;
Arabic/Dari are still commented out. This is shared RTL groundwork, not a claim
that every application screen has been visually audited in Arabic. Remaining
audit: full onboarding/profile save/back flows, Home/Daily Reads, tabs/drawer
gestures, search/filter menus, long translated content, health/growth/vaccination
forms and date pickers, media/tables, backup/restore sheets, landscape and large
text. Use approved Arabic taxonomy/content to verify the complete user flows
before enabling the language for release. Mixed-script numeric values and dates
need review in their actual translated sentences as part of that audit.

### Temporary RTL testing with English content

`env/.env.bebboDev` enables `BebboForceRTLForTesting=true`. The override in
`getLanguageDirection` requires both this exact flag value and
`FLAVOR=bebboDev`; other flavours keep normal language-based direction. It works
in Bebbo Dev Debug and Release builds, retains the selected translations and
CMS content, and uses the existing startup restart when native direction differs.
Build using both `ENVFILE=env/.env.bebboDev` and `FLAVOR=bebboDev`.
For Debug, restart Metro with the same flavour and `--reset-cache` after changing
the flag. To disable the override, set it to `false` and rebuild/relaunch; the
startup direction check returns an English app to LTR automatically. No storage
reset or reinstall is needed. Remove/disable the flag after the visual audit.
English RTL testing checks layout and navigation; it does not replace Arabic
text wrapping, font, mixed-script or translated-content checks.

### RTL UI follow-up: icons, popup controls, charts and rulers

The requested chart behaviour now supersedes the earlier decision to retain
LTR plotting: in RTL the X scale's pixel range reverses, minimum values and
earlier measurements start on the right, and the Y labels/unit move to the
right. Reference areas, measurement lines/dots, press targets and tooltips all
use that same scale. Text stays upright; source measurements, units, date/age
conversion and interpretation do not change. LTR keeps its existing scale.

`Ruler.tsx` isolates native scroll offsets in an LTR container and mirrors the
scroll viewport in RTL. Numeric text is mirrored back individually. Initial
position is applied after content layout without the old timer/animation;
selection is bounded to the ruler range, end spacing matches the declared
content width, and snapping subtracts the minimum instead of adding it. This
keeps the pointer, displayed selection and returned value consistent, including
rulers with a nonzero minimum.

`Icon.tsx` isolates font glyphs from RTL paragraph direction, centres them and
prevents flex shrinking. The existing directional-arrow transform remains;
other pictograms are unchanged. `ModalPopupStyle.tsx` keeps shared close
controls at the physical top-right in either layout, including the absolute
development-video close control. This is a consistent application design
choice; top-left close controls would also be valid in a mirrored RTL design.

Files: `app/components/Ruler.tsx`, `app/components/growth/GrowthChart.tsx`,
`app/components/shared/Icon.tsx`, `app/components/shared/ModalPopupStyle.tsx`,
the existing consolidated `designComponents.test.tsx` and `growthChart.test.tsx`
suites, and this document. No chat layout change was made after confirmation
that its layout was working. No dependency, translation or native picker change.

Verification: all 137 service tests pass. New coverage checks reversed chart
touch targets/tooltip values and ruler initial selection, offsets, snapping and
limits in both directions. No new TypeScript diagnostics compared with staged
code; existing project errors remain. Android and iOS Release preview builds
pass. An isolated in-memory RTL preview confirmed full icon glyphs, chart
direction/labels and ruler alignment on both platforms. Android interaction
verified ruler scrolling, the right-side measurement's correct tooltip, and a
top-right popup close control. It did not save profile measurements. The preview
was removed and the original entry point restored for final normal builds.
Both final normal Release builds pass; installed and launched both, confirming
the existing Home screen and profiles render in the enabled Bebbo Dev RTL mode.

Native date/time dialogs have their own localization. On Android the picker
follows the system/app locale; the JS-only English-as-RTL flag does not change
that locale. iOS also supports the existing picker `locale` prop, currently
derived from the selected language, so forcing English layout to RTL still
leaves an English picker. Verify native dialogs with a real Arabic system/app
locale when auditing their localization. See the
[picker localization notes](https://github.com/react-native-datetimepicker/datetimepicker#localization-note).

### RTL category icon spacing

- `app/components/shared/FilterStyle.tsx`: use symmetric tile padding and a row gap, with a fixed, non-shrinking 24-point icon slot. Keep labels flexible and preserve their existing font size.
- `app/components/ArticleCategories.tsx` and `app/components/ActivitiesCategories.tsx`: replace nested one-sided icon margins with the shared slot. Icon sizes, category order, filter selection and analytics are unchanged.
- `app/components/NotificationsCategories.tsx`: use the same slot and row spacing instead of putting flex and a one-sided margin on the glyph itself.
- Check Advice and Games category filters and Notification filters in LTR and RTL, including selected categories and long translated labels. This is a targeted layout fix; a complete screen-by-screen visual audit remains separate.

### RTL onboarding follow-up

- `FeaturesTCView.tsx` and `Terms.tsx`: constrain feature text to its available column, align it to the leading edge on both platforms, and let the consent text wrap beside its checkbox.
- `ButtonGlobal.tsx`, `ChildSetupList.tsx` and `home/ChildProfile.tsx`: render the add-child plus as a separate leading element. Reuse existing translations, removing a legacy plus prefix/suffix at render time to avoid duplicate symbols.
- `ModalPopupStyle.tsx`: close controls now follow the trailing edge (right in LTR, left in RTL), including development-video popups. This supersedes the earlier physical-top-right assumption.
- `ChildDate.tsx` and `FormPrematureContainer.tsx`: move info buttons out of nested text into separate, non-shrinking touch areas. Opening premature-child information does not toggle its checkbox.
- Regression coverage remains in `designComponents.test.tsx`; no additional test file or translation key is required.
- Validation: 140 tests pass; no new TypeScript diagnostics versus the staged baseline; normal Android Release and iOS simulator Release builds pass. Temporary component previews confirmed Android RTL and iOS LTR layout. The iOS RTL onboarding flow still needs a visual check. Preview files were removed and the original app entry point restored.

### Full Terms screen width and scrolling

- `app/screens/Terms.tsx`: stretch the page to the available width, explicitly constrain the feature and consent sections to that width, and use growing scroll content instead of a fixed-height flex container. This prevents the narrow-column layout and overlapping content seen on iOS.
- Verified the actual Terms screen, with the normal app providers and navigator, on the Android emulator and iPhone 17 simulator in RTL. Feature descriptions wrap within their column; the consent checkbox, links and Continue button remain separate. This supersedes the prior note that iOS RTL onboarding verification was pending for this screen.
- The temporary Terms-only start route used for verification was removed. No onboarding acceptance or child data was saved.
- Also verified scrolling on a shortened Android display (1080 × 1600), then restored the original display size. All 140 tests pass, with no new TypeScript diagnostics.
