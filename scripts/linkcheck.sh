#!/usr/bin/env bash
# Checks every external link on the built pages with curl.
# Run after "pnpm build". Exits non-zero if any link is dead.
set -euo pipefail

cd "$(dirname "$0")/.."

FILES="dist/index.html dist/en/index.html dist/impressum/index.html dist/datenschutz/index.html dist/404.html"

URLS=$(grep -hoE 'href="https://[^"]+"' $FILES \
  | sed -E 's/^href="//; s/"$//' \
  | grep -v '^https://eckstein\.io' \
  | sort -u)

if [ -z "$URLS" ]; then
  echo "No external links found, something is wrong with the build."
  exit 1
fi

FAIL=0
for url in $URLS; do
  if curl -sSfI -L --max-time 30 --retry 2 \
    -A "Mozilla/5.0 (compatible; eckstein.io linkcheck)" \
    -o /dev/null "$url"; then
    echo "OK   $url"
  else
    echo "FAIL $url"
    FAIL=1
  fi
done

exit $FAIL
