#!/usr/bin/env bash
# Scan newly introduced commits; the separate historical audit remains evidence,
# not an allowlist that could hide a changed credential at an old line number.
set -euo pipefail
base=${GITLEAKS_BASE:-$(git rev-parse HEAD^)}
if [[ ! "$base" =~ ^[0-9a-f]{40}$ || "$base" == 0000000000000000000000000000000000000000 ]]; then
  echo 'A valid previous/base commit is required for the secret scan.' >&2
  exit 2
fi
git cat-file -e "${base}^{commit}"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
binary=${GITLEAKS_BIN:-}
if [[ -z "$binary" ]]; then
  archive="$work/gitleaks.tar.gz"
  curl --fail --location --silent --show-error --retry 2 --max-time 60 \
    'https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz' -o "$archive"
  printf '%s  %s\n' '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb' "$archive" | sha256sum --check
  tar -xzf "$archive" -C "$work" gitleaks
  binary="$work/gitleaks"
fi
[[ "$("$binary" version)" == 8.30.1 ]] || { echo 'Unexpected Gitleaks version' >&2; exit 2; }
if [[ "${GITLEAKS_SELF_TEST:-}" == true ]]; then
  python3 "$(dirname "$0")/secret-scan-regression.py" "$binary"
fi
# Never expose matched values in CI logs. No historical/broad path suppressions.
"$binary" git --redact=100 --no-banner --log-opts="${base}..HEAD" .
