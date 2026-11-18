#!/bin/sh
set -eu
# Called through RN's with-environment.sh, so NODE_BINARY matches Xcode's Node.
case "$TARGET_NAME" in
  ParentBuddyApp) expected=bebbo ;;
  ParentBuddyAppDev) expected=bebboDev ;;
  ParentBuddyAppBangla) expected=babuni ;;
  ParentBuddyAppBanglaDev) expected=babuni ;;
  ParentBuddyAppXk) expected=foleja ;;
  ParentBuddyAppXkDev) expected=foleja ;;
  BebboPacific) expected=bebboPacific ;;
  Wawamor) expected=wawamor ;;
  ReraiUmntwana) expected=reraiUmntwana ;;
  MerhabaBebek) expected=merhabaBebek ;;
  *) echo "Unknown Bebbo target: $TARGET_NAME" >&2; exit 1 ;;
esac
if [ "${FLAVOR:-$expected}" != "$expected" ]; then
  echo "$TARGET_NAME requires FLAVOR=$expected" >&2
  exit 1
fi
export FLAVOR="$expected"
(cd "$PROJECT_DIR/.." && BUNDLE_PLATFORM=ios "$NODE_BINARY" scripts/vector-assets.cjs)
"$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"
