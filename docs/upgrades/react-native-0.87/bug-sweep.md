# Application bug sweep — 13 November 2026

Historical snapshot: see [extended review](extended-review.md) for the subsequent audit, fixes and verification status.

Fixes are on `RNSDKUpgrade-review-fixes`. These checks cover pre-existing defects
as well as the React Native migration. The source PR branch is unchanged.

The completed sweep passes 237 Jest tests in 23 suites, 11 Node tooling tests,
18 packaging-guard tests and production bundles for all eight flavours on both
platforms. Both representative Android/iOS native builds passed. The final device
QA passed all four Bebbo/Rerai cases at normal and 1.3x system font scale, including
actual AAB-split installation, failed-download cancellation and reachable actions.
The remaining release checks are listed below; this is not a zero-bug certificate.

## Priority

The most consequential corrections are the startup blank screen after download
cancellation, content synchronisation advancing its cursor before durable storage,
unsafe/incomplete installed-data migration callbacks, incorrect growth-card
interpretation and missing native flavour resources. These can prevent use,
leave offline content stale or display misleading information.

The other confirmed defects below are functional corrections. The remaining
TypeScript backlog and cross-device backup-photo portability are follow-up work;
physical-device migration, real-service and RTL acceptance remain release checks.

## Reproduced and corrected

| Area | Defect and correction |
| --- | --- |
| Offline analytics | SDK failures were swallowed, so events could be marked sent without being accepted. Iterating a live filtered Realm result skipped records; overlapping reconnect callbacks could send duplicates. Persist failed submissions, snapshot pending records, serialise flushes and mark only accepted events. SDK acceptance does not mean server delivery, and this is not exactly-once delivery across a process crash. |
| Native flavour resources | Rerai and Pacific product flavours use lower-case names while their native resource/manifest folders use camel case. Linux therefore ignored their layouts, icons, app names and link declarations. Explicit source mappings restore the existing branded resources and resolve the missing splash ID/notification-icon errors. |
| Android splash dismissal | Lottie SplashScreen 3 ignores `hide()` unless manual dismissal is enabled. Enable that documented mode, matching iOS and the existing JS readiness timer, retain the native two-second fallback handover, and let the library control animation playback instead of XML autoplay/restarting it. |
| Installed-data migration | The schema-4 migration checked the new version instead of the old one, so older profiles could retain an empty `autoChild` flag. Use the old version and preserve explicit flags; make Realm migration callbacks synchronous so failures propagate into the migration transaction. Realm 20.2.0 and schema version 4 are retained. |
| Notifications | Generated IDs could collide with the same new batch or return undefined after a saved-ID collision. Use a bounded collision search over saved and new IDs. Sort copied age periods by days instead of assuming Drupal IDs are chronological; use the planned term date, not the taxonomy ID, for the existing premature-child anchor. Missing catalogues return an empty result. Existing clinical schedule intervals are unchanged. |
| Videos | Missing/non-string video URLs could crash a card. A local-variable error flag reset on every render and did not reliably show the fallback. Guard metadata and retain the failure state until the source changes. |
| Offline article cache | Pinning an existing article did not refresh its content; async callbacks inside a synchronous Realm write could detach errors. Perform the batch synchronously in one transaction, refresh content and preserve pins. Cache operations return their actual completion status and API persistence rejects unconfirmed writes. |
| Download cancellation | A failed initial download followed by CANCEL/OK left both installed apps blank: the cancellation path never completed the Redux readiness signal. It also passed request descriptions as responses and the country handler skipped fallback when countries were absent. Complete the fallback, retain the failed-request list, pass only accepted responses to cursors/consumers and always load cached/bundled countries. Country responses are located by endpoint rather than array position. Six additional regression cases cover these paths. |
| Status-bar lifecycle | The focus hook ran only for one Android inset shape. Changing insets could therefore trigger React’s more/fewer-hooks error, and unfocused screens in the other branch still mounted a native status bar. Call the focus hook on every render and gate native status-bar updates by focus while preserving layout padding. Four tests reproduced the prior failures and pass after the correction. |
| Welcome-screen layout | The fixed flex allocation pushed the welcome heading behind the Android status bar on a short screen. Use top/bottom safe areas, natural content heights and scrolling; keep country/language rows and Continue reachable when text grows. Verify on installed Bebbo/Rerai at normal and 1.3x font scale. |
| Download completion | The API saga dispatched a forked cache write and immediately advanced the delta cursor/read the cache. Wait for the actual transaction; failed persistence/application responses enter the retry list and cannot advance their cursor. Concurrent downloads now own separate failure lists. Saga tests cover the ordering and error paths. |
| Article HTML tables | Replace a removed table-plugin export with the documented opaque `tableModel`; register that model beside the iframe model so table contents stay within the WebView renderer. Visual table acceptance still requires a device. |
| Growth cards | Height-only records were treated as zero because parsing required a weight. Realm Date and exported millisecond dates were not handled consistently. Interpret the supplied height/date, tolerate loading metadata and leave missing measurements unclassified. Warning text now has a matching status flag; the exact lower height boundary no longer falls through. Other cut-offs and translated messages are unchanged. |
| Article/activity search | The index was published before asynchronous construction completed and never rebuilt after data/language changes. Publish only completed indexes, cancel obsolete jobs, disable input while preparing and safely handle queries before readiness. Avoid reshuffling the activities array on every render. |
| Deep links | Invalid percent escapes could throw; a late initial-URL response could replay an older link over a foreground link or reset. Decode defensively, handle lookup failure, invalidate stale responses and remove listeners on unmount. |
| Age/date labels | The future-date test required negative years, months and days simultaneously. Near-future due dates could therefore appear newborn/today. Compare calendar dates directly; accept Date, milliseconds and ISO dates in the same local calendar, including UTC offset crossings, and preserve existing translation/plural rules. Invalid dates do not become “today”. |

Tests exercise real MiniSearch indexing and Luxon date calculations. Native SDKs
and Realm writes in Jest use doubles, including a live-results iterator and a
transaction rollback model; they do not replace installed-app migration tests.

## Automated verification

- 237 tests passed in 23 Jest suites, including backup/restore, Drive authorisation,
  notification migration, navigation and earlier review tests.
- 11 Node tooling tests passed, including eight fixed D3 path comparisons against the
  previous d3-shape version.
- RTL component checks cover direction/restart handling, leading/centred text,
  shared typography, rulers, content lists, plus labels and native sheet/picker
  dismissal ordering. They do not constitute Arabic/Dari screenshot approval.
- Type regression gate: no new diagnostics; 98 inherited diagnostics remain
  (original-head baseline: 141). Raw `tsc --noEmit` is still not clean.
- GitHub CI npm audit: 21 findings (10 moderate, 11 low), no high/critical. The
  local npm audit snapshot reports 19 (8 moderate, 11 low); counts are not treated
  as stable across npm/registry environments.
- All 96 generated native resources verified; workflow syntax checked with
  actionlint and the Android launch script checked with `bash -n`.
- 18 Python packaging guard tests cover 32/64-bit and big-endian ELF parsing,
  missing/duplicate C++ runtimes, 16 KB load alignment, missing configured ABIs,
  target SDK/extraction flags and the native splits selected for a device.
- CI inspects the actual AAB manifest, requires every configured ABI, and uses
  checksum-pinned [bundletool 1.18.3](https://github.com/google/bundletool/releases/tag/1.18.3) to generate/install device APK splits from
  that AAB. Their native libraries must be compressed and contain exactly one
  C++ runtime for the selected device. Actual 16 KB-device execution remains a
  separate acceptance check.

Automatic CI builds production JS for all eight flavours on both platforms.
Two representative flavours (Bebbo and Rerai) also run unsigned native builds.
The native workflow now installs the actual SDK repository package
`platforms;android-37.0`, explicitly sets up SDK tooling and JDK 21, assembles an
APK as well as an AAB, checks native packaging (all four configured ABIs for Bebbo; arm64-v8a and
x86_64 for Rerai) and launches Android on an API-35
emulator using generated APK splits. AGP’s overloaded signing setter uses an explicitly selected public setter for unsigned checks. Screenshots, UI hierarchy, logs and packaging results are preserved as
artifacts when those steps run. Fake configuration and a temporary CI signing
key are used; these builds are not distributable releases.

### Native evidence and test limitations

| Verification | Tested source | Result |
| --- | --- | --- |
| [Full build run 43438512801](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43438512801) | `4e3f993` | All 21 jobs green: regression checks, 16 production bundles, both unsigned iOS archives, both Android APK/AAB builds and packaging checks. |
| [Final JS/device QA 43447219490](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43447219490) | `e9b5017` | All 21 jobs green: 237 Jest tests, tooling/type/security/packaging checks, 16 production bundles and four Android device cases. |

Bebbo's bundle contains 124 native libraries across armeabi-v7a, arm64-v8a, x86
and x86_64. Rerai's CI bundle contains 62 across arm64-v8a and x86_64. Both target
SDK 37, set `extractNativeLibs=true`, contain one C++ runtime per ABI and pass
the ELF checks. Generated x86_64 device splits each contain 31 compressed native
libraries and one C++ runtime; installation, launch and the cancellation path
pass on API 35.

The final two UI fixes (welcome layout and status-bar lifecycle) are JavaScript-only.
The final QA reuses the native AABs from `4e3f993`, regenerates release Hermes
bytecode using the locked React Native compiler and verifies every other AAB entry
is byte-identical. The source gate allows only those two components, their test,
the install harness and the QA workflow to differ from the compiled commit.
Per-case provenance files record the source commits and bytecode SHA-256. The
same flavour's bytecode hash is identical across the two font-scale cases.

The final fix-branch commit follows the tested QA commit and changes only review
documentation/evidence and CI configuration. Application code and the smoke
harness are unchanged from the passing QA source. Its `[skip ci]` marker avoids
rebuilding those same application inputs. The QA-only workflow remains on
`RNSDKUpgrade-onboarding-checks`; the normal native workflow remains on the fix branch.

Screenshots were inspected in all four final cases. They confirm the blue Bebbo
and green Rerai styling, a readable welcome heading below the status bar and a
Continue button reachable by scrolling on the short screen. These are synthetic
English first-run screens, not full-app or RTL visual sign-off.

| App / system font scale | Welcome screen | Actions after scrolling | Source proof |
| --- | --- | --- | --- |
| Bebbo / 1.0 | [Image](evidence/bebbo-font-1.0-after-cancel.png) | [Image](evidence/bebbo-font-1.0-after-scroll.png) | [JSON](evidence/bebbo-font-1.0-provenance.json) |
| Bebbo / 1.3 | [Image](evidence/bebbo-font-1.3-after-cancel.png) | [Image](evidence/bebbo-font-1.3-after-scroll.png) | [JSON](evidence/bebbo-font-1.3-provenance.json) |
| Rerai / 1.0 | [Image](evidence/reraiUmntwana-font-1.0-after-cancel.png) | [Image](evidence/reraiUmntwana-font-1.0-after-scroll.png) | [JSON](evidence/reraiUmntwana-font-1.0-provenance.json) |
| Rerai / 1.3 | [Image](evidence/reraiUmntwana-font-1.3-after-cancel.png) | [Image](evidence/reraiUmntwana-font-1.3-after-scroll.png) | [JSON](evidence/reraiUmntwana-font-1.3-provenance.json) |

[Before: clipped Bebbo welcome heading](evidence/bebbo-before-welcome-clipped.png).

Earlier green process-only checks were rejected after reviewing their evidence:
Ubuntu lacked `rg`, so cancellation/error checks could be skipped; cancellation
left the app blank; a later Rerai capture showed a Pixel Launcher ANR instead of
app UI. The final harness requires the fixture retry dialog, explicit CANCEL/OK,
actual in-app welcome content below the status bar and a reachable Continue action.
It reads and launches the explicit activity from the captured AAB manifest and
preserves logs even on failure. A failed implicit-launch QA attempt is superseded
by the final passing run; none of those earlier captures are used as app acceptance.

Fake API/Firebase configuration deliberately triggers the download failure path.
Successful real-service onboarding, push delivery and Google authorisation are
outside the evidence from these builds. Expected invalid-fixture Firebase/
Facebook errors must not be mistaken for successful service integration.

Bebbo and Rerai produced byte-identical `Gemfile.lock` and `ios/Podfile.lock`.
The native vector-resource hook now resolves the typed React Gradle extension;
React Native also creates an empty legacy `ext.react` map, which shadowed the
previous property lookup and blocked `preBuild`.

The reviewed locks are now committed, and CocoaPods CI uses `--deployment` to
reject unreviewed dependency resolution changes.

## Acceptance that still needs a real app/device

This is not a certification that the app has no bugs. Before release:

- Upgrade an installed production RN 0.78.2 app without uninstalling. Check real
  children (including expected/premature children), measurements, reminders,
  milestones, favourites, settings, photos, selected profile and offline content.
- Restore real historical Android, iOS, Drive and Realm backups with the actual
  flavour keys. Verify cancellation, permission/network/storage failure and
  malformed data leave existing records intact. Backup photo references still
  do not embed image bytes for cross-device portability.
- Exercise real Google account consent/account switching, Firebase messaging,
  notification permissions, pending-notification migration, background delivery
  and exact-alarm restrictions. Fake CI credentials cannot test these services.
- Check signed native builds for every shipped flavour, supported ABI, OS
  version and bundletool-generated APK split, including actual 16 KB devices.
- Inspect Arabic/Dari and LTR screens on both platforms with long translations,
  large fonts, keyboard input, direction changes, drawers/tabs, back arrows,
  forms, bottom sheets, charts/tooltips and date/number mixtures. Automated JS
  and unsigned archive checks do not establish visual RTL acceptance.
- Have the programme/clinical owner verify growth messages and country vaccine/
  check-up schedules against the approved reference data, including boundaries.
