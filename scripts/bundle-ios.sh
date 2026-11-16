#!/bin/sh
set -eu
# Called through RN's with-environment.sh, so NODE_BINARY matches Xcode's Node.
"$NODE_BINARY" "$PROJECT_DIR/../scripts/vector-assets.cjs"
"$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"
