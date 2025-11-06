#!/bin/bash

# Exit on error
set -e

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

# remote branches/tags
injective_core_branch=release/v1.16.x
cosmos_sdk_branch=v0.50.13-evm-comet1-inj.3
wasmd_branch=v0.53.3-evm-comet1-inj
ibc_go_branch=v8.7.0-evm-comet1-inj

if [ "$SKIP_CLONE" = false ]; then
  ## Clone current proto definitions from core
  git clone https://github.com/InjectiveLabs/injective-core.git $BUILD_DIR/injective-core -b $injective_core_branch --depth 1 --single-branch > /dev/null
  cp -r $BUILD_DIR/injective-core/proto/injective $PROTO_DIR

  # ## Third Party proto definitions
  git clone https://github.com/InjectiveLabs/cosmos-sdk.git $BUILD_DIR/cosmos-sdk -b $cosmos_sdk_branch --depth 1 --single-branch > /dev/null
  git clone https://github.com/InjectiveLabs/wasmd $BUILD_DIR/wasmd -b $wasmd_branch --depth 1 --single-branch > /dev/null
  git clone https://github.com/InjectiveLabs/ibc-go.git $BUILD_DIR/ibc-go -b $ibc_go_branch --depth 1 --single-branch > /dev/null

  buf export $BUILD_DIR/cosmos-sdk --output=$PROTO_DIR
  buf export $BUILD_DIR/wasmd --exclude-imports --output=$PROTO_DIR
  buf export $BUILD_DIR/ibc-go --exclude-imports --output=$PROTO_DIR
  buf export https://github.com/cosmos/gogoproto.git --exclude-imports --output=$PROTO_DIR
  buf export https://github.com/cometbft/cometbft.git --exclude-imports --output=$PROTO_DIR
  buf export https://github.com/cosmos/ics23.git --exclude-imports --output=$PROTO_DIR
  buf export https://github.com/cosmos/ibc-apps.git --exclude-imports --output=$PROTO_DIR --path=middleware/packet-forward-middleware/proto/packetforward/v1
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

    # Update tsup.config.ts with optimized entries for tree-shaking
    echo "Updating optimized tsup.config.ts entries..."

    # Create the updated tsup config
    cat > ./tsup.config.ts << 'EOF'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    // Main index file
    'index': 'src/index.ts',
    // Generated files based on index.template.ts exports
EOF

    # Extract file paths from index.template.ts and generate tsup entries
    echo "    // Type files from template exports (excluding client files)"
    grep -o '"./generated/[^"]*"' ./src/index.template.ts | \
    grep -v '\.client"$' | \
    sed 's/^"\.\/\(.*\)"$/\1/' | \
    sed 's/\.ts$//' | \
    sort -u | \
    while read -r file_path; do
        # Use the file path as-is for the entry key (without src/ prefix)
        entry_key="$file_path"
        
        # Check if the actual file exists before adding it
        if [ -f "./src/${file_path}.ts" ]; then
            echo "    '${entry_key}': 'src/${file_path}.ts'," >> ./tsup.config.ts
        fi
    done

    # Add client files that are referenced in the template
    echo "    // Client files from template exports" >> ./tsup.config.ts
    grep -o '"./generated/[^"]*\.client"' ./src/index.template.ts | \
    sed 's/^"\.\/\(.*\)"$/\1/' | \
    sort -u | \
    while read -r file_path; do
        # Use the file path as-is for the entry key (without src/ prefix)
        entry_key="$file_path"
        
        # Check if the actual file exists before adding it
        if [ -f "./src/${file_path}.ts" ]; then
            echo "    '${entry_key}': 'src/${file_path}.ts'," >> ./tsup.config.ts
        fi
    done

    # Add the closing part of the config with tree-shaking optimizations
    cat >> ./tsup.config.ts << 'EOF'
  },
  format: ['esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: false,  // Disable splitting to prevent name mangling
  minify: false,     // Disable minification to preserve na
  external: ['shared'],
  bundle: false,     // Disable bundling to preserve original exports
})
EOF

    echo "Optimized tsup.config.ts updated successfully!"

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
echo "✅ Generation complete!"
if [ "$SKIP_CLONE" = true ]; then
  echo "📝 Updated: index.ts and tsup.config.ts (proto generation was skipped)"
else
  echo "📦 Generated files: src/generated/"
  echo "📦 Built files: proto-ts/esm/"
fi
if [ "$PERSIST" = true ]; then
  echo "💾 Temporary directories preserved in proto/gen and proto/proto"
fi
