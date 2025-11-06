#!/usr/bin/env bash

cd ./protoV2/indexer/proto-ts

v=$(npm view @injectivelabs/indexer-proto-ts-v2 version)
echo "current package version: $v"

v1="${v%.*}.$((${v##*.}+1))"
echo "new package version: $v1"

npm version $v1
npm publish
