# Remaining-task follow-up — 13 November 2026

Work continues on `RNSDKUpgrade-review-fixes`. Application source is `0a5ddab2f20dbb963bc0d64cf06ca8ed5cc164e8`. This report supersedes earlier checkpoint totals; it does **not** grant production release approval or claim that every requested task is complete.

## Implemented changes

| Change | Evidence and purpose | Scope |
| --- | --- | --- |
| Add omitted development builds | Babuni and Foleja have separate Android/iOS development targets. They now have four native CI jobs and checked identifier, scheme, plist-group and environment mappings. | All eight primary flavours plus both development configurations |
| Repair Foleja development archive | Xcode reported two `README.md` resources writing the same bundle destination. A Swift/XcodeProj-generated repair removes one resource membership and its build-file object. Only two project lines change; unrelated serializer changes were excluded after a complete object comparison. A regression check checks copied resource names across all resource phases. | `ParentBuddyAppXkDev` |
| Correct development test fixtures | Babuni development intentionally uses Android `com.datamatics.bangla` and iOS `com.datamatics.babuni`. The initial expanded fixture incorrectly assumed identical IDs. Fixtures now export separate platform IDs; native app identifiers are unchanged. | Babuni development; primary mappings retain their existing behaviour |
| Pin Realm's binding compiler | Realm's Android module otherwise selected AGP's default NDK 28.2 despite the app's NDK 27.1 pin; an implicit SDK download failed in CI. The narrow compatibility patch makes the binding use the existing root pin. Realm remains 20.2.0 with unchanged schemas. Its existing CMake 16 KB linker setting remains. | Every Android variant |
| Guard external link handling | Notification survey/hyperlink payloads and drawer links bypassed scheme validation and rejection handling. Shared handling permits web URLs; email and the two existing Apple review schemes require explicit options. Native bridge failures return failure without an unhandled tap rejection. | Shared Android/iOS navigation and drawer |
| Measure notification survey handoffs | Successful notification survey links emit the same `survey_link_opened` event as home-screen links. Failure emits no success event; generic hyperlinks do not become survey counts. This does not measure submission or prove server delivery. | All flavours |
| Preserve active-profile order | Replace an invalid one-argument sort comparator with stable active-first ordering. Other profiles retain their order, Redux arrays remain intact and a deleted/missing selection preserves all profiles. | Shared profile menu |
| Remove reserved type alias | Rename the app-owned `@types/types` alias consistently in TypeScript, Babel, imports and its test mock. Nine declaration-package diagnostics disappear; the profile-order fix removes another diagnostic. | Shared source and all flavour bundles |
| Clean abandoned backup copies | A process kill bypasses `finally`. Before the import/export UI mounts, startup now removes only generated temporary backup names and Realm sidecars in the private cache. Live databases, original provider/Drive files, photos and unrelated cache entries are excluded. Failures produce a generic diagnostic and do not block access to committed data. | Shared startup; native restart checks are recorded below |
| Scrub Realm diagnostics | Raw exceptions and temporary paths could appear in error logs retained in production. Use the existing message scrubber, preserve failure signals and stop logging a successful fallback when unlink fails. An already absent file is neutral. Public helper return behaviour is unchanged. | Shared persistence |
| Add a secret-introduction gate | Checksum-pinned Gitleaks scans newly introduced commits with full value redaction. A real-scanner regression accepts benign commits and rejects a fabricated token without printing it. No broad historical file/path exclusions were introduced. | Pull-request/push validation |

No further package major upgrade was selected merely because a newer version exists. Realm/database migration, dotenv flavour resolution and the aligned Firebase 26 integration retain the previously documented constraints.

## Verified checks and exact provenance

- Clean `npm ci --legacy-peer-deps`: all **six** compatibility patches apply, including Realm.
- **389 Jest tests / 44 suites**, **34 Node tooling tests**, **30 Python configuration/packaging tests**, and **96 native resources** pass locally.
- TypeScript regression gate passes with **86 inherited diagnostics**, down from 96 at the start of this follow-up. Raw `tsc` is **not clean**.
- [Final source checks, run 43513887765](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43513887765): **17/17 jobs pass**, checking `0a5ddab2` with all sixteen production bundles, unit/tooling/configuration/assets checks, npm audit and the secret gate.
- [Secret-gate check, run 43512691762](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43512691762): pass on source `30f8a0a0`, including the real-scanner failure/redaction regression.
- [Native build follow-up, run 43511087818](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43511087818) checks native source `efd66b60`. The later application change is the JS Realm diagnostic/fallback fix; native inputs are unchanged. The repaired Foleja development archive, corrected Babuni development archive and Wawamor retry have passed. Android builds are still running at this report checkpoint.
- [Extended native data run 43515051858](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43515051858) checks application source `0a5ddab2` on Bebbo/Rerai Android and iOS. Rerai Android has passed all 18 scenarios, with an interrupted transaction rolling back to the original three profiles; Bebbo Android and both iOS runs are still running at this checkpoint. The Android overlay verifies the native-input diff, matching Hermes header and that every AAB entry except generated JS bytecode remains identical.

The initial expanded build run [43505650999](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43505650999) is not an all-pass result. Its failures were the Foleja resource collision, the incorrect Babuni development Firebase fixture, a Realm NDK download failure, and a Wawamor Hermes download connection reset. Seven primary iOS archives and both development Android releases passed in that run. Corrections/retries are identified separately above.

### Native development mapping

| JS flavour | Android variant / application ID | iOS target / bundle ID | Firebase fixture group |
| --- | --- | --- | --- |
| Foleja | `xkstaging` / `com.datamatics.foleja` | `ParentBuddyAppXkDev` / `com.datamatics.foleja` | `XkDevelopment` |
| Babuni | `banglastaging` / `com.datamatics.bangla` | `ParentBuddyAppBanglaDev` / `com.datamatics.babuni` | `BanglaDevelopment` |

The [generated flavour matrix](flavour-matrix.json) checks all eight primary mappings and both additional mappings. Unsigned builds use fake `bebbo-compile-check` Firebase files and `example.invalid` endpoints. They cannot establish production project routing, signing, external-service behaviour or country content availability. Android minimum API 24 and iOS 15.1 remain; production Android still declares four ABIs. Rerai's two-ABI override is limited to its emulator CI build.

## Dependency and security evidence

The current registry audit reports **11 low, zero moderate/high/critical** findings. These eleven package entries trace to `deepmerge` GHSA-gcqx-w48m-w2h4. The latest published package remains 4.3.1 and GitHub lists no patched version. Upstream records the CNA's rejection/dispute in [deepmerge #273](https://github.com/TehShrike/deepmerge/issues/273#issuecomment-6584747954); [advisory-database #10910](https://github.com/github/advisory-database/issues/10910) requests correction. The registry result has not been hidden or relabelled as zero. Suggested CLI/Jest/SVG-transformer downgrades are not an appropriate framework security fix. This is not a complete Maven/CocoaPods, binary, backend or infrastructure vulnerability assessment.

The [redacted secret-scan summary](evidence/follow-up-secret-scan.json) records:

- 6,788 reachable commits / about 620 MB scanned; 239 rule matches are **not** 239 unique credentials.
- A tracked snapshot hash-verified against all 6,585 files in `efd66b60`: thirteen matches are three CocoaPods checksums and ten public-content image URLs containing a `key` query parameter.
- Historical matches include mobile backup key/IV material, public client/OAuth/Firebase configuration, generated bundle identifiers and checksums. Matched values are not reproduced here. All Facebook-secret rule matches identified the mobile client-token label; these were not established as Facebook app-secret exposures.
- Among reachable `.jks`, `.keystore`, `.p12`, `.p8` and `.pem` filenames, only the standard debug keystore was found. That filename scan is not a cryptographic audit or proof that all historical credentials are safe.

A public mobile client ID or Firebase API key is not equivalent to a server administrator credential; backend rules/API restrictions still require authorised service-side inspection. Public Google-hosted article images remain third-party availability/content dependencies; moving them requires a controlled CMS/content update rather than removing country content from this PR.

## High-priority work not completed

1. **Backup protection and portability.** The app-wide backup key remains extractable from releases/history. IV/HMAC and temporary-file cleanup do not provide user-held-key confidentiality. A versioned passphrase/key-recovery design, portable photo attachments, a defined settings/preferences snapshot, and cross-store recovery for a complete snapshot remain unimplemented. Current imports are explicit child-record replacement; there is no merge mode. Preserve legacy readers; blindly rotating the shared key or rewriting history would not solve this and could strand existing backups. Existing child-record replacement remains atomic, but it is not a complete device snapshot.
2. **Live Firebase verification and crash triage.** No authorised CLI account is present. The browser login returned `invalid_request / Unable to verify client`. Historical Crashlytics reports, DebugView offline/restart/reconnect delivery, production flavour routing, signed symbol/source-map delivery and representative BigQuery reconciliation remain inaccessible. The source event inventory, privacy filters and SDK invocation tests are not delivery evidence or an exact profile census.
3. **Arabic/Urdu device and content acceptance.** The Arabic `GRarb` registration remains commented out and no Urdu pack is registered. Approved country translations/fonts/CMS configuration are needed; no language was enabled by guesswork. Shared RTL/digit/name/chart tests and earlier English font-scale checks do not approve all Arabic/Urdu screens. Directional icons, forms, charts, mixed-direction content, keyboard behaviour, accessibility and large-font clipping still need the documented visual matrix.
4. **Real installed-app and external-service acceptance.** Synthetic Realm/schema/legacy-file tests do not replace representative historical exports and signed in-place upgrades on supported devices. Drive OAuth/account changes, quota, interrupted uploads/downloads, low storage, physical low-memory/32-bit/16 KB devices, actual notification scheduling/delivery and older OS versions still require access and device execution.
5. **Remaining security/performance scope.** The existing iOS arbitrary-load exceptions require a country endpoint/media TLS inventory before they can be removed safely. A complete native-transitive vulnerability scan, jurisdiction-specific consent/retention decisions, production automatic-fatal-report privacy inspection and device performance profiling remain outstanding. The separate RAG/chatbot pilot/backend is not present in this branch's scripted FAQ implementation and has not been certified here.

These are distinct from optional maintenance: reducing the remaining TypeScript baseline, a separately tested ESLint/toolchain major migration, and additional device/theme/font coverage. No startup/navigation speed gain is claimed without a device measurement.

## Completing acceptance

Use the detailed [backup scenarios](backup-validation.md), [Analytics reconciliation](analytics-coverage.md), [RTL/device checklist](rtl-and-device-validation.md) and [Crashlytics notes](crash-history.md). For every signed flavour/platform record the real app ID, intended Firebase project, language, OS/ABI, consent state, old/new app version and observed result. Use synthetic or appropriately authorised/anonymised data, and enter credentials through the relevant secure service/pipeline rather than committing or pasting them into reports.

Native data checks add overdue pregnancy/legacy boolean cases and actual startup cleanup after a process restart to the previous crypto, ownership, repeated replacement, failed-insert rollback, schema migration, large Unicode cache, content-reset preservation and 5,000-profile interruption cases. A complete original or committed dataset is valid after interruption; a committed result is not proof of mid-transaction rollback. Device/service results must be appended as observed outcomes, not inferred from compilation or mocks.
