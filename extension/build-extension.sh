#!/usr/bin/env bash
# Build the BannerBanner extension package.
#
# Produces dist-extension/ containing ONLY the runtime files the extension
# needs, validates the result (missing required files are fatal), writes a
# package inventory, and — when `zip` is available — an archive plus its
# sha256 for release provenance.
#
# The extension is plain JS; there is no compilation step, so this script does
# each piece of work exactly once. The GitHub Spark web app under src/ is NOT
# part of the extension and is not built here.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/extension"
OUT="$ROOT/dist-extension"
VERSION="$(node -p "JSON.parse(require('fs').readFileSync('$SRC/manifest.json','utf8')).version")"

echo "Building BannerBanner v$VERSION"

rm -rf "$OUT"
mkdir -p "$OUT/lib" "$OUT/icons"

# Runtime files only.
cp "$SRC/manifest.json" "$OUT/"
cp "$SRC/background.js" "$OUT/"
cp "$SRC/content.js" "$OUT/"
cp "$SRC/popup.html" "$SRC/popup.js" "$OUT/"
cp "$SRC/options.html" "$SRC/options.js" "$OUT/"
cp "$SRC"/lib/*.js "$OUT/lib/"
for size in 16 32 48 128; do
  # Missing icons are fatal, not a warning.
  cp "$SRC/icons/icon-$size.png" "$OUT/icons/"
done

# Validate the built package: manifest references, permission contract,
# and strict inventory (no unexpected files).
node "$ROOT/scripts/validate-package.mjs" "$OUT" --strict-inventory

# Inventory for release records.
(cd "$OUT" && find . -type f | sed 's|^\./||' | sort) > "$ROOT/dist-extension-inventory.txt"
echo "Inventory written to dist-extension-inventory.txt"

# Optional archive + hash for provenance (WS-04).
if command -v zip >/dev/null 2>&1; then
  ARCHIVE="$ROOT/bannerbanner-v$VERSION.zip"
  rm -f "$ARCHIVE"
  # Normalize timestamps and archive order so the same package contents produce
  # the same bytes on every build. SOURCE_DATE_EPOCH may override the fixed
  # default when release infrastructure supplies one.
  PACKAGE_EPOCH="${SOURCE_DATE_EPOCH:-946684800}"
  node --input-type=module - "$OUT" "$PACKAGE_EPOCH" <<'NODE'
import { readdirSync, utimesSync } from 'node:fs';
import { join } from 'node:path';

const [, , root, epochValue] = process.argv;
const epoch = Number(epochValue);
if (!Number.isFinite(epoch)) throw new Error('SOURCE_DATE_EPOCH must be numeric');

function normalizeTimes(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) normalizeTimes(path);
    else utimesSync(path, epoch, epoch);
  }
}

normalizeTimes(root);
NODE
  (
    cd "$OUT"
    find . -type f | sed 's|^\./||' | LC_ALL=C sort |
      TZ=UTC zip -X -0 -q "$ARCHIVE" -@
  )
  if command -v sha256sum >/dev/null 2>&1; then
    (cd "$ROOT" && sha256sum "$(basename "$ARCHIVE")") | tee "$ARCHIVE.sha256"
  fi
  echo "Archive: $ARCHIVE"
else
  echo "zip not found — skipping archive (package dir is complete in $OUT)"
fi

echo "Build complete: $OUT"
