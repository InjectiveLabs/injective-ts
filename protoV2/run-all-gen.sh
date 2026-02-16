#!/bin/bash

# Script to run gen.sh for all protoV2 packages
# This will generate proto files and build them to ESM format

set -e

PACKAGES=("abacus" "indexer" "mito" "olp" "core")
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Running generation for all protoV2 packages"
echo "=============================================="
echo ""

for pkg in "${PACKAGES[@]}"; do
  echo "📦 Processing: $pkg"
  echo "----------------------------------------"
  
  cd "$BASE_DIR/$pkg"
  
  # Check if gen.sh exists
  if [ ! -f "gen.sh" ]; then
    echo "❌ gen.sh not found for $pkg"
    echo ""
    continue
  fi
  
  # Run gen.sh
  echo "🔄 Running gen.sh for $pkg..."
  if /bin/bash ./gen.sh 2>&1 | tail -15; then
    echo ""
    echo "✅ $pkg generation complete!"
    
    # Verify outputs
    if [ -d "src/generated" ] && [ "$(ls -A src/generated)" ]; then
      echo "   ✓ src/generated/ has files"
    else
      echo "   ⚠️  src/generated/ is empty or missing"
    fi
    
    if [ -d "proto-ts/generated" ] && [ "$(ls -A proto-ts/generated 2>/dev/null)" ]; then
      echo "   ✓ proto-ts/generated/ has files"
    elif [ -d "proto-ts" ] && [ "$(ls -A proto-ts/*.js 2>/dev/null)" ]; then
      echo "   ✓ proto-ts/ has .js files"
    else
      echo "   ⚠️  proto-ts/ is empty or missing"
    fi
  else
    echo "❌ Failed to generate $pkg"
  fi
  
  echo ""
done

echo ""
echo "=============================================="
echo "📊 Summary"
echo "=============================================="
echo ""

# Show summary for each package
for pkg in "${PACKAGES[@]}"; do
  cd "$BASE_DIR/$pkg"
  
  SRC_COUNT=$(find src/generated -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')
  JS_COUNT=$(find proto-ts -maxdepth 1 -name "*.js" 2>/dev/null | wc -l | tr -d ' ')
  JS_COUNT=$((JS_COUNT + $(find proto-ts/generated -name "*.js" 2>/dev/null | wc -l | tr -d ' ')))
  DTS_COUNT=$(find proto-ts -name "*.d.ts" 2>/dev/null | wc -l | tr -d ' ')
  
  echo "📦 $pkg:"
  echo "   - TypeScript files (src/generated/): $SRC_COUNT"
  echo "   - JavaScript files (proto-ts/): $JS_COUNT"
  echo "   - Type definitions (proto-ts/): $DTS_COUNT"
  echo ""
done

echo "🎉 All packages processed!"

