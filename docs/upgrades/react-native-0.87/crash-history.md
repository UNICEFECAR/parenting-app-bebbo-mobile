# Available crash history and investigation limits

## Additional read-only inspection — 15 November UTC / 16 November Nairobi

The Firebase Console session is available again for Crashlytics. This supplements
the earlier review; it does not map a deployed version to the final branch or
establish final-build event delivery. Issue state remained unchanged. The views
below filter **open crash issues**, excluding nonfatal/ANR types. Counts are per
issue, not unique totals across apps. The 90-day header displayed 19 August–16
November; dashboard and event timestamps can have different day boundaries.

| App / view | Observation | Disposition |
| --- | --- | --- |
| Rerai Android, selected seven-day crash view | One pointer-index crash / one user in 1.0.1 (5); opened event dated 9 November, Xiaomi Android 15. The dashboard's date label and event timestamp are recorded separately. | Failure is at Android `ScrollView.onTouchEvent`, called by old `ReactScrollView.java:489`. Selected RN 0.87.1 already catches `IllegalArgumentException` around this exact superclass call in both vertical/horizontal Kotlin implementations. No additional custom catch or claimed deployed resolution. Real multi-touch/device acceptance remains. |
| Rerai iOS, 90-day open-crash view | No issues found with the selected filters. Latest displayed release 1.1.0 (1). | Closes the previous inability to load this view; does not prove final-branch crash freedom. The dSYM view showed an uploader, without establishing signed symbol receipt. |
| Merhaba Bebek Android, 90-day open-crash view | `libreactnative.so` loading issue: four events / three users across 1.0.3–1.1.0. | Existing current packaging/split/startup gates address this failure class. Exact affected installed-build/device reproduction and release provenance remain necessary. |
| Merhaba Bebek iOS | App detected; waiting for a first crash. | No delivery or symbolication sign-off is possible from this state. |
| Foleja Production Android, 90-day open-crash view | Missing `libreactnative.so`: three events / three users across 2.4.3–2.5.0; exact-alarm permission exception in the old RNPushNotification helper: one event / one user on 1.2.0. | Current provider is NotifyKit; its native alarm path checks exact-alarm permission and falls back to an inexact alarm, including a scheduling `SecurityException` guard. New 10.10.1 also fixes UI-thread permission requesting. Timing/delivery and historical migration remain device acceptance. |
| Foleja iOS, 90-day open-crash view | No issues found with the selected filters; latest displayed release 2.5.0 (1). | Bounded historical observation only. |
| Foleja Dev Android / iOS | Both selected registrations wait for a first crash. | Does not verify final-development-build delivery. |
| Rerai Umntwana Dev project | Crashlytics displays “Add an app to get started”. | No reviewable Crashlytics app is available in this view. Do not automatically register apps or assume this project is the intended destination of a supported flavour. |
| Rerai Analytics DebugView | The linked Analytics property returns “Missing permissions” for the active account. | Firebase project/Crashlytics visibility does not establish GA4 property access. An Analytics administrator must resolve the property access before live/offline event reconciliation can proceed. No test events or tracking settings were written. |

Remaining acceptance needs the production API/media/CDN origins per flavour,
appropriate Analytics property access, a final-source test installation, authorised
historical backup fixtures, real Drive flows, approved Arabic/Urdu assets and
physical/signed-device checks. A compatible Active Support security release is
still blocked by CocoaPods constraints. Full Apple/C++/OS-binary and backend
assurance remains separate; OSV rejected the direct CocoaPods ecosystem request,
so it was not counted as a clean Apple scan.

## Earlier inspection — 13 November 2026

Read-only Firebase Console review on 13 November 2026, primarily the selected 90-day open-issue view (approximately 16 August–13 November). Counts below are event/affected-user counts shown for particular issues, not mutually exclusive totals. Old deployed versions are represented; these observations are not crashes attributed to the new branch, nor proof of its live delivery. Bebbo Android displayed 25 of 36 issues in the loaded view. No test crash or production console configuration was changed.

| App/platform and observed issue | Events/users where read | Repository disposition and verification |
| --- | --- | --- |
| Bebbo Android missing Hermes library | 271/1 | Native packaging and actual split-install startup checks now cover the upgraded runtime. OEM/old-install reproduction remains; do not claim the historical issue resolved solely because compilation passes. |
| Bebbo Android old RNPushNotification 500-alarm exception | 23/9 | Deprecated provider replaced and old requests migrated. Batch reconciliation preserves 55 automatic reminders with one native read instead of 55. The replacement still uses Android AlarmManager; OS/OEM alarm limits and very large manual-reminder histories need stress testing. No blanket claim of immunity. |
| Bebbo Android Fabric / WebView / missing libreactnative | 12/11; 12/9; 10/4 | Updated framework/native libraries compile and launch in representative tests. Distinct device/provider/lifecycle failures need actual stacks and route reproduction. |
| Bebbo Android DatePicker stack overflow | 6/4 | Current picker version retained after compatibility review. Native picker interaction/locale/background tests remain; no fabricated application-level root cause. |
| Bebbo Android AArch64 code in x86_64 directory | 5/1 | Every packaged native library now has ELF machine/class/endianness checked against its ABI. Current AABs/splits and x86_64 installs pass; add the guard to every real signed release. |
| Bebbo Android missing WebView provider | 4/3 | Device has no usable system provider; compile checks cannot supply one. Verify user-facing recovery on affected devices before adding a library-specific fallback. |
| Rerai Android missing libreactnative | 50/4 | Packaging/startup coverage as above; live old-install/OEM verification remains. |
| Rerai Android taxonomy undefined-object crash | 3/3 | Missing taxonomy groups reproduced. Reducer accepts valid array/keyed groups and omits missing IDs; startup recovers malformed persisted JSON from matching cached/bundled metadata. Unit regressions and actual native restart recovery pass. |
| Rerai Android DatePicker | 2/2 | Native date-picker journey/device reproduction remains. |
| Pacific Android missing libreactnative | 1/1 | Compile/package verification; device acceptance remains. |
| Babuni Android missing libreactnative / libaaudio | 6/4; 4/1 | Native compile/package checks; actual device audio/lifecycle reproduction remains. |
| Wawamor Android missing libreactnative / DatePicker | 15/4; 3/2 | Native compile/package checks; actual affected-device reproduction remains. |
| Bebbo iOS nil NSDictionary key | 15/15 | No actionable app frame in the available view; do not invent a root cause. All archive targets now have symbol-upload coverage; signed receipt/current stacks remain acceptance. |
| Bebbo iOS JSI / styled theme / old FastImage | 6/3; 3/1; 3/3 | Updated native image fork, guarded theme/navigation and current framework compile. No new live crash-free claim; reproduce with symbolicated current builds. |
| Bebbo iOS permission / logging SIGABRT | 1/1 each | Consent/error paths reviewed; actual OS prompt/lifecycle reproduction remains. |

Bebbo iOS showed no active dSYM warnings in the loaded dashboard, with some uploaded symbol rows; that does not validate all future country releases. Pacific/Babuni iOS showed app detection waiting for a first crash, which is not delivery proof. Wawamor iOS had no open issues in that selected view; it is not certified crash-free. Rerai iOS did not finish loading. Türkiye, Kosovo, development apps and final-branch DebugView were not inspected before browser access ended.

Manual nonfatal reports now remove arbitrary payload text and retain a generic error/class/frames. Native/automatic fatal SDK payloads still need privacy review on real releases. Avoid blanket catches that discard failed writes: create/edit/bookmark/delete flows confirm writes, restore uses one user-Realm transaction, and post-commit cleanup is distinguished from rollback. New delete/profile UI journeys still need native interaction acceptance.

Next steps: use each signed flavour's actual GoogleServices configuration; confirm app/version/project and dSYMs/native symbols/Hermes maps; reproduce the listed picker/WebView/audio/background/upgrade scenarios; inspect current symbolicated issues and compare rates using a defined release cohort. A compile fixture cannot establish production routing or resolution of an old issue.


Reminder identity/coalescing remains a device acceptance item: the compatibility layer retains the last-nine-character ID contract, and the automatic generator coalesces matching dates. Verify overlapping child reminders and long histories with colliding identifier tails against the intended family/per-child behaviour. Do not change OS request identities without real legacy pending-request fixtures and a tested replacement/cancellation migration; unit queue counts alone do not settle those semantics.
