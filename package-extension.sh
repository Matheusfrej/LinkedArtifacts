#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$SCRIPT_DIR/manifest.json" ]]; then
  EXT_DIR="$SCRIPT_DIR"
else
  EXT_DIR="$SCRIPT_DIR/extension"
fi
OUT_DIR="$EXT_DIR/dist"
ZIP_NAME="${1:-linked-artifacts-extension.zip}"
ZIP_PATH="$OUT_DIR/$ZIP_NAME"

mkdir -p "$OUT_DIR"

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

shopt -s dotglob
for item in "$EXT_DIR"/*; do
  name="$(basename "$item")"
  case "$name" in
    dist|.gitignore)
      continue
      ;;
  esac
  cp -R "$item" "$TMP_DIR/"
done

find "$TMP_DIR" -type f \( -name "*.DS_Store" -o -name "*.swp" -o -name "*.tmp" \) -delete

(
  cd "$TMP_DIR"
  zip -rq "$ZIP_PATH" .
)

printf 'Created extension package: %s\n' "$ZIP_PATH"
