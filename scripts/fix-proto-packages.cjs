#!/usr/bin/env node
/**
 * Fix proto packages that have .js files but declare .mjs in their package.json exports
 * This is a workaround until the proto packages are fixed upstream
 */

const fs = require('fs')
const path = require('path')

const protoPackages = [
  '@injectivelabs/indexer-proto-ts-v2',
  '@injectivelabs/core-proto-ts-v2',
  '@injectivelabs/mito-proto-ts-v2',
  '@injectivelabs/olp-proto-ts-v2',
  '@injectivelabs/abacus-proto-ts-v2',
]

function findPackageInNodeModules(packageName, startDir) {
  // Try pnpm structure first
  const pnpmPattern = path.join(startDir, 'node_modules', '.pnpm')

  if (fs.existsSync(pnpmPattern)) {
    const pnpmDirs = fs.readdirSync(pnpmPattern)
    const packageDir = pnpmDirs.find((dir) =>
      dir.startsWith(packageName.replace('/', '+') + '@'),
    )

    if (packageDir) {
      return path.join(pnpmPattern, packageDir, 'node_modules', packageName)
    }
  }

  // Try regular node_modules structure
  const regularPath = path.join(startDir, 'node_modules', packageName)
  if (fs.existsSync(regularPath)) {
    return regularPath
  }

  return null
}

function fixPackageJson(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    console.log(`⚠️  package.json not found at ${packageJsonPath}`)
    return false
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  let modified = false

  // Fix the exports field - need BOTH patterns for .mjs imports to work
  if (packageJson.exports) {
    // Ensure we have the base wildcard export
    if (!packageJson.exports['./generated/*']) {
      packageJson.exports['./generated/*'] = './esm/generated/*'
      modified = true
    }

    // Add explicit .js pattern if using .js files
    if (packageJson.main && packageJson.main.endsWith('.js')) {
      if (!packageJson.exports['./generated/*.js']) {
        // Insert before the base wildcard
        const newExports = {}
        for (const [key, value] of Object.entries(packageJson.exports)) {
          newExports[key] = value
          if (key === '.') {
            // Add .js pattern right after main export
            newExports['./generated/*.js'] = './esm/generated/*.js'
          }
        }
        packageJson.exports = newExports
        modified = true
      }
    }
  }

  if (modified) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log(
      `✅ Fixed ${path.basename(path.dirname(packageJsonPath))}/${path.basename(
        packageJsonPath,
      )}`,
    )
    return true
  }

  return false
}

function main() {
  const rootDir = path.resolve(__dirname, '..')
  console.log('🔧 Fixing proto package.json files...\n')

  let fixedCount = 0

  for (const packageName of protoPackages) {
    const packagePath = findPackageInNodeModules(packageName, rootDir)

    if (packagePath) {
      if (fixPackageJson(packagePath)) {
        fixedCount++
      }
    } else {
      console.log(`⚠️  Could not find ${packageName}`)
    }
  }

  console.log(`\n✨ Fixed ${fixedCount} package(s)`)
}

main()
