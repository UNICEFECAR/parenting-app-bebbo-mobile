# Firebase reporting compatibility and flavour verification

Comparison baselines are working `main` at `f2e1bd44` and the pre-upgrade PR base `Development` at `bb2b4775` (both React Native 0.78.2). The intermediate review branch at `97f494fd` contained an event/property filter. The implementation reviewed here is on `RNSDKUpgrade-review-fixesnew`. The [call and route inventory](analytics-source-inventory.json) gives source locations and argument expressions. It describes what the client requests. Firebase DebugView, production BigQuery rows, Looker Studio queries and historical count parity require separate evidence.

## A. Firebase Analytics

| Area | Working application | Review branch after correction | Verification |
| --- | --- | --- | --- |
| Automatic native screen reporting | Firebase default enabled. Native transitions depend on Activities and UIViewControllers. | Enabled in Firebase configuration and all ten application plists. Advertising controls are independent. | Source, archive assertions |
| Navigation `screen_view` | Ready records the first leaf name silently. A later change of leaf name reports `screen_name` and `screen_class`, both equal to that route name. | Same trigger, names and parameters. Changing only route key or route params emits nothing. Returning from B to A records A again. | Route sequence tests |
| `<route>_opened` | Same name change, via the historical connectivity-aware event path. | One route alias for that change. The offline replay adds `is_offline_event: true`. | SDK boundary and replay tests |
| Advice and game detail opens | Content detail effect emits `advise_details_opened` or `game_details_opened` beside its dynamic category event. | Same names, conditions and payload expressions, including the spelling `advice_catergory_id`. Route-level `DetailsScreen_opened` remains separate. | Compared all six detail-data branches with main |
| Other historical events and parameters | 37 shared constants plus computed names. See inventory below. | All 37 main constant values and all 38 Development values retained. No general event-renaming or parameter-filter helper. Search and tool parameters retain their historical forms. | Source comparison, focused event tests |
| `platform` | On navigation mount, `Android` or `iOS`. | Same. | Source and SDK boundary |
| `distribution_channel` | On the same update, `direct_apk` for that build setting, otherwise `google_play` or `app_store`. | Same. | Source and SDK boundary |
| `distribution_country` | For direct APK builds only, from `BebboDistributionCountry`. Store builds omit it. | Same. Undefined configuration is omitted. As on main, omitting a property does not explicitly clear an existing value. | Source and SDK boundary |
| Other user properties | Country/language selection sets `country` and `language`. Selection/refresh of a child sets `ageid`, `is_premature`, `child_gender`, `relationship_with_child`, `parent_gender`, `auto_child`. | Same call sites and value sources. A future birth date yields `expected`; an available taxonomy yields its string ID. Without a taxonomy object the old update could throw. The corrected code omits ageid and still sends the other available fields. Explicit null still clears a property. | Compared all ten application call sites, exercised SDK wrapper |
| Offline delivery | Events routed through EventSync used Realm offline or when connectivity remained unknown, then replayed on reconnect with the offline marker. Direct SDK events went straight to Firebase. | Preserves those paths, gates local storage on available analytics instance ID, serialises overlapping replays and awaits native acknowledgement before removing rows. Missing local storage falls back to the native SDK. | Reconnect, failure, concurrency and consent tests |
| Advertising/privacy | Historical repository did not specify the new advertising collection defaults. | Retains restrictions on ad storage, ad personalisation, ad user data, advertising identifiers, Apple IDFV and ad-network registration. General analytics storage is not disabled by those switches. These changes can affect acquisition, attribution and vendor/device-based analysis. | Source verified; production attribution impact not verified |

Native screen transitions and React Navigation leaf changes measure different things. Both mechanisms existed on main. The exact number of native transitions depends on platform, presentation and SDK behaviour. Event definitions can remain in existing reports. Filter by screen name/class or event family as before, and reconcile actual counts on a non-debug test release before asserting parity. [Firebase screen measurement](https://firebase.google.com/docs/analytics/screenviews)

### Historical event inventory

| Trigger | Event names | Business parameters |
| --- | --- | --- |
| Navigation change | `screen_view`, `<route>_opened` | Screen name/class on the first event only |
| Terms, skip, import/setup completion | `terms_accepted`, `onboarding_skipped`, `no_of_childsetup_onboarding` | `child_count` on completion, including onboarding import |
| Expected-child flow | `expected_child_entered` | No custom parameter |
| Selecting/viewing categories, opening advice or game detail | `advise_category_selected_<id>`, `game_category_selected_<id>`, `advise_details_opened`, `game_details_opened` | Advice detail: `advise_id`, `advice_catergory_id`. Game detail: `game_id`, `game_category_id`. Source fallback values (including 0) are preserved. |
| Age filters and milestone tracking | `advice_age_group_selected`, `game_age_group_selected`, `child_development_age_group_selected`, `child_milestone_tracked` | `age_id` from the selected filter/record |
| Search | `article_searched`, `activity_searched` | Historical search text under the matching event-name key |
| Share and save | `app_shared`, `advice_shared`, `game_shared`, `favourite_advise_added`, `favourite_game_added` | `advise_id` or `game_id` where applicable. Successful additions count; removing a saved item does not emit an event on main. |
| Growth, vaccination and health check-up entry | `child_measurement_entered`, `child_vaccine_entered`, `child_health_checkup_entered` | `age_id`, plus the original action-specific `measured_at` or `vaccine_id` where supplied |
| Reminder creation and notification switches | `child_vaccine_reminder_set`, `child_health_checkup_reminder_set`, `growth_notification_on/off`, `development_notification_on/off`, `vc_hc_notification_on/off` | Separate on and off events; no new custom parameters |
| FAQ category, subcategory and answer | `chatbot_category_selected_<value>`, `chatbot_subcategory_selected_<value>`, `chatbot_faq_selected` | `faq_Id`, `faq_Subcategory_Id` on answer |
| Feedback, survey, email, donation taps | `feedback_submitted`, `survey_submitted`, `email_sent`, `donate_opened` | Tap before OS handoff. These names do not confirm external completion. |

The branch also includes events from the earlier profile and backup work: `profile_created`, `profile_updated`, `profile_deleted`, `child_added_from_manage_profile`, `backup_export_completed`, and `backup_restore_completed`. They are additional to main. Development already emitted `child_added_from_manage_profile` after a successful, non-expected child creation from Manage Profile. The other five are additional to both baselines. A completed manage-profile creation can contribute to two of those measures. Do not add those series together to count children. The new-path successful-write checks can exclude formerly attempted but failed operations. An online SDK failure used to acquire the offline marker on replay on this branch. New queue rows now record whether the SDK failed. Replaying a previously acknowledged offline row after a process interruption can also affect totals; Firebase acceptance does not establish server ingestion.

## B. Flavour assets

| Instance | Android variant(s), Debug and Release | iOS scheme(s), Debug and Release |
| --- | --- | --- |
| Bebbo | prod | ParentBuddyApp |
| Bebbo Dev | prodstaging | ParentBuddyAppDev |
| Babuni | bangla, banglastaging | ParentBuddyAppBangla, ParentBuddyAppBanglaDev |
| Foleja | xk, xkstaging | ParentBuddyAppXk, ParentBuddyAppXkDev |
| Merhaba Bebek | merhababebek | MerhabaBebek |
| Wawamor | wawamor | Wawamor |
| Rerai Umntwana | reraiumntwana | ReraiUmntwana |
| Bebbo Pacific | bebbopacific | BebboPacific |

On main, the image-generation npm command explicitly selected Bebbo. The intermediate review used shared generated destinations. The corrected branch resolves a separate Metro graph for each flavour and platform and checks its XML/PDF manifest and file hashes. The Android source sets and Xcode resource phases select the corresponding instance directory. Shared Roboto fonts, generic gradient launch artwork and the default icon used by multiple historical targets are intentionally reused; Foleja selects its own icon and Rerai and Pacific select their own branded catalogues. Rerai supplies its own static splash. Per-target animated splashes and localised app strings retain their native mappings.

## C. Corrections

- Restored automatic native screen reporting alongside the historical route pair, restored the offline route for connectivity-aware events and removed extra bookmark-removal events.
- Removed the unintended clearing of a known age group when its taxonomy object is temporarily unavailable.
- Await the instance's native event promise. In the pinned RNFirebase 26.4.1 release the modular convenience function discards that promise, which previously allowed premature acknowledgement of a retry.
- Replaced shared screens' direct imports of Bebbo's styles with the selected instance alias. The one growth-screen layout wrapper missing in other instances now uses the same spacing locally.
- Separated the iOS shared catalogue, default app icon, Foleja icon and shared launch artwork so each target compiles one intended icon and splash. Existing binary artwork is reused.
- Replaced Rerai's inherited Android default and low-density blue splash images with its existing Zimbabwe artwork at the corresponding pixel sizes. The static background behind the launch animation now comes from Rerai at every Android resource density.
- Isolated the manual iOS bundle export by flavour and invocation. CI checks all instance-owned modules in the source map, SVG name collisions, the expected animation bytes and the absence of other known launch animations and identifiable foreign instance paths in Android APK/AAB and iOS application archives.

- Android now validates the bundle flavour in both Debug and Release. Native resources require the same environment as Metro. Omitting ENVFILE defaults the native configuration to the selected instance.
- Every iOS application target now builds its Info.plist from its own template and environment in Xcode's target-specific derived directory. The ten schemes previously overwrote one xcconfig. The unused iOS react-native-config pod also wrote environment data into the shared dependency checkout. The app's JavaScript reads react-native-dotenv, and all five environment substitutions used by native plists are preserved.
- A mocked native-module test now executes the installed RNFirebase JavaScript implementation. The inventory includes user-property setters and the previously missing Home survey event. Connectivity arguments are recorded separately from event parameters.
- The vector command now exits unsuccessfully if Metro or a converter leaves an unresolved operation when Node exits. A zero exit status requires verification of every requested platform. A regression test reproduces this with an unfinished collector.
- Data Realm schema 14 preserves the original payload on a direct SDK retry. Offline and historical rows retain the offline marker. A pre-existing retry from an intermediate review build is indistinguishable from an older offline row and keeps the historical treatment.

## D. Verification limits

[The native verification run for 7a711e2d](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/44493932358) passed all 16 release JavaScript bundle checks, all ten Android APK/AAB package checks, and all ten unsigned iOS archive checks. Android emulator startup also passed for Bebbo, Bebbo Dev and Rerai Umntwana. The later asset-command exit guard was exercised locally on all 16 flavour/platform combinations. The native fixture builds do not verify live analytics or production signing.

For commit `7a711e2d`, all ten downloaded Android release bundles matched the SHA-256 digests GitHub recorded for their artifact ZIPs. Across those AABs, 5,821 packaged entries matched original asset bytes belonging to the selected instance or shared files. None matched exclusively foreign sources. All ten contained the expected Roboto and Fontello fonts. Image recompression can change the source bytes, so the hash check complements the compiled resource and artwork checks.

From empty output directories, the verifier regenerated each of the eight instances for both platforms. Each of the 16 manifests and its generated files matched the checked-in bytes, and the seven other instances remained unchanged after each regeneration. Each graph resolved 22 distinct referenced SVGs.

All 16 Android/iOS JavaScript release bundle jobs passed in [the audit run](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/44489433116). The unsigned iOS archives for Bebbo, Bebbo Dev and Babuni development also passed their packaged checks in that run. Two Android jobs stopped during dependency resolution and a subsequent branch push cancelled the unfinished jobs.

Pixel inspection of the actual Rerai AAB from [the earlier native matrix](https://github.com/UNICEFECAR/parenting-app-bebbo-mobile/actions/runs/44464181234) confirmed the shared blue Android launch background in its default and low-density entries. After the two overrides were added, Android SDK 37's AAPT2 was used to compile and link the selected resources for all ten variants. The decoded launch backgrounds and launcher icons matched their selected source artwork in all 170 bitmap configurations. All 22 generated vector names and the expected launch animation matched in each package. These resource-only packages do not exercise Gradle's complete release build. CI additionally compares the two final Rerai AAB fallbacks against its packaged same-size branded images.

The source map verifies JavaScript, configuration, local content, translations and asset modules. The package checks inspect generated vector names, identifiable instance-owned file paths and the specific launch payload. A successful build alone does not prove every pixel is correct. An unsigned Xcode archive contains a compiled application and Assets.car; its inspection is distinct from an App Store IPA. Synthetic release configurations also do not establish that production signing or Firebase routing is correct.

## E. Decisions for the programme

The historical payloads include raw search text and selected child-profile dimensions. Both were already restored on this review branch before this comparison. Changing them would affect reporting and deserves an explicit programme decision. Additional profile/backup event families, dynamic category names subject to Firebase naming limits, and the impact of restricted advertising identifiers on attribution are similarly separate from this compatibility fix. No changes to live GA4 definitions, BigQuery or Looker Studio were made.
