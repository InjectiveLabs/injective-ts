#!/usr/bin/env bash
set -eo pipefail

ROOT_DIR=./proto/core
BUILD_DIR=$ROOT_DIR/gen
PROTO_DIR=$ROOT_DIR/proto
TS_OUTPUT_DIR=$ROOT_DIR/proto-ts
TS_STUB_DIR=$ROOT_DIR/stub

# remote branches/tags
injective_core_branch=dev
cosmos_sdk_branch=v0.50.x-inj
wasmd_branch=v0.50.x-inj
ibc_go_branch=v8.3.2

# remove old gen
rm -rf $BUILD_DIR
rm -rf $PROTO_DIR
rm -rf $TS_OUTPUT_DIR

########################################
######## TS PROTO GENERATION ###########
########################################
echo "Generating TS proto code..."

## Remove/setup old build dir
mkdir -p $BUILD_DIR
mkdir -p $PROTO_DIR
mkdir -p $PROTO_DIR/proto
mkdir -p $TS_OUTPUT_DIR
mkdir -p $TS_OUTPUT_DIR/cjs
mkdir -p $TS_OUTPUT_DIR/esm
mkdir -p $TS_OUTPUT_DIR/proto

########################################
###### REMOTE PROTO DEFINITIONS ########
########################################

## Clone current proto definitions from core
git clone https://github.com/InjectiveLabs/injective-core.git $BUILD_DIR/injective-core -b $injective_core_branch --depth 1 --single-branch > /dev/null
cp -r $BUILD_DIR/injective-core/proto/injective $PROTO_DIR

## Third Party proto definitions
git clone https://github.com/InjectiveLabs/cosmos-sdk.git $BUILD_DIR/cosmos-sdk -b $cosmos_sdk_branch --depth 1 --single-branch > /dev/null
git clone https://github.com/InjectiveLabs/wasmd $BUILD_DIR/wasmd -b $wasmd_branch --depth 1 --single-branch > /dev/null
git clone https://github.com/InjectiveLabs/ibc-go $BUILD_DIR/ibc-go -b $ibc_go_branch --depth 1 --single-branch > /dev/null

buf export $BUILD_DIR/cosmos-sdk --output=$PROTO_DIR
buf export $BUILD_DIR/wasmd --exclude-imports --output=$PROTO_DIR
buf export $BUILD_DIR/ibc-go --exclude-imports --output=$PROTO_DIR
buf export https://github.com/cosmos/gogoproto.git --exclude-imports --output=$PROTO_DIR
buf export https://github.com/cometbft/cometbft.git --exclude-imports --output=$PROTO_DIR
buf export https://github.com/cosmos/ics23.git --exclude-imports --output=$PROTO_DIR
buf export https://github.com/cosmos/ibc-apps.git --exclude-imports --output=$PROTO_DIR --path=middleware/packet-forward-middleware/proto/packetforward/v1

# generate TS proto
proto_dirs=$(find $PROTO_DIR -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)

# gen using ts-proto
npm --prefix $ROOT_DIR install
for dir in $proto_dirs; do
    protoc \
    --plugin="$ROOT_DIR/node_modules/.bin/protoc-gen-ts_proto" \
    --ts_proto_opt="esModuleInterop=true" \
    --ts_proto_opt="forceLong=string" \
    --ts_proto_opt="env=both" \
    --ts_proto_opt="useExactTypes=false" \
    --ts_proto_opt="outputClientImpl=grpc-web" \
    --ts_proto_out="$TS_OUTPUT_DIR/proto" \
    -I "$PROTO_DIR" \
    $(find "${dir}" -maxdepth 1 -name '*.proto')
done


#######################################
###### NPM PACKAGES GENERATION #######
#######################################

echo "Compiling npm packages..."

## 1. Replace packages
search1="@improbable-eng/grpc-web"
replace1="@injectivelabs/grpc-web"

FILES=$( find $TS_OUTPUT_DIR -type f )

for file in $FILES
do
  sed -ie "s/${search1//\//\\/}/${replace1//\//\\/}/g" "$file"
done

search1="getExtension():"
replace1="// @ts-ignore \n  getExtension():"
search2="setExtension("
replace2="// @ts-ignore \n  setExtension("

FILES=$( find $TS_OUTPUT_DIR -type f -name '*.d.ts' )

for file in $FILES
do
  sed -ie "s/${search1//\//\\/}/${replace1//\//\\/}/g" "$file"
  sed -ie "s/${search2//\//\\/}/${replace2//\//\\/}/g" "$file"
done

search3="protobufjs/minimal"
replace3="protobufjs/minimal.js"

FILES=$( find $TS_OUTPUT_DIR -type f )

for file in $FILES
do
  sed -ie "s/${search3//\//\\/}/${replace3//\//\\/}/g" "$file"
done

ESM_PKG_TEMPLATE=$TS_STUB_DIR/package.json.esm.template
ESM_CFG_TEMPLATE=$TS_STUB_DIR/tsconfig.json.esm.template
CJS_PKG_TEMPLATE=$TS_STUB_DIR/package.json.cjs.template
CJS_CFG_TEMPLATE=$TS_STUB_DIR/tsconfig.json.cjs.template

## 3. Compile TypeScript for ESM package
cp $TS_STUB_DIR/index.ts.template $TS_OUTPUT_DIR/proto/index.ts

### ESM
cp $ESM_PKG_TEMPLATE $TS_OUTPUT_DIR/proto/package.json
cp $ESM_CFG_TEMPLATE $TS_OUTPUT_DIR/proto/tsconfig.json
npm --prefix $TS_OUTPUT_DIR/proto install
npm --prefix $TS_OUTPUT_DIR/proto run gen
cp $ESM_PKG_TEMPLATE $TS_OUTPUT_DIR/esm/package.json

## CJS
cp $CJS_PKG_TEMPLATE $TS_OUTPUT_DIR/proto/package.json
cp $CJS_CFG_TEMPLATE $TS_OUTPUT_DIR/proto/tsconfig.json
npm --prefix $TS_OUTPUT_DIR/proto install
npm --prefix $TS_OUTPUT_DIR/proto run gen
cp $CJS_PKG_TEMPLATE $TS_OUTPUT_DIR/cjs/package.json

## 4. Setup proper package.json for core-proto-ts packages
cp $TS_STUB_DIR/package.json.core-proto-ts.template $TS_OUTPUT_DIR/package.json

## 5. ESM import fixes
npm --prefix $ROOT_DIR run tscEsmFix

# 6. Clean up folders
rm -rf $BUILD_DIR
rm -rf $PROTO_DIR
rm -rf $TS_OUTPUT_DIR/proto
find $TS_OUTPUT_DIR -name "*.jse" -type f -delete
find $TS_OUTPUT_DIR -name "*.tse" -type f -delete
find $TS_OUTPUT_DIR -name "*.jsone" -type f -delete

echo "Done!"
