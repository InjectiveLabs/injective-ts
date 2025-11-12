#!/usr/bin/env bash

# DEPRECATION WARNING
echo "❌ ERROR: This script is deprecated, use protoV2/indexer/publish.sh instead" >&2
exit 1

cd ./proto/indexer
cd ./proto-ts || exit

v=$(npm view @injectivelabs/indexer-proto-ts version)
echo "current package version: $v"

v1="${v%.*}.$((${v##*.}+1))"
echo "new package version: $v1"

npm version $v1
npm publish
