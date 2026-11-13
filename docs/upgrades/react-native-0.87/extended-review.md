# Extended application review — 13 November 2026

Branch: `RNSDKUpgrade-review-fixes`. This extends the earlier [bug sweep](bug-sweep.md), whose results describe its recorded commits, not subsequent application changes. The original PR branch is unchanged.

## Implemented in this review

| Priority | Evidence | Change and verification |
| --- | --- | --- |
| High: backup confidentiality/integrity | Historical JSON exports use a fixed IV and unauthenticated AES-CBC | New v2 exports use a native random 16-byte IV and AES-256-CBC with encrypt-then-HMAC-SHA256, domain-separated MAC key; authenticate the version/context, IV and ciphertext before decryption. Retain legacy raw/quoted ciphertext and binary Realm readers. Round-trip, tampering, wrong key and format rejection tests pass using Node crypto. Native AES/HMAC/legacy round trips and tamper rejection pass on Bebbo/Rerai Android emulators and iOS simulators; actual transferred-file interoperability remains acceptance. The app-wide key remains extractable; this does **not** provide user-held-key security. Older app versions cannot read v2 exports. |
| High: crashes/incorrect native packages | Historical Bebbo Android reports include AArch64 code inside an x86_64 library directory | Packaging guards now verify ELF machine, class and endianness for every AAB/device-split native library, in addition to existing ABI presence, compression, C++ runtime and alignment checks. Three regressions failed before the guard and pass afterwards. |
| Medium: startup taxonomy crash | Historical Rerai `setTaxonomyIds` undefined-object crash; reproduced with missing groups | Accept array/keyed taxonomy collections, ignore malformed rows, safely resolve configured categories in country order, and fix service-provider relationship mapping. Seven reducer regressions pass. |
| Medium: offline telemetry/preferences loss | Country/language selection calls content reset, which deleted every DataRealm table | Reset downloaded content while retaining ConfigSettings and Event. Regression proves caregiver settings and queued events survive. No Realm schema change. |
| Medium: analytics accuracy/privacy | Restore emitted onboarding child counts; searches sent free text; selected-child properties included health attributes; initial screen omitted | Report `backup_restore_completed` after the single child transaction, never profile creation for imports; new successful creates use `profile_created`; remove free text and clinical values through an explicit parameter policy and clear legacy child properties. Track first screen and route-key changes. Keep route-opened aliases for dashboard compatibility; never sum aliases and screen_view. Tests cover policy and sequencing. |
| Medium: offline capture time | JavaScript waited for connectivity before passing events to Firebase | Submit immediately to Firebase's native persistent offline queue, including direct UI calls. A fallback retry is stored only after actual SDK rejection and only when analytics storage is permitted; never bypass a denied native consent. Legacy retries remain serialised and acknowledged rows are removed. Native request acceptance is not delivery proof. |
| Medium: HTML rendering | Four screens supplied a new WebView that discarded source/bridge/layout props | Forward the renderer's WebView props through the actual component; keep Android hardware rendering. Country content/media need device acceptance. |
| Medium: RTL input | Seven flavour name filters removed Unicode combining marks; Babuni already permitted them | Preserve Arabic/Urdu vowel marks and Bengali combining marks in every flavour. Eight configuration-level tests cover composed letters, marks and emoji removal. Invalid locale data falls back safely. |
| Performance | 55 generated reminders caused 55 complete native reconciliation passes | Coalesce consecutive schedule calls into one durable batch; cancellation/read operations remain ordering barriers. Measured regression: 55 → 1 `getTriggerNotifications` calls, all 55 records retained. Migration, cancellation, tap and iOS 64-request overflow tests pass. This measures bridge work, not device wall-clock speed. |
| Supply chain | Current glob/minimatch advisories in build dependencies; mutable Actions tags | Scoped overrides update glob to 14.0.2/minimatch to 11.0.1 without changing legacy callback consumers. Patch Babel resolver's CommonJS interop, tested with real glob roots. Pin existing Actions versions to resolved commit SHAs. |
| Release correctness | Manual non-Bebbo Gradle builds can default JavaScript to Bebbo | Fail bundling when native flavour and FLAVOR/ENVFILE disagree; correct Babuni npm scripts' environment paths. Native compile matrix expanded to eight primary flavours × both platforms. |

## Current local checks

348 Jest tests / 39 suites; 23 Node tests; 29 Python packaging/configuration tests pass. Type regression gate passes with 96 inherited diagnostics (raw tsc remains non-zero). Local npm audit: 11 low, zero moderate/high/critical. Registry/npm versions can change totals. The latest production-source CI verifies these checks at efe62468; full run/source provenance and native results are recorded below.

## Evidence boundaries and remaining work

Production historical Crashlytics was reviewed read-only for Bebbo Android/iOS, Rerai Android, Pacific Android, Babuni Android and Wawamor Android/iOS. Pacific/Babuni iOS showed “app detected; waiting for a crash”, not delivery verification. Wawamor iOS had no open crash issues in the selected 90-day view. Rerai iOS did not finish loading. Browser access ended before Türkiye, Kosovo, development apps or DebugView could be checked. Do not infer crash-free operation from these views or attribute old-release issues to the new branch without reproduction.

Real signed Firebase configurations, live DebugView event reconciliation, native offline/restart/reconnect Analytics delivery, Drive account scenarios, push, installed historical Realm migrations, real Arabic/Urdu translations, full-screen large-font screenshots, actual low-end/16 KB hardware and physical iOS device execution remain acceptance checks. Compile-only Firebase fixtures cannot confirm project routing. Detailed matrices and procedures are linked below.

Realm 20.2.0/schema 4 and dotenv 3.4.12 are intentionally retained. Firebase 26.4.1 remains on the tested CocoaPods path; 27's native integration migration is separate. No framework/native runtime major is upgraded merely to clear an outdated list. Remaining low build-tool advisories with no compatible published fix are not resolved by forced downgrades.


## Additional confirmed fixes after the first checkpoint

- Gradle 9.4.1 is affected by high-severity first-party advisories outside npm audit. Pin the patched 9.8.1 distribution/checksum; fresh native compilation is required before calling this compatible.
- Fix ATT denial being overridden by Facebook tracking initialisation. All ten Android branded manifests and ten iOS app plists default advertising ID collection off. Five consent regressions verify denied/blocked/unavailable/granted/revoked decisions.
- Explicit iOS privacy/screen flags cover every app target even where checked-in RNFB script phases are absent. Ten archive schemes upload symbols using their own archived app configuration; unsigned/fixture builds never upload. Source tests cover all ten, and the native workflow checks built bundle ID/Firebase project/flags/minimum OS/app dSYM.
- Retain private composed iOS Hermes maps and select the right JS flavour for all ten Xcode targets; Android guards the corresponding variant/FLAVOR pairing. Supported Android API 24/iOS 15.1 and existing country identifiers are retained.
- Content verification was adding synthetic game ID 1234 and removing user bookmarks based on incomplete cached content. Stop treating the cache as authoritative user data; a regression reproduces the old mutation and verifies all saved IDs remain.
- Confirm profile edit writes before navigation/analytics; return the actual update result from the database helper. Add explicit replacement confirmation to all three restore UI entry points, validate nested backup records and reject corrupt inner control characters without rewriting user text. The new warning needs approved country translations.
- Replace misleading feedback/survey submitted and email sent events with observed link-opening events, only after successful native handoff. Handle unsupported/malformed link schemes and native errors. Count confirmed backup exports separately.
- Manual Crashlytics reports remove payload text while retaining error class/frames; backup UI uses that path. Keep raw error details out of caregiver fallback screens.
- Long shared headers use selected-country typography and can grow/wrap; Arabic/Urdu locale aliases now select the intended digit set. Real native visual acceptance remains separate.

## Review deliverables

- [Analytics coverage, event semantics and offline reconciliation](analytics-coverage.md); [complete source event/route/screen inventory](analytics-source-inventory.json).
- [Backup scope, regression scenarios and device procedure](backup-validation.md).
- [Security severity, evidence, native dependency decisions and remaining risks](security-assessment.md); [available crash history and root-cause boundaries](crash-history.md).
- [Validation results and remaining release gates](validation-results.md).
- [RTL/design findings and device acceptance matrix](rtl-and-device-validation.md); [per-flavour native IDs/languages/configuration matrix](flavour-matrix.json).

## CI provenance

First checkpoint: `d664ad0b67dd88d28c35caf17210aa5e68ac757a`, [run 43463202988](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43463202988). Its unit job and all 16 production JS bundle jobs passed. Native jobs were still running when the subsequent Gradle/privacy/archive corrections were prepared. Results from that checkpoint do not validate later source changes. Final checkpoint/run outcomes will be appended after verification.


A final startup regression handles malformed persisted taxonomy JSON before PersistGate opens. It reads only matching-language Realm metadata or the existing bundled taxonomy, repairs only that Redux cache field, and shows the existing retry UI if neither source is valid. It does not delete profiles/settings. Six tests cover valid caches, truncated/scalar/array snapshots and missing recovery data.


Gradle compatibility follow-up: all eight Android jobs at `bdfdcc4` failed before app compilation because RN 0.87.1's build-plugin compiler 2.2.0 could not read Gradle 9.8.1's embedded Kotlin 2.4 metadata. A scoped patch compiles only RN's Gradle plugins with Kotlin 2.4.21 while retaining their KGP implementation dependency and the application's KGP 2.2.10. [Focused run 43472919633](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43472919633) passed `help buildEnvironment :react-native-webview:compileReleaseKotlin` on Gradle 9.8.1/JDK 21. Its resolved build graph confirms KGP 2.2.10; host-side Kotlin stdlib resolves to 2.4.21. No metadata-version checks are disabled. Full Android application builds subsequently passed for all eight primary flavours; see the native build matrix for exact sources/ABI coverage. The preflight alone was not used as their substitute.

Category telemetry also handles multiple public category IDs and malformed historical suffixes without generating invalid/high-cardinality event names; it never uploads an unrecognised suffix as text.


The first custom Analytics event now waits for legacy child-property cleanup, shared across concurrent callers. A delayed-native-cleanup regression verifies that no custom event is submitted early and that cleanup runs only once. Native automatic startup events can precede JavaScript; upgrade DebugView inspection and historical data retention/deletion remain separate privacy acceptance work.


Data-preservation follow-up: the independent Redux Realm adapter used obsolete `migration` instead of `onMigration`, and its callback mistakenly selected destination objects from the old Realm. Correct both while retaining schema version 1. Five regressions cover schema-0 Unicode/empty cache preservation and current-schema behaviour. Bound fragments by worst-case UTF-8 size and avoid splitting surrogate pairs, preventing oversized native strings and text corruption. Localisation no longer deletes `isMigrated == false` child records when the Redux onboarding flag is false: ordinary caregiver-created profiles also have that value, so the flag is not a safe draft discriminator. Explicit caregiver profile deletion remains available. A source safety guard covers both localisation entry points. Real native migration/restart/interruption checks are being run on an isolated QA branch; no production test controller is included here.


Bookmark controls now check the actual native write and read back stored state before Redux/Analytics updates. Missing/deleted active profiles produce a recoverable message rather than `Object.values(undefined)`/property-access failures. Add/remove events reflect confirmed membership; repeated taps are guarded, and a profile switch cannot replace the new child's visible bookmarks with the previous child's list. The shared control uses the selected flavour's typography. Nine service regressions cover both content types, removal, missing/deleted profiles, failed writes and invalid input. Notification delivered/opened lifecycle coverage remains separately documented rather than inferred from push delivery.


Four rendered bookmark-control regressions additionally verify confirmed removal, repeated taps, failed writes and a profile switch before React rerenders. The last scenario reproduced a stale-ref race; reading the current Redux store after native completion prevents the previous child's favourites being dispatched into the newly selected profile.


Profile deletion now handles missing records safely, detaches embedded reminders before deleting their owner, cancels them only after confirmed deletion, prevents overlapping requests and emits one confirmed `profile_deleted` event with placeholder/caregiver distinction. All three caller screens retain current selection/navigation on failed deletion. Post-commit cancellation failure produces a generic nonfatal diagnostic rather than falsely reporting that the profile was restored. Seven regressions cover these service outcomes. Native UI deletion/permission reconciliation still needs the device journey check.


Legacy backup vaccination-only/partial-measurement fixtures exposed missing required height/weight strings: the old converter skipped fields for blank/null measurements, causing otherwise valid imports to fail native validation. Convert each available legacy value in its original units, preserve absent values as empty strings and retain the existing measured flag rule. Five tests execute the actual converter (four failed before correction), including unchanged current array-format records. Native acceptance is extended with the vaccination-only case.

One final startup check was blocked by the app's existing poor-connection/data-saver prompt. Its screenshot shows that prompt, not a crash. The smoke harness now declines this recognised prompt and waits a bounded time for the same required download-retry screen, retaining strict blank/error-screen checks. Other unexpected dialogs still fail the test.


The field-by-field legacy comparison also reproduced past-due pregnancy profiles being reclassified as born children on restore. Preserve an explicit stored expected-child flag and infer from dates only when an old file has none; normalise legacy boolean premature/placeholder flags to the existing string schema without losing true values. Three actual-converter regressions fail before the change and pass afterwards. These flag edge cases have unit verification; installed historical pregnancy fixtures still require device acceptance. No schema version or stored-data rewrite is introduced.
