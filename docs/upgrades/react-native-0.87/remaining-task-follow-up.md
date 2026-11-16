# Remaining-task follow-up — 13–14 November 2026

**14 November follow-up:** [Implemented non-Firebase fixes and current validation](non-firebase-follow-up.md), including passphrase-protected portable backups, journalled recovery and a clean strict TypeScript check. Older source-specific results below remain historical evidence.

Work continues on `RNSDKUpgrade-review-fixes`. Application logic tested in the extended data run is `0a5ddab2f20dbb963bc0d64cf06ca8ed5cc164e8`; the subsequent native/Ruby dependency fixes are `7760562e59a2f23d65344955f06948bedbfbb1ac`. Final application source `1e449290e00fd7cad3c7f37bec34ed4605c336fd` adds only the private-error logging fix to the application code after those dependency changes. This report supersedes earlier checkpoint totals; it does **not** grant production release approval or claim that every requested task is complete.

## Requested work and remaining acceptance

| Request | Verified repository/build evidence | Still open |
| --- | --- | --- |
| Dependencies | npm audit; 926 resolved Maven package/version pairs; 45 Ruby gems; three justified library/tooling updates and scoped deferrals | Build-only advisories and complete vendored-binary/Apple SDK advisory coverage |
| Analytics | 43 routes / 46 screen files / 78 event calls inventoried; event/privacy/retry tests and successful survey-handoff measurement | Live DebugView/offline-reconnect reconciliation and production routing; Analytics is not an authoritative profile census |
| Security | Scheme guards, scrubbed retained failure logs, secret-introduction gate and scoped vulnerability fixes | Legacy-backup shared-key exposure, production backend/API restrictions, remaining country TLS exceptions and release fatal-report inspection |
| Arabic/Urdu | Shared RTL/name/digit/header/HTML/chart fixes and regression fixtures | Actual approved language packs and device visual/accessibility acceptance; no Urdu pack was invented |
| Crashes | Resilience fixes, native builds, transaction/restart tests and privacy-safe manual diagnostics | Historical Crashlytics triage and signed-release symbol/delivery verification |
| Performance | Earlier measured reminder lookup reduction; content/cache correctness checks | Startup, memory, navigation and scrolling profiling on representative physical devices |
| Every flavour | Eight primary plus two development mappings; ten Android Java compilations, ten source-specific iOS archives and four Wawamor ABI release builds | Real endpoint/Firebase configuration, signed releases and device acceptance across all configurations |
| Backup/import | V3 passphrase protection, portable photo/preference snapshots and durable recovery are now implemented; see the superseding follow-up for fresh native results | Historical real exports, live Drive, signed upgrades and physical interruption/storage acceptance |

The previously unimplemented repository design in the last row is now implemented in the superseding follow-up. Device/service acceptance cannot be replaced by more mocked tests or unsigned compile fixtures.

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
| Scrub Realm diagnostics | Raw exceptions and temporary paths could appear in error logs retained in production. Use the existing message scrubber in Realm helpers, backup conversion and DataRealm cache writes, preserve failure signals and stop logging a successful fallback when unlink fails. An already absent file is neutral. Public helper return behaviour is unchanged. | Shared persistence |
| Patch vulnerable runtime/build libraries | Shared Android constraints select Gson 2.13.2 and Guava 33.7.2-android; concurrent-ruby becomes 1.3.8 in Gemfile/lock. The conservative gem update leaves 928 generated iOS native inputs byte-for-byte identical. Scoped advisories, deferrals and build provenance are in the [native dependency assessment](native-dependency-security.md). | All ten Android configurations; shared CocoaPods tooling |
| Add a secret-introduction gate | Checksum-pinned Gitleaks scans newly introduced commits with full value redaction. A real-scanner regression accepts benign commits and rejects a fabricated token without printing it. No broad historical file/path exclusions were introduced. | Pull-request/push validation |

No further package major upgrade was selected merely because a newer version exists. Realm/database migration, dotenv flavour resolution and the aligned Firebase 26 integration retain the previously documented constraints.

## Verified checks and exact provenance

- Clean `npm ci --legacy-peer-deps`: all **six** compatibility patches apply, including Realm.
- **390 Jest tests / 44 suites**, **34 Node tooling tests**, **30 Python configuration/packaging tests**, and **96 native resources** pass locally.
- TypeScript regression gate passes with **86 inherited diagnostics**, down from 96 at the start of this follow-up. Raw `tsc` is **not clean**.
- [Earlier source checks, run 43513887765](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43513887765): **17/17 jobs pass**, checking `0a5ddab2` with all sixteen production bundles, unit/tooling/configuration/assets checks, npm audit and the secret gate. The final logging change is verified in [run 43528902894](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43528902894), pinned to `1e449290`: **17/17 jobs pass**, including 390 Jest tests and all sixteen production bundles. Native compiler/linker inputs and selected packages remain the same as `7760562e`; the packaged JS is separately rebuilt here.
- [Secret-gate check, run 43512691762](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43512691762): pass on source `30f8a0a0`, including the real-scanner failure/redaction regression.
- [Native build follow-up, run 43511087818](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43511087818) checks native source `efd66b60`. The later application change is the JS Realm diagnostic/fallback fix; native inputs are unchanged. The repaired Foleja development archive, corrected Babuni development archive and Wawamor iOS retry passed. Nine of ten Android variants passed. The Wawamor Android runner received a shutdown signal rather than a compiler diagnostic; its isolated [retry, run 43519507495](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43519507495), checks application source `0a5ddab2`. The original run must not be described as all-pass. These builds predate the later Gson/Guava constraints; their separate validation is below.
- [Extended native data run 43515051858](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43515051858) checks application source `0a5ddab2` on Bebbo/Rerai Android and iOS. **All four jobs passed all 18 scenarios each** (72 executions of 18 distinct cases). Both Android runs rolled back the interrupted transaction to their original three profiles. Both iOS runs had fully committed all 5,000 replacement profiles before termination. Neither outcome was partial; the iOS result is not proof of termination inside the transaction. Per-platform synthetic results are preserved in the evidence directory. This run predates the Gson/Guava constraints; it does not claim to run their new Java artefacts. The Android overlay verifies the native-input diff, matching Hermes header and that every AAB entry except generated JS bytecode remains identical.

The initial expanded build run [43505650999](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43505650999) is not an all-pass result. Its failures were the Foleja resource collision, the incorrect Babuni development Firebase fixture, a Realm NDK download failure, and a Wawamor Hermes download connection reset. Seven primary iOS archives and both development Android releases passed in that run. Corrections/retries are identified separately above.

### Native build matrix and later dependency checks

| Configuration | Android native build before the Java constraints | iOS archive |
| --- | --- | --- |
| Bebbo | Pass, `efd66b60` | Pass, `3ca070fd` |
| Bebbo development | Pass, `efd66b60` | Pass, `3ca070fd` |
| Babuni | Pass, `efd66b60` | Pass, `3ca070fd` |
| Foleja | Pass, `efd66b60` | Pass, `3ca070fd` |
| Merhaba Bebek | Pass, `efd66b60` | Pass, `3ca070fd` |
| Wawamor | Earlier `3ca070fd` pass; follow-up combined builds have no successful result | Pass, `efd66b60` |
| Rerai Umntwana | Pass, `efd66b60`; two-ABI emulator override | Pass, `3ca070fd` |
| Bebbo Pacific | Pass, `efd66b60` | Pass, `3ca070fd` |
| Babuni development | Pass, `efd66b60` | Pass, `efd66b60` |
| Foleja development | Pass, `efd66b60` | Pass after resource repair, `efd66b60` |

Seven primary iOS archives come from run 43505650999; Wawamor and both development archives come from run 43511087818. The intervening Xcode repair affects only the Foleja development resource phase. Later JS diagnostics do not change native compiler/linker inputs; they do change the packaged JavaScript, which is checked in the separate all-flavour bundle run. The subsequent Ruby update separately preserves all 928 generated native inputs. This establishes unsigned compilation/configuration evidence, not real-service or signed-store acceptance.

After the Gson/Guava fix in `7760562e`, [resolved-runtime evidence](evidence/native-maven-runtime-after.json) verifies both selected versions in every one of the ten Android variants and no current OSV matches among their 266 distinct Maven runtime package/version pairs. Buildscript-only advisories and unscanned embedded binaries remain outside that result. [Run 43527932788](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43527932788) passes all **ten** country-specific Java compilation jobs. Its full representative Bebbo release also passed: **11/11 jobs overall**, including the combined four-ABI AAB/APK, R8/dex, manifest and native-library packaging checks. The [packaging result](evidence/bebbo-patched-runtime-packaging.json) reports no problems across 124 ELF libraries; all required 64-bit load alignments pass. This finished on 14 November 2026.

The preceding run 43525862764 passed resolution but its compile driver named an unavailable mergeExtDex task; run 43526704454 then correctly tripped the country guard when one environment was used for multiple bundles. The final driver keeps that guard and gives each variant its own country environment. It uses Java compilation plus a separate full release R8/dex pipeline.

The combined Wawamor retry 43519507495 failed after about 59 minutes; logs were unavailable at collection time, so its precise cause is not asserted. [Run 43527569988](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43527569988) checks all four Wawamor ABIs separately on `7760562e`, including packaging checks. Production architecture declarations are unchanged. **All four jobs passed**: armeabi-v7a, arm64-v8a, x86 and x86_64, each building an unsigned release AAB/APK and passing manifest/native packaging validation. The four `wawamor-*-packaging.json` files preserve the observed results. All 64-bit libraries satisfy the required 16 KB load alignment; 32-bit entries are inspected without pretending their 4 KB alignment proves 16 KB support. These are separate single-ABI verification bundles, not a newly tested combined Wawamor bundle or signed/device acceptance.

### Native development mapping

| JS flavour | Android variant / application ID | iOS target / bundle ID | Firebase fixture group |
| --- | --- | --- | --- |
| Foleja | `xkstaging` / `com.datamatics.foleja` | `ParentBuddyAppXkDev` / `com.datamatics.foleja` | `XkDevelopment` |
| Babuni | `banglastaging` / `com.datamatics.bangla` | `ParentBuddyAppBanglaDev` / `com.datamatics.babuni` | `BanglaDevelopment` |

The [generated flavour matrix](flavour-matrix.json) checks all eight primary mappings and both additional mappings. Unsigned builds use fake `bebbo-compile-check` Firebase files and `example.invalid` endpoints. They cannot establish production project routing, signing, external-service behaviour or country content availability. Android minimum API 24 and iOS 15.1 remain; production Android still declares four ABIs. Rerai's two-ABI override is limited to its emulator CI build.

## Dependency and security evidence

The current registry audit reports **11 low, zero moderate/high/critical** findings. These eleven package entries trace to `deepmerge` GHSA-gcqx-w48m-w2h4. The latest published package remains 4.3.1 and GitHub lists no patched version. Upstream records the CNA's rejection/dispute in [deepmerge #273](https://github.com/TehShrike/deepmerge/issues/273#issuecomment-6584747954); [advisory-database #10910](https://github.com/github/advisory-database/issues/10910) requests correction. The registry result has not been hidden or relabelled as zero. Suggested CLI/Jest/SVG-transformer downgrades are not an appropriate framework security fix. The separate [native/build-tool assessment](native-dependency-security.md) resolves and scans Maven and Ruby packages; its findings include high/critical **build-only** advisories that are not represented by npm's low-only result. This is not a complete vendored-binary, backend or infrastructure vulnerability assessment.

The [redacted secret-scan summary](evidence/follow-up-secret-scan.json) records:

- 6,788 reachable commits / about 620 MB scanned; 239 rule matches are **not** 239 unique credentials.
- A tracked snapshot hash-verified against all 6,585 files in `efd66b60`: thirteen matches are three CocoaPods checksums and ten public-content image URLs containing a `key` query parameter.
- Historical matches include mobile backup key/IV material, public client/OAuth/Firebase configuration, generated bundle identifiers and checksums. Matched values are not reproduced here. All Facebook-secret rule matches identified the mobile client-token label; these were not established as Facebook app-secret exposures.
- Among reachable `.jks`, `.keystore`, `.p12`, `.p8` and `.pem` filenames, only the standard debug keystore was found. That filename scan is not a cryptographic audit or proof that all historical credentials are safe.

A public mobile client ID or Firebase API key is not equivalent to a server administrator credential; backend rules/API restrictions still require authorised service-side inspection. Public Google-hosted article images remain third-party availability/content dependencies; moving them requires a controlled CMS/content update rather than removing country content from this PR.

## High-priority work not completed

1. **Legacy backup and device acceptance.** New exports now use the v3 user-passphrase design with portable photo/preferences and cross-store recovery; see the [superseding implementation and validation](non-firebase-follow-up.md). Existing old files retain their original shared-key/unauthenticated protection. Preserve the legacy readers and known-good copies while validating new exports. Import remains explicit replacement, with no merge mode. Real historical exports, actual provider/device transfers and signed installed-app upgrades still require acceptance. An old file's valid v2 MAC is not trusted authorship.
2. **Live Firebase verification and crash triage.** No authorised CLI account is present. The browser login returned `invalid_request / Unable to verify client`. Historical Crashlytics reports, DebugView offline/restart/reconnect delivery, production flavour routing, signed symbol/source-map delivery and representative BigQuery reconciliation remain inaccessible. The source event inventory, privacy filters and SDK invocation tests are not delivery evidence or an exact profile census.
3. **Arabic/Urdu device and content acceptance.** The Arabic `GRarb` registration remains commented out and no Urdu pack is registered. Approved country translations/fonts/CMS configuration are needed; no language was enabled by guesswork. Shared RTL/digit/name/chart tests and earlier English font-scale checks do not approve all Arabic/Urdu screens. Directional icons, forms, charts, mixed-direction content, keyboard behaviour, accessibility and large-font clipping still need the documented visual matrix.
4. **Real installed-app and external-service acceptance.** Synthetic Realm/schema/legacy-file tests do not replace representative historical exports and signed in-place upgrades on supported devices. Drive OAuth/account changes, quota, interrupted uploads/downloads, low storage, physical low-memory/32-bit/16 KB devices, actual notification scheduling/delivery and older OS versions still require access and device execution.
5. **Remaining security/performance scope.** The existing iOS arbitrary-load exceptions require a country endpoint/media TLS inventory before they can be removed safely. The resolved Maven/Ruby scan is completed with scoped findings and deferrals in the native dependency assessment. Vendored-binary/Apple SDK advisory coverage, jurisdiction-specific consent/retention decisions, production automatic-fatal-report privacy inspection and device performance profiling remain outstanding. The separate RAG/chatbot pilot/backend is not present in this branch's scripted FAQ implementation and has not been certified here.

These are distinct from optional maintenance: a separately tested ESLint/toolchain major migration, and additional device/theme/font coverage. No startup/navigation speed gain is claimed without a device measurement. The [consolidated verification summary](evidence/follow-up-verification-summary.json) records exact job IDs, sources and cut-offs for the completed automated work. No CI build in this final verification set remains pending.

## Completing acceptance

Use the detailed [backup scenarios](backup-validation.md), [Analytics reconciliation](analytics-coverage.md), [RTL/device checklist](rtl-and-device-validation.md) and [Crashlytics notes](crash-history.md). For every signed flavour/platform record the real app ID, intended Firebase project, language, OS/ABI, consent state, old/new app version and observed result. Use synthetic or appropriately authorised/anonymised data, and enter credentials through the relevant secure service/pipeline rather than committing or pasting them into reports.

Native data checks add overdue pregnancy/legacy boolean cases and actual startup cleanup after a process restart to the previous crypto, ownership, repeated replacement, failed-insert rollback, schema migration, large Unicode cache, content-reset preservation and 5,000-profile interruption cases. A complete original or committed dataset is valid after interruption; a committed result is not proof of mid-transaction rollback. Device/service results must be appended as observed outcomes, not inferred from compilation or mocks.
