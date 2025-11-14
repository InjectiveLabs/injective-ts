#!/usr/bin/env bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to script directory
cd "$SCRIPT_DIR" || exit

# Ensure package.json exists (copy from template if needed)
if [ ! -f "./proto-ts/package.json" ]; then
  echo "package.json not found, copying from template..."
  cp ./package.json.template ./proto-ts/package.json
fi

# Get current version - prioritize npm, then local package.json, then template
v=$(npm view @injectivelabs/abacus-proto-ts-v2 version 2>/dev/null || echo "")
if [ -n "$v" ]; then
  echo "current package version (from npm): $v"
else
  # Try local package.json
  if [ -f "./proto-ts/package.json" ]; then
    v=$(grep -o '"version": *"[^"]*"' ./proto-ts/package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')
    echo "current package version (from local): $v"
  else
    # Fall back to template version
    v=$(grep -o '"version": *"[^"]*"' ./package.json.template | sed 's/.*"version": *"\([^"]*\)".*/\1/')
    echo "current package version (from template): $v"
  fi
fi

v1="${v%.*}.$((${v##*.}+1))"
echo "new package version: $v1"

# Change to proto-ts directory for publishing
cd "$SCRIPT_DIR/proto-ts" || exit

npm version $v1
npm publish .
