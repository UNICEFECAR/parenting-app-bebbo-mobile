# Available crash history and investigation limits

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
