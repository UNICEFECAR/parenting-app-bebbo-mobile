# Backup, restore and import validation

**14 November follow-up:** [Implemented non-Firebase fixes and current validation](non-firebase-follow-up.md), including passphrase-protected portable backups, journalled recovery and a clean strict TypeScript check. Older source-specific results below remain historical evidence.

## Format and behaviour

All restore paths validate/detach before writing live profiles and replace ChildEntity/embedded Measures/Reminder records in **one synchronous user-Realm write**. Import is explicit replacement, not merge; repeated imports do not append profiles. V3 snapshots also journal previous/target children, caregiver settings and Redux preferences before replacement, then recover idempotently on startup. Separate stores are not one database transaction: the durable journal and blocking retry/rollback screen provide recovery when a later step fails. See [the complete protocol and native provenance](backup-v3-follow-up.md).

Every caregiver-facing replacement path requires confirmation. V3 uses `backupRestoreReplaceWarningV3` with an explicit English default covering child/pregnancy records, photos and preferences, backing up first, trusted files and no merge. Country teams must approve the translation before fully localised release acceptance is claimed.

All new caregiver-facing local/Drive exports use the **v3 passphrase-protected portable snapshot**, documented in `protectedBackupCipher.ts` and `backupSnapshot.ts`. User passphrases are not stored or recoverable; new files require the updated app and the passphrase on the receiving device. Modern snapshots enforce the same flavour and country while allowing a different UI language. Legacy v2/fixed-IV JSON and copied binary Realm readers remain. Historical files retain their old protection: app-wide keys are extractable, v2 MACs do not establish trusted authorship, and fixed-IV legacy JSON has no authentication tag. Legacy formats do not establish cross-country/taxonomy compatibility.

## What is actually backed up

| Data | Behaviour |
| --- | --- |
| Child/pregnancy profiles | ChildEntity fields, including stored identifiers, dates, names, gender and profile flags; dates validated/converted. Pregnancy handling still uses existing app converter rules and needs historical device fixtures. |
| Growth/health/vaccination | Embedded Measures, including height/weight, vaccine IDs, dates, location and comments, subject to existing legacy converter/schema validation. Tool action analytics are separate. |
| Milestones | checkedMilestones IDs; same-country taxonomy/content identifiers must remain compatible. |
| Reminders | Embedded records with existing compatibility conversion; system notification requests are regenerated, not backed up as OS objects. |
| Saved content | Advice/game IDs attached to the correct child. Actual CMS media/content files are not embedded. Content refresh no longer purges saved IDs merely because a response/cache is partial. |
| Root measurement place | Retained by the converter (was omitted). |
| Child photos | V3 includes validated JPEG/PNG bytes keyed by child UUID, stages independent local filenames, and fails explicitly for missing/unsupported/oversized attachments. Legacy formats retain path-reference-only behaviour. |
| Preferences/caregiver settings | V3 includes allowlisted caregiver fields, active child, reminder switches and optional data-saver preference, with durable recovery. It retains the receiving country/language and other configuration. Legacy formats do not carry these preferences. Onboarding can apply subsequently entered caregiver details. |

Portable photos/preferences and cross-store recovery are now implemented in v3. This is an application snapshot, not an OS/device image: credentials, downloaded CMS files, telemetry queues and OS permissions are deliberately excluded. Snapshot/image bounds and migration rules are explicit in the [v3 follow-up](backup-v3-follow-up.md). Real historical files, external providers, actual device/platform exchange and low-resource devices remain acceptance checks. The detailed earlier automated rows below must be read with their source-specific provenance; current results are in the [non-Firebase follow-up](non-firebase-follow-up.md).

## Automated scenarios

| Scenario | Verified scope |
| --- | --- |
| Android quoted/iOS raw JSON, BOM/outer controls | Unit format tests; new envelope cryptographic round trips with Node AES/HMAC implementations matching native signatures. Native AES/HMAC raw/quoted and legacy round trips pass on Android emulators and iOS simulators for Bebbo/Rerai. Actual encrypted-file exchange between platforms remains acceptance. |
| Current and legacy JSON/binary Realm | Reader, private-copy, close/cleanup and legacy-converter invocation tests. Not a real old installed Realm file migration or all historical export versions. |
| Multiple/expected profiles, nested growth/vaccines/reminders/milestones/bookmarks | Complete synthetic payload pass-through, correct root transaction and 500-profile repeated-import test; orchestration uses doubles, complemented by actual three-profile child/pregnancy/nested ownership and legacy-converter checks on all four native runs. |
| Repeated replacement | No appended child UUIDs in transaction model; restored analytics never new-profile events. |
| Invalid/empty/missing/duplicate child data | Rejected before live opening/writes. Unsafe UUID query syntax, malformed nested collections, duplicate nested identifiers and invalid saved IDs rejected. |
| Corrupt/unknown encrypted files | MAC/IV/cipher modification, wrong key, truncated envelope and unsupported version fail before decryption/live mutation. Invalid control bytes inside JSON are rejected rather than silently deleted from caregiver text. |
| Failure on second insertion | Transaction rollback model preserves all previous children and first insertion; native failed-second-insertion rollback also passes in all four emulator/simulator runs. |
| Picker/read/provider copy errors, cancellation, disk/write failure | Unit simulated failures, awaited copy/share and temporary cleanup; no success navigation/count on failed restore. Physical insufficient-storage and provider process interruption remain device tests. |
| Drive denied/cancelled authorisation, listing/download/upload errors | Mocked service tests; failed upload keeps previous copy, deletion only follows confirmed replacement. No live Drive account round trip. |
| Overlapping/repeated taps | Singleton operation lock and onboarding ref guard; operations fail/return neutral rather than overlap. |
| Arabic/Urdu text | Unicode synthetic names round-trip through JSON/crypto; not Arabic/Urdu screen approval or translated file-provider QA. |
| Restart/interrupted import | Preparation leaves current Realm untouched; single write uses Realm transaction semantics. The captured native runs stop/restart a 5,000-profile replacement and accept only the complete original or committed dataset. The latest Android runs recover the original three profiles; latest iOS runs recover all 5,000 committed profiles. No partial/mixed records are accepted. Post-commit settings failure and physical-device kill/storage conditions remain acceptance. |

## Device acceptance procedure

Use test data only and retain an independent known-good export before replacement. For each supported flavour/platform, exercise a fresh install and an upgrade from its latest production app with at least two born children and one pregnancy, multiple measurement/vaccine/milestone/reminder records, saved content, preferences and a photo. Compare every stored field/owner before export and after restore; separately expect the documented photo/preferences gaps.

Test same-device local file, Drive, Android→iOS and iOS→Android within the same flavour, older exported JSON/binary fixtures, two repeated imports, large growth histories, and active-child fallback. Run offline, airplane-mode restarts, cancel each picker/auth/confirmation step, force close during file copying/decryption/native transaction and after commit, revoke Drive permission, fill device storage and retry after freeing it. Test no-child, truncated, incompatible and wrong-key files. Inspect current records after every failure, not merely the success message. Review temporary private cache remnants after process death; normal `finally` cleanup cannot run after a hard kill. Authenticate production files with the real flavour keys without copying secrets into logs/reports.

Before release, review the app-wide extractable encryption key and lack of user-held recovery secret, legacy unauthenticated file support, cache cleanup after process death, incomplete preferences/photo portability and translation approval. The new envelope improves integrity/randomisation; it does not make client-shared-key backups equivalent to end-to-end user-held-key encryption.


## Additional upgrade-preservation safeguards

The user Realm retains schema 4. The separate Redux Realm retains schema 1 but now registers its existing schema-0 migration through `onMigration` and writes migrated fragments to the new Realm, not the old one. Large non-Latin strings are fragmented within native UTF-8 limits without breaking surrogate pairs. Country/language setup no longer deletes non-imported child profiles based on a missing onboarding flag; imported status does not identify disposable records. Five migration/fragment regressions and a localisation source guard pass. These tests do not substitute for installing an actual historical production database.


## First captured native evidence (14-scenario checkpoint)

Bebbo and Rerai each pass 14 checks on Android API-35 x86_64 emulators and Release iPhone simulators: native random IV/AES/HMAC/tamper rejection; legacy ciphertext and record conversion; three-profile child/pregnancy/nested ownership; repeat replacement; actual failed-insert transaction rollback; synthetic user-Realm schema 3→4 and Redux-Realm schema 0→1 migrations; approximately 18 MB of Unicode cache text; settings preservation; app restarts; real startup taxonomy-cache recovery; and interrupted 5,000-profile replacement. Every interruption run observed `writing` and recovered the old complete three-profile dataset. This does not establish physical-device power-loss behaviour or a complete cross-store restore journal.

The status-only result/provenance files are in [evidence](evidence/). Android [run 43483023359](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43483023359) reuses native binaries from `0da745b` and verifies that only release Hermes bytecode changed. iOS data jobs in [run 43482015050](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43482015050) compile the same data-test source for simulators. The first Android harness attempt failed before app launch because of shell-variable scope; the corrected run passes both flavours. Test controllers remain only on the isolated QA branch and are rejected by production bundle guards. Data-path source is `1943dc16`; subsequent bookmark/profile-delete changes do not alter backup, crypto, persistence or migration code.


The actual legacy converter also has five regressions for empty/null or height-only/weight-only vaccination records and unchanged current array-format units. Previously four legacy cases omitted native-required string fields and prevented the whole restore; now available values are converted, absent values remain empty (never zero), and vaccination IDs/comments remain attached to their profile. These new edge cases are distinguished from the earlier four native happy-path legacy runs until the extended native results are recorded.


Explicit expected-child flags are now preserved even when a pregnancy due date has passed. A date is not proof of birth; only files without an explicit flag use legacy date inference. Legacy boolean premature/default-child flags are normalised to the current string representation. Three actual-converter regressions verify these cases; native schema handling of current pregnancy/flag strings is covered by the captured runs, but these specific overdue/boolean edge cases have unit-only evidence and require real historical-device acceptance.


Restored Reminder records and their owner are verified separately from actual OS delivery. Test simultaneous reminders for different children, identifier/coalescing behaviour, very large pending queues, exact-alarm denial and OEM limits on installed legacy upgrades. The repository tests do not certify every restored record as a separately delivered notification.


## Completed extended native checkpoint (15 scenarios)

[Run 43490604453](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43490604453) passes all 25 jobs, including 15 scenarios for each Bebbo/Rerai Android/iOS configuration. The added legacy vaccination-only case restores blank height/weight as empty strings while retaining vaccines and ownership. Latest status/provenance files are the `final-native-data-*.json` files in evidence. Android interruption runs roll back to the original three profiles; latest iOS runs observe fully committed 5,000-profile datasets after restart. A writing marker does not establish that the process stopped before commit, so those iOS outcomes are not labelled mid-transaction rollbacks. Actual failed-insert rollback is tested independently on every platform.

Native data source is f077fa4d. The subsequent overdue/boolean flag preservation at efe62468 has actual-converter unit verification and all-flavour production bundle verification; its specific historical pregnancy edge cases remain device acceptance. No native/schema interface changed between those checkpoints.

## Follow-up native checkpoint (18 scenarios)

[Run 43515051858](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43515051858) passed all four Bebbo/Rerai Android/iOS jobs on application source `0a5ddab2`. The latest summaries are `follow-up-native-data-*.json` in evidence. It adds overdue-pregnancy conversion, historical boolean profile flags and actual startup cleanup after a killed/restarted process. Strictly named temporary files and a Realm management directory are removed while unrelated cache files and live profiles remain intact.

Each configuration passes 18 distinct scenarios. Both Android interruption outcomes are `rolled_back` with three original profiles; both iOS outcomes are `fully_committed` with 5,000 profiles. This is 72 scenario executions, not 72 different cases or all-flavour device acceptance. The later Gson/Guava runtime constraints were resolved/built separately; these native data runs predate those Java artefacts. See [the current follow-up report](remaining-task-follow-up.md) for precise dependency/build provenance and remaining user-held-key, attachment and preference-snapshot gaps.
