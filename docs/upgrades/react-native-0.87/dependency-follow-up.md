> Historical dependency checkpoint: current audit/check totals and the deepmerge advisory status are recorded in [remaining-task-follow-up.md](remaining-task-follow-up.md).

# Dependency follow-up — 13 November 2026

This follow-up starts from review-fixes commit
`6990b1415a7d990b36812f06ad15a34291fd75b7`. The dependency tree, upstream
release changes and the app's actual imports were reviewed before selecting
updates. Versions below describe resolved packages rather than only the lower
bounds previously written in package.json.

## Applied maintenance updates

| Package | Previous resolved version | New pinned version | Reason |
| --- | --- | --- | --- |
| d3-shape | 3.2.0 | 3.2.1 | Current patch release with updated ESM packaging and dependency requirements. Keep the growth-chart path engine maintained within major 3. |
| @babel/preset-env | 7.28.3 | 7.29.14 | Babel 7 transform/parser maintenance, including fixes for dynamic imports and generator/finally handling. |
| @babel/runtime | 7.29.13 | 7.29.14 | Keep the runtime helpers on the current reviewed Babel 7 patch line. |
| @types/luxon | 3.7.1 | 3.7.6 | Updated typings within the installed Luxon 3.7 line; the Luxon runtime remains 3.7.2. |

Compatible transitive dependencies were updated in the lockfile. Existing native
library versions, all three compatibility patches and Realm schemas are unchanged.

The D3 release changes package entry points to an ESM distribution, so a version
edit alone is insufficient verification. The existing component tests mock D3.
Eight new tests instead exercise the actual installed package and compare paths
with references captured using 3.2.0: one/two measurements, a growth series and
decimal coordinates, each in LTR and RTL. All eight paths remain identical.
This does not replace native chart rendering and interaction testing.

## Candidate rejected after audit

`react-native-rename` 3.3.2 was trialled because upstream improves recent template
handling. Its `replace-in-file` dependency adds affected `glob` dependency paths.
The full audit increased from 19 to 21 entries, adding two moderate package
findings. That update was reverted; **3.2.17 is now pinned exactly** so a routine
install cannot adopt the rejected candidate through the former caret range.

The relevant glob advisory has a published 14.0.2 fix. Adopting it here would
require overriding the parent libraries' declared major ranges and validating
real project-renaming fixtures. That separate tool migration was not added to
the framework-upgrade branch. No project rename was performed.

## Retained dependencies

| Package/group | Decision |
| --- | --- |
| React Native 0.87.1, React/react-test-renderer 19.2.3, RN preset/config packages | Keep the reviewed framework/renderer combination. |
| Realm 20.2.0 and react-native-dotenv 3.4.12 | Preserve the user's data-migration and multi-flavour constraints. |
| Firebase 26.4.1 | Keep the aligned four packages and reviewed CocoaPods/static-framework integration; major 27 needs a separate Apple integration migration. |
| FS fork 2.40.4 | Keep the reviewed RN 0.87 native selection. |
| Gesture Handler 2.33.1 | The 2.x line supports RN 0.87. Major 3 should be evaluated with navigation, drawers, sheets and native gesture tests. No claim is made that major 3 is universally incompatible. |
| Skia 2.15.1 / Victory Native 43.0.1 | Keep the reviewed chart combination. Skia 3 introduces Graphite/WebGPU native dependencies; evaluate it with chart, GPU/device and build testing. |
| Reanimated 4.7.1 / Worklets 0.13.1 | Keep the reviewed compatible pair. |
| Redux Saga 1.5.1 | Version 1.6.0 primarily adds a named createSagaMiddleware export. The app uses the existing default export, so this does not address an identified app problem. |
| CLI 20.2, Babel 7, Jest 29, ESLint 8, TypeScript 5.9.3 | Keep the reviewed toolchain; new major versions need separate configuration/peer validation. Babel 7 patches are applied above. |
| Other native/UI packages | No further native upgrade is selected solely because of a higher version number. |

## Validation

- All 161 application tests and 11 tooling tests pass, including the eight new
  tests of real D3 path generation.
- Type regression check passes with the same 136 inherited diagnostics.
- All 96 checked-in native vector resources verify.
- Production JS bundle checks and the existing GitHub matrix cover all eight
  flavours on Android and iOS before accepting this follow-up.
- The full npm audit returns to **19 entries: 8 moderate, 11 low, zero high and
  zero critical** after reverting the rename candidate. This is a registry
  snapshot, not a complete application security assessment.
- A clean npm install and all existing compatibility patches are checked in CI.

Signed native builds, installed-app upgrade/data tests and real translated RTL
visual QA remain required as documented in [review-fixes.md](review-fixes.md).
No native/device sign-off is inferred from JS tests or bundling.

## Upstream references

- [Babel 7.29.14 release](https://github.com/babel/babel/releases/tag/v7.29.14)
- [D3 Shape 3.2.0 to 3.2.1 comparison](https://github.com/d3/d3-shape/compare/v3.2.0...v3.2.1)
- [Redux Saga 1.6.0 release](https://github.com/redux-saga/redux-saga/releases/tag/redux-saga%401.6.0)
- [Rename 3.2.17 to 3.3.2 comparison](https://github.com/junedomingo/react-native-rename/compare/v3.2.17...v3.3.2)
- [Glob advisory GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)
- [Gesture Handler releases](https://github.com/software-mansion/react-native-gesture-handler/releases)
