# Backup, restore and import validation

## Format and behaviour

All local-file, Drive and onboarding restore paths validate/detach first, convert children before opening the live transaction, then replace ChildEntity and its embedded Measures/Reminder records in **one synchronous user-Realm write**. This is replacement, not merge. Repeated imports do not append profiles. Selected child is retained if its UUID exists in restored data, otherwise an imported child is selected. Notification regeneration is requested after commit. Onboarding/Settings metadata and Redux live outside that transaction: a later UI/settings failure cannot be described as an all-storage atomic rollback.

Every caregiver-facing replacement path now requires explicit confirmation. The new `backupRestoreReplaceWarning` has a clear English default; country teams must supply/approve the translated key before claiming fully localised release acceptance. It must explain replacement of all child/pregnancy profiles and records, backing up first, and absence of merging. Existing Google Drive/language guidance alone did not explain data replacement.

New JSON exports use the v2 authenticated envelope documented in `backupCipher.ts`. Same-flavour Android/iOS readers accept raw or JSON-quoted envelopes. Existing legacy fixed-IV JSON and private copied binary Realm backups remain readable. Legacy JSON has no authentication tag; validation cannot make an unauthenticated historical file cryptographically authentic. New v2 files require updated apps on the receiving device. Cross-flavour/country transfer is **not** guaranteed: historical keys, taxonomy IDs and content identifiers may differ.

## What is actually backed up

| Data | Behaviour |
| --- | --- |
| Child/pregnancy profiles | ChildEntity fields, including stored identifiers, dates, names, gender and profile flags; dates validated/converted. Pregnancy handling still uses existing app converter rules and needs historical device fixtures. |
| Growth/health/vaccination | Embedded Measures, including height/weight, vaccine IDs, dates, location and comments, subject to existing legacy converter/schema validation. Tool action analytics are separate. |
| Milestones | checkedMilestones IDs; same-country taxonomy/content identifiers must remain compatible. |
| Reminders | Embedded records with existing compatibility conversion; system notification requests are regenerated, not backed up as OS objects. |
| Saved content | Advice/game IDs attached to the correct child. Actual CMS media/content files are not embedded. Content refresh no longer purges saved IDs merely because a response/cache is partial. |
| Root measurement place | Retained by the converter (was omitted). |
| Child photos | A local path/reference only; missing photos are cleared by existing conversion. Photo bytes are **not** portable across devices. |
| Preferences/caregiver settings | DataRealm/Redux preferences and caregiver settings are **not** a complete exported snapshot. Existing settings on the receiving device are retained/recomputed; onboarding collects caregiver details separately. Country/language content reset now preserves settings. |

A full device backup with photographs and preferences needs a versioned data/attachment manifest, migration rules for country/taxonomy differences, a recovery journal across stores and a user-held key/passphrase design. Adding uncoordinated preference writes after deleting profiles would not satisfy atomic recovery and could select the wrong country's configuration. These gaps remain, rather than silently claiming all app data is backed up.

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
| Restart/interrupted import | Preparation leaves current Realm untouched; single write uses Realm transaction semantics. All four native runs observed the writing marker during a 5,000-profile replacement, killed the process, and recovered the original three profiles without partial data. Post-commit settings failure and physical-device kill/storage conditions remain acceptance. |

## Device acceptance procedure

Use test data only and retain an independent known-good export before replacement. For each supported flavour/platform, exercise a fresh install and an upgrade from its latest production app with at least two born children and one pregnancy, multiple measurement/vaccine/milestone/reminder records, saved content, preferences and a photo. Compare every stored field/owner before export and after restore; separately expect the documented photo/preferences gaps.

Test same-device local file, Drive, Android→iOS and iOS→Android within the same flavour, older exported JSON/binary fixtures, two repeated imports, large growth histories, and active-child fallback. Run offline, airplane-mode restarts, cancel each picker/auth/confirmation step, force close during file copying/decryption/native transaction and after commit, revoke Drive permission, fill device storage and retry after freeing it. Test no-child, truncated, incompatible and wrong-key files. Inspect current records after every failure, not merely the success message. Review temporary private cache remnants after process death; normal `finally` cleanup cannot run after a hard kill. Authenticate production files with the real flavour keys without copying secrets into logs/reports.

Before release, review the app-wide extractable encryption key and lack of user-held recovery secret, legacy unauthenticated file support, cache cleanup after process death, incomplete preferences/photo portability and translation approval. The new envelope improves integrity/randomisation; it does not make client-shared-key backups equivalent to end-to-end user-held-key encryption.


## Additional upgrade-preservation safeguards

The user Realm retains schema 4. The separate Redux Realm retains schema 1 but now registers its existing schema-0 migration through `onMigration` and writes migrated fragments to the new Realm, not the old one. Large non-Latin strings are fragmented within native UTF-8 limits without breaking surrogate pairs. Country/language setup no longer deletes non-imported child profiles based on a missing onboarding flag; imported status does not identify disposable records. Five migration/fragment regressions and a localisation source guard pass. These tests do not substitute for installing an actual historical production database.


## Captured native evidence

Bebbo and Rerai each pass 14 checks on Android API-35 x86_64 emulators and Release iPhone simulators: native random IV/AES/HMAC/tamper rejection; legacy ciphertext and record conversion; three-profile child/pregnancy/nested ownership; repeat replacement; actual failed-insert transaction rollback; synthetic user-Realm schema 3→4 and Redux-Realm schema 0→1 migrations; approximately 18 MB of Unicode cache text; settings preservation; app restarts; real startup taxonomy-cache recovery; and interrupted 5,000-profile replacement. Every interruption run observed `writing` and recovered the old complete three-profile dataset. This does not establish physical-device power-loss behaviour or a complete cross-store restore journal.

The status-only result/provenance files are in [evidence](evidence/). Android [run 43483023359](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43483023359) reuses native binaries from `0da745b` and verifies that only release Hermes bytecode changed. iOS data jobs in [run 43482015050](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43482015050) compile the same data-test source for simulators. The first Android harness attempt failed before app launch because of shell-variable scope; the corrected run passes both flavours. Test controllers remain only on the isolated QA branch and are rejected by production bundle guards. Data-path source is `1943dc16`; subsequent bookmark/profile-delete changes do not alter backup, crypto, persistence or migration code.
