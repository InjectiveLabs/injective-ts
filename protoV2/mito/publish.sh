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
v=$(npm view @injectivelabs/mito-proto-ts-v2 version 2>/dev/null || echo "")
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

# Use provided version or auto-increment
if [ -n "$1" ]; then
  v1="$1"
  echo "using provided version: $v1"
else
  v1="${v%.*}.$((${v##*.}+1))"
  echo "auto-incremented version: $v1"
fi

# Change to proto-ts directory for publishing
cd "$SCRIPT_DIR/proto-ts" || exit

# Update version in package.json
npm version "$v1" --no-git-tag-version

# Detect prerelease tag (alpha, beta, rc, etc.)
if [[ "$v1" =~ -([a-z]+) ]]; then
  tag="${BASH_REMATCH[1]}"
  echo "publishing prerelease version with tag: $tag"
  npm publish . --tag "$tag"
else
  echo "publishing release version"
  npm publish .
fi
