# Non-Firebase completion follow-up — 14 November 2026

Work is on `RNSDKUpgrade-review-fixes`. Protected backups are implemented in `e093124cf6b2488b39a9ea35a203dfc66458993a`; subsequent compatibility/security fixes are in `0145c3b541e7a7b7853b6f527a38b34f5d0cb021`, followed by exact decoded-photo bounds in `80b50ffc8a561afb9ad96c34d52646e11ba556f0`. This follow-up excludes live Firebase access. It supersedes the earlier statements that portable photo/preference backups and journalled recovery were unimplemented. It does not constitute production release approval.

## Implemented and justified

| Change | Evidence / effect |
| --- | --- |
| User-held-key backup protection | Every new caregiver-facing local/Drive export uses a passphrase-protected v3 envelope. PBKDF2-HMAC-SHA256 uses 600,000 iterations, random salt/IV, AES-256-CBC and encrypt-then-HMAC. Wrong passphrases/tampering are rejected before decryption. Existing legacy readers remain. Old files retain their historical protection; there is no password reset. See [format, bounds and recovery](backup-v3-follow-up.md). |
| Portable photos and preferences | Include child/pregnancy records, nested measurements/vaccines/reminders, milestones/bookmark IDs, per-child photo bytes, caregiver fields, active child and reminder/data-saver preferences. A same-flavour/country check protects country taxonomies/configuration. No downloaded content cache, credentials, OS permission or telemetry queue is exported. |
| Interrupted restore recovery | Persist a before/after journal before changing profiles. Replace children in one Realm transaction, flush preference persistence and finalise settings/journal together. Startup completes a pending restore before normal navigation; retry or explicit rollback can recover a failure. Photo staging never overwrites originals. Realm/schema versions stay unchanged. |
| Import privacy and failure handling | Navigation carries an expiring opaque preview handle; backgrounding clears preview/passphrase state. Private file copies are bounded and cleaned. Image headers, dimensions and sizes are validated. The final byte-bound regression also rejects an 8 MiB + 1 byte photo even when its base64 character count equals an allowed 8 MiB photo. Updated replacement confirmation includes photos/preferences. Known safe failure messages reach the user; retained diagnostics omit provider payloads. |
| Local date-picker boundaries | `new Date(dateTime.toISODate())` interpreted local calendar dates as UTC, shifting limits in other time zones. Use local-midnight Date values directly; regression cases cover New York, Athens, Nairobi, Karachi and leap-day month arithmetic. Other Luxon/native Date boundaries use `toJSDate()` and numeric date sorts use `getTime()`. |
| RTL selection labels | Use logical `margin-start` for country/language radio text and a transient styled-components prop for selected weight. Retain native `text-align: start`; do not double-mirror text or invent language packs. Arabic/Urdu string fixtures test the shared style contract, not device appearance. New backup/recovery inputs enable font scaling; broader existing app font-scaling behaviour was retained rather than claiming full accessibility conformance. |
| React/native library compatibility | Correct refs, drawer/nested navigation types, nullable AppState/theme handling, standard-deviation payload shape and Realm update-mode typing. Remove ignored FastImage preload callbacks and ineffective object-identity comparisons. Guard missing category taxonomy while data loads. The legacy shared walkthrough has a stable slider ref and existing flavour image aliases; no historical production pagination crash is asserted. |
| Strict TypeScript gate | Clear the inherited diagnostics without adding suppressions or weakening strictness. `npm run typecheck` now invokes `tsc --noEmit`, so reintroducing a formerly baselined error fails CI. A declaration-only FastImage patch uses RN 0.87's exported ImageStyle instead of obsolete FlexStyle/ShadowStyleIOS exports; native runtime code is unchanged. |
| Scripted FAQ callback security | Remove `eval` of serialised callback source from local Redux data. Its selector never returned a restored session, so the existing fresh-session behaviour is preserved. Cancel the initial step timer on unmount and remove associated payload logging. An AST security guard rejects eval/Function construction. This removes a dangerous execution path; remote exploitability was not established. |

No dependency was upgraded merely to increase its version. Realm 20.2.0 and schema versions are preserved. Dotenv 3.4.12 remains to avoid the observed flavour-resolution migration risk. The prior [native dependency/security fixes and scoped deferrals](native-dependency-security.md) remain applicable. The new FastImage change corrects declarations for the already selected version; it introduces no native binary or dependency lock change.

## Verified checks

[Final source CI run 43548274786](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43548274786), controller `6f9d3ec970d38203226d3d680bf6f508fe9da0fe`, explicitly checks out application source `80b50ffc`. All 17 jobs passed: the unit/check job and sixteen release JavaScript bundles covering Android/iOS for Bebbo, Bebbo Dev, Babuni, Foleja, Merhaba Bebek, Wawamor, Rerai Umntwana and Bebbo Pacific.

- 434 Jest tests in 52 suites; 35 Node tooling tests; 30 Python packaging/native-configuration tests.
- Full strict TypeScript compiler check: zero diagnostics. All 96 generated native vector resources verified.
- Static flavour audit: eight primary and both extra Babuni/Foleja development mappings, identifiers, schemes, manifests and plist paths. Existing Android API 24/iOS 15.1 minimums and production ABI declarations are unchanged.
- Generated source inventory is current: 43 route declarations, 78 event calls and 46 screen files. Refreshing line numbers is not a live Analytics/delivery test.
- Fresh npm audit: 11 low, zero moderate/high/critical. The remaining low entries trace to the disputed deepmerge advisory with no published compatible patch; this is not a zero-vulnerability assertion for native/build/backend systems. Earlier Maven/Ruby findings and deferrals are documented separately.
- The first v3 source CI run `43544701451` passed 425 tests and all sixteen bundles but failed its stale generated inventory check. The inventory was regenerated; intermediate run `43547250197` passed all 17 jobs on `0145c3b5`, and the final run above also passed after the exact byte-bound fix. The failed checkpoint is not hidden.

### Fresh native protected-backup checks

[Native run 43544601957](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43544601957) uses controller `32c2aa7a0a265374b3b4e6ea607a9e86440cf8a4` and application source `e093124c`. A source-difference guard permits only its four QA files. Both platforms compile fresh Release apps; Android x86_64 and iOS active-architecture settings are confined to this test controller. QA files are not merged into the application branch. Results and exact provenance are committed under `evidence/backup-v3-native-*`.

| Platform/flavour | Native scenarios | Interrupted transaction outcome | Evidence |
| --- | --- | --- | --- |
| Android Bebbo | 24 / 24 | `rolled_back` | [result](evidence/backup-v3-native-android-bebbo-result.json) |
| Android Rerai Umntwana | 24 / 24 | `rolled_back` | [result](evidence/backup-v3-native-android-rerai-result.json) |
| iOS Bebbo | 24 / 24 | `fully_committed` | [result](evidence/backup-v3-native-ios-bebbo-result.json) |
| iOS Rerai Umntwana | 24 / 24 | `fully_committed` | [result](evidence/backup-v3-native-ios-rerai-result.json) |

All 96 scenario executions passed. The Android interruption cases retained the original dataset; iOS completed the full transaction. Both are valid atomic outcomes. This does not claim a mid-write rollback occurred in the iOS runs.

Each successful native run covers 24 scenarios: native crypto/tamper/legacy readers, a fixed Unicode PBKDF2 known-answer vector, protected raw/quoted envelopes, wrong passphrase, nested ownership/repeated replacement/failed-insert rollback, legacy vaccination and pregnancy flags, UserRealm 3→4 and ReduxRealm 0→1 fixtures, a large Unicode cache, settings-preserving content reset, real photo bytes/preferences, explicit rollback, pending-journal restart recovery, actual startup cleanup/profile persistence/taxonomy recovery and a killed 5,000-profile transaction. These are synthetic native integration tests, not real historical-file, cloud-provider or physical-device acceptance.

The earlier ten Android configuration compilations, ten source-specific iOS archives and Wawamor ABI checks remain in the [previous provenance report](remaining-task-follow-up.md). They predate these pure application changes; do not relabel every historical native archive as a new binary of `80b50ffc`. The final source has all sixteen bundle checks; the four fresh native backup builds have the explicitly stated source above. The subsequent exact photo byte-bound change has a targeted boundary regression; the native fixtures use small image attachments and do not certify that boundary or physical memory limits.

## TLS inventory and remaining external acceptance

A bounded scan of bundled country content found HTTP references to seven hosts. Rerai accounts for 586 references / 333 unique URLs in two bundled content files. Eight sampled owned media URLs returned HTTPS 206 responses with image content types. [Inventory and sampled results](evidence/non-firebase-tls-inventory.json) record the scope. This does not prove all current CMS/API/media hosts are HTTPS-ready: real environment files and live country-delivered content are not the test fixtures. Broad iOS ATS exceptions therefore remain open; removing them globally without the production inventory could disrupt country content. Coordinate CMS HTTPS URL generation and cache-compatible migration before narrowing exceptions.

| Remaining check | Exact requirement |
| --- | --- |
| Real backup/provider acceptance | Run [backup scenarios](backup-validation.md) using representative authorised exports from supported historical versions and real Drive accounts. Cover account changes/revocation, upload/download cancellation, quota, low storage, file-provider copies, fresh and existing installs, same-country language changes, repeated imports and actual Android↔iOS file exchange. Test password cancellation and iOS modal/provider handoff. Synthetic fixtures do not establish these outcomes. |
| Signed upgrade/device support | Install signed upgrades over supported released builds, without clearing data, across every flavour. Exercise older OS/32-bit/low-memory/16 KB-page-size physical devices, denied permissions, notification scheduling and process death during each journal phase. Source/configuration checks and emulator architectures are explicitly narrower. |
| Arabic/Urdu release acceptance | Supply approved country resource packs/fonts/CMS configuration and translated new backup/recovery messages. `GRarb` remains commented out; no Urdu pack is registered. Follow the full [visual/accessibility matrix](rtl-and-device-validation.md), including mixed text, directional icons, charts, forms, keyboard and large fonts. No guessed translation was enabled. |
| Production security | Complete endpoint/media TLS inventory, backend rules/API restrictions, signing/credential controls, Apple/vendored-binary advisory coverage and legal consent/retention decisions. The separate hosted RAG pilot/backend is outside this branch's scripted FAQ code. |
| Performance | Profile startup, scrolling, memory, images, large libraries and PBKDF2/export/restore on representative low-spec devices. No device speed improvement is claimed from compiler success or test duration. |

Firebase console access, DebugView/offline delivery reconciliation, historical Crashlytics and signed symbol receipt are excluded at the user's request. No Firebase configuration/service claim is inferred from the fixture builds.
