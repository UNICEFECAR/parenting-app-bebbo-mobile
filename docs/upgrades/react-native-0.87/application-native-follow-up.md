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
