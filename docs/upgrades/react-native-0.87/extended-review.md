# Extended application review — 13 November 2026

Branch: `RNSDKUpgrade-review-fixes`. This extends the earlier [bug sweep](bug-sweep.md), whose results describe its recorded commits, not subsequent application changes. The original PR branch is unchanged.

## Implemented in this review

| Priority | Evidence | Change and verification |
| --- | --- | --- |
| High: backup confidentiality/integrity | Historical JSON exports use a fixed IV and unauthenticated AES-CBC | New v2 exports use a native random 16-byte IV and AES-256-CBC with encrypt-then-HMAC-SHA256, domain-separated MAC key; authenticate the version/context, IV and ciphertext before decryption. Retain legacy raw/quoted ciphertext and binary Realm readers. Round-trip, tampering, wrong key and format rejection tests pass using Node crypto. Actual native crypto cross-platform round trips remain device acceptance. The app-wide key remains extractable; this does **not** provide user-held-key security. Older app versions cannot read v2 exports. |
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

314 Jest tests / 34 suites; 22 Node tests; 29 Python packaging/configuration tests pass. Type regression gate passes with 96 inherited diagnostics (raw tsc remains non-zero). Local npm audit: 11 low, zero moderate/high/critical. Registry/npm versions can change totals. Fresh CI/native results will be recorded below after completion.

## Evidence boundaries and remaining work

Production historical Crashlytics was reviewed read-only for Bebbo Android/iOS, Rerai Android, Pacific Android, Babuni Android and Wawamor Android/iOS. Pacific/Babuni iOS showed “app detected; waiting for a crash”, not delivery verification. Wawamor iOS had no open crash issues in the selected 90-day view. Rerai iOS did not finish loading. Browser access ended before Türkiye, Kosovo, development apps or DebugView could be checked. Do not infer crash-free operation from these views or attribute old-release issues to the new branch without reproduction.

Real signed Firebase configurations, live DebugView event reconciliation, native offline/restart/reconnect delivery, Drive account scenarios, push, installed historical Realm migrations, real Arabic/Urdu translations, large-font screenshots, actual low-end/16 KB hardware and iOS simulator/device execution remain acceptance checks. Compile-only Firebase fixtures cannot confirm project routing. Detailed matrices and procedures are linked below.

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
- [Security severity, evidence, native dependency decisions and remaining risks](security-assessment.md).
- [RTL/design findings and device acceptance matrix](rtl-and-device-validation.md); [per-flavour native IDs/languages/configuration matrix](flavour-matrix.json).

## CI provenance

First checkpoint: `d664ad0b67dd88d28c35caf17210aa5e68ac757a`, [run 43463202988](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43463202988). Its unit job and all 16 production JS bundle jobs passed. Native jobs were still running when the subsequent Gradle/privacy/archive corrections were prepared. Results from that checkpoint do not validate later source changes. Final checkpoint/run outcomes will be appended after verification.


A final startup regression handles malformed persisted taxonomy JSON before PersistGate opens. It reads only matching-language Realm metadata or the existing bundled taxonomy, repairs only that Redux cache field, and shows the existing retry UI if neither source is valid. It does not delete profiles/settings. Six tests cover valid caches, truncated/scalar/array snapshots and missing recovery data.


Gradle compatibility follow-up: all eight Android jobs at `bdfdcc4` failed before app compilation because RN 0.87.1's build-plugin compiler 2.2.0 could not read Gradle 9.8.1's embedded Kotlin 2.4 metadata. A scoped patch compiles only RN's Gradle plugins with Kotlin 2.4.21 while retaining their KGP implementation dependency and the application's KGP 2.2.10. [Focused run 43472919633](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43472919633) passed `help buildEnvironment :react-native-webview:compileReleaseKotlin` on Gradle 9.8.1/JDK 21. Its resolved build graph confirms KGP 2.2.10; host-side Kotlin stdlib resolves to 2.4.21. No metadata-version checks are disabled. Full application builds still need final-run results; a successful preflight is not a substitute for them.

Category telemetry also handles multiple public category IDs and malformed historical suffixes without generating invalid/high-cardinality event names; it never uploads an unrecognised suffix as text.
