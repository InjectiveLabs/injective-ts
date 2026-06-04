#!/bin/bash

# Exit on error
set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to script directory to ensure relative paths work
cd "$SCRIPT_DIR"

# Parse command line arguments
SKIP_CLONE=false
PERSIST=false

while [[ $# -gt 0 ]]; do
  case $1 in
    -s|--skip-clone)
      SKIP_CLONE=true
      shift
      ;;
    -p|--persist)
      PERSIST=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  -s, --skip-clone    Skip cloning repositories and generating proto files"
      echo "  -p, --persist       Keep temporary directories after generation completes"
      echo "  -h, --help          Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0                  Run full generation (clone repos + generate)"
      echo "  $0 --skip-clone     Skip cloning, only regenerate tsup config and index files"
      echo "  $0 --persist        Run generation and keep proto/gen and proto/proto directories"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      echo "Use -h or --help for usage information"
      exit 1
      ;;
  esac
done

echo "Starting generation script..."
if [ "$SKIP_CLONE" = true ]; then
  echo "⚠️  Skipping repository cloning and proto generation"
else
  echo "📦 Will clone repositories and generate proto files"
fi
if [ "$PERSIST" = true ]; then
  echo "💾 Will persist temporary directories after generation"
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/protoc" ]; then
  echo "📥 Installing dependencies..."
  npm install || pnpm install || {
    echo "❌ Failed to install dependencies"
    exit 1
  }
fi

if [ "$SKIP_CLONE" = false ]; then
  # Ensure we start with a clean slate
  rm -rf proto/gen
  rm -rf proto/proto
  rm -rf src/generated

  # Create output directories if they don't exist
  mkdir -p proto/gen
  mkdir -p proto/proto
  mkdir -p src/generated
fi

ROOT_DIR="./proto"
PROTO_DIR="./proto/proto"
BUILD_DIR="./proto/gen"

# https://github.com/InjectiveLabs/injective-core/blob/release/v1.16.x/go.mod

# remote branches/tags
injective_core_branch=release/v1.20.x
cosmos_sdk_branch=v0.50.14-inj.10
wasmd_branch=v0.53.3-inj.3
ibc_go_branch=v8.7.0-inj.4

if [ "$SKIP_CLONE" = false ]; then
  ## Clone current proto definitions from core
  git clone https://github.com/InjectiveLabs/injective-core.git $BUILD_DIR/injective-core -b $injective_core_branch --depth 1 --single-branch > /dev/null
  cp -r $BUILD_DIR/injective-core/proto/injective $PROTO_DIR

  # ## Third Party proto definitions
  git clone https://github.com/InjectiveLabs/cosmos-sdk.git $BUILD_DIR/cosmos-sdk -b $cosmos_sdk_branch --depth 1 --single-branch > /dev/null
  git clone https://github.com/InjectiveLabs/wasmd $BUILD_DIR/wasmd -b $wasmd_branch --depth 1 --single-branch > /dev/null
  git clone https://github.com/InjectiveLabs/ibc-go.git $BUILD_DIR/ibc-go -b $ibc_go_branch --depth 1 --single-branch > /dev/null

  echo "Exporting proto files with buf..."
  buf export $BUILD_DIR/cosmos-sdk --output=$PROTO_DIR
  buf export $BUILD_DIR/wasmd --exclude-imports --output=$PROTO_DIR
  buf export $BUILD_DIR/ibc-go --exclude-imports --output=$PROTO_DIR
  
  echo "Exporting external dependencies..."
  buf export https://github.com/cosmos/gogoproto.git --exclude-imports --output=$PROTO_DIR || echo "⚠️  Warning: Failed to export gogoproto"
  buf export https://github.com/cometbft/cometbft.git --exclude-imports --output=$PROTO_DIR || echo "⚠️  Warning: Failed to export cometbft"
  buf export https://github.com/cosmos/ics23.git --exclude-imports --output=$PROTO_DIR || echo "⚠️  Warning: Failed to export ics23"
  buf export https://github.com/cosmos/ibc-apps.git --exclude-imports --output=$PROTO_DIR --path=middleware/packet-forward-middleware/proto/packetforward/v1 || echo "⚠️  Warning: Failed to export ibc-apps"
fi

  ## explicit copy of google/protobuf/struct.proto
  mkdir -p $PROTO_DIR/google/protobuf

  proto_dirs=$(find $PROTO_DIR -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)
  echo "proto_dirs: $proto_dirs"

  # Path to the proto files
  PROTO_DIR="./proto/proto"

  # Output directory for generated files
  OUT_DIR="./src/generated"

  # Find all proto files
  PROTO_FILES=$(find ${PROTO_DIR} -name "*.proto" -type f)

  # Generate TypeScript code for all proto files at once
  echo "Generating TypeScript code with @protobuf-ts..."
  
  ./node_modules/.bin/protoc \
    --proto_path=${PROTO_DIR} \
    --plugin=./node_modules/.bin/protoc-gen-ts \
    --ts_out=${OUT_DIR} \
    --ts_opt=add_pb_suffix \
    ${PROTO_FILES}
    
  echo "All gRPC-Web TypeScript client code generated successfully!"

  # @protobuf-ts generates TypeScript files with _pb suffix
  echo "TypeScript files generated successfully with @protobuf-ts"

    # Create index.ts file with exports for tree-shaking optimization
    echo "Creating optimized index.ts file with exports..."
    
    # Add namespace type exports
    cat ./src/index.template.ts > ./src/index.ts

    echo "Stub index file copied successfully!"
    echo "Using static tsup.config.ts (not regenerating)"

if [ "$SKIP_CLONE" = false ] && [ "$PERSIST" = false ]; then
  echo "Cleaning up temporary files..."
  rm -rf proto/gen
  rm -rf proto/proto
elif [ "$PERSIST" = true ]; then
  echo "💾 Keeping temporary directories (proto/gen and proto/proto)"
else
  echo "Skipped cleanup (no temporary directories were created)"
fi

echo ""
echo "Building TypeScript to ESM..."
npm run build

echo ""
echo "Copying package.json template..."
cp ./package.json.template ./proto-ts/package.json

echo ""
echo "✅ Generation complete!"
if [ "$SKIP_CLONE" = true ]; then
  echo "📝 Updated: index.ts and tsup.config.ts (proto generation was skipped)"
else
  echo "📦 Generated files: src/generated/"
  echo "📦 Built files: proto-ts/"
fi
if [ "$PERSIST" = true ]; then
  echo "💾 Temporary directories preserved in proto/gen and proto/proto"
fi
