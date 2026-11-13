#!/usr/bin/env bash
set -euo pipefail
: "${ANDROID_APP_ID:?Missing CI application ID}"
: "${RUNNER_TEMP:?Missing temporary directory}"
if [[ "${CI:-}" != "true" ]]; then echo 'Unsigned fixture smoke checks require CI'; exit 1; fi
for required in java keytool adb python3 grep; do
  command -v "$required" >/dev/null || { echo "Missing smoke-test dependency: $required"; exit 1; }
done
report="$RUNNER_TEMP/native-smoke"
mkdir -p "$report"
: "${BUNDLETOOL_JAR:?Missing pinned bundletool}"
bundle=$(python3 -c 'from pathlib import Path; files=list(Path("android/app/build/outputs/bundle").glob("**/*.aab")); assert len(files)==1, files; print(files[0])')
serial=$(adb get-serialno | tr -d '\r')
keytool -genkeypair -noprompt -keystore "$RUNNER_TEMP/smoke.jks" -alias smoke -storepass android -keypass android -keyalg RSA -validity 1 -dname 'CN=Bebbo CI'
java -jar "$BUNDLETOOL_JAR" get-device-spec --device-id="$serial" --output="$report/device-spec.json"
java -jar "$BUNDLETOOL_JAR" build-apks --bundle="$bundle" --output="$RUNNER_TEMP/smoke.apks" \
  --device-spec="$report/device-spec.json" --ks="$RUNNER_TEMP/smoke.jks" --ks-key-alias=smoke \
  --ks-pass=pass:android --key-pass=pass:android
python3 scripts/check-android-splits.py "$RUNNER_TEMP/smoke.apks" "$report/split-packaging.json"
java -jar "$BUNDLETOOL_JAR" install-apks --apks="$RUNNER_TEMP/smoke.apks" --device-id="$serial"
adb shell pm grant "$ANDROID_APP_ID" android.permission.POST_NOTIFICATIONS || true
capture_state() {
  local stage="$1"
  adb shell uiautomator dump /sdcard/bebbo-smoke.xml
  adb pull /sdcard/bebbo-smoke.xml "$report/$stage.xml"
  adb exec-out screencap -p > "$report/$stage.png"
}
tap_label() {
  local tree="$1" label="$2" point x y
  if point=$(python3 - "$tree" "$label" <<'PYCODE'
import re, sys, xml.etree.ElementTree as ET
root = ET.parse(sys.argv[1]).getroot()
for node in root.iter('node'):
    if node.attrib.get('text', '').casefold() == sys.argv[2].casefold() and node.attrib.get('clickable') == 'true':
        bounds = [int(x) for x in re.findall(r'\d+', node.attrib['bounds'])]
        if len(bounds) == 4:
            print((bounds[0] + bounds[2]) // 2, (bounds[1] + bounds[3]) // 2)
            sys.exit(0)
sys.exit(1)
PYCODE
  ); then
    read -r x y <<< "$point"
    adb shell input tap "$x" "$y"
    return 0
  fi
  return 1
}
adb logcat -c
adb shell monkey -p "$ANDROID_APP_ID" -c android.intent.category.LAUNCHER 1
sleep 20
capture_state startup
# The deliberately invalid API fixture exercises the initial download failure.
# Also exercise its existing cancel/confirmation path to the bundled fallback.
if grep -Eqi 'not all content' "$report/startup.xml"; then
  tap_label "$report/startup.xml" CANCEL || { echo 'Download cancellation button missing'; exit 1; }
  sleep 2
  capture_state cancel-confirmation
  tap_label "$report/cancel-confirmation.xml" OK || { echo 'Cancellation confirmation button missing'; exit 1; }
  sleep 5
  capture_state after-cancel
  python3 - "$report/after-cancel.xml" "$ANDROID_APP_ID" <<'PYCODE'
import sys, xml.etree.ElementTree as ET
root = ET.parse(sys.argv[1]).getroot()
labels = [node.get('text') or node.get('content-desc') for node in root.iter('node')
          if node.get('package') == sys.argv[2] and (node.get('text') or node.get('content-desc'))]
if not labels:
    raise SystemExit('Download cancellation left a blank application screen')
print('Visible application content after cancellation:', labels)
PYCODE
fi
pid=$(adb shell pidof "$ANDROID_APP_ID" | tr -d '\r' || true)
adb logcat -d > "$report/logcat.txt"
if [[ -z "$pid" ]]; then echo 'App exited during startup or download cancellation'; exit 1; fi
adb logcat -d --pid="$pid" > "$report/app-logcat.txt"
if grep -E 'FATAL EXCEPTION|Fatal signal|ReactNativeJS.*(TypeError|ReferenceError|RangeError|Invariant Violation)|Unhandled JS Exception' "$report/app-logcat.txt"; then
  echo 'App logged a fatal startup error'; exit 1
fi
if grep -E 'text="[^"]*(TypeError:|ReferenceError:|RangeError:|SyntaxError:|Invariant Violation)' "$report"/*.xml; then
  echo 'App displayed a JavaScript error'; exit 1
fi
printf 'Startup smoke passed: %s (pid %s)\n' "$ANDROID_APP_ID" "$pid"
