#!/usr/bin/env bash
set -euo pipefail
: "${ANDROID_APP_ID:?Missing CI application ID}"
: "${RUNNER_TEMP:?Missing temporary directory}"
if [[ "${CI:-}" != "true" ]]; then echo 'Unsigned fixture smoke checks require CI'; exit 1; fi
report="$RUNNER_TEMP/native-smoke"
mkdir -p "$report"
apk=$(python3 -c 'from pathlib import Path; files=sorted(Path("android/app/build/outputs/apk").glob("**/*release*.apk")); assert len(files)==1, files; print(files[0])')
tools="$ANDROID_HOME/build-tools/37.0.0"
keytool -genkeypair -noprompt -keystore "$RUNNER_TEMP/smoke.jks" -alias smoke -storepass android -keypass android -keyalg RSA -validity 1 -dname 'CN=Bebbo CI'
"$tools/apksigner" sign --ks "$RUNNER_TEMP/smoke.jks" --ks-key-alias smoke --ks-pass pass:android --key-pass pass:android --out "$RUNNER_TEMP/smoke.apk" "$apk"
adb install -r "$RUNNER_TEMP/smoke.apk"
adb shell pm grant "$ANDROID_APP_ID" android.permission.POST_NOTIFICATIONS || true
adb logcat -c
adb shell monkey -p "$ANDROID_APP_ID" -c android.intent.category.LAUNCHER 1
sleep 20
pid=$(adb shell pidof "$ANDROID_APP_ID" | tr -d '\r' || true)
adb logcat -d > "$report/logcat.txt"
adb exec-out screencap -p > "$report/startup.png"
adb shell uiautomator dump /sdcard/bebbo-smoke.xml
adb pull /sdcard/bebbo-smoke.xml "$report/startup.xml"
if [[ -z "$pid" ]]; then echo 'App exited during startup'; exit 1; fi
adb logcat -d --pid="$pid" > "$report/app-logcat.txt"
if rg 'FATAL EXCEPTION|Fatal signal|ReactNativeJS.*(TypeError|ReferenceError|RangeError|Invariant Violation)|Unhandled JS Exception' "$report/app-logcat.txt"; then
  echo 'App logged a fatal startup error'; exit 1
fi
printf 'Startup smoke passed: %s (pid %s)\n' "$ANDROID_APP_ID" "$pid"
