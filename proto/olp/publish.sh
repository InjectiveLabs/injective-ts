#!/usr/bin/env bash

# DEPRECATION WARNING
echo "❌ ERROR: This script is deprecated, use protoV2/olp/publish.sh instead" >&2
exit 1

cd ./proto/olp
cd ./proto-ts || exit

v=$(npm view @injectivelabs/olp-proto-ts version)
echo "current package version: $v"

v1="${v%.*}.$((${v##*.}+1))"
echo "new package version: $v1"

npm version $v1
npm publish
