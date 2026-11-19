#!/bin/sh
set -eu
# The historical manual command defaulted to Babuni.
export FLAVOR="${FLAVOR:-babuni}"
case "$FLAVOR" in
  bebbo|bebboDev|babuni|foleja|merhabaBebek|wawamor|reraiUmntwana|bebboPacific) ;;
  *) echo 'Unknown iOS bundle flavour' >&2; exit 1 ;;
esac
export ENVFILE="${ENVFILE:-env/.env.$FLAVOR}"
mkdir -p "ios/build/bundles/$FLAVOR"
output=$(mktemp -d "ios/build/bundles/$FLAVOR/release.XXXXXX")
./node_modules/.bin/react-native bundle --entry-file index.js --platform ios --dev false \
  --bundle-output "$output/main.jsbundle" --assets-dest "$output" --sourcemap-output "$output/main.map"
node scripts/check-bundle-flavour.cjs "$FLAVOR" "$output/main.map"
printf '%s\n' "$output"
