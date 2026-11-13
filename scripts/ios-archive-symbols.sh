#!/usr/bin/env bash
# Xcode archive post-action; use the archived app's own Firebase configuration.
set -euo pipefail
if [[ "${CODE_SIGNING_ALLOWED:-YES}" == "NO" ]]; then
  echo 'Skipping Firebase upload for an unsigned verification archive'
  exit 0
fi
: "${ARCHIVE_PATH:?Missing archive path}"
: "${SRCROOT:?Missing iOS project root}"
app_name="${1:?Missing app bundle name}"
plist="$ARCHIVE_PATH/Products/Applications/$app_name/GoogleService-Info.plist"
symbols="$ARCHIVE_PATH/dSYMs"
uploader="$SRCROOT/Pods/FirebaseCrashlytics/upload-symbols"
[[ -f "$plist" && -d "$symbols" && -x "$uploader" ]] || {
  echo 'error: Archive Firebase plist, dSYMs or CocoaPods symbol uploader is missing'; exit 1;
}
project=$(/usr/libexec/PlistBuddy -c 'Print PROJECT_ID' "$plist")
if [[ "$project" == 'bebbo-compile-check' ]]; then
  if [[ "${CI:-false}" == 'true' ]]; then echo 'Skipping fixture symbol upload'; exit 0; fi
  echo 'error: Refusing to upload fixture symbols'; exit 1
fi
"$uploader" -gsp "$plist" -p ios "$symbols"
