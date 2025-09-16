#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm executable not found in PATH." >&2
  echo "Install Node.js to run the test task." >&2
  exit 1
fi

if [[ ! -f package.json ]]; then
  echo "Error: package.json not found in $ROOT_DIR." >&2
  echo "This project is expected to provide npm scripts for running tests." >&2
  exit 1
fi

if ! python - "$ROOT_DIR/package.json" <<'PY' >/dev/null; then
import json
import sys
with open(sys.argv[1], 'r', encoding='utf-8') as handle:
    data = json.load(handle)
if 'scripts' not in data or 'test' not in data['scripts']:
    raise SystemExit(1)
PY
  echo "Error: package.json does not define an npm 'test' script." >&2
  exit 1
fi

npm test
