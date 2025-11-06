#!/bin/bash

# Exit on error
set -e

# Source shared generation functions
source ../_scripts/generate-exports.sh

# Ensure we start with a clean slate
rm -rf proto/gen
rm -rf proto/proto
rm -rf src/generated

# Create output directories if they don't exist
mkdir -p proto/gen
mkdir -p proto/proto
mkdir -p src/generated

ROOT_DIR="./proto"
PROTO_DIR="./proto/proto"
BUILD_DIR="./proto/gen"

olp_indexer_branch=dev

## Clone current proto definitions from core
git clone https://github.com/InjectiveLabs/injective-dmm-be.git $BUILD_DIR -b $olp_indexer_branch --depth 1 --single-branch > /dev/null

# collecting indexer proto files
find $ROOT_DIR/gen/api/proto -type f -name "*.proto" -exec cp {} $PROTO_DIR/ \;

proto_dirs=$(find $PROTO_DIR -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)
echo "proto_dirs: $proto_dirs"

# Path to the proto files
PROTO_DIR="./proto/proto"

# Output directory for generated files
OUT_DIR="./src/generated"

# Find all proto files
PROTO_FILES=$(find ${PROTO_DIR} -name "*.proto" -type f)

# Generate TypeScript code for each proto file
for proto_file in ${PROTO_FILES}; do
  echo "Generating TypeScript code for ${proto_file}"
  
  # Extract the filename without extension
  filename=$(basename -- "$proto_file")
  filename_no_ext="${filename%.*}"
  
  ./node_modules/.bin/protoc \
    --proto_path=${PROTO_DIR} \
    --ts_out=${OUT_DIR} \
    --ts_opt=add_pb_suffix \
    ${proto_file}
    
  echo "Generated files for ${filename_no_ext}"
done
echo "All gRPC-Web TypeScript client code generated successfully!" 

# @protobuf-ts generates TypeScript files directly
echo "TypeScript files generated successfully with @protobuf-ts"

# Copy index template
echo "Copying index.template.ts to index.ts..."
cp ./src/index.template.ts ./src/index.ts

echo "Index file created successfully!"

echo "Cleaning up temporary files..."
rm -rf proto/gen
rm -rf proto/proto

echo "Building TypeScript to ESM..."
npm run build

echo ""
echo "✅ Generation complete!"
echo "📦 Generated files: src/generated/"
echo "📦 Built files: proto-ts/esm/"
