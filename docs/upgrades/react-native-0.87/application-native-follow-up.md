# Application follow-up to the best-practices assessment

Scope: incremental application fixes on `RNSDKUpgrade-review-fixes`, based on
`775c4c06dbd22a1f8cb3da53515d880f06ae45a2`. This is an engineering change and
validation record. It does not assert an OpenSSF badge or replace human security
review, country acceptance or signed native/device testing.

## Changes and reasons

| Area | Issue | Implementation and affected files |
| --- | --- | --- |
| Hook ordering | DetailsScreen called `useContext` conditionally. Health scheduling called `useTranslation` inside a per-period helper, so changing period counts could change hook counts. Other selector-based services were named as ordinary functions, hiding their hook contract. | Move context/translation hooks to the unconditional component/custom-hook body. Rename health, vaccination, periodic-sync and interpretation hooks with `use` prefixes and update all production callers. Files: `app/screens/home/DetailsScreen.tsx`, `app/services/{healthCheckupService,vacccineService,periodicSync,interpretationService}.ts`, `app/screens/home/{HealthCheckups,Vaccination,bottomTabs/Home}.tsx`, `app/screens/healthCheckup/AddChildHealthCheckup.tsx`, `app/components/vaccination/PrevPlannedVaccines.tsx`, and the two growth cards. |
| Health/vaccination input safety | Invalid/empty/non-array vaccine JSON could throw while deriving schedules or opening edit screens. Missing profile/taxonomy data could also throw. Health scheduling annotated and sorted memoised selector objects in place. | Add `healthInput.ts` array/UUID readers, preserving usable entries without rewriting saved records. Use them in both schedule services and `app/screens/{healthCheckup/AddChildHealthCheckup,vaccination/AddChildVaccination}.tsx`. Guard loading-state arrays. Copy health/vaccine selector records before attaching derived fields. Preserve existing calendar calculations, including zero-valued IDs and legacy data. |
| Growth-card correctness | Weight-for-height selected boy data based on availability of boy taxonomy rather than the selected child's gender. Numeric fallback predicates could include a different growth type. The height card sorted shared profile measurements in place. Incomplete profile data could throw, and focus timers survived leaving the screen. | Correct gender selection and group growth-type predicates in `app/components/growth/{ChartHeightForAge,ChartWeightForHeight}.tsx`. Sort a copy, guard incomplete data and clear focus timers. Reference datasets and interpretation thresholds are unchanged. |
| Growth interpretation boundary | Malformed/missing interpretation JSON or reference data could crash. Missing interpretation content could still leave a healthy-status flag. | Use safe array readers and validate the age-list shape in `interpretationService.ts`. Return an unavailable status when interpretation content is unavailable. Retain existing clinical threshold calculations and legacy date handling. |
| External links | The previous scheme regex accepted malformed authorities, invalid ports and embedded credentials. | `app/services/externalLink.ts` validates web/store authorities with the WHATWG URL polyfill already installed by `index.js`. Reject embedded credentials, invalid authority/ports, control characters and backslashes. Preserve country HTTP compatibility, Unicode paths, explicitly permitted email and the existing Apple review schemes. |
| CMS images | Non-string image URLs could throw in `.trim()`, and malformed percent escapes could throw from offline HTML image lookup. | Add string guards and reuse the existing safe decoder in `app/services/imageResolver.ts`. Preserve the existing remote, cache-only, bundled and default fallback order. Tests confirm HTTP/HTTPS scheme changes do not change bundled-asset lookup keys. |
| Accessibility and dismissal | Shared styled actions did not consistently expose a button role or the actual disabled state. AlertModal's close icon was unnamed and Android back did nothing. | Add `app/components/shared/buttonAccessibility.ts`; apply it to shared actions in `ButtonGlobal.tsx` and `ButtonView.tsx`, preserving explicit roles and other state. `AlertModal.tsx` labels the close action with the existing translated `close` key, exposes disabled state and routes Android back to the same cancel callback. Existing geometry and country styling remain. |
| Generated evidence | Added imports moved analytics source line numbers. | Regenerate `analytics-source-inventory.json`; event names, payloads and event-call counts are unchanged. |

## Regression checks

See [machine-readable validation](evidence/application-native-follow-up.json) for
final counts, source file hashes and flavour/platform bundle results.

- Full Jest suite, strict TypeScript, Node tooling and Python tests.
- Full ESLint rerun: hook-rule violations reduced from 18 to zero. The wider lint
  backlog remains, including unused variables and effect dependencies. No blanket
  autofix or warning suppression was introduced.
- Changing health-period counts within the same mounted component; frozen selector
  inputs; malformed vaccine metadata; loading states; valid vaccine/date retention.
- Boy/girl and legacy numeric growth identifiers, growth-type separation, missing
  interpretation data, unchanged date/boundary regressions, copied measurement
  ordering and focus-timer cleanup.
- Native-facing button roles/states, explicit role overrides and modal cancellation
  through the close action and Android back callback.
- Malformed link authorities, Unicode/legacy links, malformed CMS image metadata,
  percent escapes and scheme-independent bundled image lookup.
- Flavour configuration, analytics inventory and native vector-resource checks.
- Release-mode JavaScript bundles for the eight primary flavours and both platform
  resolvers, using deliberately fake CI service configuration. An audit-only Metro
  watch-folder setting makes the existing dependency installation outside this
  detached worktree visible. That local setting is not a repository change.

## Native/network findings and remaining acceptance

No native library, SDK, signing, ABI, minimum-device version, Realm schema, backup
cipher/envelope or legacy backup reader is changed by this follow-up. Android
already enables R8/resource shrinking and full native symbols, disables OS app
backup and uses the target-SDK secure cleartext default outside debug. Ten iOS app
plists were inspected. No new build-flag defect was established that justified a
speculative native configuration change.

Broad iOS ATS exceptions remain open. The static Rerai article/basic-page data
contains 586 HTTP references to its media host; other country content also has
legacy HTTP links. Correctly decoded sample image URLs work over HTTPS. This does
not establish every production API, media host, redirect, SDK or supported device.
Initial source-text probes included escaping and must not be treated as evidence
of a server TLS failure. A country-aware endpoint/content inventory and successful
real-device checks are still required before narrowing ATS or globally refusing
HTTP. No certificate bypass or insecure fallback was added.

Fresh native Android/iOS binaries and physical VoiceOver/TalkBack, large-text/RTL,
real CMS/media, Drive, signed-store and historical-backup scenarios were not run
in this environment. Native build/device evidence already in this directory is
historical evidence for its recorded source, not a fresh validation of this commit.
The existing backup unit regressions pass; this is not a new expert cryptographic
review or proof that every device/service scenario is defect-free.

## Further follow-up on 15 November

- GitHub run [43648690774](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43648690774) completed successfully for commit `74d1d71`: all 37 jobs, including 20 unsigned native compile jobs (16 primary and four auxiliary development), 16 JS bundles and unit checks. This supersedes the earlier lack of fresh native compilation evidence for that commit. It does not establish physical-device acceptance.
- Restrict CMS image schemes to web/relative sources and reject malformed authorities, credentials and control bytes. The shared content loader is not the caregiver photo picker. Tests retain country-relative images and bundled/cache fallbacks.
- Guard missing incremental-sync timestamps during hydration.
- Remove two unreachable, empty cleanup returns in Articles. Real subscription/navigation cleanup remains intact. Regenerate the analytics source inventory for moved lines only.
- Full suite: 507 tests across 59 suites; strict TypeScript passes. ESLint: 447 errors and 2,120 warnings; hook-rule violations remain zero. The two new warnings identify intentional control-byte rejection and a malicious-URL rejection fixture, not execution of scripts. The broader lint backlog is still open.
- The new source changes require their own CI run. No production endpoint list, signed credentials, physical test devices or remote device-testing session is available here. Broad ATS narrowing, signed-store acceptance and complete VoiceOver/TalkBack/large-text/RTL device acceptance remain unverified. No full completion or badge compliance is asserted.

## Remaining application follow-up, 15 November (base `283530b`)

| Area of change | Bug or issue | Detailed change | Files impacted |
| --- | --- | --- | --- |
| Startup network prompts | The optional data-saver preference alert could be scheduled during onboarding, alongside first-download recovery dialogs. A delayed answer could overwrite a preference changed elsewhere. The failed Rerai CI attempt showed a blank screen after cancelling this prompt, but did not establish this as the root cause; its unmodified rerun passed. | Gate this optional prompt until onboarding completes. Cancel the pending timer on navigation/state changes, ignore answers after cleanup and check the latest preference before dispatching an accepted answer. Preserve existing low/high-bandwidth decisions and translated prompt actions. | `app/navigation/AppNavigation.tsx`; new `app/customHooks/useBandwidthPrompt.ts`; new `app/services/__tests__/bandwidthPrompt.test.tsx`. |
| Deferred network work | Network work ran from `useMemo`, whose returned function React never invokes as effect cleanup. Obsolete work could execute after a connection changed or navigation unmounted. Accessing missing cellular details could also throw. | Move scheduling into a dedicated effect with actual cancellation. Depend on network primitives rather than snapshot identity. Keep Android/iOS bandwidth policies, event synchronisation and unresolved-network behaviour; tolerate absent cellular details. Test stale-task cancellation, unmounting, equal fresh snapshots and platform policies. | `app/navigation/AppNavigation.tsx`; new `app/customHooks/useNetworkClassification.ts`; new `app/services/__tests__/networkClassification.test.tsx`. |
| Profile date editing | Mutable birth/prematurity/due-date locals were populated inside a focus callback that captured its initial props. An already-mounted date editor could retain another profile's data, and invalid prematurity JSON could throw. | Read profile fields directly from props and refresh on their primitive values. Accept the existing boolean/string `true` representations without parsing arbitrary JSON. Keep picker ranges, date calculations and parent update callbacks. Test switching profiles and malformed/legacy prematurity inputs. | `app/components/ChildDate.tsx`; new `app/services/__tests__/childDateRefresh.test.tsx`. |
| Milestone related content | Related activity/video data arriving after the card mounted did not refresh its links. Adding the data dependencies to the combined effect would also reset a caregiver's in-progress checkbox selection. Missing optional related-ID arrays could throw. | Separate checkbox initialisation from related-content updates. Refresh content when the source arrays change; guard optional ID arrays. Render-level regressions verify newly available content appears, the checkbox choice survives and Realm save callbacks still run. | `app/components/ChildDevelopmentCollapsibleItem.tsx`; new `app/services/__tests__/milestoneContentRefresh.test.tsx`. |
| Late taxonomy/reference data | Baby headings could retain old gender labels when taxonomy arrived later. Growth-card memos omitted their reference-data alias. Several mount effects omitted stable Redux dispatch. | Add the actual taxonomy/reference inputs and stable dispatch dependencies to the specific affected effects/memos. No global dependency autofix, new clinical thresholds or reset of caregiver forms. | `app/components/{HeaderBabyMenu,HeaderNotiIcon}.tsx`; `app/components/homeScreen/{BabyNotification,ChildInfo}.tsx`; `app/components/growth/{ChartHeightForAge,ChartWeightForHeight}.tsx`; `app/screens/home/ChildProfile.tsx`. |
| Profile list ordering | The profile screen's comparator inspected only its first argument, violating sort ordering and allowing inconsistent active/sibling positions. The resulting list was also recreated on every render. | Reuse the existing `activeChildFirst` helper and memoise by profile list and selected UUID. Move the selected child first without mutating Redux records or changing sibling order. Existing regressions cover every active position, missing/numeric identifiers and frozen inputs. | `app/screens/home/ChildProfile.tsx`; existing `app/services/activeChildOrder.ts` and `__tests__/activeChildOrder.test.ts` supply the tested implementation. |
| Unused application code and review noise | 326 unused-variable lint findings obscured substantive problems. Some unused `Entity` self-assignments in the API import router added runtime statements without selecting any schema. | Remove unused import bindings only after exact development/production Babel output comparison. Preserve argument positions and parameter types, hook calls/order, side-effecting initialisers and the existing settings-update generic API. Remove unreferenced local helpers/types/data; retain all invoked Realm operations, backup readers and error handling. Replace the unused runtime `Entity` local with the existing article type/inferred generic types. A fixed checked-in test fixture compiler has a narrowly scoped lint explanation. | Application components/screens, Redux/service/database helpers and three existing test files. The complete per-file source hashes and import-cleanup mapping are in `evidence/remaining-application-follow-up.json`; this is a cleanup across existing files, not a library upgrade. |
| Country network inventory | A few successful HTTPS probes cannot justify removing ATS exceptions for every country. Runtime API configuration, CMS redirects and supported-device trust results are not present in public source. | Add a reproducible public-source origin inventory for all eight flavours and inspect ten iOS plist policies. Keep source paths and occurrence counts; do not read private environment files or export query values. Add an inventory freshness check to CI. This prepares the country review; it is deliberately not an automatically trusted allowlist. | New `scripts/network-source-inventory.cjs`; new `network-source-inventory.json`; `.github/workflows/review-checks.yml`. |
| Analytics evidence | Removing unused code moves event call locations. | Regenerate source locations; 43 routes, 78 event calls and 46 screen files remain inventoried. No analytics event names or payloads are added or removed in this follow-up. | `analytics-source-inventory.json`. |

Validation: **524 Jest tests in 63 suites**, strict TypeScript, **35 Node tooling
tests**, **30 Python tests**, **96 native vector resources**, flavour mappings,
both generated inventories and **16 release JavaScript bundles** pass. Bundle
results and source hashes are
recorded in [the follow-up evidence](evidence/remaining-application-follow-up.json).
These checks use deliberately fake CI service configuration.

Full lint falls from **447 errors / 2,120 warnings** to **107 errors / 2,074
warnings**. All remaining errors are existing effect-dependency findings, recorded
individually in the evidence file. There are zero reported unused-variable or
rules-of-hooks errors. This is **not a clean full-lint result**: the remaining
lifecycle findings still need individual review; blindly expanding dependency
arrays can reset forms, reschedule notifications or repeat downloads.

Parent commit `283530b` passed all **37 CI jobs on attempt 2** in run
[43668908479](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/43668908479),
including 20 unsigned native compilations (16 primary and four auxiliary), 16
bundles and unit checks. Attempt 1's startup/runner failures are recorded without
assuming a confirmed root cause. New source requires its own CI result, recorded
separately when available.

No libraries, SDK versions, minimum devices, native signing/ABI settings, Realm
schemas or backup envelope formats change in this follow-up. Production country
API/media origins and redirects are still needed before narrowing ATS. Signed
store acceptance, physical accessibility/RTL/large-text checks, live Drive and
production analytics checks remain separate acceptance work; the existing unit
and historical native evidence does not establish those scenarios for this patch.
