# Non-Firebase follow-up: portable protected backups

14 November 2026. Implementation checkpoint; native validation results will be appended when observed. Firebase console/delivery verification is deliberately outside this follow-up.

## Implemented

- All user-facing new local-file/Drive exports use version 3: a user-supplied passphrase, PBKDF2-HMAC-SHA256 (600,000 iterations), independent random 256-bit salt and 128-bit IV, AES-256-CBC with encrypt-then-HMAC authentication and a domain-separated authentication key. The envelope authenticates its version/KDF/work factor/salt/IV/ciphertext. No fallback to the embedded application key is used for new exports. Legacy v2/fixed-IV JSON and binary Realm readers remain.
- Passphrase entry works on both platforms, requires at least 12 characters and confirmation on export, and warns that forgotten passphrases cannot be recovered. Unicode passphrases use NFC normalisation. Passphrases/derived keys are not persisted, logged or put in Redux/navigation. The prompt clears on backgrounding. iOS waits for dialog dismissal before continuing to a provider.
- Portable snapshots preserve all exported child/pregnancy fields and embedded records, milestone/bookmark IDs, original profile dates and identifiers, photo bytes per child, caregiver name/roles, active-child preference, reminder switches and data-saver preference. They do not export downloaded CMS caches, telemetry queues, credentials or OS permissions. Existing country/language selection stays in place; modern snapshots reject another app flavour or country before changing live data. A different UI language within the same country is allowed.
- New photo files are staged under independent generated names. Existing profile images are never overwritten during preparation. Missing/oversized/unsupported photo data fails explicitly rather than silently producing a partial backup. JPEG/PNG headers are checked before decoding, with image dimension and attachment-size bounds. Newly staged orphan files are collected only when unreferenced and no recovery journal needs them.
- A durable journal is written in the existing ConfigSettings schema **before** profile replacement. It records previous and target records/preferences and supports idempotent roll-forward or explicit rollback. Profile replacement remains one user-Realm transaction. Redux preference persistence and the final DataRealm preference/journal transaction must finish before success. A process restart replays recovery before normal navigation; recovery failure exposes retry/keep-previous-data actions and blocks normal app use. Realm versions and schemas are unchanged.
- Onboarding navigation carries an expiring opaque preview handle, rather than records/photo bytes. Preview contents clear on backgrounding. Import remains explicit replacement, with an updated confirmation covering photos and preferences; no merge mode or new-profile analytics is introduced.
- Retained failure logs in the touched import/export paths use the existing privacy-safe diagnostic helper. Only recognised, non-personal failure messages reach the user.

## Bounds and compatibility

Version 3 plaintext is bounded to 32 MiB of UTF-8, each photo to 8 MiB, total photo base64 to 24 MiB, and image dimensions to 4096 per axis / 16 million pixels. JSON/provider copies have a 128 MiB read limit; modern cipher/work-factor metadata is validated before derivation/decryption. Larger/unsupported data reports failure without replacing live profiles or deleting the previous Drive copy. These bounds are not physical low-memory-device certification.

New files require the updated app and their passphrase on the receiving device. Existing files are unchanged and retain their old protection; keep known-good copies until the new backup is tested. There is no password-reset or backend escrow mechanism. Exact clinical/content taxonomy portability between countries is not invented. The existing onboarding form's explicit caregiver details can supersede restored caregiver preferences after import, preserving that flow's current behaviour.

## Checks at implementation checkpoint

- 425 Jest tests / 49 suites pass, including new native-signature-compatible crypto vectors, wrong-passphrase/tamper/KDF-bound cases, photo ownership/path/image-header checks, failed staging, transaction rollback, settings/Redux failure replay, durable rollback direction, repeated recovery, preview lifecycle and secure prompt tests.
- TypeScript regression check passes with 84 inherited diagnostics, down from 86; two false-valued FlatList header/footer props now use undefined. Raw tsc is not yet clean.
- Full native AES/Realm and restart tests are required before sign-off. Prior 18-case native runs predate this writer/journal and must not be presented as proof of version 3.
- New user-facing keys have explicit English fallbacks and require approved country translations, including Arabic/Urdu. No language pack has been enabled by guesswork. Device font/keyboard, real providers/Drive, older real exports, physical low-storage/process-kill and signed in-place upgrade testing remain separate.

Cryptographic work-factor reference: [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Native PBKDF2 uses the existing AES library's UTF-8 password/salt and bit-length API on both platforms; no new native dependency is introduced.
