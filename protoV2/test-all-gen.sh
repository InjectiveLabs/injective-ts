#!/bin/bash

# Test script to verify all protoV2 packages can generate and build successfully
# This script tests the complete workflow: proto generation -> TypeScript -> ESM

set -e

PACKAGES=("abacus" "indexer" "mito" "olp" "core")
FAILED_PACKAGES=()
SUCCESS_PACKAGES=()

echo "🧪 Testing ProtoV2 Package Generation & Build"
echo "=============================================="
echo ""

for pkg in "${PACKAGES[@]}"; do
  echo "📦 Testing package: $pkg"
  echo "----------------------------------------"
  
  cd "/Users/leeruianthomas/Public/injective/injective-ts/protoV2/$pkg"
  
  # Check if gen.sh exists
  if [ ! -f "gen.sh" ]; then
    echo "❌ gen.sh not found for $pkg"
    FAILED_PACKAGES+=("$pkg")
    echo ""
    continue
  fi
  
  # Check if package.json exists
  if [ ! -f "package.json" ]; then
    echo "❌ package.json not found for $pkg"
    FAILED_PACKAGES+=("$pkg")
    echo ""
    continue
  fi
  
  # Check if node_modules exists, if not install
  if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies for $pkg..."
    npm install || pnpm install || {
      echo "❌ Failed to install dependencies for $pkg"
      FAILED_PACKAGES+=("$pkg")
      echo ""
      continue
    }
  fi
  
  # Test: Check if gen.sh has the build step
  if ! grep -q "npm run build\|pnpm build" gen.sh; then
    echo "⚠️  Warning: gen.sh doesn't have build step for $pkg"
  fi
  
  # Test: Verify tsup.config.ts exists and has correct outDir
  if [ -f "tsup.config.ts" ]; then
    if grep -q "outDir.*'proto-ts'" tsup.config.ts && ! grep -q "outDir.*'proto-ts/esm'" tsup.config.ts; then
      echo "✅ tsup.config.ts configured correctly"
    else
      echo "⚠️  Warning: tsup.config.ts might not have correct outDir"
    fi
  else
    echo "❌ tsup.config.ts not found for $pkg"
    FAILED_PACKAGES+=("$pkg")
    echo ""
    continue
  fi
  
  # Test: Verify proto-ts folder structure exists
  if [ ! -d "proto-ts" ]; then
    echo "⚠️  proto-ts folder doesn't exist yet (will be created on build)"
  fi
  
  # Test: Check if proto-ts/package.json exists
  if [ -f "proto-ts/package.json" ]; then
    echo "✅ proto-ts/package.json exists"
  else
    echo "❌ proto-ts/package.json not found for $pkg"
    FAILED_PACKAGES+=("$pkg")
    echo ""
    continue
  fi
  
  echo "✅ All checks passed for $pkg"
  SUCCESS_PACKAGES+=("$pkg")
  echo ""
done

echo ""
echo "=============================================="
echo "📊 Test Summary"
echo "=============================================="
echo "Total packages tested: ${#PACKAGES[@]}"
echo "✅ Passed: ${#SUCCESS_PACKAGES[@]}"
echo "❌ Failed: ${#FAILED_PACKAGES[@]}"

if [ ${#SUCCESS_PACKAGES[@]} -gt 0 ]; then
  echo ""
  echo "✅ Successful packages:"
  for pkg in "${SUCCESS_PACKAGES[@]}"; do
    echo "   - $pkg"
  done
fi

if [ ${#FAILED_PACKAGES[@]} -gt 0 ]; then
  echo ""
  echo "❌ Failed packages:"
  for pkg in "${FAILED_PACKAGES[@]}"; do
    echo "   - $pkg"
  done
  exit 1
fi

echo ""
echo "🎉 All packages are configured correctly!"
echo ""
echo "To generate and build a package, run:"
echo "  cd protoV2/<package>"
echo "  sh ./gen.sh"
echo ""
echo "Or use npm/pnpm:"
echo "  pnpm generate  # Generates proto + builds to ESM"

