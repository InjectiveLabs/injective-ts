ROOT_DIR=./proto/abacus
BUILD_DIR=$ROOT_DIR/gen
PROTO_DIR=$ROOT_DIR/proto
TS_OUTPUT_DIR=$ROOT_DIR/proto-ts
TS_STUB_DIR=$ROOT_DIR/stub
abacus_branch=main

# remove old gen
rm -rf $BUILD_DIR
rm -rf $TS_OUTPUT_DIR
rm -rf $PROTO_DIR

########################################
######## TS PROTO GENERATION ###########
########################################
echo "Generating TS proto code..."

# make dirs
mkdir -p $BUILD_DIR
mkdir -p $TS_OUTPUT_DIR
mkdir -p $PROTO_DIR
mkdir -p $PROTO_DIR/danielvladco
mkdir -p $PROTO_DIR/danielvladco/protobuf
mkdir -p $TS_OUTPUT_DIR/proto
mkdir -p $TS_OUTPUT_DIR/esm
mkdir -p $TS_OUTPUT_DIR/cjs

## Clone current proto definitions from core
git clone https://github.com/InjectiveLabs/injective-abacus.git $BUILD_DIR -b $abacus_branch --depth 1 --single-branch > /dev/null

# collecting proto files
find $BUILD_DIR/api/gen/grpc/points_svc/pb -name '*.proto' -exec cp {} $PROTO_DIR \;

# copy imports
cp $TS_STUB_DIR/graphql.stub.proto $PROTO_DIR/danielvladco/protobuf/graphql.proto

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

find $TS_OUTPUT_DIR/proto -name "*.js" -type f -delete
find $TS_OUTPUT_DIR/proto -name "*.d.ts" -type f -delete

########################################
####### POST GENERATION CLEANUP #######
########################################

echo "Compiling npm packages..."

## 1. Replace strings
## 1. Replace packages
search1="@improbable-eng/grpc-web"
replace1="@injectivelabs/grpc-web"

FILES=$( find $TS_OUTPUT_DIR/proto -type f )

for file in $FILES
do
  sed -ie "s/${search1//\//\\/}/${replace1//\//\\/}/g" "$file"
done

search1="getExtension():"
replace1="// @ts-ignore \n  getExtension():"
search2="setExtension("
replace2="// @ts-ignore \n  setExtension("

FILES=$( find $TS_OUTPUT_DIR/proto -type f -name '*.d.ts' )

for file in $FILES
do
  sed -ie "s/${search1//\//\\/}/${replace1//\//\\/}/g" "$file"
  sed -ie "s/${search2//\//\\/}/${replace2//\//\\/}/g" "$file"
done

search3="protobufjs/minimal"
replace3="protobufjs/minimal.js"

FILES=$( find $TS_OUTPUT_DIR/proto -type f )

for file in $FILES
do
  sed -ie "s/${search3//\//\\/}/${replace3//\//\\/}/g" "$file"
done

## 4. Compile TypeScript for ESM package
cp $TS_STUB_DIR/index.ts.template $TS_OUTPUT_DIR/proto/index.ts

### ESM
cp $TS_STUB_DIR/package.json.esm.template $TS_OUTPUT_DIR/proto/package.json
cp $TS_STUB_DIR/tsconfig.json.esm.template $TS_OUTPUT_DIR/proto/tsconfig.json
npm --prefix $TS_OUTPUT_DIR/proto install
npm --prefix $TS_OUTPUT_DIR/proto run gen
cp $TS_STUB_DIR/package.json.esm.template $TS_OUTPUT_DIR/esm/package.json

### CJS
cp $TS_STUB_DIR/package.json.cjs.template $TS_OUTPUT_DIR/proto/package.json
cp $TS_STUB_DIR/tsconfig.json.cjs.template $TS_OUTPUT_DIR/proto/tsconfig.json
npm --prefix $TS_OUTPUT_DIR/proto install
npm --prefix $TS_OUTPUT_DIR/proto run gen
cp $TS_STUB_DIR/package.json.cjs.template $TS_OUTPUT_DIR/cjs/package.json

## 5. Setup proper package.json for abacus-proto-ts packages
cp $TS_STUB_DIR/package.json.abacus-proto-ts.template $TS_OUTPUT_DIR/package.json

## 6. ESM import fixes
npm --prefix $ROOT_DIR run tscEsmFix

# 7. Clean up folders
rm -rf $BUILD_DIR
rm -rf $PROTO_DIR
rm -rf $TS_OUTPUT_DIR/proto
find $TS_OUTPUT_DIR -name "*.jse" -type f -delete
find $TS_OUTPUT_DIR -name "*.tse" -type f -delete
find $TS_OUTPUT_DIR -name "*.jsone" -type f -delete
