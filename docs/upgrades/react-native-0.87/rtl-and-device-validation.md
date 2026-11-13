# RTL, country configuration and device acceptance

The generated [flavour matrix](flavour-matrix.json) checks eight primary app mappings, Android branded source manifests, both iOS Debug/Release bundle IDs/plist paths and shared schemes. It separately inventories two older country-development variants/targets. Regenerate with `python3 scripts/flavour-audit.py`; `--check` detects drift. This validates checked-in configuration relationships, not production environment files or actual Firebase delivery.

| JS flavour | Android variant | iOS scheme | App identifier | Registered UI languages |
| --- | --- | --- | --- | --- |
| bebbo | prod | ParentBuddyApp | org.unicef.ecar.bebbo | 23 registered resource keys, detailed in JSON |
| bebboDev | prodstaging | ParentBuddyAppDev | org.unicef.bebbodev | Same 23-resource registry |
| babuni | bangla | ParentBuddyAppBangla | org.unicef.bangladesh.babuni | Bengali |
| foleja | xk | ParentBuddyAppXk | org.unicef.kosovo.foleja | Albanian, Serbian |
| merhabaBebek | merhababebek | MerhabaBebek | org.unicef.ecar.merhababebek | Turkish |
| wawamor | wawamor | Wawamor | org.unicef.ec.wawamor | Ecuador Spanish, English |
| reraiUmntwana | reraiumntwana | ReraiUmntwana | org.unicef.zw.reraiumntwana | Zimbabwe English, Shona, Ndebele |
| bebboPacific | bebbopacific | BebboPacific | org.unicef.pc.bebbopacific | Fiji English, iTaukei, Samoa English, Samoan |

`xkstaging`/ParentBuddyAppXkDev and `banglastaging`/ParentBuddyAppBanglaDev retain their com.datamatics application identifiers and existing signing/GoogleServices groups. They are source-checked and included in shared iOS flag/scheme tests; they are not included in the primary eight-flavour native compile matrix. No new application IDs, countries, production endpoints or translation packs are invented. The old tvOS scheme is unchanged and untested.

## Confirmed design discrepancies and fixes

- Seven name-field filters stripped combining marks, damaging Arabic/Urdu vowel marks and other languages. Every flavour now preserves Unicode letters/marks/spaces; eight tests execute each actual configured regex.
- Four HTML screens discarded the renderer's WebView source/bridge/layout props. Forwarding them fixes missing embedded content/layout behaviour; real country media/HTML still needs visual checks.
- Shared tab header imported Bebbo typography directly, capped height at 50 points and truncated titles to one line. It now uses the selected flavour's typography, allows two lines and a minimum height. Fix the invalid `padding-verticle` property. A long Arabic/Urdu component fixture verifies no maximum-height cap; native text metrics are not simulated by that test.
- Digit formatting now recognises real ar-EG/ur-PK tags and the existing GRarb/hin/urd aliases; number order, signs and units remain unchanged. Previously only exact short aliases selected those digits.
- Existing reviewed fixes retain explicit leading/centred typography, isolate icon glyph direction, mirror only navigation arrows, preserve chart/media orientation and persist the RTL restart/destination. Ruler/HTML-list behaviour and action-sheet dismissal have regression tests. Do not apply a global row reversal or mirror all pictograms.

## Actual language availability

Arabic `GRarb` files exist but are commented out of the current Bebbo/BebboDev available-language/localisation registries. No registered Urdu pack is present among these eight flavours. `getLanguageDirection` tests real `ar-EG` and `ur-PK` tags, and synthetic names/headings cover those scripts; this is **not** an enabled Arabic/Urdu deployment, verified translation quality or visual acceptance. Do not silently enable an incomplete pack or select another country's CMS taxonomy/content. Country onboarding must provide reviewed UI strings, locale metadata, fonts and endpoint content before end-to-end Arabic/Urdu claims.

## Device matrix to complete

For every relevant enabled language/flavour, use a signed production-like Android build (API 24 minimum, a low-memory 32-bit device if supported, Android 15/16/SDK37 device, and actual 16 KB hardware) and iOS 15.1 plus current iOS, on small/large screens. Existing Android emulator proof is recorded against its exact commits in bug-sweep/extended-review; it does not cover all these combinations.

Traverse all 46 screen files and 43 route declarations in the analytics inventory. For Arabic/Urdu acceptance, first install the actual approved country language pack. Check onboarding/country-language restart, parent/child/pregnancy forms, date pickers, numeric inputs (including Arabic/Persian digits and decimal separators), headers/drawers/back gestures, tabs, search, content lists/HTML/iframes, FAQ bubbles, bookmark/share sheets, profile switcher, growth ruler/chart axes, health/vaccine lists, notification lists, settings, backup pickers/confirmation/errors, terms/privacy/about, and failure/retry modals.

At 1.0, 1.3 and largest supported accessibility font scale, check no clipped labels, obscured actions, overlapping icons, hidden fields behind keyboards or unreachable scroll actions. Use long translations, mixed Latin URLs/email, local digits/dates, multiline names and screen-reader reading order. Navigation arrows should reverse; logos, photos, media controls with intrinsic playback direction, chart chronology and medical values should retain appropriate orientation. Capture labelled screenshots plus app version, OS, device, locale and font scale. Clinical chart correctness must use known measurements, not appearance alone.

The new replacement-confirmation warning has an explicit English fallback and needs approved translations via `backupRestoreReplaceWarning`. This is a known localisation release gap. Source/component checks cannot certify text shaping, keyboard/picker behaviour, RTL gesture direction or screen-reader focus on native devices.

## Configuration and service validation

For each signed archive/APK, inspect the **built** application ID, app name/icon/assets, Firebase Google app/project IDs and production endpoint scheme; compare to the country release configuration. Verify Analytics/Crashlytics arrive in that project's console, with debug mode enabled only for test installations. Confirm iOS archive dSYMs and Android native symbols/mapping are associated with the same app/version; preserve Hermes source maps in private release storage. Test real Drive login/account changes, push/local reminders, deep-link association and country-specific features. The compile fixtures deliberately use a fake project and `example.invalid`, so no compile result can satisfy these service checks.
