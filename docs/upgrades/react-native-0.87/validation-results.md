# Validation results — 13 November 2026

The implemented fixes and repository checks are reviewable on `RNSDKUpgrade-review-fixes`. Production release acceptance remains incomplete. The original PR branch remains `b1286358cbcc1187d07cdb277c13f4395edbe9f1`.

## Verified source and builds

Final application source: `efe62468b945cd372243a8ef1618a7cc2d13a54c`. Subsequent report/evidence commits do not change application behaviour.

| Flavour | Android unsigned release/package check | iOS unsigned archive/configuration check | Final production JS |
| --- | --- | --- | --- |
| Bebbo | Pass, four ABIs | Pass | Android + iOS pass |
| BebboDev | Pass, four ABIs | Pass after CDN retry | Android + iOS pass |
| Babuni | Pass, four ABIs | Pass | Android + iOS pass |
| Foleja | Pass, four ABIs | Pass | Android + iOS pass |
| Merhaba Bebek | Pass, four ABIs | Pass | Android + iOS pass |
| Wawamor | Pass, four ABIs | Pass | Android + iOS pass |
| Rerai Umntwana | Pass, arm64-v8a + x86_64 in this CI build | Pass | Android + iOS pass |
| Bebbo Pacific | Pass, four ABIs | Pass | Android + iOS pass |

Production Android defaults retain armeabi-v7a, arm64-v8a, x86 and x86_64; the Rerai CI override is not a release configuration change. Minimum Android API 24/iOS 15.1, country identifiers and branding remain. Two additional country-development configurations and the old tvOS target were inventoried; they were not compiled in this matrix. Actual production Firebase configurations/endpoints and signed distributions are not established by these fake fixtures.

| Evidence | Exact source / run | Result |
| --- | --- | --- |
| Unit/tool/config/security/assets + all 16 production bundles | `efe62468`, [43491847432](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43491847432) | 17/17 jobs pass |
| Eight Android + seven iOS release builds | `0da745ba`, [43477593213](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43477593213) | 15/16 native jobs pass; original BebboDev iOS failed downloading the CocoaPods CDN before compilation |
| BebboDev iOS retry | Production checkout `529784d8`, [43484429818](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43484429818) | Pass, including archived app ID/Firebase fixture/privacy flags/minimum OS/app dSYM |
| Native data + actual production startup/font checks | Data/startup source `f077fa4d`, QA controller `deedf00f`, [43490604453](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43490604453) | 24/25 jobs pass; Bebbo extended iOS simulator job is still in its boot/build step at this checkpoint |

The final source passes **348 Jest tests / 39 suites**, **23 Node tooling tests**, **29 Python packaging/configuration tests**, and verification of **96 native resources**. The TypeScript regression gate passes with **96 inherited diagnostics**; raw tsc is not clean. The final CI npm audit reports **11 low, zero moderate/high/critical**. This is not a complete native-transitive or infrastructure vulnerability scan.

[Native build matrix](evidence/native-build-matrix.json), [native input equivalence](evidence/native-input-equivalence.json) and [production checks](evidence/production-checks.json) retain machine-readable provenance. Native sources/specs, dependencies/locks, patches, assets/configuration and bundle tools are unchanged between the compiled native checkpoint and the final application source. Android runtime checks regenerate Hermes bytecode, compare its version, and verify every other AAB entry is byte-identical. This proves which inputs were reused; it does not claim all JS behaviour is identical.

## Native data and UI evidence

Bebbo and Rerai each exercise native AES/HMAC/legacy ciphertext, tamper rejection, profile/nested-record ownership, repeated replacement, failed-insert rollback, synthetic user-Realm schema 3→4 and Redux-Realm schema 0→1 migration, large Unicode persistence, settings preservation, restarts, startup taxonomy recovery, legacy vaccination-only records and process-interrupted 5,000-profile replacement. Latest per-platform results and exact interruption outcomes are recorded in the `final-native-data-*.json` files in [evidence](evidence/).

A kill after a writing marker can occur before or after commit. A complete original or committed dataset is valid; partial/mixed data is not. Do not describe a committed result as proof of a mid-transaction rollback. The overdue-pregnancy and legacy boolean-flag cases added after this native checkpoint have actual-converter unit verification; their real historical-device fixtures remain acceptance.

All four English production-startup checks (Bebbo/Rerai at 1.0/1.3 font scale) pass failed-download cancellation, visible application content and reachable Continue. One earlier test was blocked by the existing data-saver prompt; the corrected harness declines that recognised prompt and retains the original strict assertions. Screenshots/provenance are saved in evidence. Rerai's post-dialog viewport changed between accessibility and PNG captures; physical-device focus/scroll verification is still required. These images do not approve Arabic/Urdu or the other screens.

The first Android data-harness attempt failed before app launch because shell variables did not persist between runner commands. Its corrected run and the later extended run are recorded separately; that failure is not presented as a successful app test. No QA controller is included in production source/bundles.

## Release gates and remaining risks

- **High: backup protection and scope.** The embedded app-wide key remains extractable. Random IV/HMAC improves new exports but does not create user-held-key security; legacy files remain unauthenticated. New v2 exports require an updated receiving app. Photos are references, and preferences/caregiver settings are not a complete portable snapshot. A complete protected device backup needs its own versioned attachment/preferences/key design.
- **Installed data and real providers.** Upgrade actual old signed apps without uninstalling, using independently retained synthetic/historical fixtures. Test local/Drive transfers in both platform directions, overdue pregnancies, old export variants, multiple/repeated imports, account changes, denied permissions, disk exhaustion and interruption before/after the primary commit. Post-commit Redux/settings/navigation recovery is not one cross-store transaction. Confirm the translated replacement warning with country teams.
- **Notifications and device failures.** Test real legacy pending requests, same-date child reminders/identifier coalescing, large queues, exact-alarm denial, OEM limits, background delivery and taps. Reproduce historical picker/WebView/audio/native-loader issues with current symbolicated releases; compilation is not their resolution proof.
- **Live Firebase and consent.** Compare each signed app's actual project/app IDs, then reconcile online/offline/restart/reconnect journeys in DebugView and the authorised reporting pipeline. Verify signed symbol/source-map receipt and actual fatal-report privacy. Historical consoles were only partially available. Define the analytics/Meta consent and retention policy; native SDK acceptance and GA4 estimates are not an exact child census.
- **RTL/accessibility.** Arabic GRarb is not enabled in the current registry, and no registered Urdu UI pack is present. Approved strings, fonts, locale metadata and country content are required before end-to-end acceptance. Traverse the full screen inventory on small/large Android/iOS devices with real packs, large fonts, keyboards and screen readers. Existing input scaling restrictions and post-alert focus need review.
- **Security and performance acceptance.** Inventory real API/media TLS endpoints before narrowing the retained ATS exceptions. Review current production SDK payloads, secret history/key restrictions and backend rules. Profile low-memory/32-bit/16 KB devices and real media/content libraries. The measured reminder improvement is 55→1 native reconciliation reads with 55 records retained, not a device wall-clock benchmark.

## Deferred maintenance

Realm 20.2.0 and schema versions remain to avoid combining a database upgrade with the framework migration. dotenv 3.4.12 retains the tested flavour behaviour; major 5 requires isolated FLAVOR/environment regression proof. Firebase 26.4.1 retains the tested CocoaPods path and Apple security backport; the Firebase 27/SPM migration needs coordinated work across all targets. Low build-tool advisories without a compatible published fix, legacy callback consumers, ESLint configuration migration and the inherited typing backlog are recorded follow-ups. They have not been hidden by forced major upgrades or suppression rules.

For full procedures and findings, see [backup validation](backup-validation.md), [analytics coverage](analytics-coverage.md), [security assessment](security-assessment.md), [crash history](crash-history.md) and [RTL/flavour validation](rtl-and-device-validation.md).
