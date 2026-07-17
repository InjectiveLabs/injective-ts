#!/bin/bash

# Exit on error
set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to script directory to ensure relative paths work
cd "$SCRIPT_DIR"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/protoc" ]; then
  echo "📥 Installing dependencies..."
  npm install || pnpm install || {
    echo "❌ Failed to install dependencies"
    exit 1
  }
fi

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

platform_services_branch=master

## Clone current proto definitions from platform-services
git clone https://github.com/InjectiveLabs/platform-services.git $BUILD_DIR/platform-services -b $platform_services_branch --depth 1 --single-branch > /dev/null

# Collecting platform-services proto files
if [ ! -d "$ROOT_DIR/gen/platform-services/api/gen/grpc" ]; then
  echo "❌ platform-services gRPC proto directory not found: $ROOT_DIR/gen/platform-services/api/gen/grpc"
  exit 1
fi

find $ROOT_DIR/gen/platform-services/api/gen/grpc -type f -name "*.proto" -exec cp {} $PROTO_DIR/ \;

proto_dirs=$(find $PROTO_DIR -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)
echo "proto_dirs: $proto_dirs"

# Path to the proto files
PROTO_DIR="./proto/proto"

# Output directory for generated files
OUT_DIR="./src/generated"

# Find all proto files
PROTO_FILES=$(find ${PROTO_DIR} -name "*.proto" -type f)

# Generate TypeScript code with @protobuf-ts
echo "Generating TypeScript code with @protobuf-ts..."

./node_modules/.bin/protoc \
  --proto_path=${PROTO_DIR} \
  --plugin=./node_modules/.bin/protoc-gen-ts \
  --ts_out=${OUT_DIR} \
  --ts_opt=add_pb_suffix \
  ${PROTO_FILES}
  
echo "TypeScript files generated successfully!"

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
echo "Copying package.json template..."
cp ./package.json.template ./proto-ts/package.json

echo ""
echo "✅ Generation complete!"
echo "📦 Generated files: src/generated/"
echo "📦 Built files: proto-ts/"
