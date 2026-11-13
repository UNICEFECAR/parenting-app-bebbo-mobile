# PR #1115 review fixes

This follow-up is based on `RNSDKUpgrade` at
`b1286358cbcc1187d07cdb277c13f4395edbe9f1`. The fixes are isolated on
`RNSDKUpgrade-review-fixes`; the source PR branch is unchanged.

## Implemented changes

| Review issue | Change |
| --- | --- |
| F1: production visual test controller | Removed the polling effect and its audit-only imports from navigation. Production bundles are checked for its command filenames and globals. |
| F2: destructive local restore | Local documents, Drive and onboarding confirmation share validation/conversion and a single Realm write transaction. Selection and preview never clear or close the live Realm. Errors propagate to the UI. |
| F3: missing branded resources | Generated the union of actual SVG dependencies for all eight flavours, including Rerai's green logos and Foleja/Merhaba/Babuni variants. Checked-in manifest verifies resource bytes and SVG source changes. Android preBuild and all ten iOS bundle phases run that verification. |
| F4: obsolete workflows | Replaced Node 21/npm-install/old-Fontello-copy workflows with current lockfile installs and supported Node. Added automatic JS/test/security/type-regression checks and explicit manual unsigned native compile checks. |
| F5: About page RTL | Added HTML base direction and the shared RTL list-renderer properties. |
| F6: incompatible TypeScript peer | Pinned TypeScript 5.9.3, satisfying the Expo require-utils peer brought in by notify-kit. |

Additional corrections:

- Both Android's historical JSON-quoted ciphertext and iOS/Drive raw ciphertext
  are accepted, including BOM/whitespace. Encryption algorithm, key and IV
  remain compatible; the historical local IV suffix normalisation is preserved.
- Both platforms use the current document picker's private-copy API for JSON
  and legacy binary backups. Temporary Realm copies are closed and removed.
- File export is awaited, uses unique cache files, cleans up after native copy
  or sharing completes, and handles cancellation without reporting success.
  Duplicate backup code and logs of plaintext/ciphertext/IV were removed.
- Backup/restore operations reject overlap. Conversion happens before any live
  write; Realm insertion failures roll back deletion and earlier insertions.
- Onboarding confirmation imports once, updates parent settings once, then
  selects the active child and refreshes notifications. Repeated taps are blocked.
  The Navigation 7 event unsubscribe function is used during cleanup.
- Corrected the `relationshipname` route-parameter mismatch in AddChildSetup
  and preserved parent selections in its import preview.
- Metro cache versions now include flavour and environment-file contents.
  This prevents stale transforms from selecting a previous flavour's assets.
  Corrected the bebboDev iOS npm command to select `FLAVOR=bebboDev`.
- Realm is pinned exactly to 20.2.0 instead of a floating major-compatible range.
  Neither user/data Realm schemas nor their version numbers were changed.

## Reproducible checks

```sh
nvm use
npm ci --legacy-peer-deps
npm test -- --runInBand
npm run test:tooling
npm run typecheck
npm run assets:check
npm audit --audit-level=high
```

`npm run typecheck` is a **regression gate**, not a claim of a clean TypeScript
build. Its checked-in baseline was collected at the original PR head using
TypeScript 5.9.3 (141 diagnostics). The follow-up currently has 136 diagnostics;
raw `tsc --noEmit` still fails on that inherited backlog. New diagnostic types,
files or increased counts fail the gate. No errors are hidden with `ts-ignore`.

The baseline does not replace fixing the remaining typing backlog in a separate
change. The missing legacy `@types/react-native` peers reported by `npm ls --all`
under two native-html packages are upstream metadata: modern React Native ships
its own types. A deprecated stub package has not been added to silence that output.

Automatic checks build production JS for all eight flavours on Android and iOS,
check the removal of test instrumentation, and verify the native resources those
flavours reference. `npm run assets:generate` collects Metro assets in separate
flavour processes and converts the union privately before publishing. This can
be slower than generating one flavour, but avoids deleting another app's logos.

The four legacy native workflow entry points now call
`native-verification.yml`. That workflow can also be dispatched for each of the
eight flavours and either platform. It uses deliberately fake Firebase/environment
fixtures and disables signing for compile verification. It does not publish,
upload to stores or create a distributable release. Existing local release
commands and per-flavour signing configurations remain available. A signed
release must use the real configuration and must not set `unsignedVerification`.

CocoaPods runs through the pinned Gemfile. The later bug sweep committed the
byte-identical `Gemfile.lock` and `ios/Podfile.lock` produced by successful Bebbo
and Rerai macOS archives; CI now uses CocoaPods deployment mode and preserves
the resolved locks as artifacts. See [bug sweep](bug-sweep.md) for current results.

See [dependency follow-up](dependency-follow-up.md) for the subsequent reviewed
maintenance updates and the rename-tool candidate rejected after audit.

## Dependency decisions

| Dependency | Decision |
| --- | --- |
| Realm 20.2.0 | Retain and pin. Separating a database/Realm upgrade from RN migration is justified. Real installed-app upgrade tests remain mandatory. |
| react-native-dotenv 3.4.12 | Retain. The multi-flavour build behaviour is exercised explicitly; major 5 needs its own FLAVOR and empty-variable migration tests. |
| Firebase 26.4.1 | Retain all four aligned packages and the CocoaPods/static-framework integration. Version 27's Apple SPM and Kotlin changes are a separate migration. |
| FS fork 2.40.4 | Retain the RN 0.87-compatible selection rather than adopting APIs intended for RN 0.88. |
| Reanimated 4.7.1 / Worklets 0.13.1 | Retain the compatible pair. |
| Other selected native/UI packages | Keep the reviewed versions. Broad latest-version upgrades would invalidate the migration test scope. |

The full npm audit at this follow-up reports 19 package entries: 8 moderate,
11 low, no high or critical. This is a registry audit snapshot, not complete
application security certification.

## Validation on the review host

- Reproducible `npm ci --legacy-peer-deps`, with all three compatibility patches.
- 11 Jest suites / 161 tests passed, plus 3 Node tooling tests.
- 117 modified application/test source files transformed for each of all eight
  flavours; FLAVOR substitution resolved in every case.
- Production Metro bundles passed for Bebbo Android and Rerai iOS; both exclude
  the removed visual controller. All-flavour asset collection also builds the
  iOS application graph for each flavour.
- All 96 generated native resources verified; rendered Bebbo and Rerai native
  logo PDFs were inspected for the expected blue/green branding.
- All workflow YAML passed actionlint 1.7.12.
- Type regression gate passed with 136 inherited diagnostics (141 in the
  original-head baseline under the same compiler).
- npm audit: 19 entries, zero high/critical. Full dependency-tree inspection
  retains only the two documented obsolete native-html type-peer warnings.

## Native and device acceptance still required

The Linux review host cannot run Xcode, Android SDK builds or physical-device
upgrade tests. Source checks, mocked Realm transactions and JS bundles do not
prove installed-app data safety or visual correctness. Before release:

- [ ] Run the native compile workflow for both platforms and every shipped
  flavour; review the captured native dependency locks.
- [ ] Build signed releases with real Firebase/OAuth/environment configuration.
  Inspect the AAB/APK for every expected ABI, `libc++_shared.so`, 16 KB page
  alignment and manifest/library packaging behaviour. Install the generated
  split APKs through bundletool on supported devices.
- [ ] Upgrade an installed RN 0.78.2 release without uninstalling it. Verify
  multiple and expected children, measurements, reminders, milestones,
  favourites, settings, selected child, offline content and local photos.
- [ ] Restore real historical Android quoted JSON, iOS raw JSON, Drive JSON and
  legacy Realm backups on both platforms. Inject malformed JSON, duplicate IDs,
  invalid dates, incompatible nested data, conversion failure, failed insertion,
  picker cancellation and storage failure. Existing records must survive every
  failure before a transaction commits.
- [ ] Verify real AES ciphertext with unchanged historic flavour keys/IVs.
  Test Drive access with existing backups, permission denial, cancellation,
  account switching, offline/timeouts and successful replacement.
- [ ] Verify notification migration once, with pending old notifications, denied
  permissions, cold-start/opened notifications, exact-alarm restrictions and
  reinstall/upgrade cases. There must be no duplicate or missing reminders.
- [ ] Capture Arabic/Dari and LTR screenshots on Android and iOS, with long real
  translated content and large fonts. Check About lists, Terms, onboarding,
  parent/child forms, tabs/drawers, bottom sheets, keyboard, back arrows, date
  dialogs, growth charts/tooltips/rulers, mixed-script dates/numbers and restart
  after changing language. Forced English RTL is insufficient for sign-off.
- [ ] Verify Rerai's green onboarding/Terms/chat branding and every other app's
  own logos in installed native builds. Check charts against the prior release
  at fixed measurements and test touch/scroll behaviour.

Backup files still contain photo references rather than embedded image bytes.
This inherited limitation is unchanged; cross-device photo portability needs a
separate backup-format migration and must not be represented as fixed here.
