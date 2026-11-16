# Bebbo upgrade comparison and regression recheck

14 November 2026. PR #1115 head `b1286358cbcc1187d07cdb277c13f4395edbe9f1` compared with reviewed application source `3abbb0d962d80bac0442fa5a11fa287c12a3bb8d` on `RNSDKUpgrade-review-fixes`.

This register separates changes already present in the upgrade PR from subsequent fixes. The PR remains open and its source branch was not altered. The original PR spans 195 changed paths from its recorded base. The detailed 69-entry register below covers the net follow-up changes, with 390 application/build/test/evidence paths plus these two new register artifacts. Every one of the 392 paths is mapped in Appendix A; generated files and historical evidence are not mislabelled as separate functional bugs.

Three regressions in the newer backup implementation were reproduced and fixed during this recheck: Unicode creation versus unlock policy, stale preview invalidation and same-render recovery tap races. They are C14 to C16. No additional confirmed critical-severity defect was established in this recheck. Passing the checks below does not prove zero defects on every physical device or external service.

## Verified results

Final source [CI run 43551171807](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43551171807) checks out `3abbb0d962d80bac0442fa5a11fa287c12a3bb8d` from controller `d9e5d9be4e5fd99ebb8e5dc012b48bb779a884b4`: all 17 jobs pass. Local checks were also rerun.

- 440 Jest tests in 53 suites, 35 Node tooling tests and 30 Python packaging/native-configuration tests pass.
- Full strict TypeScript has zero diagnostics; all 96 vector resources, static flavour mappings and generated source inventory verify.
- All 16 Android/iOS release JavaScript bundles pass across Bebbo, Bebbo Dev, Babuni, Foleja, Merhaba Bebek, Wawamor, Rerai Umntwana and Bebbo Pacific.
- CI npm audit reports 11 low, zero moderate/high/critical entries. Native/build/backend advisories have separate scope and documented deferrals.
- Earlier native run 43544601957 passed 96 scenarios on e093124c across Bebbo/Rerai Android/iOS. It predates the new recheck fixes; those three have fresh targeted/full JS/crypto tests and bundles, not a fresh device/native scenario run.

## Changes already present in PR 1115

The framework upgrade, native library replacements and selected dependency majors belong to the PR baseline. They must not be credited to the later fixes. RN 0.78.2 to 0.87.1, React 19.0.0 to 19.2.3, SDK 37, AGP 9.2.1 and application Kotlin 2.2.10 were already selected there. The later branch changes Gradle 9.4.1 to 9.8.1 and applies scoped compatibility/security corrections. The initial PR includes FastImage/filesystem/notification/icon/keyboard replacements, Navigation 7, Reanimated 4, growth-chart migration, Drive authorisation and native configuration work. Its complete 195-path baseline inventory is preserved in the companion JSON; this detailed register describes subsequent changes relative to that head.

## Priority and remaining release gates

High-priority repaired areas include destructive restore/localisation, profile migration, incomplete offline persistence, shared-key backup protection for new exports, consent/privacy failures, production test instrumentation and native flavour/build integrity. Priorities below are engineering review priorities, not formal CVSS scores.

Remaining high-priority acceptance: representative authorised historical backup files; signed upgrades over installed releases without clearing data; actual Drive OAuth/account/quota/provider interruptions; physical low-memory/older OS/32-bit/16 KiB devices; approved Arabic/Urdu resources and full visual/accessibility coverage; production endpoint TLS/backend/API restrictions and remaining native/build advisories. Existing old backup files retain their earlier protection. New passphrases cannot be recovered. Live Firebase/DebugView/Crashlytics reconciliation is excluded from this recheck. No device speed gain, complete production security certification or authoritative profile census is asserted.

## Detailed change register

### C01 Removal of production test instrumentation

**1 Area of change:** Removal of production test instrumentation (High priority production integrity).

**2 Bug or issue:** The PR navigation graph contained an audit controller that polled test commands. Test-only navigation/state manipulation could execute in production and contaminated the shipped application.

**3 Change made in detail:** Remove the controller and its audit imports from production navigation. Add a release-bundle scan for its globals and command filenames. Native QA now uses an isolated branch and an explicit source-difference guard; its controller files are not merged into the application branch.

**4 Files impacted:** 3 changed paths:

- `.github/workflows/review-checks.yml` (F006)
- `app/navigation/AppNavigation.tsx` (F084)
- `scripts/check-production-bundle.cjs` (F380)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C02 Atomic child restore shared by every import route

**1 Area of change:** Atomic child restore shared by every import route (High priority data preservation).

**2 Bug or issue:** Local-file, Drive and onboarding paths duplicated restoration logic and could clear live records before the complete replacement was validated. Conversion or a later insertion failure could lose existing profiles.

**3 Change made in detail:** Separate read/preview from mutation. Detach and validate every child, convert legacy fields before opening the write, then delete/insert all children in one synchronous Realm transaction. Propagate failure to callers and reject overlapping operations. V3 adds the cross-store journal described separately; a transaction alone does not make Redux/settings atomic.

**4 Files impacted:** 3 changed paths:

- `app/services/__tests__/backup.test.ts` (F128)
- `app/services/backup.tsx` (F173)
- `app/services/backupFormat.ts` (F178)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C03 Document picker and private import copies

**1 Area of change:** Document picker and private import copies (High priority data preservation).

**2 Bug or issue:** Provider content URIs and deprecated picker assumptions differed between Android/iOS; binary Realm inspection could touch the original file. File saves could report success before a native copy completed.

**3 Change made in detail:** Use the current picker private-copy API for JSON and binary files, await native save/share completion, handle cancellation as cancellation, use unique cache names and remove private copies in finally blocks. Inspect a copied Realm and close it before cleanup. Bound provider copies before reading them; do not delete the original selected document.

**4 Files impacted:** 3 changed paths:

- `app/services/__tests__/backup.test.ts` (F128)
- `app/services/backup.tsx` (F173)
- `app/services/backupDocuments.ts` (F176)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C04 Historical backup framing and validation

**1 Area of change:** Historical backup framing and validation (High priority data preservation).

**2 Bug or issue:** Android JSON-quoted encrypted strings, iOS/Drive raw bytes, BOM/outer controls and old binary Realm files did not share reliable handling. Stripping control bytes inside payload strings could silently change names/comments.

**3 Change made in detail:** Normalise only historical outer framing, accept raw or quoted cipher envelopes, preserve the old IV suffix normalisation and retain legacy readers. Reject empty/invalid profiles, duplicate child/nested IDs, malformed collections and invalid saved identifiers before mutation. Do not silently rewrite internal user text.

**4 Files impacted:** 5 changed paths:

- `app/services/__tests__/backup.test.ts` (F128)
- `app/services/__tests__/backupCipher.test.ts` (F130)
- `app/services/backup.tsx` (F173)
- `app/services/backupCipher.ts` (F175)
- `app/services/backupFormat.ts` (F178)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C05 Drive replacement and confirmed exports

**1 Area of change:** Drive replacement and confirmed exports (High priority data preservation).

**2 Bug or issue:** Deleting the previous cloud backup before a successful replacement, swallowing provider errors or treating cancellation as success could leave caregivers without a usable copy.

**3 Change made in detail:** Await authentication, folder/file results and confirmed upload. Retain the previous copy until upload succeeds, then attempt its cleanup. Local export success depends on native provider/share confirmation. Deduplicate export implementation used by Quick Links and report only completed exports. Live OAuth, quota and cross-account behaviour remain provider acceptance.

**4 Files impacted:** 4 changed paths:

- `app/components/homeScreen/QuickLinksRow.tsx` (F061)
- `app/services/__tests__/backup.test.ts` (F128)
- `app/services/backup.tsx` (F173)
- `app/services/backupDocuments.ts` (F176)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C06 Onboarding restore confirmation and navigation parameters

**1 Area of change:** Onboarding restore confirmation and navigation parameters (High priority data preservation).

**2 Bug or issue:** Preview could mutate data, repeated confirmation taps could import twice, and relationshipname/parent route fields were inconsistent. Navigation 7 cleanup used obsolete subscription handling.

**3 Change made in detail:** Keep preview read-only, require the same explicit replacement warning as Settings/Drive, guard repeated import taps and restore once. Preserve parent/relationship fields, select the restored active profile and request notification regeneration only after success. Use the Navigation 7 unsubscribe function. V3 previews carry an opaque handle rather than full records.

**4 Files impacted:** 7 changed paths:

- `app/screens/AddChildInfoSetup.tsx` (F090)
- `app/screens/AddChildSetup.tsx` (F091)
- `app/screens/ChildImportSetup.tsx` (F094)
- `app/screens/ChildSetup.tsx` (F095)
- `app/screens/home/SettingScreen.tsx` (F108)
- `app/services/__tests__/confirmBackupReplacement.test.ts` (F139)
- `app/services/confirmBackupReplacement.ts` (F189)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C07 Legacy clinical record and pregnancy conversion

**1 Area of change:** Legacy clinical record and pregnancy conversion (High priority data preservation).

**2 Bug or issue:** Vaccination-only legacy records could omit required height/weight strings; past-due expected children were reclassified as born children. Boolean profile flags could lose true values.

**3 Change made in detail:** Convert each available legacy height/weight value using the existing units, preserve absent values as empty strings and retain the measured-flag rule. Preserve an explicit expected-child flag regardless of an overdue date, infer only when absent, and normalise legacy boolean premature/placeholder values to the existing string schema. Preserve root measurement place and existing identifiers. No clinical schedule or schema version is changed.

**4 Files impacted:** 2 changed paths:

- `app/services/Utils.ts` (F122)
- `app/services/__tests__/legacyBackupConversion.test.ts` (F149)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C08 Passphrase protected portable backup format

**1 Area of change:** Passphrase protected portable backup format (High priority backup confidentiality).

**2 Bug or issue:** Historical exports used a shared application key. Random IVs and a MAC alone still left confidentiality dependent on a key extractable from releases/history.

**3 Change made in detail:** All new caregiver-facing exports use v3 with a user-held passphrase, PBKDF2-HMAC-SHA256 at 600000 iterations, a random 256-bit salt and 128-bit IV, AES-256-CBC and encrypt-then-HMAC with a domain-separated authentication key. Authenticate metadata before decrypting and reject attacker-selected work factors. Keep v2/fixed-IV/binary readers; old files retain their original protection. There is no password reset or escrow.

**4 Files impacted:** 5 changed paths:

- `app/services/__tests__/backupCipher.test.ts` (F130)
- `app/services/__tests__/protectedBackupCipher.test.ts` (F157)
- `app/services/backup.tsx` (F173)
- `app/services/backupCipher.ts` (F175)
- `app/services/protectedBackupCipher.ts` (F201)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C09 Portable photos and image input bounds

**1 Area of change:** Portable photos and image input bounds (High priority data preservation).

**2 Bug or issue:** A local photo pathname in a backup does not transfer image bytes to another device. Blindly accepting file paths or large image dimensions could overwrite files or exhaust resources.

**3 Change made in detail:** Include photo bytes by child UUID in v3. Validate ownership, path basenames, base64, JPEG/PNG headers and dimensions before use. Stage independent generated filenames, never overwrite original photos, and clean unreferenced staged files safely. Apply an exact 8 MiB decoded limit per photo, 24 MiB total photo base64 and 32 MiB UTF-8 plaintext bounds. Base64 padding is included in byte accounting. Unsupported/missing photos fail explicitly rather than silently disappearing.

**4 Files impacted:** 4 changed paths:

- `app/services/__tests__/backupSnapshot.test.ts` (F135)
- `app/services/backupPhoto.ts` (F180)
- `app/services/backupSnapshot.ts` (F184)
- `app/services/protectedBackupCipher.ts` (F201)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C10 Portable caregiver settings and country isolation

**1 Area of change:** Portable caregiver settings and country isolation (High priority data preservation).

**2 Bug or issue:** Child-only exports omitted caregiver details, selected-child and reminder/data-saver preferences. Copying an entire cache/configuration could apply another country's taxonomy or expose credentials.

**3 Change made in detail:** Snapshot only allowlisted caregiver settings, active child and notification/data-saver flags. Record flavour/country/language context; require the same flavour and country and permit a different UI language within that country. Preserve unrelated receiving-country settings. Exclude credentials, OS permissions, downloaded CMS caches and telemetry queues. Existing onboarding form input may supersede restored caregiver details.

**4 Files impacted:** 6 changed paths:

- `App.tsx` (F008)
- `app/instances/index.ts` (F079)
- `app/services/__tests__/backupSnapshot.test.ts` (F135)
- `app/services/backupRecovery.ts` (F182)
- `app/services/backupRuntime.ts` (F183)
- `app/services/backupSnapshot.ts` (F184)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C11 Durable recovery across profiles settings and Redux

**1 Area of change:** Durable recovery across profiles settings and Redux (High priority data preservation).

**2 Bug or issue:** A successful Realm child transaction followed by failed settings/Redux persistence could leave mixed state. Process death can interrupt multi-store restoration.

**3 Change made in detail:** Persist a before/after journal in existing ConfigSettings before changing profiles. Restore children transactionally, await Redux persistence, then finalise settings and journal removal together. On startup replay pending recovery before normal navigation. Support explicit rollback with a durable rollback direction and retain original photo files until recovery completes. Failed cleanup does not reverse a committed restore. UserRealm 4, DataRealm 13 and ReduxRealm 1 remain unchanged.

**4 Files impacted:** 5 changed paths:

- `App.tsx` (F008)
- `app/components/BackupRecoveryScreen.tsx` (F049)
- `app/services/__tests__/backupRecovery.test.ts` (F133)
- `app/services/backupRecovery.ts` (F182)
- `app/services/backupRuntime.ts` (F183)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C12 Backup UI secrets modal handoff and safe errors

**1 Area of change:** Backup UI secrets modal handoff and safe errors (High priority backup resilience).

**2 Bug or issue:** Passphrases/large preview objects should not enter persistent Redux or navigation. Competing native dialogs and raw provider errors can cause failures or disclose sensitive details.

**3 Change made in detail:** Mount a secure prompt with export confirmation, no autocorrect, explicit font scaling and background clearing. Wait for iOS Modal dismissal before presenting a provider. Use a root busy View instead of a competing native loading Modal. Keep secrets in operation memory, use an expiring preview handle and show only recognised safe error text. Block normal use during unresolved journal recovery.

**4 Files impacted:** 9 changed paths:

- `App.tsx` (F008)
- `app/components/BackupPasswordPrompt.tsx` (F048)
- `app/components/BackupRecoveryScreen.tsx` (F049)
- `app/components/homeScreen/QuickLinksRow.tsx` (F061)
- `app/services/__tests__/backupPasswordPrompt.test.tsx` (F131)
- `app/services/__tests__/backupPreview.test.ts` (F132)
- `app/services/backupErrorMessage.ts` (F177)
- `app/services/backupPassword.ts` (F179)
- `app/services/backupPreview.ts` (F181)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C13 Abandoned private backup cache cleanup

**1 Area of change:** Abandoned private backup cache cleanup (Security and resilience).

**2 Bug or issue:** Finally blocks cannot run after process death, leaving private decrypted binary imports or encrypted export copies and Realm sidecars behind.

**3 Change made in detail:** Before import/export UI becomes accessible, remove only tightly matched helper-generated cache names and permitted Realm sidecars. Never inspect/delete provider files, live Realm files or profile photos. Return removed/failed counts and a generic diagnostic for incomplete cleanup; transient cache failures do not block access to committed data.

**4 Files impacted:** 5 changed paths:

- `App.tsx` (F008)
- `app/redux/reducers/realmSafe.ts` (F087)
- `app/services/__tests__/backupCacheCleanup.test.ts` (F129)
- `app/services/__tests__/realmDiagnostics.test.ts` (F159)
- `app/services/backupCacheCleanup.ts` (F174)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C14 Recheck fix Unicode passphrase normalisation

**1 Area of change:** Recheck fix Unicode passphrase normalisation (New regression fixed high priority).

**2 Bug or issue:** Our v3 writer counted decomposed combining characters before NFC normalisation. Six decomposed accented letters could pass a twelve-character check, while their equivalent composed spelling failed the unlock minimum. This could prevent opening a valid file.

**3 Change made in detail:** Count the creation minimum after NFC normalisation. Separate bounded non-empty unlock validation from creation-strength policy in both the UI and derivation path. Keep existing shorter-normalised v3 files unlockable with either equivalent spelling; do not silently change KDF, salt, MAC or ciphertext. New exports still enforce at least twelve normalised characters and confirmation.

**4 Files impacted:** 4 changed paths:

- `app/components/BackupPasswordPrompt.tsx` (F048)
- `app/services/__tests__/backupPasswordPrompt.test.tsx` (F131)
- `app/services/__tests__/protectedBackupCipher.test.ts` (F157)
- `app/services/protectedBackupCipher.ts` (F201)

Validation: Reproduced failing validation/decryption/UI cases against the previous implementation; all pass after correction. Node crypto exercises the real format and native API signatures. Device keyboard/provider acceptance remains.

### C15 Recheck fix stale preview handles

**1 Area of change:** Recheck fix stale preview handles (New regression fixed).

**2 Bug or issue:** Our preview reader rejected an old navigation handle by clearing the single current preview, inadvertently discarding a newer valid selection.

**3 Change made in detail:** Expire the stored preview only when its own TTL has elapsed. Reject a mismatched handle without modifying a newer live preview. Background clearing and explicit successful-import clearing remain.

**4 Files impacted:** 2 changed paths:

- `app/services/__tests__/backupPreview.test.ts` (F132)
- `app/services/backupPreview.ts` (F181)

Validation: A regression selecting old then new data fails before the fix and retains the newer data after it.

### C16 Recheck fix simultaneous recovery taps

**1 Area of change:** Recheck fix simultaneous recovery taps (New regression fixed).

**2 Bug or issue:** Our recovery screen relied on React busy state alone. Retry and rollback taps in the same render interval could both join the running recovery and invoke completion twice.

**3 Change made in detail:** Use a synchronous in-flight ref before setting busy state. Respect the first accepted recovery choice and ignore later taps until completion. Release the guard on failure so a deliberate retry or rollback remains available. The journal protocol and schema are unchanged.

**4 Files impacted:** 2 changed paths:

- `app/components/BackupRecoveryScreen.tsx` (F049)
- `app/services/__tests__/backupRecoveryScreen.test.tsx` (F134)

Validation: The corrected rendered rapid-tap regression fails on the prior component. Both rapid taps and failure-then-rollback pass after the ref guard.

### C17 User Realm migration callback correctness

**1 Area of change:** User Realm migration callback correctness (High priority data preservation).

**2 Bug or issue:** Schema-4 migration tested the new schema version rather than the previous version; missing autoChild values could remain unset. Async migration callbacks did not propagate failures transactionally.

**3 Change made in detail:** Use oldRealm.schemaVersion to decide migration, set only a missing placeholder flag and preserve explicit values. Keep migration work synchronous and target the new Realm objects. Do not bump the Realm package/schema or delete existing user data.

**4 Files impacted:** 3 changed paths:

- `app/database/config/dbConfig.ts` (F071)
- `app/database/migration/init.ts` (F074)
- `app/services/__tests__/legacyMigration.test.ts` (F150)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C18 Redux Realm migration and large Unicode cache persistence

**1 Area of change:** Redux Realm migration and large Unicode cache persistence (High priority data preservation).

**2 Bug or issue:** The adapter used obsolete migration rather than onMigration, selected destination objects from oldRealm and fragmented strings by UTF-16 length without a native UTF-8 bound.

**3 Change made in detail:** Register onMigration, write into newRealm objects and preserve old Unicode/empty caches. Bound fragments for worst-case UTF-8 size without splitting surrogate pairs. Parameterise cache-key queries. Keep ReduxRealm schema 1 and ensure failed writes are not reported as success.

**4 Files impacted:** 4 changed paths:

- `app/redux/reducers/realmPersistor.js` (F086)
- `app/redux/reducers/realmSafe.ts` (F087)
- `app/services/__tests__/realmDiagnostics.test.ts` (F159)
- `app/services/__tests__/realmPersistence.test.ts` (F160)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C19 Localisation must not delete caregiver profiles

**1 Area of change:** Localisation must not delete caregiver profiles (High priority data preservation).

**2 Bug or issue:** The localisation flow treated a reset onboarding flag and isMigrated false as authority to purge profiles, although ordinary caregiver-created records also have that value.

**3 Change made in detail:** Remove the implicit deletion from both country and language selection. Recover cache/onboarding state independently of child records. Retain explicit caregiver deletion and existing country customisation flows; source guards forbid reintroducing automatic profile deletion in these paths.

**4 Files impacted:** 3 changed paths:

- `app/screens/localization/CountrySelection.tsx` (F116)
- `app/screens/localization/LanguageSelection.tsx` (F117)
- `scripts/__tests__/release-guards.test.cjs` (F368)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C20 Malformed startup taxonomy recovery

**1 Area of change:** Malformed startup taxonomy recovery (High priority availability).

**2 Bug or issue:** Truncated/scalar cached taxonomy JSON could throw before navigation mounted and strand startup.

**3 Change made in detail:** Validate the cached object before PersistGate opens. Recover only matching-language metadata from DataRealm or the existing bundled taxonomy; repair only that Redux field. If neither source is valid, use the existing retry UI. Do not reset children, caregiver preferences or other country content.

**4 Files impacted:** 3 changed paths:

- `App.tsx` (F008)
- `app/services/__tests__/taxonomyRecovery.test.ts` (F164)
- `app/services/taxonomyRecovery.ts` (F205)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C21 Content sync persistence and cursor ordering

**1 Area of change:** Content sync persistence and cursor ordering (High priority offline integrity).

**2 Bug or issue:** A dispatched/forked cache write returned before durable storage. Delta cursors and consumers could advance despite missing content; a shared mutable error list mixed concurrent requests.

**3 Change made in detail:** Await the actual Realm persistence result before exposing success or advancing timestamps. Treat non-200 application responses and unconfirmed saves as retryable failure. Use a request-owned error list and pass accepted responses to success/cancellation consumers. Preserve retry information on cancelled downloads.

**4 Files impacted:** 4 changed paths:

- `app/database/dbquery/dataRealmCommon.ts` (F072)
- `app/redux/sagaMiddleware/saga.ts` (F089)
- `app/services/__tests__/contentSync.test.ts` (F140)
- `app/services/commonApiService.ts` (F188)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C22 Pinned article refresh and cache transaction results

**1 Area of change:** Pinned article refresh and cache transaction results (High priority offline integrity).

**2 Bug or issue:** Pinning an existing article skipped content refresh. Async forEach inside a synchronous Realm transaction detached errors, and some database methods did not return the committed result.

**3 Change made in detail:** Write article batches synchronously in one transaction, refresh every record and preserve an existing/new pin. Return actual completion status from cache/update methods; failed storage cannot masquerade as completed synchronisation. Existing API/schema contracts are retained.

**4 Files impacted:** 4 changed paths:

- `app/database/dbquery/dataRealmCommon.ts` (F072)
- `app/database/dbquery/userRealmCommon.ts` (F073)
- `app/services/__tests__/articleCache.test.ts` (F127)
- `app/services/__tests__/contentSync.test.ts` (F140)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C23 First launch cancellation and country fallback

**1 Area of change:** First launch cancellation and country fallback (High priority availability).

**2 Bug or issue:** Failed download followed by CANCEL/OK left installed apps blank. The gate never completed; request descriptions were passed as responses and country handling assumed response position zero.

**3 Change made in detail:** Complete readiness even when retry is cancelled, preserve failed requests and expose only accepted responses. Locate country responses by endpoint and fall back to cached/bundled countries whenever the response is missing/invalid. Native startup checks reject blank screens and require reachable retry actions.

**4 Files impacted:** 5 changed paths:

- `app/redux/sagaMiddleware/saga.ts` (F089)
- `app/services/__tests__/contentSync.test.ts` (F140)
- `app/services/__tests__/startupCountries.test.ts` (F163)
- `app/services/commonApiService.ts` (F188)
- `scripts/android-startup-smoke.sh` (F374)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C24 Taxonomy shape safety and caregiver role mapping

**1 Area of change:** Taxonomy shape safety and caregiver role mapping (Crash prevention).

**2 Bug or issue:** Reducers assumed collections were arrays and duplicated the other-caregiver condition for service providers. Category indexes could be read before metadata was ready.

**3 Change made in detail:** Normalise absent/keyed/array collections, filter malformed rows, resolve configured categories by stable unique names and positive numeric IDs, and map service-provider roles to their own field. Default missing category IDs to an empty collection. Country-specific taxonomy IDs remain data driven.

**4 Files impacted:** 4 changed paths:

- `app/components/ActivitiesCategories.tsx` (F046)
- `app/redux/reducers/utilsSlice.ts` (F088)
- `app/services/__tests__/taxonomyState.test.ts` (F165)
- `app/services/taxonomyCollections.ts` (F204)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C25 Preserve saved content identifiers

**1 Area of change:** Preserve saved content identifiers (High priority data preservation).

**2 Bug or issue:** verifyFavorites injected synthetic game 1234 and removed saved IDs merely because a partial offline cache did not contain the associated CMS item.

**3 Change made in detail:** Stop mutating caregiver bookmarks during cache verification. Keep the existing API as a compatibility no-op; listing screens resolve available content separately. A partial download is not proof of a CMS deletion.

**4 Files impacted:** 2 changed paths:

- `app/database/dbquery/userRealmCommon.ts` (F073)
- `app/services/__tests__/savedContent.test.ts` (F161)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C26 Bookmark write acknowledgement and profile switch races

**1 Area of change:** Bookmark write acknowledgement and profile switch races (High priority data correctness).

**2 Bug or issue:** The UI/analytics updated from stale props even if native storage failed. Missing profiles could throw; completion for one child could overwrite the newly selected child's visible favourites.

**3 Change made in detail:** Validate IDs and profile existence, await the real write and read back stored membership. Guard repeated taps with a ref and re-read the current Redux child after completion before dispatching visible state. Emit add/remove actions only for confirmed membership. Use selected-flavour typography.

**4 Files impacted:** 4 changed paths:

- `app/components/shared/ShareFavButtons.tsx` (F066)
- `app/services/__tests__/bookmarkControls.test.tsx` (F136)
- `app/services/__tests__/bookmarks.test.ts` (F137)
- `app/services/bookmarks.ts` (F185)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C27 Confirmed profile deletion and reminder ownership

**1 Area of change:** Confirmed profile deletion and reminder ownership (High priority data correctness).

**2 Bug or issue:** Callers cancelled reminders or changed selection/navigation despite failed deletion; missing records or invalid embedded objects could throw after their owner was deleted.

**3 Change made in detail:** Detach reminder data before deleting its owner, guard overlapping requests and require a success result. Only then cancel reminders and update selection/navigation in all three callers. Emit one confirmed deletion event with placeholder/caregiver distinction. Post-commit cancellation failure is a generic diagnostic and never pretends to undo a committed delete.

**4 Files impacted:** 6 changed paths:

- `app/screens/AddExpectingChildProfile.tsx` (F092)
- `app/screens/ChildSetupList.tsx` (F096)
- `app/screens/home/EditChildProfile.tsx` (F104)
- `app/services/__tests__/profileDeletion.test.ts` (F156)
- `app/services/childCRUD.ts` (F187)
- `app/services/profileDeletion.ts` (F200)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C28 Profile edits must finish before UI confirmation

**1 Area of change:** Profile edits must finish before UI confirmation (Data correctness).

**2 Bug or issue:** An update helper returned undefined despite performing a write, while callers could navigate and report an edit without confirmed persistence.

**3 Change made in detail:** Return the committed update result, handle missing/deleted active profiles and defer profile-update UI/analytics until storage succeeds. Preserve entered data and existing screen selection on failure. No automatic profile count is inferred from an attempted edit.

**4 Files impacted:** 4 changed paths:

- `app/database/dbquery/userRealmCommon.ts` (F073)
- `app/screens/home/EditChildProfile.tsx` (F104)
- `app/services/__tests__/bookmarks.test.ts` (F137)
- `app/services/childCRUD.ts` (F187)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C29 Growth interpretation height dates and invalid values

**1 Area of change:** Growth interpretation height dates and invalid values (High priority displayed information).

**2 Bug or issue:** Height-only records could be interpreted as zero because weight was checked first. Mixed timestamp/ISO/Date inputs and invalid measurements could produce misleading growth-card interpretations.

**3 Change made in detail:** Read height independently of weight, convert supported date representations through a shared helper and reject invalid/missing values rather than fabricate measurements. Correct invalid-measure flags in existing interpretation branches. Preserve the existing reference data and clinical thresholds; this is not independent clinical validation of the charts.

**4 Files impacted:** 3 changed paths:

- `app/services/__tests__/growthInterpretation.test.ts` (F147)
- `app/services/dateUtils.ts` (F190)
- `app/services/interpretationService.ts` (F194)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C30 Calendar age labels and date picker boundaries

**1 Area of change:** Calendar age labels and date picker boundaries (Functional).

**2 Bug or issue:** Age labels mixed date representations, bypassed translated plurals and could show invalid values. Parsing a local ISO date-only string as a JS Date interpreted it as UTC and shifted due-date limits in some zones.

**3 Change made in detail:** Use common date conversion and count-aware translation keys, retain calendar-age semantics and return a safe fallback for invalid input. Convert date-picker offsets directly to local-midnight Dates. Native/Luxon boundaries use toJSDate and sort comparisons use getTime. Tests cover New York, Athens, Nairobi, Karachi and leap-year month arithmetic.

**4 Files impacted:** 7 changed paths:

- `app/components/ChildDate.tsx` (F050)
- `app/services/__tests__/ageLabels.test.ts` (F125)
- `app/services/__tests__/calendarDate.test.ts` (F138)
- `app/services/ageLabels.ts` (F170)
- `app/services/calendarDate.ts` (F186)
- `app/services/childCRUD.ts` (F187)
- `app/services/dateUtils.ts` (F190)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C31 Notification generation identifiers and date anchors

**1 Area of change:** Notification generation identifiers and date anchors (Notification correctness).

**2 Bug or issue:** New-batch IDs could collide; saved-ID collisions could return undefined. Taxonomy IDs were treated as chronological age and a premature-child anchor used an ID rather than its planned date.

**3 Change made in detail:** Allocate against saved and newly generated IDs with a bounded collision strategy. Sort copied age periods by days without mutating shared taxonomy, use the existing planned-term anchor and handle missing vaccine catalogues as an empty valid state. Keep clinical scheduling intervals unchanged. Correct native Date conversions and stable numeric sorts in consumers.

**4 Files impacted:** 10 changed paths:

- `app/components/HeaderNotiIcon.tsx` (F054)
- `app/components/healthChekup/UpcomingHealthCheckup.tsx` (F059)
- `app/components/vaccination/tabs/UpcomingVaccines.tsx` (F069)
- `app/screens/CustomDrawerContent.tsx` (F097)
- `app/screens/home/HealthCheckups.tsx` (F106)
- `app/screens/home/Notifications.tsx` (F107)
- `app/screens/vaccination/AddChildVaccination.tsx` (F118)
- `app/services/__tests__/notificationGeneration.test.ts` (F154)
- `app/services/notificationService.ts` (F198)
- `app/services/periodicSync.ts` (F199)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C32 Notification queue performance without lost ordering

**1 Area of change:** Notification queue performance without lost ordering (Measured performance and ordering).

**2 Bug or issue:** Scheduling a large desired reminder set repeatedly persisted/rebuilt the queue, adding avoidable work. Optimising without operation barriers could reorder cancellation or reads.

**3 Change made in detail:** Coalesce only adjacent scheduling operations that have not started, persist the desired batch before native scheduling and retain queue barriers around cancellation/read/in-flight operations. Do not claim native OS delivery from stored records. Existing tests exercise ordering and coalescing, with earlier bounded host measurements recorded in the performance notes.

**4 Files impacted:** 2 changed paths:

- `app/services/LocalNotifications.js` (F121)
- `app/services/__tests__/localNotifications.test.ts` (F151)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C33 Deep links and external navigation safety

**1 Area of change:** Deep links and external navigation safety (Security and resilience).

**2 Bug or issue:** Malformed/stale links or an unavailable navigation ref could produce unhandled navigation failures. Arbitrary schemes from notification/drawer content could invoke unexpected native handlers.

**3 Change made in detail:** Validate supported routes and parameters, bound pending navigation handling and recover after readiness rather than dispatch blindly. Shared external handoff permits web URLs, with explicit opt-in for email and the existing Apple review schemes. Catch OS rejections and keep notification survey handoffs consistent. Association-domain and real push/deep-link acceptance remain device/service checks.

**4 Files impacted:** 8 changed paths:

- `app/navigation/AppNavigation.tsx` (F084)
- `app/screens/CustomDrawerContent.tsx` (F097)
- `app/services/DeepLinking.tsx` (F119)
- `app/services/__tests__/deepLinking.test.tsx` (F141)
- `app/services/__tests__/externalLink.test.ts` (F144)
- `app/services/__tests__/notificationLink.test.ts` (F155)
- `app/services/externalLink.ts` (F192)
- `app/services/notificationLink.ts` (F197)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C34 Video metadata and playback fallback

**1 Area of change:** Video metadata and playback fallback (Crash prevention).

**2 Bug or issue:** Missing/non-string video metadata could crash render. A local failure variable reset on rerender and did not reliably retain the poster fallback.

**3 Change made in detail:** Validate URL metadata and relative media paths, tolerate a missing API base, retain playback failure in component state and reset it only when the source changes. Preserve existing direct/YouTube/Vimeo/image choices. Native media codec, permissions and provider availability still require device testing.

**4 Files impacted:** 2 changed paths:

- `app/components/VideoPlayer.tsx` (F057)
- `app/services/__tests__/videoPlayer.test.tsx` (F166)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C35 Search index readiness and stale completion

**1 Area of change:** Search index readiness and stale completion (Functional and resilience).

**2 Bug or issue:** Article/activity search could run before addAllAsync completed or use an index produced for an old language/data set after the screen changed.

**3 Change made in detail:** Build asynchronously and publish only a complete index, search only a ready index, cancel publication on cleanup and invalidate the reference when content/language changes. Retain existing tokenisation and article/activity filters. This prevents stale/incomplete results; no device startup-speed gain is inferred from a unit test.

**4 Files impacted:** 4 changed paths:

- `app/screens/home/bottomTabs/Activities.tsx` (F111)
- `app/screens/home/bottomTabs/Articles.tsx` (F112)
- `app/services/__tests__/searchIndex.test.ts` (F162)
- `app/services/searchIndex.ts` (F203)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C36 React hook order and focused status bars

**1 Area of change:** React hook order and focused status bars (Crash prevention).

**2 Bug or issue:** The focus hook ran conditionally for one inset/platform shape. Inset changes could produce more/fewer-hooks errors; an unfocused screen could still control the native status bar.

**3 Change made in detail:** Call the focus hook on every render and gate native StatusBar rendering by focus in both branches while preserving inset padding. Regression tests change insets and focus across renders instead of merely asserting an implementation snapshot.

**4 Files impacted:** 2 changed paths:

- `app/components/FocusAwareStatusBar.tsx` (F052)
- `app/services/__tests__/focusAwareStatusBar.test.tsx` (F146)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C37 Welcome screen safe areas and reachable actions

**1 Area of change:** Welcome screen safe areas and reachable actions (Design and accessibility).

**2 Bug or issue:** Fixed flex allocation pushed the welcome heading under the status bar on shorter Android screens and constrained large text/Continue access.

**3 Change made in detail:** Use safe top/bottom insets, natural layout height and scrolling for the country/language confirmation. Preserve country text/branding. Earlier installed Bebbo/Rerai Android screenshot journeys verify the failure/cancellation path at normal and enlarged system font settings; that limited evidence is not all-screen Arabic/Urdu sign-off.

**4 Files impacted:** 26 changed paths:

- `app/screens/localization/CountryLanguageConfirmation.tsx` (F115)
- `docs/upgrades/react-native-0.87/evidence/bebbo-before-welcome-clipped.png` (F225)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-after-cancel.png` (F226)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-after-scroll.png` (F227)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-provenance.json` (F228)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-after-cancel.png` (F229)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-after-scroll.png` (F230)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-provenance.json` (F231)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-after-cancel.png` (F257)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-after-scroll.png` (F258)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-provenance.json` (F259)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-after-cancel.png` (F260)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-after-scroll.png` (F261)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-provenance.json` (F262)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0-continued.png` (F265)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0.json` (F266)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0.png` (F267)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3-continued.png` (F268)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3.json` (F269)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3.png` (F270)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0-continued.png` (F271)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0.json` (F272)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0.png` (F273)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3-continued.png` (F274)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3.json` (F275)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3.png` (F276)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C38 Shared header layout and flavour typography

**1 Area of change:** Shared header layout and flavour typography (Design and RTL).

**2 Bug or issue:** Single-line fixed-height headers clipped longer translations and used Bebbo typography for other flavours. A misspelled padding property was ignored.

**3 Change made in detail:** Use selected-flavour heading styles, allow two lines and a growing minimum header height, and correct padding-vertical. Retain existing RTL direction semantics. Tests check wrapping/style behaviour; every translated screen, largest font size and device navigation bar still requires visual acceptance.

**4 Files impacted:** 3 changed paths:

- `app/components/TabScreenHeader.tsx` (F056)
- `app/components/shared/HeaderContainerStyle.tsx` (F062)
- `app/services/__tests__/headerLayout.test.tsx` (F148)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C39 RTL text names and localised digits

**1 Area of change:** RTL text names and localised digits (Design and RTL).

**2 Bug or issue:** Name filtering removed combining marks used by Arabic/Urdu and other scripts. Locale aliases/regional tags failed to select the expected digit set.

**3 Change made in detail:** Preserve Unicode marks with letters/spaces in the seven changed flavour configs; Babuni already had compatible handling and is not rewritten. Resolve Arabic/Urdu/Hindi aliases and BCP-47-style tags in a shared digit converter, preserve non-digit characters and return strings consistently. No new country translation pack or guessed wording is enabled.

**4 Files impacted:** 11 changed paths:

- `app/customHooks/useDigitConvert.ts` (F070)
- `app/instances/bebbo/config/appConfig.ts` (F075)
- `app/instances/bebboDev/config/appConfig.ts` (F076)
- `app/instances/bebboPacific/config/appConfig.ts` (F077)
- `app/instances/foleja/config/appConfig.ts` (F078)
- `app/instances/merhabaBebek/config/appConfig.ts` (F080)
- `app/instances/reraiUmntwana/config/appConfig.ts` (F081)
- `app/instances/wawamor/config/appConfig.ts` (F082)
- `app/services/__tests__/localisedDigits.test.ts` (F152)
- `app/services/localisedDigits.ts` (F195)
- `scripts/__tests__/rtl-input.test.cjs` (F369)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C40 RTL language labels and safe direction fallback

**1 Area of change:** RTL language labels and safe direction fallback (Design and RTL).

**2 Bug or issue:** Country/language radio labels used physical left spacing and forwarded selection styling props. Invalid language metadata could be dereferenced by direction detection.

**3 Change made in detail:** Use logical margin-start and a transient selected-weight prop; retain native text-align start to avoid double mirroring. Validate the language object before reading locale metadata and preserve explicit RTL flags plus known legacy aliases. Arabic/Urdu fixtures test contracts, not translation availability or final pixels.

**4 Files impacted:** 5 changed paths:

- `app/components/CountryItem.tsx` (F051)
- `app/components/LanguageItem.tsx` (F055)
- `app/components/shared/radio.tsx` (F067)
- `app/localization/layoutDirection.ts` (F083)
- `app/services/__tests__/radioLayout.test.tsx` (F158)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C41 HTML WebView tables and RTL list rendering

**1 Area of change:** HTML WebView tables and RTL list rendering (Compatibility and RTL).

**2 Bug or issue:** The table plugin export used by the detail screen was removed; some shared HTML screens lost WebView/renderer configuration. About content lacked a base RTL direction.

**3 Change made in detail:** Register the plugin opaque tableModel beside the iframe model and explicitly provide WebView and its existing hardware-rendering props. Apply shared RTL list renderers/base direction to About while preserving article, Terms and Privacy content. Do not globally disable embedded content or assert CMS sanitisation without an approved host/content inventory.

**4 Files impacted:** 4 changed paths:

- `app/screens/PrivacyPolicy.tsx` (F098)
- `app/screens/TermsPage.tsx` (F099)
- `app/screens/home/Aboutus.tsx` (F101)
- `app/screens/home/DetailsScreen.tsx` (F103)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C42 Active child menu order and profile absence

**1 Area of change:** Active child menu order and profile absence (Functional).

**2 Bug or issue:** The comparator only considered one operand and could reorder siblings unpredictably. Reading an absent active child UUID could throw.

**3 Change made in detail:** Use a stable helper that moves the active child first while preserving the original order of the remaining profiles. Tolerate missing active selection. No profile data or persisted ordering is rewritten.

**4 Files impacted:** 3 changed paths:

- `app/components/HeaderBabyMenu.tsx` (F053)
- `app/services/__tests__/activeChildOrder.test.ts` (F123)
- `app/services/activeChildOrder.ts` (F168)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C43 Scripted FAQ persisted callback execution

**1 Area of change:** Scripted FAQ persisted callback execution (Security hardening).

**2 Bug or issue:** The FAQ screen evaluated serialised callback source from local Redux. Its selector did not return restored data, so that evaluation did not provide working session restoration.

**3 Change made in detail:** Remove eval and the associated payload logging, keep the existing fresh-session behaviour and cancel the initial step timer on unmount. Add an AST guard against direct eval/Function construction. This removes an unsafe execution path; remote exploitability was not established, and a separate hosted RAG pilot/backend is outside this branch.

**4 Files impacted:** 2 changed paths:

- `app/screens/home/SupportChat.tsx` (F109)
- `scripts/__tests__/security-config.test.cjs` (F370)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C44 Source analytics submission and offline retry reliability

**1 Area of change:** Source analytics submission and offline retry reliability (High priority measurement correctness).

**2 Bug or issue:** SDK failures were swallowed, NetInfo was treated as a delivery acknowledgement, iteration over a live filtered Realm result could skip rows and overlapping flushes could duplicate submissions.

**3 Change made in detail:** Submit eligible events to the native SDK even when offline so its own persistent session/time queue can operate. Store SDK submission failures, snapshot pending rows, serialise retry flushes and mark only accepted records. Resolve SDK instances inside guarded operations instead of failing at import. Native acceptance is not server delivery or exactly-once counting across a process crash.

**4 Files impacted:** 5 changed paths:

- `app/services/EventSyncService.ts` (F120)
- `app/services/__tests__/eventSync.test.ts` (F143)
- `app/services/__tests__/firebase.test.ts` (F145)
- `app/services/analyticsOutbox.ts` (F171)
- `app/services/firebaseAnalytics.ts` (F193)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C45 Telemetry privacy and legacy child properties

**1 Area of change:** Telemetry privacy and legacy child properties (High priority privacy).

**2 Bug or issue:** Custom events could include names, UUIDs, dates, health values, URLs or raw searches. Legacy child user properties persisted across upgrade and cleanup could race the first custom event.

**3 Change made in detail:** Apply a parameter/name allowlist, keep only public content IDs, fixed labels and permitted counts, and replace raw query text with query length. Clear named legacy child properties once and await the shared cleanup promise before custom submission; failed cleanup remains retryable. Automatic SDK startup events and historical retention require separate service-side review.

**4 Files impacted:** 4 changed paths:

- `app/services/__tests__/analyticsPolicy.test.ts` (F126)
- `app/services/__tests__/firebase.test.ts` (F145)
- `app/services/analyticsPolicy.ts` (F172)
- `app/services/firebaseAnalytics.ts` (F193)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C46 Event naming screens and meaningful journey counts

**1 Area of change:** Event naming screens and meaningful journey counts (Measurement correctness).

**2 Bug or issue:** Dynamic category IDs in names inflated event cardinality; content impressions were labelled selection. The same detail screen name could hide distinct navigation instances, and two screen metrics could be double-counted.

**3 Change made in detail:** Normalise category impressions to stable viewed events with public ID parameters; discard unrecognised suffix text. Track route keys for repeated detail instances, emit screen_view and retain the historical opened alias for existing dashboards. Document that consumers must not sum both aliases or treat app-event estimates as an authoritative profile census.

**4 Files impacted:** 5 changed paths:

- `app/assets/data/firebaseEvents.ts` (F045)
- `app/navigation/AppNavigation.tsx` (F084)
- `app/services/__tests__/analyticsPolicy.test.ts` (F126)
- `app/services/analyticsPolicy.ts` (F172)
- `app/services/screenAnalytics.ts` (F202)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C47 Profile and tool events follow confirmed operations

**1 Area of change:** Profile and tool events follow confirmed operations (Measurement correctness).

**2 Bug or issue:** Attempted profile writes/imports could be counted as created activity and lifecycle distinctions such as placeholders/pregnancies were inconsistent.

**3 Change made in detail:** Use confirmed operation results for profile/tool reporting, distinguish placeholder versus caregiver profiles and restore completion, and avoid emitting newly-created profile activity for restored historical records. Keep event coverage/inventory and explicit delivery limits. These are source semantics, not verification against live Firebase totals.

**4 Files impacted:** 6 changed paths:

- `app/services/__tests__/backup.test.ts` (F128)
- `app/services/__tests__/profileDeletion.test.ts` (F156)
- `app/services/backup.tsx` (F173)
- `app/services/childCRUD.ts` (F187)
- `app/services/firebaseAnalytics.ts` (F193)
- `app/services/profileDeletion.ts` (F200)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C48 Survey feedback and email event semantics

**1 Area of change:** Survey feedback and email event semantics (Measurement correctness).

**2 Bug or issue:** Opening an external survey/feedback link or email composer was recorded as submitted/sent before OS handoff, despite no evidence of completion.

**3 Change made in detail:** Rename the events to feedback_link_opened, survey_link_opened and email_composer_opened. Use a guarded measured-link helper and emit only after successful native handoff. Include the home, drawer, FAQ and notification entry points. Do not claim email delivery, survey submission or payment completion from these events.

**4 Files impacted:** 8 changed paths:

- `app/assets/data/firebaseEvents.ts` (F045)
- `app/screens/CustomDrawerContent.tsx` (F097)
- `app/screens/home/SupportChat.tsx` (F109)
- `app/screens/home/bottomTabs/Home.tsx` (F114)
- `app/services/__tests__/measuredLink.test.ts` (F153)
- `app/services/__tests__/notificationLink.test.ts` (F155)
- `app/services/measuredLink.ts` (F196)
- `app/services/notificationLink.ts` (F197)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C49 Advertising tracking consent defaults

**1 Area of change:** Advertising tracking consent defaults (High priority consent correctness).

**2 Bug or issue:** The iOS ATT denied path was overridden by Facebook advertiser-tracking initialisation. Repeated initialisation could also apply inconsistent settings.

**3 Change made in detail:** Centralise the decision path, never enable tracking for denied/blocked/unavailable states and disable it after revocation. Default advertising-ID collection off in all ten branded Android manifests and ten iOS app plists. Android does not infer user consent from an unrelated permission. Generic SDK events and legal consent/retention remain separate product review.

**4 Files impacted:** 24 changed paths:

- `android/app/src/bangla/AndroidManifest.xml` (F013)
- `android/app/src/banglastaging/AndroidManifest.xml` (F015)
- `android/app/src/bebboPacific/AndroidManifest.xml` (F017)
- `android/app/src/merhababebek/AndroidManifest.xml` (F030)
- `android/app/src/prod/AndroidManifest.xml` (F032)
- `android/app/src/prodstaging/AndroidManifest.xml` (F034)
- `android/app/src/reraiUmntwana/AndroidManifest.xml` (F036)
- `android/app/src/wawamor/AndroidManifest.xml` (F038)
- `android/app/src/xk/AndroidManifest.xml` (F040)
- `android/app/src/xkstaging/AndroidManifest.xml` (F042)
- `app/navigation/AppNavigation.tsx` (F084)
- `app/services/__tests__/advertisingConsent.test.ts` (F124)
- `app/services/advertisingConsent.ts` (F169)
- `firebase.json` (F291)
- `ios/BebboPacific-Info.plist` (F293)
- `ios/MerhabaBebek-Info.plist` (F294)
- `ios/ParentBuddyApp/Info.plist` (F348)
- `ios/ParentBuddyAppBangla-Info.plist` (F349)
- `ios/ParentBuddyAppBanglaDev-Info.plist` (F350)
- `ios/ParentBuddyAppDev-Info.plist` (F351)
- `ios/ParentBuddyAppXk-Info.plist` (F352)
- `ios/ParentBuddyAppXkDev-Info.plist` (F353)
- `ios/ReraiUmntwana-Info.plist` (F355)
- `ios/Wawamor-Info.plist` (F356)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C50 Privacy safe diagnostics and fallback UI

**1 Area of change:** Privacy safe diagnostics and fallback UI (High priority privacy).

**2 Bug or issue:** Retained error logs and manual crash reports could contain Realm/provider payloads, names, paths or clinical details. The root fallback exposed raw errors and reported during render.

**3 Change made in detail:** Replace retained sensitive error arguments with generic diagnostics preserving approved error class/frames, scrub breadcrumb URLs/email/identifiers/dates and bound lengths. Report root errors from an effect and remove raw exception text from caregiver UI. Backup UI uses safe recognised messages. This does not certify every automatic fatal native report or backend log.

**4 Files impacted:** 9 changed paths:

- `App.tsx` (F008)
- `app/components/homeScreen/QuickLinksRow.tsx` (F061)
- `app/database/dbquery/dataRealmCommon.ts` (F072)
- `app/redux/reducers/realmSafe.ts` (F087)
- `app/services/Utils.ts` (F122)
- `app/services/__tests__/diagnostics.test.ts` (F142)
- `app/services/__tests__/realmDiagnostics.test.ts` (F159)
- `app/services/diagnostics.ts` (F191)
- `app/services/firebaseAnalytics.ts` (F193)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C51 Android country source sets and splash handover

**1 Area of change:** Android country source sets and splash handover (High priority native availability).

**2 Bug or issue:** Lower-case Rerai/Pacific Gradle flavour names did not match camel-case source folders on Linux, omitting branded resources/manifests. Lottie hide required manual-dismiss mode.

**3 Change made in detail:** Map the two existing source sets explicitly without renaming application IDs. Enable manual splash dismissal, preserve the fallback handover and let the library control playback instead of competing XML autoplay. Update all ten branded launch layouts consistently. Existing country branding and link declarations are retained.

**4 Files impacted:** 12 changed paths:

- `android/app/build.gradle` (F012)
- `android/app/src/bangla/res/layout/launch_screen.xml` (F014)
- `android/app/src/banglastaging/res/layout/launch_screen.xml` (F016)
- `android/app/src/bebboPacific/res/layout/launch_screen.xml` (F018)
- `android/app/src/main/java/org/unicef/ecar/bebbo/MainActivity.kt` (F019)
- `android/app/src/merhababebek/res/layout/launch_screen.xml` (F031)
- `android/app/src/prod/res/layout/launch_screen.xml` (F033)
- `android/app/src/prodstaging/res/layout/launch_screen.xml` (F035)
- `android/app/src/reraiUmntwana/res/layout/launch_screen.xml` (F037)
- `android/app/src/wawamor/res/layout/launch_screen.xml` (F039)
- `android/app/src/xk/res/layout/launch_screen.xml` (F041)
- `android/app/src/xkstaging/res/layout/launch_screen.xml` (F043)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C52 Native vector resources across all flavours

**1 Area of change:** Native vector resources across all flavours (High priority native compatibility).

**2 Bug or issue:** A Bebbo-only generation command omitted Rerai and other branded SVG dependencies. Regeneration for one flavour could delete assets needed by another.

**3 Change made in detail:** Collect the union of actual Metro SVG dependencies in isolated flavour processes, generate Android vectors/iOS image-set PDFs and verify bytes/source fingerprints with a checked-in manifest. Run checks before Android/iOS bundling. The net diff includes generated assets; they are outputs supporting the resource fix, not dozens of independent design changes. Existing artwork is retained.

**4 Files impacted:** 57 changed paths:

- `android/app/src/main/res/drawable/bebbo_logo_shape1_svg_72eabf.xml` (F020)
- `android/app/src/main/res/drawable/bebbo_logo_shape1_svg_82c63d.xml` (F021)
- `android/app/src/main/res/drawable/bebbo_logo_shape1_svg_98422f.xml` (F022)
- `android/app/src/main/res/drawable/bebbo_logo_shape_svg_9edbd8.xml` (F023)
- `android/app/src/main/res/drawable/bebbo_logo_shape_svg_b84625.xml` (F024)
- `android/app/src/main/res/drawable/bebbo_logo_shape_svg_fecacb.xml` (F025)
- `android/app/src/main/res/drawable/img_logo_chatbot_new_svg_0dbf49.xml` (F026)
- `android/app/src/main/res/drawable/img_logo_chatbot_new_svg_6f2944.xml` (F027)
- `android/app/src/main/res/drawable/img_logo_chatbot_new_svg_eed7b8.xml` (F028)
- `android/app/src/main/res/drawable/img_logo_chatbot_new_svg_fa2402.xml` (F029)
- `ios/ParentBuddyApp/Images.xcassets/activity_feature_logo_svg_97fc39.imageset/light.pdf` (F306)
- `ios/ParentBuddyApp/Images.xcassets/advice_feature_logo_svg_7c0e83.imageset/light.pdf` (F307)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_72eabf.imageset/Contents.json` (F308)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_72eabf.imageset/light.pdf` (F309)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_82c63d.imageset/Contents.json` (F310)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_82c63d.imageset/light.pdf` (F311)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_98422f.imageset/Contents.json` (F312)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_98422f.imageset/light.pdf` (F313)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_b84625.imageset/light.pdf` (F314)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_55f84f.imageset/light.pdf` (F315)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_9edbd8.imageset/Contents.json` (F316)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_9edbd8.imageset/light.pdf` (F317)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_b84625.imageset/Contents.json` (F318)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_b84625.imageset/light.pdf` (F319)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_fecacb.imageset/Contents.json` (F320)
- `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_fecacb.imageset/light.pdf` (F321)
- `ios/ParentBuddyApp/Images.xcassets/camera_profile_svg_a16942.imageset/light.pdf` (F322)
- `ios/ParentBuddyApp/Images.xcassets/chart_svg_e10e63.imageset/light.pdf` (F323)
- `ios/ParentBuddyApp/Images.xcassets/history_svg_a08286.imageset/light.pdf` (F324)
- `ios/ParentBuddyApp/Images.xcassets/ic_activity_color_svg_86e25d.imageset/light.pdf` (F325)
- `ios/ParentBuddyApp/Images.xcassets/ic_article_color_svg_0eb212.imageset/light.pdf` (F326)
- `ios/ParentBuddyApp/Images.xcassets/ic_backup_link_svg_5eb37b.imageset/light.pdf` (F327)
- `ios/ParentBuddyApp/Images.xcassets/ic_chat_link_svg_68719f.imageset/light.pdf` (F328)
- `ios/ParentBuddyApp/Images.xcassets/ic_development_color_svg_623199.imageset/light.pdf` (F329)
- `ios/ParentBuddyApp/Images.xcassets/ic_favorites_link_svg_a63c49.imageset/light.pdf` (F330)
- `ios/ParentBuddyApp/Images.xcassets/ic_file_svg_873adc.imageset/light.pdf` (F331)
- `ios/ParentBuddyApp/Images.xcassets/ic_gdrive_svg_1618e2.imageset/light.pdf` (F332)
- `ios/ParentBuddyApp/Images.xcassets/ic_growth_color_svg_532ea2.imageset/light.pdf` (F333)
- `ios/ParentBuddyApp/Images.xcassets/ic_health_color_svg_b47d6e.imageset/light.pdf` (F334)
- `ios/ParentBuddyApp/Images.xcassets/ic_tools_color_svg_335b8f.imageset/light.pdf` (F335)
- `ios/ParentBuddyApp/Images.xcassets/ic_vaccination_color_svg_5b90d8.imageset/light.pdf` (F336)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_0dbf49.imageset/Contents.json` (F337)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_0dbf49.imageset/light.pdf` (F338)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_6f2944.imageset/Contents.json` (F339)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_6f2944.imageset/light.pdf` (F340)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_c61e96.imageset/light.pdf` (F341)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_eed7b8.imageset/Contents.json` (F342)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_eed7b8.imageset/light.pdf` (F343)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_fa2402.imageset/Contents.json` (F344)
- `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_fa2402.imageset/light.pdf` (F345)
- `ios/ParentBuddyApp/Images.xcassets/play_icon_svg_b1cbb6.imageset/light.pdf` (F346)
- `ios/ParentBuddyApp/Images.xcassets/tools_features_logo_svg_41c195.imageset/light.pdf` (F347)
- `package.json` (F359)
- `scripts/__tests__/release-guards.test.cjs` (F368)
- `scripts/collect-vector-assets.cjs` (F383)
- `scripts/vector-assets-manifest.json` (F390)
- `scripts/vector-assets.cjs` (F391)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C53 Android native packaging verification and split installation

**1 Area of change:** Android native packaging verification and split installation (Build verification).

**2 Bug or issue:** Compilation alone did not prove the final AAB included a single C++ runtime per ABI, compressed JNI packaging, correct manifest flags or installable device splits.

**3 Change made in detail:** Add checks on the actual AAB, native ELF alignment and bundletool-generated device splits; install those splits rather than an unrelated APK. Preserve the PR's existing ABI/packaging settings. No new packaging flag change is attributed to this comparison where it was already in PR #1115. Prior evidence includes a combined Bebbo four-ABI release and separate four Wawamor ABI builds; physical 16 KiB execution remains separate.

**4 Files impacted:** 6 changed paths:

- `.github/workflows/native-verification.yml` (F005)
- `scripts/__tests__/test_android_packaging.py` (F371)
- `scripts/android-startup-smoke.sh` (F374)
- `scripts/android_elf.py` (F375)
- `scripts/check-android-bundle.py` (F377)
- `scripts/check-android-splits.py` (F378)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C54 Patched Gradle with compatible build plugin compilation

**1 Area of change:** Patched Gradle with compatible build plugin compilation (High priority build security).

**2 Bug or issue:** Gradle 9.4.1 had first-party build-host advisories outside npm audit. Moving to 9.8.1 exposed RN Gradle-plugin compiler 2.2.0 incompatibility with embedded Kotlin 2.4 metadata.

**3 Change made in detail:** Pin Gradle 9.8.1 and its official checksum. Patch only compilation of RN's Gradle plugins to Kotlin 2.4.21; keep the application KGP 2.2.10 and the plugin implementation dependency. Do not disable metadata checks. Focused Gradle/WebView compilation and later native releases verify this separation.

**4 Files impacted:** 3 changed paths:

- `android/gradle/wrapper/gradle-wrapper.properties` (F044)
- `patches/@react-native+gradle-plugin+0.87.1.patch` (F361)
- `scripts/__tests__/security-config.test.cjs` (F370)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C55 Android runtime dependency vulnerability fixes

**1 Area of change:** Android runtime dependency vulnerability fixes (High priority dependency security).

**2 Bug or issue:** Resolved transitive Gson/Guava versions were affected by known deserialisation/allocation advisories, despite low-only npm results.

**3 Change made in detail:** Constrain Gson 2.13.2 and Guava 33.7.2-android for every flavour, then resolve/scan the runtime graph and compile releases. The recorded exact-package runtime scan found no matches within its scope. Build-only Maven advisories and complete Apple/vendored-binary coverage remain separately documented; do not describe npm as a complete mobile security scan.

**4 Files impacted:** 4 changed paths:

- `android/app/build.gradle` (F012)
- `docs/upgrades/react-native-0.87/evidence/native-maven-audit-before.json` (F252)
- `docs/upgrades/react-native-0.87/evidence/native-maven-runtime-after.json` (F253)
- `docs/upgrades/react-native-0.87/native-dependency-security.md` (F283)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C56 Realm native NDK consistency

**1 Area of change:** Realm native NDK consistency (Native compatibility).

**2 Bug or issue:** Realm's Android module selected AGP's default NDK 28.2 instead of the app's 27.1 pin, causing an implicit download failure and inconsistent native build inputs.

**3 Change made in detail:** Use the existing root NDK version in Realm's binding module and retain its existing 16 KiB linker configuration. Pin Realm 20.2.0 exactly. There is no Realm engine/schema migration, and the fix does not remove the need for real signed installed-data upgrades.

**4 Files impacted:** 3 changed paths:

- `package-lock.json` (F358)
- `package.json` (F359)
- `patches/realm+20.2.0.patch` (F363)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C57 iOS flavour bundling guards and private source maps

**1 Area of change:** iOS flavour bundling guards and private source maps (High priority country configuration).

**2 Bug or issue:** Shared archive phases could select the wrong JS flavour/environment, and maps needed for release diagnostics were not retained consistently.

**3 Change made in detail:** Use a shared bundle helper mapping every primary/development Xcode target to its JS flavour, validate environment choices, verify native vector resources and compose/retain private Hermes source maps. Android bundle tasks similarly reject mismatched FLAVOR/ENVFILE. Maps may contain environment values and are not public artifacts.

**4 Files impacted:** 5 changed paths:

- `android/app/build.gradle` (F012)
- `ios/.xcode.env` (F292)
- `ios/ParentBuddyApp.xcodeproj/project.pbxproj` (F295)
- `scripts/__tests__/test_ios_configuration.py` (F372)
- `scripts/bundle-ios.sh` (F376)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C58 Per-target archive flags symbols and compile checks

**1 Area of change:** Per-target archive flags symbols and compile checks (Native configuration and diagnostics).

**2 Bug or issue:** Checked-in symbol/core phases did not cover all app targets. A successful archive did not establish bundle ID, privacy flags, minimum OS or symbol presence for each configuration.

**3 Change made in detail:** Apply explicit privacy/screen flags across all ten iOS app plists and attach archive symbol upload using each app's own archived GoogleService plist/dSYMs through ten schemes. Skip uploads for unsigned/fake fixtures. Validate archive identifiers, expected fixture project, app dSYM and minimum OS. Actual signed symbol receipt remains unverified and live Firebase work is excluded from this recheck.

**4 Files impacted:** 24 changed paths:

- `firebase.json` (F291)
- `ios/BebboPacific-Info.plist` (F293)
- `ios/MerhabaBebek-Info.plist` (F294)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/BebboPacific.xcscheme` (F296)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/MerhabaBebek.xcscheme` (F297)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyApp.xcscheme` (F298)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppBangla.xcscheme` (F299)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppBanglaDev.xcscheme` (F300)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppDev.xcscheme` (F301)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppXk.xcscheme` (F302)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppXkDev.xcscheme` (F303)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ReraiUmntwana.xcscheme` (F304)
- `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/Wawamor.xcscheme` (F305)
- `ios/ParentBuddyApp/Info.plist` (F348)
- `ios/ParentBuddyAppBangla-Info.plist` (F349)
- `ios/ParentBuddyAppBanglaDev-Info.plist` (F350)
- `ios/ParentBuddyAppDev-Info.plist` (F351)
- `ios/ParentBuddyAppXk-Info.plist` (F352)
- `ios/ParentBuddyAppXkDev-Info.plist` (F353)
- `ios/ReraiUmntwana-Info.plist` (F355)
- `ios/Wawamor-Info.plist` (F356)
- `scripts/__tests__/test_ios_configuration.py` (F372)
- `scripts/check-ios-archive.py` (F379)
- `scripts/ios-archive-symbols.sh` (F386)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C59 Foleja development duplicate copied resource

**1 Area of change:** Foleja development duplicate copied resource (Native build correctness).

**2 Bug or issue:** The auxiliary iOS development archive failed because two README.md resource memberships wrote the same bundle destination.

**3 Change made in detail:** Remove the duplicate resource membership/build-file object from the Foleja development target, retaining unrelated project objects. Add duplicate copied-resource checks across resource phases and compile the additional country-development configurations. Application bundle identifiers and signing groups are preserved.

**4 Files impacted:** 2 changed paths:

- `ios/ParentBuddyApp.xcodeproj/project.pbxproj` (F295)
- `scripts/__tests__/test_ios_configuration.py` (F372)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C60 Reproducible CocoaPods and Ruby dependency inputs

**1 Area of change:** Reproducible CocoaPods and Ruby dependency inputs (Dependency stability and security).

**2 Bug or issue:** Native dependencies were not fully locked and concurrent-ruby was constrained below maintained fixes. Drifting resolver output undermined repeatable multi-target builds.

**3 Change made in detail:** Commit the locks produced by successful native resolutions, use CocoaPods deployment mode and pin concurrent-ruby 1.3.8 with CocoaPods 1.16.2/xcodeproj 1.27.0. Validate runtime require order. Defer the affected ActiveSupport line where CocoaPods constrains migration; document build-host reachability and remaining advisories instead of forcing an incompatible major.

**4 Files impacted:** 6 changed paths:

- `.github/workflows/native-verification.yml` (F005)
- `Gemfile` (F009)
- `Gemfile.lock` (F010)
- `docs/upgrades/react-native-0.87/evidence/ruby-security-audit-after.json` (F263)
- `docs/upgrades/react-native-0.87/evidence/ruby-update-validation.json` (F264)
- `ios/Podfile.lock` (F354)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C61 Reviewed JavaScript maintenance upgrades and exact pins

**1 Area of change:** Reviewed JavaScript maintenance upgrades and exact pins (Maintained compatible dependencies).

**2 Bug or issue:** Selected runtime/build patches and typings lagged compatible fixes, while floating Realm/rename versions could silently alter migration/tool behaviour. TypeScript 6 did not satisfy an installed dependency peer.

**3 Change made in detail:** Update d3-shape 3.2.0 to 3.2.1, resolved Babel preset 7.28.3/runtime 7.29.13 to 7.29.14, Luxon typings 3.7.1 to 3.7.6 and TypeScript to 5.9.3. Pin Realm 20.2.0 and rename 3.2.17. Retain RN 0.87.1/React 19.2.3 and the selected native library pairings. Compare actual D3 paths with captured 3.2.0 results, including RTL.

**4 Files impacted:** 4 changed paths:

- `package-lock.json` (F358)
- `package.json` (F359)
- `scripts/__tests__/chart-paths.test.cjs` (F364)
- `scripts/__tests__/fixtures/chart-paths-d3-3.2.0.json` (F367)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C62 Resolver glob and minimatch security fixes

**1 Area of change:** Resolver glob and minimatch security fixes (Dependency security).

**2 Bug or issue:** The Babel resolver used an older glob callback API, so a security override to a maintained major could not safely be applied as a version edit alone. Affected minimatch ranges remained transitive.

**3 Change made in detail:** Override resolver glob to 14.0.2 and patch its globbed-root enumeration to the maintained API; test actual temporary project-root resolution. Override affected modern minimatch ranges to 11.0.1 and lock the result. A rename-tool upgrade trial was reverted after it worsened the audit; the rejected candidate is not a final branch upgrade.

**4 Files impacted:** 4 changed paths:

- `package-lock.json` (F358)
- `package.json` (F359)
- `patches/babel-plugin-module-resolver+5.0.3.patch` (F362)
- `scripts/__tests__/dependency-compat.test.cjs` (F366)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C63 Strict TypeScript and RN generated image declarations

**1 Area of change:** Strict TypeScript and RN generated image declarations (Compatibility and maintainability).

**2 Bug or issue:** The PR had an inherited type backlog, obsolete RN style type imports and mismatches in refs, payloads, navigation, native Date usage and nullable values. A moving baseline could admit old errors again.

**3 Change made in detail:** Correct targeted contracts without suppressions: typed refs, list keys, drawer/nested navigation, Realm update modes, standard-deviation payload shape and nullable AppState/theme access. Replace ignored preload callbacks and ineffective object comparisons. Patch FastImage declarations to use RN ImageStyle rather than unavailable legacy exports. Make npm typecheck invoke tsc --noEmit; keep historical baseline files as evidence, not the active gate.

**4 Files impacted:** 21 changed paths:

- `app/components/AgeBrackets.tsx` (F047)
- `app/components/growth/LastChildMeasure.tsx` (F058)
- `app/components/shared/InfiniteScrollList.tsx` (F063)
- `app/components/shared/RelatedArticles.tsx` (F064)
- `app/components/shared/RelatedVideoArticles.tsx` (F065)
- `app/components/vaccination/tabs/PreviousVaccines.tsx` (F068)
- `app/database/dbquery/dataRealmCommon.ts` (F072)
- `app/database/dbquery/userRealmCommon.ts` (F073)
- `app/navigation/types.ts` (F085)
- `app/screens/home/Favourites.tsx` (F105)
- `app/screens/home/HealthCheckups.tsx` (F106)
- `app/screens/home/Notifications.tsx` (F107)
- `app/screens/home/Vaccination.tsx` (F110)
- `app/screens/home/bottomTabs/ChildDevelopment.tsx` (F113)
- `app/services/commonApiService.ts` (F188)
- `app/services/periodicSync.ts` (F199)
- `package.json` (F359)
- `patches/@d11+react-native-fast-image+8.13.0.patch` (F360)
- `scripts/check-types.cjs` (F381)
- `scripts/typescript-baseline.json` (F389)
- `tsconfig.json` (F392)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C64 Application aliases and legacy walkthrough references

**1 Area of change:** Application aliases and legacy walkthrough references (Compatibility).

**2 Bug or issue:** Application imports used the reserved @types namespace, some Babuni scripts used the wrong env path and the development iOS command selected Bebbo JS. The legacy shared walkthrough had stale asset/module/ref references.

**3 Change made in detail:** Use @app-types for application aliases, fix env/.env.babuni paths and FLAVOR=bebboDev, and ensure Metro resolves the same aliases. Repair the legacy shared walkthrough's flavour image imports and stable slider ref with a rerender pagination test. No historical production pagination crash is asserted for an unused/shared legacy screen.

**4 Files impacted:** 15 changed paths:

- `app/components/ChildDate.tsx` (F050)
- `app/components/HeaderBabyMenu.tsx` (F053)
- `app/components/homeScreen/BabyNotification.tsx` (F060)
- `app/screens/AddChildInfoSetup.tsx` (F090)
- `app/screens/AddChildSetup.tsx` (F091)
- `app/screens/AddExpectingChildProfile.tsx` (F092)
- `app/screens/AddSiblingData.tsx` (F093)
- `app/screens/CustomDrawerContent.tsx` (F097)
- `app/screens/Walkthrough.tsx` (F100)
- `app/screens/home/ChildProfile.tsx` (F102)
- `app/screens/home/EditChildProfile.tsx` (F104)
- `app/services/__tests__/walkthrough.test.tsx` (F167)
- `babel.config.js` (F206)
- `package.json` (F359)
- `tsconfig.json` (F392)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C65 Metro flavour and environment cache isolation

**1 Area of change:** Metro flavour and environment cache isolation (High priority country configuration).

**2 Bug or issue:** A shared transform cache could reuse Babel/env output from another app flavour or environment file and bundle the wrong assets/configuration.

**3 Change made in detail:** Include flavour and environment-file contents in the cache version, isolate flavour asset collection processes and add cache-key regression checks. Keep actual production endpoint values external; compile fixtures do not verify real endpoint routing.

**4 Files impacted:** 3 changed paths:

- `metro.config.js` (F357)
- `scripts/__tests__/release-guards.test.cjs` (F368)
- `scripts/flavour-cache.cjs` (F385)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C66 Native CI all flavours auxiliary targets and unsigned guards

**1 Area of change:** Native CI all flavours auxiliary targets and unsigned guards (Build reliability and country coverage).

**2 Bug or issue:** Legacy workflows used Node 21, unlocked installs and obsolete font steps. Only representative targets were compiled and platform-specific development identifiers were conflated.

**3 Change made in detail:** Route legacy workflow entry points through reusable native verification with supported Node/JDK, locked npm/pod installs, explicit SDK tooling and fake compile-only service files. Cover eight primary flavours plus Foleja/Babuni development targets, preserve distinct Babuni platform IDs and verify AAB/archive outputs. Select the AGP public signing setter explicitly for unsigned fixtures; normal release signing remains. Pin external Actions to immutable commits and use read-only permissions.

**4 Files impacted:** 10 changed paths:

- `.github/workflows/Android_Prod.yml` (F001)
- `.github/workflows/android.yml` (F002)
- `.github/workflows/ios.yml` (F003)
- `.github/workflows/ios_Prod.yml` (F004)
- `.github/workflows/native-verification.yml` (F005)
- `.github/workflows/review-checks.yml` (F006)
- `android/app/build.gradle` (F012)
- `scripts/__tests__/ci-fixtures.test.cjs` (F365)
- `scripts/ci-fixtures.cjs` (F382)
- `scripts/flavour-audit.py` (F384)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C67 Regression CI startup and artifact verification

**1 Area of change:** Regression CI startup and artifact verification (Validation infrastructure).

**2 Bug or issue:** Passing mocked JS tests did not prove native installation/startup or guard against branded assets, packaging and configuration drift.

**3 Change made in detail:** Add unit/tooling/Python/type/audit gates and sixteen production bundles for all eight flavours/platforms. Native checks validate real bundle/split/archive contents and bounded emulator startup journeys. Isolate data/fault-injection harnesses from production, record source hashes and inspect recognised prompts without weakening blank/error-screen detection. Prior native scenarios and screenshots are source-specific evidence, not final signed releases.

**4 Files impacted:** 81 changed paths:

- `.github/workflows/native-verification.yml` (F005)
- `.github/workflows/review-checks.yml` (F006)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-bebbo-provenance.json` (F217)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-bebbo-result.json` (F218)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-rerai-provenance.json` (F219)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-rerai-result.json` (F220)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-bebbo-provenance.json` (F221)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-bebbo-result.json` (F222)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-rerai-provenance.json` (F223)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-rerai-result.json` (F224)
- `docs/upgrades/react-native-0.87/evidence/bebbo-before-welcome-clipped.png` (F225)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-after-cancel.png` (F226)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-after-scroll.png` (F227)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-provenance.json` (F228)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-after-cancel.png` (F229)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-after-scroll.png` (F230)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-provenance.json` (F231)
- `docs/upgrades/react-native-0.87/evidence/bebbo-patched-runtime-packaging.json` (F232)
- `docs/upgrades/react-native-0.87/evidence/final-native-data-android-bebbo.json` (F233)
- `docs/upgrades/react-native-0.87/evidence/final-native-data-android-reraiUmntwana.json` (F234)
- `docs/upgrades/react-native-0.87/evidence/final-native-data-ios-bebbo.json` (F235)
- `docs/upgrades/react-native-0.87/evidence/final-native-data-ios-reraiUmntwana.json` (F236)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-android-bebbo.json` (F237)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-android-rerai.json` (F238)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-ios-bebbo.json` (F239)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-ios-rerai.json` (F240)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-provenance-android-bebbo.json` (F241)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-provenance-android-rerai.json` (F242)
- `docs/upgrades/react-native-0.87/evidence/follow-up-secret-scan.json` (F243)
- `docs/upgrades/react-native-0.87/evidence/follow-up-verification-summary.json` (F244)
- `docs/upgrades/react-native-0.87/evidence/native-build-matrix.json` (F245)
- `docs/upgrades/react-native-0.87/evidence/native-data-and-startup-checks.json` (F246)
- `docs/upgrades/react-native-0.87/evidence/native-data-bebbo-android.json` (F247)
- `docs/upgrades/react-native-0.87/evidence/native-data-bebbo-ios.json` (F248)
- `docs/upgrades/react-native-0.87/evidence/native-data-rerai-android.json` (F249)
- `docs/upgrades/react-native-0.87/evidence/native-data-rerai-ios.json` (F250)
- `docs/upgrades/react-native-0.87/evidence/native-input-equivalence.json` (F251)
- `docs/upgrades/react-native-0.87/evidence/native-maven-audit-before.json` (F252)
- `docs/upgrades/react-native-0.87/evidence/native-maven-runtime-after.json` (F253)
- `docs/upgrades/react-native-0.87/evidence/non-firebase-tls-inventory.json` (F254)
- `docs/upgrades/react-native-0.87/evidence/non-firebase-verification-summary.json` (F255)
- `docs/upgrades/react-native-0.87/evidence/production-checks.json` (F256)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-after-cancel.png` (F257)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-after-scroll.png` (F258)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-provenance.json` (F259)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-after-cancel.png` (F260)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-after-scroll.png` (F261)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-provenance.json` (F262)
- `docs/upgrades/react-native-0.87/evidence/ruby-security-audit-after.json` (F263)
- `docs/upgrades/react-native-0.87/evidence/ruby-update-validation.json` (F264)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0-continued.png` (F265)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0.json` (F266)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0.png` (F267)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3-continued.png` (F268)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3.json` (F269)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3.png` (F270)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0-continued.png` (F271)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0.json` (F272)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0.png` (F273)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3-continued.png` (F274)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3.json` (F275)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3.png` (F276)
- `docs/upgrades/react-native-0.87/evidence/wawamor-arm64-v8a-packaging.json` (F277)
- `docs/upgrades/react-native-0.87/evidence/wawamor-armeabi-v7a-packaging.json` (F278)
- `docs/upgrades/react-native-0.87/evidence/wawamor-x86-packaging.json` (F279)
- `docs/upgrades/react-native-0.87/evidence/wawamor-x86_64-packaging.json` (F280)
- `scripts/__tests__/chart-paths.test.cjs` (F364)
- `scripts/__tests__/ci-fixtures.test.cjs` (F365)
- `scripts/__tests__/dependency-compat.test.cjs` (F366)
- `scripts/__tests__/fixtures/chart-paths-d3-3.2.0.json` (F367)
- `scripts/__tests__/release-guards.test.cjs` (F368)
- `scripts/__tests__/rtl-input.test.cjs` (F369)
- `scripts/__tests__/security-config.test.cjs` (F370)
- `scripts/__tests__/test_android_packaging.py` (F371)
- `scripts/__tests__/test_ios_configuration.py` (F372)
- `scripts/android-startup-smoke.sh` (F374)
- `scripts/check-android-bundle.py` (F377)
- `scripts/check-android-splits.py` (F378)
- `scripts/check-ios-archive.py` (F379)
- `scripts/check-production-bundle.cjs` (F380)
- `scripts/check-types.cjs` (F381)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C68 Secret introduction scanning

**1 Area of change:** Secret introduction scanning (Security gate).

**2 Bug or issue:** Existing public history and large generated artifacts required a repeatable check that new commits did not introduce credentials. Merely reporting a one-time scan did not protect later changes.

**3 Change made in detail:** Add a version/checksum-pinned redacted scanner over the correct newly introduced commit range and a self-test proving a planted fixture secret is rejected. Preserve a redacted historical assessment, avoid publishing matches and distinguish public mobile client IDs/checksums from proven server credentials. No history rewrite or destructive credential rotation was performed.

**4 Files impacted:** 5 changed paths:

- `.github/workflows/review-checks.yml` (F006)
- `.gitignore` (F007)
- `docs/upgrades/react-native-0.87/evidence/follow-up-secret-scan.json` (F243)
- `scripts/scan-new-secrets.sh` (F387)
- `scripts/secret-scan-regression.py` (F388)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

### C69 Complete regression tests evidence and change documentation

**1 Area of change:** Complete regression tests evidence and change documentation (Documentation and regression coverage).

**2 Bug or issue:** The PR did not contain the later targeted regression suites or source-specific results needed to explain what was actually verified. Historical reports can otherwise be mistaken for current sign-off.

**3 Change made in detail:** Add focused service/rendered-component/tooling/native-configuration tests, generated inventories, native result JSON, provenance and bounded screenshots. Maintain readable reports for dependency decisions, analytics, backup, RTL, crash-history limits and remaining acceptance. This register supplies the requested four fields; its complete file ledger separates functional code, generated assets, tests, build tooling and evidence. Historical baseline/test files remain labelled historical.

**4 Files impacted:** 140 changed paths:

- `README.md` (F011)
- `app/services/__tests__/activeChildOrder.test.ts` (F123)
- `app/services/__tests__/advertisingConsent.test.ts` (F124)
- `app/services/__tests__/ageLabels.test.ts` (F125)
- `app/services/__tests__/analyticsPolicy.test.ts` (F126)
- `app/services/__tests__/articleCache.test.ts` (F127)
- `app/services/__tests__/backup.test.ts` (F128)
- `app/services/__tests__/backupCacheCleanup.test.ts` (F129)
- `app/services/__tests__/backupCipher.test.ts` (F130)
- `app/services/__tests__/backupPasswordPrompt.test.tsx` (F131)
- `app/services/__tests__/backupPreview.test.ts` (F132)
- `app/services/__tests__/backupRecovery.test.ts` (F133)
- `app/services/__tests__/backupRecoveryScreen.test.tsx` (F134)
- `app/services/__tests__/backupSnapshot.test.ts` (F135)
- `app/services/__tests__/bookmarkControls.test.tsx` (F136)
- `app/services/__tests__/bookmarks.test.ts` (F137)
- `app/services/__tests__/calendarDate.test.ts` (F138)
- `app/services/__tests__/confirmBackupReplacement.test.ts` (F139)
- `app/services/__tests__/contentSync.test.ts` (F140)
- `app/services/__tests__/deepLinking.test.tsx` (F141)
- `app/services/__tests__/diagnostics.test.ts` (F142)
- `app/services/__tests__/eventSync.test.ts` (F143)
- `app/services/__tests__/externalLink.test.ts` (F144)
- `app/services/__tests__/firebase.test.ts` (F145)
- `app/services/__tests__/focusAwareStatusBar.test.tsx` (F146)
- `app/services/__tests__/growthInterpretation.test.ts` (F147)
- `app/services/__tests__/headerLayout.test.tsx` (F148)
- `app/services/__tests__/legacyBackupConversion.test.ts` (F149)
- `app/services/__tests__/legacyMigration.test.ts` (F150)
- `app/services/__tests__/localNotifications.test.ts` (F151)
- `app/services/__tests__/localisedDigits.test.ts` (F152)
- `app/services/__tests__/measuredLink.test.ts` (F153)
- `app/services/__tests__/notificationGeneration.test.ts` (F154)
- `app/services/__tests__/notificationLink.test.ts` (F155)
- `app/services/__tests__/profileDeletion.test.ts` (F156)
- `app/services/__tests__/protectedBackupCipher.test.ts` (F157)
- `app/services/__tests__/radioLayout.test.tsx` (F158)
- `app/services/__tests__/realmDiagnostics.test.ts` (F159)
- `app/services/__tests__/realmPersistence.test.ts` (F160)
- `app/services/__tests__/savedContent.test.ts` (F161)
- `app/services/__tests__/searchIndex.test.ts` (F162)
- `app/services/__tests__/startupCountries.test.ts` (F163)
- `app/services/__tests__/taxonomyRecovery.test.ts` (F164)
- `app/services/__tests__/taxonomyState.test.ts` (F165)
- `app/services/__tests__/videoPlayer.test.tsx` (F166)
- `app/services/__tests__/walkthrough.test.tsx` (F167)
- `docs/upgrades/react-native-0.87/README.md` (F207)
- `docs/upgrades/react-native-0.87/analytics-coverage.md` (F208)
- `docs/upgrades/react-native-0.87/analytics-source-inventory.json` (F209)
- `docs/upgrades/react-native-0.87/backup-v3-follow-up.md` (F210)
- `docs/upgrades/react-native-0.87/backup-validation.md` (F211)
- `docs/upgrades/react-native-0.87/bug-sweep.md` (F212)
- `docs/upgrades/react-native-0.87/comparison-change-register.md` (F213)
- `docs/upgrades/react-native-0.87/comparison-file-inventory.json` (F214)
- `docs/upgrades/react-native-0.87/crash-history.md` (F215)
- `docs/upgrades/react-native-0.87/dependency-follow-up.md` (F216)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-bebbo-provenance.json` (F217)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-bebbo-result.json` (F218)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-rerai-provenance.json` (F219)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-rerai-result.json` (F220)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-bebbo-provenance.json` (F221)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-bebbo-result.json` (F222)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-rerai-provenance.json` (F223)
- `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-rerai-result.json` (F224)
- `docs/upgrades/react-native-0.87/evidence/bebbo-before-welcome-clipped.png` (F225)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-after-cancel.png` (F226)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-after-scroll.png` (F227)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-provenance.json` (F228)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-after-cancel.png` (F229)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-after-scroll.png` (F230)
- `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-provenance.json` (F231)
- `docs/upgrades/react-native-0.87/evidence/bebbo-patched-runtime-packaging.json` (F232)
- `docs/upgrades/react-native-0.87/evidence/final-native-data-android-bebbo.json` (F233)
- `docs/upgrades/react-native-0.87/evidence/final-native-data-android-reraiUmntwana.json` (F234)
- `docs/upgrades/react-native-0.87/evidence/final-native-data-ios-bebbo.json` (F235)
- `docs/upgrades/react-native-0.87/evidence/final-native-data-ios-reraiUmntwana.json` (F236)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-android-bebbo.json` (F237)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-android-rerai.json` (F238)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-ios-bebbo.json` (F239)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-ios-rerai.json` (F240)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-provenance-android-bebbo.json` (F241)
- `docs/upgrades/react-native-0.87/evidence/follow-up-native-provenance-android-rerai.json` (F242)
- `docs/upgrades/react-native-0.87/evidence/follow-up-secret-scan.json` (F243)
- `docs/upgrades/react-native-0.87/evidence/follow-up-verification-summary.json` (F244)
- `docs/upgrades/react-native-0.87/evidence/native-build-matrix.json` (F245)
- `docs/upgrades/react-native-0.87/evidence/native-data-and-startup-checks.json` (F246)
- `docs/upgrades/react-native-0.87/evidence/native-data-bebbo-android.json` (F247)
- `docs/upgrades/react-native-0.87/evidence/native-data-bebbo-ios.json` (F248)
- `docs/upgrades/react-native-0.87/evidence/native-data-rerai-android.json` (F249)
- `docs/upgrades/react-native-0.87/evidence/native-data-rerai-ios.json` (F250)
- `docs/upgrades/react-native-0.87/evidence/native-input-equivalence.json` (F251)
- `docs/upgrades/react-native-0.87/evidence/native-maven-audit-before.json` (F252)
- `docs/upgrades/react-native-0.87/evidence/native-maven-runtime-after.json` (F253)
- `docs/upgrades/react-native-0.87/evidence/non-firebase-tls-inventory.json` (F254)
- `docs/upgrades/react-native-0.87/evidence/non-firebase-verification-summary.json` (F255)
- `docs/upgrades/react-native-0.87/evidence/production-checks.json` (F256)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-after-cancel.png` (F257)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-after-scroll.png` (F258)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-provenance.json` (F259)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-after-cancel.png` (F260)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-after-scroll.png` (F261)
- `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-provenance.json` (F262)
- `docs/upgrades/react-native-0.87/evidence/ruby-security-audit-after.json` (F263)
- `docs/upgrades/react-native-0.87/evidence/ruby-update-validation.json` (F264)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0-continued.png` (F265)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0.json` (F266)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0.png` (F267)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3-continued.png` (F268)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3.json` (F269)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3.png` (F270)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0-continued.png` (F271)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0.json` (F272)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0.png` (F273)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3-continued.png` (F274)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3.json` (F275)
- `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3.png` (F276)
- `docs/upgrades/react-native-0.87/evidence/wawamor-arm64-v8a-packaging.json` (F277)
- `docs/upgrades/react-native-0.87/evidence/wawamor-armeabi-v7a-packaging.json` (F278)
- `docs/upgrades/react-native-0.87/evidence/wawamor-x86-packaging.json` (F279)
- `docs/upgrades/react-native-0.87/evidence/wawamor-x86_64-packaging.json` (F280)
- `docs/upgrades/react-native-0.87/extended-review.md` (F281)
- `docs/upgrades/react-native-0.87/flavour-matrix.json` (F282)
- `docs/upgrades/react-native-0.87/native-dependency-security.md` (F283)
- `docs/upgrades/react-native-0.87/non-firebase-follow-up.md` (F284)
- `docs/upgrades/react-native-0.87/remaining-task-follow-up.md` (F285)
- `docs/upgrades/react-native-0.87/review-fixes.md` (F286)
- `docs/upgrades/react-native-0.87/rtl-and-device-validation.md` (F287)
- `docs/upgrades/react-native-0.87/security-assessment.md` (F288)
- `docs/upgrades/react-native-0.87/security-review.md` (F289)
- `docs/upgrades/react-native-0.87/validation-results.md` (F290)
- `scripts/__tests__/chart-paths.test.cjs` (F364)
- `scripts/__tests__/ci-fixtures.test.cjs` (F365)
- `scripts/__tests__/dependency-compat.test.cjs` (F366)
- `scripts/__tests__/fixtures/chart-paths-d3-3.2.0.json` (F367)
- `scripts/__tests__/release-guards.test.cjs` (F368)
- `scripts/__tests__/rtl-input.test.cjs` (F369)
- `scripts/__tests__/security-config.test.cjs` (F370)
- `scripts/__tests__/test_android_packaging.py` (F371)
- `scripts/__tests__/test_ios_configuration.py` (F372)
- `scripts/analytics-inventory.cjs` (F373)

Validation: Reviewed against the source diff and full automated checks; see the verification section for exact native and device limits.

## Appendix A Complete follow up file ledger

Status A means added and M means modified relative to the PR head. All paths are repository relative. A path can support several fixes; its register IDs identify those relationships. The two register artifacts themselves are documentation additions.

| File ID | Status | Path | Register entries |
| --- | --- | --- | --- |
| F001 | M | `.github/workflows/Android_Prod.yml` | C66 |
| F002 | M | `.github/workflows/android.yml` | C66 |
| F003 | M | `.github/workflows/ios.yml` | C66 |
| F004 | M | `.github/workflows/ios_Prod.yml` | C66 |
| F005 | A | `.github/workflows/native-verification.yml` | C53, C60, C66, C67 |
| F006 | A | `.github/workflows/review-checks.yml` | C01, C66, C67, C68 |
| F007 | M | `.gitignore` | C68 |
| F008 | M | `App.tsx` | C10, C11, C12, C13, C20, C50 |
| F009 | M | `Gemfile` | C60 |
| F010 | A | `Gemfile.lock` | C60 |
| F011 | M | `README.md` | C69 |
| F012 | M | `android/app/build.gradle` | C51, C55, C57, C66 |
| F013 | M | `android/app/src/bangla/AndroidManifest.xml` | C49 |
| F014 | M | `android/app/src/bangla/res/layout/launch_screen.xml` | C51 |
| F015 | M | `android/app/src/banglastaging/AndroidManifest.xml` | C49 |
| F016 | M | `android/app/src/banglastaging/res/layout/launch_screen.xml` | C51 |
| F017 | M | `android/app/src/bebboPacific/AndroidManifest.xml` | C49 |
| F018 | M | `android/app/src/bebboPacific/res/layout/launch_screen.xml` | C51 |
| F019 | M | `android/app/src/main/java/org/unicef/ecar/bebbo/MainActivity.kt` | C51 |
| F020 | A | `android/app/src/main/res/drawable/bebbo_logo_shape1_svg_72eabf.xml` | C52 |
| F021 | A | `android/app/src/main/res/drawable/bebbo_logo_shape1_svg_82c63d.xml` | C52 |
| F022 | A | `android/app/src/main/res/drawable/bebbo_logo_shape1_svg_98422f.xml` | C52 |
| F023 | A | `android/app/src/main/res/drawable/bebbo_logo_shape_svg_9edbd8.xml` | C52 |
| F024 | A | `android/app/src/main/res/drawable/bebbo_logo_shape_svg_b84625.xml` | C52 |
| F025 | A | `android/app/src/main/res/drawable/bebbo_logo_shape_svg_fecacb.xml` | C52 |
| F026 | A | `android/app/src/main/res/drawable/img_logo_chatbot_new_svg_0dbf49.xml` | C52 |
| F027 | A | `android/app/src/main/res/drawable/img_logo_chatbot_new_svg_6f2944.xml` | C52 |
| F028 | A | `android/app/src/main/res/drawable/img_logo_chatbot_new_svg_eed7b8.xml` | C52 |
| F029 | A | `android/app/src/main/res/drawable/img_logo_chatbot_new_svg_fa2402.xml` | C52 |
| F030 | M | `android/app/src/merhababebek/AndroidManifest.xml` | C49 |
| F031 | M | `android/app/src/merhababebek/res/layout/launch_screen.xml` | C51 |
| F032 | M | `android/app/src/prod/AndroidManifest.xml` | C49 |
| F033 | M | `android/app/src/prod/res/layout/launch_screen.xml` | C51 |
| F034 | M | `android/app/src/prodstaging/AndroidManifest.xml` | C49 |
| F035 | M | `android/app/src/prodstaging/res/layout/launch_screen.xml` | C51 |
| F036 | M | `android/app/src/reraiUmntwana/AndroidManifest.xml` | C49 |
| F037 | M | `android/app/src/reraiUmntwana/res/layout/launch_screen.xml` | C51 |
| F038 | M | `android/app/src/wawamor/AndroidManifest.xml` | C49 |
| F039 | M | `android/app/src/wawamor/res/layout/launch_screen.xml` | C51 |
| F040 | M | `android/app/src/xk/AndroidManifest.xml` | C49 |
| F041 | M | `android/app/src/xk/res/layout/launch_screen.xml` | C51 |
| F042 | M | `android/app/src/xkstaging/AndroidManifest.xml` | C49 |
| F043 | M | `android/app/src/xkstaging/res/layout/launch_screen.xml` | C51 |
| F044 | M | `android/gradle/wrapper/gradle-wrapper.properties` | C54 |
| F045 | M | `app/assets/data/firebaseEvents.ts` | C46, C48 |
| F046 | M | `app/components/ActivitiesCategories.tsx` | C24 |
| F047 | M | `app/components/AgeBrackets.tsx` | C63 |
| F048 | A | `app/components/BackupPasswordPrompt.tsx` | C12, C14 |
| F049 | A | `app/components/BackupRecoveryScreen.tsx` | C11, C12, C16 |
| F050 | M | `app/components/ChildDate.tsx` | C30, C64 |
| F051 | M | `app/components/CountryItem.tsx` | C40 |
| F052 | M | `app/components/FocusAwareStatusBar.tsx` | C36 |
| F053 | M | `app/components/HeaderBabyMenu.tsx` | C42, C64 |
| F054 | M | `app/components/HeaderNotiIcon.tsx` | C31 |
| F055 | M | `app/components/LanguageItem.tsx` | C40 |
| F056 | M | `app/components/TabScreenHeader.tsx` | C38 |
| F057 | M | `app/components/VideoPlayer.tsx` | C34 |
| F058 | M | `app/components/growth/LastChildMeasure.tsx` | C63 |
| F059 | M | `app/components/healthChekup/UpcomingHealthCheckup.tsx` | C31 |
| F060 | M | `app/components/homeScreen/BabyNotification.tsx` | C64 |
| F061 | M | `app/components/homeScreen/QuickLinksRow.tsx` | C05, C12, C50 |
| F062 | M | `app/components/shared/HeaderContainerStyle.tsx` | C38 |
| F063 | M | `app/components/shared/InfiniteScrollList.tsx` | C63 |
| F064 | M | `app/components/shared/RelatedArticles.tsx` | C63 |
| F065 | M | `app/components/shared/RelatedVideoArticles.tsx` | C63 |
| F066 | M | `app/components/shared/ShareFavButtons.tsx` | C26 |
| F067 | M | `app/components/shared/radio.tsx` | C40 |
| F068 | M | `app/components/vaccination/tabs/PreviousVaccines.tsx` | C63 |
| F069 | M | `app/components/vaccination/tabs/UpcomingVaccines.tsx` | C31 |
| F070 | M | `app/customHooks/useDigitConvert.ts` | C39 |
| F071 | M | `app/database/config/dbConfig.ts` | C17 |
| F072 | M | `app/database/dbquery/dataRealmCommon.ts` | C21, C22, C50, C63 |
| F073 | M | `app/database/dbquery/userRealmCommon.ts` | C22, C25, C28, C63 |
| F074 | M | `app/database/migration/init.ts` | C17 |
| F075 | M | `app/instances/bebbo/config/appConfig.ts` | C39 |
| F076 | M | `app/instances/bebboDev/config/appConfig.ts` | C39 |
| F077 | M | `app/instances/bebboPacific/config/appConfig.ts` | C39 |
| F078 | M | `app/instances/foleja/config/appConfig.ts` | C39 |
| F079 | M | `app/instances/index.ts` | C10 |
| F080 | M | `app/instances/merhabaBebek/config/appConfig.ts` | C39 |
| F081 | M | `app/instances/reraiUmntwana/config/appConfig.ts` | C39 |
| F082 | M | `app/instances/wawamor/config/appConfig.ts` | C39 |
| F083 | M | `app/localization/layoutDirection.ts` | C40 |
| F084 | M | `app/navigation/AppNavigation.tsx` | C01, C33, C46, C49 |
| F085 | M | `app/navigation/types.ts` | C63 |
| F086 | M | `app/redux/reducers/realmPersistor.js` | C18 |
| F087 | M | `app/redux/reducers/realmSafe.ts` | C13, C18, C50 |
| F088 | M | `app/redux/reducers/utilsSlice.ts` | C24 |
| F089 | M | `app/redux/sagaMiddleware/saga.ts` | C21, C23 |
| F090 | M | `app/screens/AddChildInfoSetup.tsx` | C06, C64 |
| F091 | M | `app/screens/AddChildSetup.tsx` | C06, C64 |
| F092 | M | `app/screens/AddExpectingChildProfile.tsx` | C27, C64 |
| F093 | M | `app/screens/AddSiblingData.tsx` | C64 |
| F094 | M | `app/screens/ChildImportSetup.tsx` | C06 |
| F095 | M | `app/screens/ChildSetup.tsx` | C06 |
| F096 | M | `app/screens/ChildSetupList.tsx` | C27 |
| F097 | M | `app/screens/CustomDrawerContent.tsx` | C31, C33, C48, C64 |
| F098 | M | `app/screens/PrivacyPolicy.tsx` | C41 |
| F099 | M | `app/screens/TermsPage.tsx` | C41 |
| F100 | M | `app/screens/Walkthrough.tsx` | C64 |
| F101 | M | `app/screens/home/Aboutus.tsx` | C41 |
| F102 | M | `app/screens/home/ChildProfile.tsx` | C64 |
| F103 | M | `app/screens/home/DetailsScreen.tsx` | C41 |
| F104 | M | `app/screens/home/EditChildProfile.tsx` | C27, C28, C64 |
| F105 | M | `app/screens/home/Favourites.tsx` | C63 |
| F106 | M | `app/screens/home/HealthCheckups.tsx` | C31, C63 |
| F107 | M | `app/screens/home/Notifications.tsx` | C31, C63 |
| F108 | M | `app/screens/home/SettingScreen.tsx` | C06 |
| F109 | M | `app/screens/home/SupportChat.tsx` | C43, C48 |
| F110 | M | `app/screens/home/Vaccination.tsx` | C63 |
| F111 | M | `app/screens/home/bottomTabs/Activities.tsx` | C35 |
| F112 | M | `app/screens/home/bottomTabs/Articles.tsx` | C35 |
| F113 | M | `app/screens/home/bottomTabs/ChildDevelopment.tsx` | C63 |
| F114 | M | `app/screens/home/bottomTabs/Home.tsx` | C48 |
| F115 | M | `app/screens/localization/CountryLanguageConfirmation.tsx` | C37 |
| F116 | M | `app/screens/localization/CountrySelection.tsx` | C19 |
| F117 | M | `app/screens/localization/LanguageSelection.tsx` | C19 |
| F118 | M | `app/screens/vaccination/AddChildVaccination.tsx` | C31 |
| F119 | M | `app/services/DeepLinking.tsx` | C33 |
| F120 | M | `app/services/EventSyncService.ts` | C44 |
| F121 | M | `app/services/LocalNotifications.js` | C32 |
| F122 | M | `app/services/Utils.ts` | C07, C50 |
| F123 | A | `app/services/__tests__/activeChildOrder.test.ts` | C42, C69 |
| F124 | A | `app/services/__tests__/advertisingConsent.test.ts` | C49, C69 |
| F125 | A | `app/services/__tests__/ageLabels.test.ts` | C30, C69 |
| F126 | A | `app/services/__tests__/analyticsPolicy.test.ts` | C45, C46, C69 |
| F127 | A | `app/services/__tests__/articleCache.test.ts` | C22, C69 |
| F128 | M | `app/services/__tests__/backup.test.ts` | C02, C03, C04, C05, C47, C69 |
| F129 | A | `app/services/__tests__/backupCacheCleanup.test.ts` | C13, C69 |
| F130 | A | `app/services/__tests__/backupCipher.test.ts` | C04, C08, C69 |
| F131 | A | `app/services/__tests__/backupPasswordPrompt.test.tsx` | C12, C14, C69 |
| F132 | A | `app/services/__tests__/backupPreview.test.ts` | C12, C15, C69 |
| F133 | A | `app/services/__tests__/backupRecovery.test.ts` | C11, C69 |
| F134 | A | `app/services/__tests__/backupRecoveryScreen.test.tsx` | C16, C69 |
| F135 | A | `app/services/__tests__/backupSnapshot.test.ts` | C09, C10, C69 |
| F136 | A | `app/services/__tests__/bookmarkControls.test.tsx` | C26, C69 |
| F137 | A | `app/services/__tests__/bookmarks.test.ts` | C26, C28, C69 |
| F138 | A | `app/services/__tests__/calendarDate.test.ts` | C30, C69 |
| F139 | A | `app/services/__tests__/confirmBackupReplacement.test.ts` | C06, C69 |
| F140 | A | `app/services/__tests__/contentSync.test.ts` | C21, C22, C23, C69 |
| F141 | A | `app/services/__tests__/deepLinking.test.tsx` | C33, C69 |
| F142 | A | `app/services/__tests__/diagnostics.test.ts` | C50, C69 |
| F143 | A | `app/services/__tests__/eventSync.test.ts` | C44, C69 |
| F144 | A | `app/services/__tests__/externalLink.test.ts` | C33, C69 |
| F145 | M | `app/services/__tests__/firebase.test.ts` | C44, C45, C69 |
| F146 | A | `app/services/__tests__/focusAwareStatusBar.test.tsx` | C36, C69 |
| F147 | A | `app/services/__tests__/growthInterpretation.test.ts` | C29, C69 |
| F148 | A | `app/services/__tests__/headerLayout.test.tsx` | C38, C69 |
| F149 | A | `app/services/__tests__/legacyBackupConversion.test.ts` | C07, C69 |
| F150 | A | `app/services/__tests__/legacyMigration.test.ts` | C17, C69 |
| F151 | M | `app/services/__tests__/localNotifications.test.ts` | C32, C69 |
| F152 | A | `app/services/__tests__/localisedDigits.test.ts` | C39, C69 |
| F153 | A | `app/services/__tests__/measuredLink.test.ts` | C48, C69 |
| F154 | A | `app/services/__tests__/notificationGeneration.test.ts` | C31, C69 |
| F155 | A | `app/services/__tests__/notificationLink.test.ts` | C33, C48, C69 |
| F156 | A | `app/services/__tests__/profileDeletion.test.ts` | C27, C47, C69 |
| F157 | A | `app/services/__tests__/protectedBackupCipher.test.ts` | C08, C14, C69 |
| F158 | A | `app/services/__tests__/radioLayout.test.tsx` | C40, C69 |
| F159 | A | `app/services/__tests__/realmDiagnostics.test.ts` | C13, C18, C50, C69 |
| F160 | A | `app/services/__tests__/realmPersistence.test.ts` | C18, C69 |
| F161 | A | `app/services/__tests__/savedContent.test.ts` | C25, C69 |
| F162 | A | `app/services/__tests__/searchIndex.test.ts` | C35, C69 |
| F163 | A | `app/services/__tests__/startupCountries.test.ts` | C23, C69 |
| F164 | A | `app/services/__tests__/taxonomyRecovery.test.ts` | C20, C69 |
| F165 | A | `app/services/__tests__/taxonomyState.test.ts` | C24, C69 |
| F166 | A | `app/services/__tests__/videoPlayer.test.tsx` | C34, C69 |
| F167 | A | `app/services/__tests__/walkthrough.test.tsx` | C64, C69 |
| F168 | A | `app/services/activeChildOrder.ts` | C42 |
| F169 | A | `app/services/advertisingConsent.ts` | C49 |
| F170 | A | `app/services/ageLabels.ts` | C30 |
| F171 | A | `app/services/analyticsOutbox.ts` | C44 |
| F172 | A | `app/services/analyticsPolicy.ts` | C45, C46 |
| F173 | M | `app/services/backup.tsx` | C02, C03, C04, C05, C08, C47 |
| F174 | A | `app/services/backupCacheCleanup.ts` | C13 |
| F175 | A | `app/services/backupCipher.ts` | C04, C08 |
| F176 | M | `app/services/backupDocuments.ts` | C03, C05 |
| F177 | A | `app/services/backupErrorMessage.ts` | C12 |
| F178 | A | `app/services/backupFormat.ts` | C02, C04 |
| F179 | A | `app/services/backupPassword.ts` | C12 |
| F180 | A | `app/services/backupPhoto.ts` | C09 |
| F181 | A | `app/services/backupPreview.ts` | C12, C15 |
| F182 | A | `app/services/backupRecovery.ts` | C10, C11 |
| F183 | A | `app/services/backupRuntime.ts` | C10, C11 |
| F184 | A | `app/services/backupSnapshot.ts` | C09, C10 |
| F185 | A | `app/services/bookmarks.ts` | C26 |
| F186 | A | `app/services/calendarDate.ts` | C30 |
| F187 | M | `app/services/childCRUD.ts` | C27, C28, C30, C47 |
| F188 | M | `app/services/commonApiService.ts` | C21, C23, C63 |
| F189 | A | `app/services/confirmBackupReplacement.ts` | C06 |
| F190 | A | `app/services/dateUtils.ts` | C29, C30 |
| F191 | A | `app/services/diagnostics.ts` | C50 |
| F192 | A | `app/services/externalLink.ts` | C33 |
| F193 | M | `app/services/firebaseAnalytics.ts` | C44, C45, C47, C50 |
| F194 | M | `app/services/interpretationService.ts` | C29 |
| F195 | A | `app/services/localisedDigits.ts` | C39 |
| F196 | A | `app/services/measuredLink.ts` | C48 |
| F197 | A | `app/services/notificationLink.ts` | C33, C48 |
| F198 | M | `app/services/notificationService.ts` | C31 |
| F199 | M | `app/services/periodicSync.ts` | C31, C63 |
| F200 | A | `app/services/profileDeletion.ts` | C27, C47 |
| F201 | A | `app/services/protectedBackupCipher.ts` | C08, C09, C14 |
| F202 | A | `app/services/screenAnalytics.ts` | C46 |
| F203 | A | `app/services/searchIndex.ts` | C35 |
| F204 | A | `app/services/taxonomyCollections.ts` | C24 |
| F205 | A | `app/services/taxonomyRecovery.ts` | C20 |
| F206 | M | `babel.config.js` | C64 |
| F207 | M | `docs/upgrades/react-native-0.87/README.md` | C69 |
| F208 | A | `docs/upgrades/react-native-0.87/analytics-coverage.md` | C69 |
| F209 | A | `docs/upgrades/react-native-0.87/analytics-source-inventory.json` | C69 |
| F210 | A | `docs/upgrades/react-native-0.87/backup-v3-follow-up.md` | C69 |
| F211 | A | `docs/upgrades/react-native-0.87/backup-validation.md` | C69 |
| F212 | A | `docs/upgrades/react-native-0.87/bug-sweep.md` | C69 |
| F213 | A | `docs/upgrades/react-native-0.87/comparison-change-register.md` | C69 |
| F214 | A | `docs/upgrades/react-native-0.87/comparison-file-inventory.json` | C69 |
| F215 | A | `docs/upgrades/react-native-0.87/crash-history.md` | C69 |
| F216 | A | `docs/upgrades/react-native-0.87/dependency-follow-up.md` | C69 |
| F217 | A | `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-bebbo-provenance.json` | C67, C69 |
| F218 | A | `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-bebbo-result.json` | C67, C69 |
| F219 | A | `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-rerai-provenance.json` | C67, C69 |
| F220 | A | `docs/upgrades/react-native-0.87/evidence/backup-v3-native-android-rerai-result.json` | C67, C69 |
| F221 | A | `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-bebbo-provenance.json` | C67, C69 |
| F222 | A | `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-bebbo-result.json` | C67, C69 |
| F223 | A | `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-rerai-provenance.json` | C67, C69 |
| F224 | A | `docs/upgrades/react-native-0.87/evidence/backup-v3-native-ios-rerai-result.json` | C67, C69 |
| F225 | A | `docs/upgrades/react-native-0.87/evidence/bebbo-before-welcome-clipped.png` | C37, C67, C69 |
| F226 | A | `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-after-cancel.png` | C37, C67, C69 |
| F227 | A | `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-after-scroll.png` | C37, C67, C69 |
| F228 | A | `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.0-provenance.json` | C37, C67, C69 |
| F229 | A | `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-after-cancel.png` | C37, C67, C69 |
| F230 | A | `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-after-scroll.png` | C37, C67, C69 |
| F231 | A | `docs/upgrades/react-native-0.87/evidence/bebbo-font-1.3-provenance.json` | C37, C67, C69 |
| F232 | A | `docs/upgrades/react-native-0.87/evidence/bebbo-patched-runtime-packaging.json` | C67, C69 |
| F233 | A | `docs/upgrades/react-native-0.87/evidence/final-native-data-android-bebbo.json` | C67, C69 |
| F234 | A | `docs/upgrades/react-native-0.87/evidence/final-native-data-android-reraiUmntwana.json` | C67, C69 |
| F235 | A | `docs/upgrades/react-native-0.87/evidence/final-native-data-ios-bebbo.json` | C67, C69 |
| F236 | A | `docs/upgrades/react-native-0.87/evidence/final-native-data-ios-reraiUmntwana.json` | C67, C69 |
| F237 | A | `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-android-bebbo.json` | C67, C69 |
| F238 | A | `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-android-rerai.json` | C67, C69 |
| F239 | A | `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-ios-bebbo.json` | C67, C69 |
| F240 | A | `docs/upgrades/react-native-0.87/evidence/follow-up-native-data-ios-rerai.json` | C67, C69 |
| F241 | A | `docs/upgrades/react-native-0.87/evidence/follow-up-native-provenance-android-bebbo.json` | C67, C69 |
| F242 | A | `docs/upgrades/react-native-0.87/evidence/follow-up-native-provenance-android-rerai.json` | C67, C69 |
| F243 | A | `docs/upgrades/react-native-0.87/evidence/follow-up-secret-scan.json` | C67, C68, C69 |
| F244 | A | `docs/upgrades/react-native-0.87/evidence/follow-up-verification-summary.json` | C67, C69 |
| F245 | A | `docs/upgrades/react-native-0.87/evidence/native-build-matrix.json` | C67, C69 |
| F246 | A | `docs/upgrades/react-native-0.87/evidence/native-data-and-startup-checks.json` | C67, C69 |
| F247 | A | `docs/upgrades/react-native-0.87/evidence/native-data-bebbo-android.json` | C67, C69 |
| F248 | A | `docs/upgrades/react-native-0.87/evidence/native-data-bebbo-ios.json` | C67, C69 |
| F249 | A | `docs/upgrades/react-native-0.87/evidence/native-data-rerai-android.json` | C67, C69 |
| F250 | A | `docs/upgrades/react-native-0.87/evidence/native-data-rerai-ios.json` | C67, C69 |
| F251 | A | `docs/upgrades/react-native-0.87/evidence/native-input-equivalence.json` | C67, C69 |
| F252 | A | `docs/upgrades/react-native-0.87/evidence/native-maven-audit-before.json` | C55, C67, C69 |
| F253 | A | `docs/upgrades/react-native-0.87/evidence/native-maven-runtime-after.json` | C55, C67, C69 |
| F254 | A | `docs/upgrades/react-native-0.87/evidence/non-firebase-tls-inventory.json` | C67, C69 |
| F255 | A | `docs/upgrades/react-native-0.87/evidence/non-firebase-verification-summary.json` | C67, C69 |
| F256 | A | `docs/upgrades/react-native-0.87/evidence/production-checks.json` | C67, C69 |
| F257 | A | `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-after-cancel.png` | C37, C67, C69 |
| F258 | A | `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-after-scroll.png` | C37, C67, C69 |
| F259 | A | `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.0-provenance.json` | C37, C67, C69 |
| F260 | A | `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-after-cancel.png` | C37, C67, C69 |
| F261 | A | `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-after-scroll.png` | C37, C67, C69 |
| F262 | A | `docs/upgrades/react-native-0.87/evidence/reraiUmntwana-font-1.3-provenance.json` | C37, C67, C69 |
| F263 | A | `docs/upgrades/react-native-0.87/evidence/ruby-security-audit-after.json` | C60, C67, C69 |
| F264 | A | `docs/upgrades/react-native-0.87/evidence/ruby-update-validation.json` | C60, C67, C69 |
| F265 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0-continued.png` | C37, C67, C69 |
| F266 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0.json` | C37, C67, C69 |
| F267 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.0.png` | C37, C67, C69 |
| F268 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3-continued.png` | C37, C67, C69 |
| F269 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3.json` | C37, C67, C69 |
| F270 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-bebbo-font-1.3.png` | C37, C67, C69 |
| F271 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0-continued.png` | C37, C67, C69 |
| F272 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0.json` | C37, C67, C69 |
| F273 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.0.png` | C37, C67, C69 |
| F274 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3-continued.png` | C37, C67, C69 |
| F275 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3.json` | C37, C67, C69 |
| F276 | A | `docs/upgrades/react-native-0.87/evidence/verified-startup-reraiUmntwana-font-1.3.png` | C37, C67, C69 |
| F277 | A | `docs/upgrades/react-native-0.87/evidence/wawamor-arm64-v8a-packaging.json` | C67, C69 |
| F278 | A | `docs/upgrades/react-native-0.87/evidence/wawamor-armeabi-v7a-packaging.json` | C67, C69 |
| F279 | A | `docs/upgrades/react-native-0.87/evidence/wawamor-x86-packaging.json` | C67, C69 |
| F280 | A | `docs/upgrades/react-native-0.87/evidence/wawamor-x86_64-packaging.json` | C67, C69 |
| F281 | A | `docs/upgrades/react-native-0.87/extended-review.md` | C69 |
| F282 | A | `docs/upgrades/react-native-0.87/flavour-matrix.json` | C69 |
| F283 | A | `docs/upgrades/react-native-0.87/native-dependency-security.md` | C55, C69 |
| F284 | A | `docs/upgrades/react-native-0.87/non-firebase-follow-up.md` | C69 |
| F285 | A | `docs/upgrades/react-native-0.87/remaining-task-follow-up.md` | C69 |
| F286 | A | `docs/upgrades/react-native-0.87/review-fixes.md` | C69 |
| F287 | A | `docs/upgrades/react-native-0.87/rtl-and-device-validation.md` | C69 |
| F288 | A | `docs/upgrades/react-native-0.87/security-assessment.md` | C69 |
| F289 | M | `docs/upgrades/react-native-0.87/security-review.md` | C69 |
| F290 | A | `docs/upgrades/react-native-0.87/validation-results.md` | C69 |
| F291 | A | `firebase.json` | C49, C58 |
| F292 | M | `ios/.xcode.env` | C57 |
| F293 | M | `ios/BebboPacific-Info.plist` | C49, C58 |
| F294 | M | `ios/MerhabaBebek-Info.plist` | C49, C58 |
| F295 | M | `ios/ParentBuddyApp.xcodeproj/project.pbxproj` | C57, C59 |
| F296 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/BebboPacific.xcscheme` | C58 |
| F297 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/MerhabaBebek.xcscheme` | C58 |
| F298 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyApp.xcscheme` | C58 |
| F299 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppBangla.xcscheme` | C58 |
| F300 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppBanglaDev.xcscheme` | C58 |
| F301 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppDev.xcscheme` | C58 |
| F302 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppXk.xcscheme` | C58 |
| F303 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ParentBuddyAppXkDev.xcscheme` | C58 |
| F304 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/ReraiUmntwana.xcscheme` | C58 |
| F305 | M | `ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/Wawamor.xcscheme` | C58 |
| F306 | M | `ios/ParentBuddyApp/Images.xcassets/activity_feature_logo_svg_97fc39.imageset/light.pdf` | C52 |
| F307 | M | `ios/ParentBuddyApp/Images.xcassets/advice_feature_logo_svg_7c0e83.imageset/light.pdf` | C52 |
| F308 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_72eabf.imageset/Contents.json` | C52 |
| F309 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_72eabf.imageset/light.pdf` | C52 |
| F310 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_82c63d.imageset/Contents.json` | C52 |
| F311 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_82c63d.imageset/light.pdf` | C52 |
| F312 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_98422f.imageset/Contents.json` | C52 |
| F313 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_98422f.imageset/light.pdf` | C52 |
| F314 | M | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape1_svg_b84625.imageset/light.pdf` | C52 |
| F315 | M | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_55f84f.imageset/light.pdf` | C52 |
| F316 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_9edbd8.imageset/Contents.json` | C52 |
| F317 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_9edbd8.imageset/light.pdf` | C52 |
| F318 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_b84625.imageset/Contents.json` | C52 |
| F319 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_b84625.imageset/light.pdf` | C52 |
| F320 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_fecacb.imageset/Contents.json` | C52 |
| F321 | A | `ios/ParentBuddyApp/Images.xcassets/bebbo_logo_shape_svg_fecacb.imageset/light.pdf` | C52 |
| F322 | M | `ios/ParentBuddyApp/Images.xcassets/camera_profile_svg_a16942.imageset/light.pdf` | C52 |
| F323 | M | `ios/ParentBuddyApp/Images.xcassets/chart_svg_e10e63.imageset/light.pdf` | C52 |
| F324 | M | `ios/ParentBuddyApp/Images.xcassets/history_svg_a08286.imageset/light.pdf` | C52 |
| F325 | M | `ios/ParentBuddyApp/Images.xcassets/ic_activity_color_svg_86e25d.imageset/light.pdf` | C52 |
| F326 | M | `ios/ParentBuddyApp/Images.xcassets/ic_article_color_svg_0eb212.imageset/light.pdf` | C52 |
| F327 | M | `ios/ParentBuddyApp/Images.xcassets/ic_backup_link_svg_5eb37b.imageset/light.pdf` | C52 |
| F328 | M | `ios/ParentBuddyApp/Images.xcassets/ic_chat_link_svg_68719f.imageset/light.pdf` | C52 |
| F329 | M | `ios/ParentBuddyApp/Images.xcassets/ic_development_color_svg_623199.imageset/light.pdf` | C52 |
| F330 | M | `ios/ParentBuddyApp/Images.xcassets/ic_favorites_link_svg_a63c49.imageset/light.pdf` | C52 |
| F331 | M | `ios/ParentBuddyApp/Images.xcassets/ic_file_svg_873adc.imageset/light.pdf` | C52 |
| F332 | M | `ios/ParentBuddyApp/Images.xcassets/ic_gdrive_svg_1618e2.imageset/light.pdf` | C52 |
| F333 | M | `ios/ParentBuddyApp/Images.xcassets/ic_growth_color_svg_532ea2.imageset/light.pdf` | C52 |
| F334 | M | `ios/ParentBuddyApp/Images.xcassets/ic_health_color_svg_b47d6e.imageset/light.pdf` | C52 |
| F335 | M | `ios/ParentBuddyApp/Images.xcassets/ic_tools_color_svg_335b8f.imageset/light.pdf` | C52 |
| F336 | M | `ios/ParentBuddyApp/Images.xcassets/ic_vaccination_color_svg_5b90d8.imageset/light.pdf` | C52 |
| F337 | A | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_0dbf49.imageset/Contents.json` | C52 |
| F338 | A | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_0dbf49.imageset/light.pdf` | C52 |
| F339 | A | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_6f2944.imageset/Contents.json` | C52 |
| F340 | A | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_6f2944.imageset/light.pdf` | C52 |
| F341 | M | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_c61e96.imageset/light.pdf` | C52 |
| F342 | A | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_eed7b8.imageset/Contents.json` | C52 |
| F343 | A | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_eed7b8.imageset/light.pdf` | C52 |
| F344 | A | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_fa2402.imageset/Contents.json` | C52 |
| F345 | A | `ios/ParentBuddyApp/Images.xcassets/img_logo_chatbot_new_svg_fa2402.imageset/light.pdf` | C52 |
| F346 | M | `ios/ParentBuddyApp/Images.xcassets/play_icon_svg_b1cbb6.imageset/light.pdf` | C52 |
| F347 | M | `ios/ParentBuddyApp/Images.xcassets/tools_features_logo_svg_41c195.imageset/light.pdf` | C52 |
| F348 | M | `ios/ParentBuddyApp/Info.plist` | C49, C58 |
| F349 | M | `ios/ParentBuddyAppBangla-Info.plist` | C49, C58 |
| F350 | M | `ios/ParentBuddyAppBanglaDev-Info.plist` | C49, C58 |
| F351 | M | `ios/ParentBuddyAppDev-Info.plist` | C49, C58 |
| F352 | M | `ios/ParentBuddyAppXk-Info.plist` | C49, C58 |
| F353 | M | `ios/ParentBuddyAppXkDev-Info.plist` | C49, C58 |
| F354 | A | `ios/Podfile.lock` | C60 |
| F355 | M | `ios/ReraiUmntwana-Info.plist` | C49, C58 |
| F356 | M | `ios/Wawamor-Info.plist` | C49, C58 |
| F357 | M | `metro.config.js` | C65 |
| F358 | M | `package-lock.json` | C56, C61, C62 |
| F359 | M | `package.json` | C52, C56, C61, C62, C63, C64 |
| F360 | A | `patches/@d11+react-native-fast-image+8.13.0.patch` | C63 |
| F361 | A | `patches/@react-native+gradle-plugin+0.87.1.patch` | C54 |
| F362 | A | `patches/babel-plugin-module-resolver+5.0.3.patch` | C62 |
| F363 | A | `patches/realm+20.2.0.patch` | C56 |
| F364 | A | `scripts/__tests__/chart-paths.test.cjs` | C61, C67, C69 |
| F365 | A | `scripts/__tests__/ci-fixtures.test.cjs` | C66, C67, C69 |
| F366 | A | `scripts/__tests__/dependency-compat.test.cjs` | C62, C67, C69 |
| F367 | A | `scripts/__tests__/fixtures/chart-paths-d3-3.2.0.json` | C61, C67, C69 |
| F368 | A | `scripts/__tests__/release-guards.test.cjs` | C19, C52, C65, C67, C69 |
| F369 | A | `scripts/__tests__/rtl-input.test.cjs` | C39, C67, C69 |
| F370 | A | `scripts/__tests__/security-config.test.cjs` | C43, C54, C67, C69 |
| F371 | A | `scripts/__tests__/test_android_packaging.py` | C53, C67, C69 |
| F372 | A | `scripts/__tests__/test_ios_configuration.py` | C57, C58, C59, C67, C69 |
| F373 | A | `scripts/analytics-inventory.cjs` | C69 |
| F374 | A | `scripts/android-startup-smoke.sh` | C23, C53, C67 |
| F375 | A | `scripts/android_elf.py` | C53 |
| F376 | A | `scripts/bundle-ios.sh` | C57 |
| F377 | A | `scripts/check-android-bundle.py` | C53, C67 |
| F378 | A | `scripts/check-android-splits.py` | C53, C67 |
| F379 | A | `scripts/check-ios-archive.py` | C58, C67 |
| F380 | A | `scripts/check-production-bundle.cjs` | C01, C67 |
| F381 | A | `scripts/check-types.cjs` | C63, C67 |
| F382 | A | `scripts/ci-fixtures.cjs` | C66 |
| F383 | A | `scripts/collect-vector-assets.cjs` | C52 |
| F384 | A | `scripts/flavour-audit.py` | C66 |
| F385 | A | `scripts/flavour-cache.cjs` | C65 |
| F386 | A | `scripts/ios-archive-symbols.sh` | C58 |
| F387 | A | `scripts/scan-new-secrets.sh` | C68 |
| F388 | A | `scripts/secret-scan-regression.py` | C68 |
| F389 | A | `scripts/typescript-baseline.json` | C63 |
| F390 | A | `scripts/vector-assets-manifest.json` | C52 |
| F391 | A | `scripts/vector-assets.cjs` | C52 |
| F392 | M | `tsconfig.json` | C63, C64 |

## Appendix B Complete resolved npm path differences

These are 100 lockfile path/version differences, including additions, removals and hoisting moves. They are not 100 independent upgrades or vulnerabilities. Absence at one path does not prove removal from the full dependency tree. Direct package/security decisions are explained in C61 to C63 and the retained-version notes.

| Lockfile package path | PR head | Fixes branch |
| --- | --- | --- |
| `node_modules/@babel/generator` | 7.29.13 | 7.29.14 |
| `node_modules/@babel/helper-create-regexp-features-plugin` | 7.27.1 | 7.29.14 |
| `node_modules/@babel/helper-define-polyfill-provider` | 0.6.5 | 0.6.8 |
| `node_modules/@babel/helper-module-transforms` | 7.29.13 | 7.29.14 |
| `node_modules/@babel/helper-remap-async-to-generator` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/helper-string-parser` | 7.29.13 | 7.29.14 |
| `node_modules/@babel/helper-wrap-function` | 7.28.3 | 7.29.14 |
| `node_modules/@babel/parser` | 7.29.13 | 7.29.14 |
| `node_modules/@babel/plugin-bugfix-firefox-class-in-computed-class-key` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-bugfix-safari-class-field-initializer-scope` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-bugfix-safari-rest-destructuring-rhs-array` | Absent at this path | 7.29.13 |
| `node_modules/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly` | 7.28.3 | 7.29.7 |
| `node_modules/@babel/plugin-syntax-import-assertions` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-syntax-import-attributes` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-arrow-functions` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-async-generator-functions` | 7.28.0 | 7.29.7 |
| `node_modules/@babel/plugin-transform-async-to-generator` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-block-scoped-functions` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-block-scoping` | 7.28.0 | 7.29.13 |
| `node_modules/@babel/plugin-transform-class-static-block` | 7.28.3 | 7.29.14 |
| `node_modules/@babel/plugin-transform-computed-properties` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-destructuring` | 7.28.0 | 7.29.13 |
| `node_modules/@babel/plugin-transform-dotall-regex` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-duplicate-keys` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-duplicate-named-capturing-groups-regex` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-dynamic-import` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-explicit-resource-management` | 7.28.0 | 7.29.7 |
| `node_modules/@babel/plugin-transform-exponentiation-operator` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-export-namespace-from` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-for-of` | 7.27.1 | 7.29.13 |
| `node_modules/@babel/plugin-transform-function-name` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-json-strings` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-literals` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-logical-assignment-operators` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-member-expression-literals` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-modules-amd` | 7.27.1 | 7.29.14 |
| `node_modules/@babel/plugin-transform-modules-commonjs` | 7.29.7 | 7.29.14 |
| `node_modules/@babel/plugin-transform-modules-umd` | 7.27.1 | 7.29.14 |
| `node_modules/@babel/plugin-transform-named-capturing-groups-regex` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-new-target` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-numeric-separator` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-object-rest-spread` | 7.28.0 | 7.29.7 |
| `node_modules/@babel/plugin-transform-object-super` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-optional-catch-binding` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-parameters` | 7.27.7 | 7.29.7 |
| `node_modules/@babel/plugin-transform-private-methods` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-private-property-in-object` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-property-literals` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-regenerator` | 7.28.3 | 7.29.8 |
| `node_modules/@babel/plugin-transform-regexp-modifiers` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-reserved-words` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-shorthand-properties` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-spread` | 7.27.1 | 7.29.11 |
| `node_modules/@babel/plugin-transform-sticky-regex` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-template-literals` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-typeof-symbol` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-unicode-escapes` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-unicode-property-regex` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-unicode-regex` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/plugin-transform-unicode-sets-regex` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/preset-env` | 7.28.3 | 7.29.14 |
| `node_modules/@babel/preset-env/node_modules/babel-plugin-polyfill-corejs3` | Absent at this path | 0.14.2 |
| `node_modules/@babel/runtime` | 7.29.13 | 7.29.14 |
| `node_modules/@babel/traverse` | 7.29.13 | 7.29.14 |
| `node_modules/@babel/types` | 7.29.11 | 7.29.14 |
| `node_modules/@isaacs/nonrecursive-glob-match` | Absent at this path | 1.1.0 |
| `node_modules/@types/luxon` | 3.7.1 | 3.7.6 |
| `node_modules/@typescript-eslint/parser/node_modules/debug` | 4.4.3 | Absent at this path |
| `node_modules/@typescript-eslint/project-service/node_modules/debug` | 4.4.3 | Absent at this path |
| `node_modules/@typescript-eslint/type-utils/node_modules/debug` | 4.4.3 | Absent at this path |
| `node_modules/@typescript-eslint/typescript-estree/node_modules/debug` | 4.4.3 | Absent at this path |
| `node_modules/babel-plugin-module-resolver/node_modules/glob` | 9.3.5 | 14.0.2 |
| `node_modules/babel-plugin-module-resolver/node_modules/minimatch` | 8.0.7 | Absent at this path |
| `node_modules/babel-plugin-polyfill-corejs2` | 0.4.14 | 0.4.17 |
| `node_modules/babel-plugin-polyfill-regenerator` | 0.6.5 | 0.6.8 |
| `node_modules/body-parser/node_modules/debug` | 4.4.3 | Absent at this path |
| `node_modules/cheerio` | 1.1.2 | 1.2.0 |
| `node_modules/core-js-compat` | 3.45.1 | 3.51.0 |
| `node_modules/d3-shape` | 3.2.0 | 3.2.1 |
| `node_modules/debug` | 4.4.1 | 4.4.3 |
| `node_modules/htmlparser2` | 10.0.0 | 10.1.0 |
| `node_modules/htmlparser2/node_modules/entities` | 6.0.1 | 7.0.1 |
| `node_modules/is-core-module` | 2.16.1 | 2.18.0 |
| `node_modules/minimatch` | 10.2.6 | 11.0.1 |
| `node_modules/minipass` | 4.2.8 | 7.1.3 |
| `node_modules/path-scurry` | 1.11.1 | 3.0.0 |
| `node_modules/path-scurry/node_modules/lru-cache` | 10.4.3 | 11.5.3 |
| `node_modules/path-scurry/node_modules/minipass` | 7.1.2 | Absent at this path |
| `node_modules/react-native-rename/node_modules/chalk` | 5.6.0 | 5.6.2 |
| `node_modules/regenerate` | 1.4.2 | 1.5.0 |
| `node_modules/regenerate-unicode-properties` | 10.2.0 | 10.3.0 |
| `node_modules/regexpu-core` | 6.2.0 | 6.5.4 |
| `node_modules/regjsparser` | 0.12.0 | 0.14.1 |
| `node_modules/regjsparser/node_modules/jsesc` | 3.0.2 | Absent at this path |
| `node_modules/resolve` | 1.22.10 | 1.22.14 |
| `node_modules/typescript` | 6.0.3 | 5.9.3 |
| `node_modules/unicode-match-property-value-ecmascript` | 2.2.0 | 2.2.1 |
| `node_modules/unicode-property-aliases-ecmascript` | 2.1.0 | 2.2.0 |

## Retained dependencies and unchanged migration boundaries

Realm remains 20.2.0 with UserRealm 4, DataRealm 13 and ReduxRealm 1. Dotenv remains 3.4.12; major 5 requires separate flavour/environment migration validation. Firebase remains aligned at 26.4.1 on the tested CocoaPods path, not a new major/SPM migration. Reanimated 4.7.1/Worklets 0.13.1, Skia 2.15.1/Victory 43.0.1 and other selected native/UI versions are retained unless a specific justified change is recorded. The rename 3.3.2 trial was rejected and is not in the final branch. The remaining deepmerge npm advisory has no compatible published fix and is disputed; it was not hidden by obsolete-tool downgrades. See native-dependency-security.md for unresolved build-only/Apple/vendored-binary coverage. Android API 24/iOS 15.1 minimums and production architecture declarations are preserved.

## Review coverage and interpretation

All net-changed paths were inventoried and assigned a register entry. Source/configuration diffs and tests were reviewed by area; binary generated assets were verified through their manifest/resource checks, source-specific builds and existing visual evidence. Historical reports/results remain historical. The original and comparison SHA pairings, every original PR path, every follow-up path and all 100 resolved npm path changes are retained in comparison-file-inventory.json. Reverted experiments are mentioned as decisions, not shipped upgrades. No runtime change is inferred merely because a lockfile, snapshot, screenshot or report changed.
