#!/usr/bin/env bash

cd ./proto/indexer
cd ./proto-ts || exit

v=$(npm view @injectivelabs/indexer-proto-ts version)
echo "current package version: $v"

v1="${v%.*}.$((${v##*.}+1))"
echo "new package version: $v1"

npm version $v1
npm publish
