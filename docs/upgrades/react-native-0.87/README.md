# React Native 0.87 migration

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
npm install --legacy-peer-deps
```

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

RTL, Google sign-in API migration, and a full security-alert cleanup are
separate follow-up work.

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

`npm install --legacy-peer-deps` completed with all seven existing patches
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

Validation: `npm install --legacy-peer-deps` completed and all seven active
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

Installation used `npm install --legacy-peer-deps`; all seven existing patches
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
