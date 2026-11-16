# C116 Tab header height regression

## Issue and correction

The Android screenshot supplied on 16 November 2026 shows an oversized blue header pushing content down on the bottom tabs and Tools. C38 removed a fixed maximum height to support wrapped/flavour-specific headings, but left `HeaderRowView`'s inherited `flex: 1` active. styled-components expands that declaration into `flexGrow`, `flexShrink` and `flexBasis`. A minimum height alone therefore permits the header to share the screen's spare vertical space.

`app/components/TabScreenHeader.tsx` now overrides all three composed properties through a static StyleSheet: `flexGrow: 0`, `flexShrink: 0`, `flexBasis: 'auto'`, retaining `minHeight: 50`. The heading still uses the selected flavour typography and two-line limit, without a fixed height/maxHeight. An inline `flex: 0` alone is insufficient because the inherited explicit longhand properties still apply. The screen body, rather than the header, receives spare height. `HeaderRowView` itself is unchanged, preserving separately capped detail/editor rows and the drawer.

## Affected screens and similar layout review

The same component is used by Home, Activities/Games, Articles/Advice, ChildDevelopment, Childgrowth, Vaccination, HealthCheckups, Favourites, Settings, About, SupportChat and UserGuide. The single correction covers these 12 source consumers on both platforms and all eight flavour aliases. Direct `HeaderRowView` consumers were also inspected: detail/editor rows retain their explicit height caps and the drawer retains its existing container contract. No additional independently established layout bug was found in this bounded pass; no global flex rewrite was made.

## Verification

- The expanded `headerLayout.test.tsx` checks the native View's full composed styles, not merely the React wrapper's incoming minHeight. It covers Android/iOS × LTR/RTL, short/long headings, minimum/content sizing, colour and wrapping. The four cases fail against the previous component and pass against the correction.
- Full Jest suite: 565 tests in 75 suites pass. Strict TypeScript passes. Full ESLint: zero errors and 2053 existing warnings. Native asset check: 96 resources verified. Analytics and network inventory freshness checks pass.
- The focused header suite was also run under all eight FLAVOR aliases with Jest's transform cache disabled; four cases pass per alias. These are JavaScript/render-contract checks, not eight installed native applications.
- `evidence/header-layout-yoga.cpp` compiles against the Yoga C++ source included with the installed React Native 0.87.1. `header-layout-yoga.csv` records 48 model cases: two screen heights, two widths, three supplied text heights, LTR/RTL and old/fixed composed flex policies. All 24 fixed cases retain natural 50/80/110-point header heights and give the remainder to content; all 24 old-policy cases reproduce excess height. Text heights are supplied to the model, not measured Android/iOS text. This is real layout-engine execution on the host, not a screenshot/device acceptance result.
- No new Android SDK/emulator or iOS installation was available locally for this follow-up. Final signed Android/iOS visual checks, including large system text, Tools switching and country fonts, remain device acceptance. Earlier successful native CI applies to its earlier commit, not this new source. The branch's push-triggered workflow supplies current CI status separately.

## Reproducing the layout model

From the repository root with a C++20 compiler and locked node_modules installed:

```sh
g++ -std=c++20 -O0 -I node_modules/react-native/ReactCommon/yoga \
  $(find node_modules/react-native/ReactCommon/yoga/yoga -name '*.cpp') \
  docs/upgrades/react-native-0.87/evidence/header-layout-yoga.cpp \
  -o /tmp/bebbo-header-yoga
/tmp/bebbo-header-yoga
```

The two evidence files are retained for maintainers and not imported or packaged by the app. No dependency versions, native identities, user data, notification rules or production service configuration were changed in C116.

## Correct build commands for the reported Bebbo development target

```sh
npm run assets:generate
npm run assets:check
ENVFILE=env/.env.bebboDev FLAVOR=bebboDev npx react-native run-android --mode=prodstagingRelease --appId org.unicef.bebbodev --no-packager
```

The `assets:generaten` and `pm run assets: check` strings in the message contain typing/spacing errors. The valid asset commands above preserve the all-flavour vector workflow. Use the actual authorised development environment/service inputs and the updated fixes branch.
