ROOT_DIR=./proto/indexer
BUILD_DIR=$ROOT_DIR/gen
PROTO_DIR=$ROOT_DIR/proto
TS_OUTPUT_DIR=$ROOT_DIR/proto-ts
TS_STUB_DIR=$ROOT_DIR/stub
injective_indexer_branch=v1.13.41

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
mkdir -p $TS_OUTPUT_DIR/proto
mkdir -p $TS_OUTPUT_DIR/esm
mkdir -p $TS_OUTPUT_DIR/cjs

## Clone current proto definitions from core
git clone https://github.com/InjectiveLabs/injective-indexer.git $BUILD_DIR -b $injective_indexer_branch --depth 1 --single-branch > /dev/null

# collecting proto files
find $BUILD_DIR/api/gen/grpc -name '*.proto' -exec cp {} $PROTO_DIR \;

proto_dirs=$(find $PROTO_DIR -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)

# Rename all files to remove goadesign_goagen_ prefix.
# This is a patch to fix the script as the new goagen version that was introduced
# in the go.mod file generates files with a different prefix.
for file in $proto_dirs/goadesign_goagen_*.proto; do
    new_file=$(basename "$file" | sed 's/^goadesign_goagen_//')
    mv "$file" "$proto_dirs/$new_file"
done

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

## 1. Replace package with our own fork
search1="@improbable-eng/grpc-web"
replace1="@injectivelabs/grpc-web"

FILES=$( find $TS_OUTPUT_DIR/proto -type f )

for file in $FILES
do
	sed -ie "s/${search1//\//\\/}/${replace1//\//\\/}/g" $file
done

## 2. Replace extension type to ignore on compile time
search1="getExtension():"
replace1="// @ts-ignore \n  getExtension():"
search2="setExtension("
replace2="// @ts-ignore \n  setExtension("

FILES=$( find $TS_OUTPUT_DIR/proto -type f -name '*.d.ts' )

for file in $FILES
do
	sed -ie "s/${search1//\//\\/}/${replace1//\//\\/}/g" $file
  sed -ie "s/${search2//\//\\/}/${replace2//\//\\/}/g" $file
done


## 3. Compile TypeScript for ESM package
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

## 4. Setup proper package.json for both indexer-api and indexer-proto-ts packages
cp $TS_STUB_DIR/package.json.indexer-proto-ts.template $TS_OUTPUT_DIR/package.json

# 5. Clean up folders
rm -rf $BUILD_DIR
rm -rf $PROTO_DIR
rm -rf $TS_OUTPUT_DIR/proto
find $TS_OUTPUT_DIR -name "*.jse" -type f -delete
find $TS_OUTPUT_DIR -name "*.tse" -type f -delete
find $TS_OUTPUT_DIR -name "*.jsone" -type f -delete
