# Application bug sweep — 13 November 2026

Fixes are on `RNSDKUpgrade-review-fixes`. These checks cover pre-existing defects
as well as the React Native migration. The source PR branch is unchanged.

## Reproduced and corrected

| Area | Defect and correction |
| --- | --- |
| Offline analytics | SDK failures were swallowed, so events could be marked sent without being accepted. Iterating a live filtered Realm result skipped records; overlapping reconnect callbacks could send duplicates. Persist failed submissions, snapshot pending records, serialise flushes and mark only accepted events. SDK acceptance does not mean server delivery, and this is not exactly-once delivery across a process crash. |
| Installed-data migration | The schema-4 migration checked the new version instead of the old one, so older profiles could retain an empty `autoChild` flag. Use the old version and preserve explicit flags; make Realm migration callbacks synchronous so failures propagate into the migration transaction. Realm 20.2.0 and schema version 4 are retained. |
| Notifications | Generated IDs could collide with the same new batch or return undefined after a saved-ID collision. Use a bounded collision search over saved and new IDs. Sort copied age periods by days instead of assuming Drupal IDs are chronological; use the planned term date, not the taxonomy ID, for the existing premature-child anchor. Missing catalogues return an empty result. Existing clinical schedule intervals are unchanged. |
| Videos | Missing/non-string video URLs could crash a card. A local-variable error flag reset on every render and did not reliably show the fallback. Guard metadata and retain the failure state until the source changes. |
| Offline article cache | Pinning an existing article did not refresh its content; async callbacks inside a synchronous Realm write could detach errors. Perform the batch synchronously in one transaction, refresh content and preserve pins. Cache operations return their actual completion status and API persistence rejects unconfirmed writes. |
| Download completion | The API saga dispatched a forked cache write and immediately advanced the delta cursor/read the cache. Wait for the actual transaction; failed persistence/application responses enter the retry list and cannot advance their cursor. Concurrent downloads now own separate failure lists. Seven saga tests cover the ordering and error paths. |
| Article HTML tables | Replace a removed table-plugin export with the documented opaque `tableModel`; register that model beside the iframe model so table contents stay within the WebView renderer. Visual table acceptance still requires a device. |
| Growth cards | Height-only records were treated as zero because parsing required a weight. Realm Date and exported millisecond dates were not handled consistently. Interpret the supplied height/date, tolerate loading metadata and leave missing measurements unclassified. Warning text now has a matching status flag; the exact lower height boundary no longer falls through. Other cut-offs and translated messages are unchanged. |
| Article/activity search | The index was published before asynchronous construction completed and never rebuilt after data/language changes. Publish only completed indexes, cancel obsolete jobs, disable input while preparing and safely handle queries before readiness. Avoid reshuffling the activities array on every render. |
| Deep links | Invalid percent escapes could throw; a late initial-URL response could replay an older link over a foreground link or reset. Decode defensively, handle lookup failure, invalidate stale responses and remove listeners on unmount. |
| Age/date labels | The future-date test required negative years, months and days simultaneously. Near-future due dates could therefore appear newborn/today. Compare calendar dates directly; accept Date, milliseconds and ISO dates in the same local calendar, including UTC offset crossings, and preserve existing translation/plural rules. Invalid dates do not become “today”. |

Tests exercise real MiniSearch indexing and Luxon date calculations. Native SDKs
and Realm writes in Jest use doubles, including a live-results iterator and a
transaction rollback model; they do not replace installed-app migration tests.

## Automated verification

- 227 tests passed in 21 Jest suites, including backup/restore, Drive authorisation,
  notification migration, navigation and earlier review tests.
- 11 Node tooling tests passed, including eight fixed D3 path comparisons against the
  previous d3-shape version.
- Type regression gate: no new diagnostics; 98 inherited diagnostics remain
  (original-head baseline: 141). Raw `tsc --noEmit` is still not clean.
- All 96 generated native resources verified; workflow syntax checked with
  actionlint and the Android launch script checked with `bash -n`.
- Android AAB checker tested against eight positive/negative ELF/packaging
  fixtures. It checks the number of C++ runtimes and 64-bit ELF load alignment;
  it does not prove APK ZIP alignment or execution on a real 16 KB device.

Automatic CI builds production JS for all eight flavours on both platforms.
Two representative flavours (Bebbo and Rerai) also run unsigned native builds.
The native workflow now installs the actual SDK repository package
`platforms;android-37.0`, explicitly sets up SDK tooling and JDK 21, assembles an
APK as well as an AAB, checks native packaging and launches Android on an API-35
emulator. AGP’s overloaded signing setter uses an explicitly selected public setter for unsigned checks. Screenshots, UI hierarchy, logs and packaging results are preserved as
artifacts when those steps run. Fake configuration and a temporary CI signing
key are used; these builds are not distributable releases.

Both Bebbo and Rerai unsigned iOS archives succeeded in
[run 43412777599](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43412777599)
on commit `9f2b707`, before the application fixes in this sweep. That run's Android
jobs stopped at the SDK package installation, which is corrected in this sweep.
The complete run must be checked again on the final application-fix commit.

Bebbo and Rerai produced byte-identical `Gemfile.lock` and `ios/Podfile.lock`.
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
