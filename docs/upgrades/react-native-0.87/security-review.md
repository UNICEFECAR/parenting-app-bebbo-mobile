# Dependency security review — 11 November 2026

Historical snapshot: see [extended review](extended-review.md) for the subsequent audit, fixes and verification status.

This historical review covers the npm dependency tree at the initial security-fix stage. Audit counts describe vulnerable-package entries, including parent packages affected through dependencies; they are not counts of independently exploitable app vulnerabilities. This is not a complete application security assessment.

## Follow-up snapshot — 13 November 2026

The review-fixes branch resolves styled-components 6.6.0 and TypeScript 5.9.3.
A fresh full-tree `npm audit --json` reports **19 entries: 8 moderate, 11 low,
0 high and 0 critical**. The original 38-to-21 table and package paths below
record the earlier snapshot; they do not describe the final dependency tree.
See [review fixes](review-fixes.md) for validation limits and retained versions,
and [dependency follow-up](dependency-follow-up.md) for the subsequent Babel/D3/typings
updates. The rename-tool candidate was reverted after its audit regression;
the follow-up retains the same 19-entry audit snapshot.

## Original result

| Severity | Before | After |
| --- | ---: | ---: |
| Critical | 0 | 0 |
| High | 16 | 0 |
| Moderate | 10 | 10 |
| Low | 12 | 11 |
| Total | 38 | 21 |

The remaining 21 package entries trace to three upstream advisories, described below. They remain open. No forced audit fix, major tool migration, native Firebase upgrade or application feature change was used.

## Applied fixes

| Dependency | Before | After | Scope |
| --- | --- | --- | --- |
| `@babel/core` | 7.28.3 | 7.29.13 | Build tooling; raise the direct minimum to `^7.29.13` |
| `@babel/helpers` | 7.28.3 | 7.29.13 | Babel dependency |
| `@babel/plugin-transform-modules-systemjs` | 7.27.1 | 7.29.8 | Babel dependency |
| `browserslist` | 4.25.3 | 4.29.5 | Build target tooling; associated browser databases updated |
| `minimatch` 3.x | 3.1.2 | 3.1.5 | Compatible fixes in lint/test/glob consumers |
| `minimatch` 5.x | 5.1.6 | 5.1.9 | Compatible fix in replace-in-file |
| `minimatch` 8.x | 8.0.4 | 8.0.7 | Fixes older ReDoS issues; a different advisory remains open |
| `nanoid` | 3.3.11 | 3.3.20 | Used by navigation and PostCSS |
| `source-map-js` | 1.2.1 | 1.2.2 | CSS/vector tooling dependency |
| `tmp` | 0.2.5 | 0.2.7 | patch-package dependency |
| React DevTools' `ws` | 7.5.10 | 7.5.13 | Development tooling dependency |
| `postcss` | 8.4.49 | 8.5.32 | Scoped override under styled-components |
| `@grpc/grpc-js` | 1.9.16 | 1.13.6 | Scoped override under Firebase's Node Firestore package |

Most changes remain within their parents' existing semver ranges. Two scoped overrides are necessary because the parents pin older releases:

- `styled-components → postcss: 8.5.32`: retains styled-components 6.1.19 and PostCSS major 8. Addresses CSS/source-map security findings without starting the styled-components/RTL migration.
- `@firebase/firestore → @grpc/grpc-js: 1.13.6`: retains Firebase JS 12.17.1, Firestore 4.17.0 and all native RN Firebase packages at 26.4.1. This overrides Firestore's declared `~1.9.0` range while retaining gRPC major 1. The Firestore Node transport uses `Metadata`, `credentials` and `loadPackageDefinition`, which are retained. This app uses native Analytics, Messaging and Crashlytics; the Node Firestore transport is not an app feature. The override is a compatibility exception that should be removed once the upstream dependency range includes a patched release.

Sources include the [gRPC advisory](https://github.com/advisories/GHSA-m9gg-hp2v-232j), [gRPC 1.13.6 release](https://github.com/grpc/grpc-node/releases/tag/%40grpc%2Fgrpc-js%401.13.6), [PostCSS source-map advisory](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [Babel advisory](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8), [Babel SystemJS advisory](https://github.com/advisories/GHSA-fv7c-fp4j-7gwp), [NanoID advisory](https://github.com/advisories/GHSA-2v37-7h3g-55p8), [tmp advisory](https://github.com/advisories/GHSA-ph9p-34f9-6g65) and [ws advisory](https://github.com/advisories/GHSA-96hv-2xvq-fx4p).

## Findings retained for separate work

| Upstream advisory | Installed dependency/path | Assessment and next action |
| --- | --- | --- |
| [deepmerge prototype poisoning](https://github.com/advisories/GHSA-gcqx-w48m-w2h4), low | deepmerge 4.3.1, used by CLI/Jest/SVGR configuration | No published patched version is listed. Keep the finding open and monitor the upstream fix. Downgrading React Native CLI to npm audit's suggested older major would disrupt the supported toolchain. |
| [glob cancellation bypass](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), moderate | glob 9.3.5 under babel-plugin-module-resolver | Published fix starts at 14.0.2. Review the resolver's glob API/options and Node requirements before any major override or parent replacement. Current aliases come from the project's Babel configuration, rather than CMS article content. |
| [minimatch pattern amplification](https://github.com/advisories/GHSA-g3hv-75wg-m249), moderate | minimatch 8.0.7 under the resolver's glob and 10.2.6 under TypeScript ESLint tooling | Published fix starts at 11.0.1. Do not replace all minimatch versions globally: older consumers use different APIs. Affected pattern processing is in the build/lint dependency paths; this is not a dismissal of CI risk from untrusted inputs. Review the relevant parent upgrades separately. |

## Validation

- All nine service suites / 97 tests pass. No new TypeScript diagnostics relative to the preceding native-package batch; existing project errors remain.
- Actual-package checks pass for PostCSS parse/stringify, NanoID negative/zero/normal sizes, gRPC's used public exports/Metadata, and Firebase Node Firestore initialization and cleanup. No database requests were issued; this does not test Firestore RPC/TLS interoperability.
- Dependency installation succeeds with `--legacy-peer-deps`; all three existing compatibility patches apply.
- Android prodRelease and iOS Release simulator builds pass. Installed both builds and verified that each opens Home with its existing profile/data.
- All eight flavour Babel configurations compile. Android Release source-map inspection confirms that PostCSS is bundled, while the Node Firestore/gRPC transport and the remaining deepmerge/glob/minimatch tooling packages are absent from that bundle. This inspection does not cover every native or external service dependency.

## Files and follow-up

Only `package.json`, `package-lock.json` and security-review documentation change for this batch. App screens, translated strings, Babel configuration, native SDK versions, iOS project/privacy declarations and existing compatibility patches are retained.

Continue the planned UI migrations separately: Action Sheets, styled-components/RTL and the dedicated Victory chart migration. Optional Babel 8, Jest 30, ESLint 10 and TypeScript 7 upgrades are not required to obtain the fixes applied here.

Re-run `npm audit` when dependencies/advisories change. The zero-high result is a snapshot of this registry audit, not a guarantee that the app has no vulnerabilities.
