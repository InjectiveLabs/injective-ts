#!/usr/bin/env node
/**
 * Shared script to fix ESM imports by adding .js extensions.
 * Usage: node ../_scripts/fix-imports.mjs
 *
 * Must be run from a package directory (e.g., protoV2/core/)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// Recursively find all .js files
function findJsFiles(dir) {
  const results = []
  const items = readdirSync(dir)

  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      results.push(...findJsFiles(fullPath))
    } else if (item.endsWith('.js')) {
      results.push(fullPath)
    }
  }

  return results
}

// Find all .js files in proto-ts (relative to cwd)
const outDir = join(process.cwd(), 'proto-ts')
const files = findJsFiles(outDir)

console.log(`Found ${files.length} .js files to process`)

let totalReplacements = 0

files.forEach((fullPath) => {
  let content = readFileSync(fullPath, 'utf8')

  // Count replacements for this file
  let fileReplacements = 0

  // Replace relative imports without extensions
  const newContent = content.replace(
    /(from\s+['"])(\.\/?[^'"]+?)(['"])/g,
    (match, prefix, path, suffix) => {
      // Skip if already has an extension
      if (path.endsWith('.mjs') || path.endsWith('.js')) {
        return match
      }

      // Skip if it's not a relative import (doesn't start with . or ..)
      if (!path.startsWith('.')) {
        return match
      }

      // Add .js extension
      fileReplacements++
      return `${prefix}${path}.js${suffix}`
    },
  )

  if (fileReplacements > 0) {
    writeFileSync(fullPath, newContent, 'utf8')
    const relativePath = fullPath.replace(process.cwd() + '/', '')
    console.log(`  ✓ ${relativePath}: ${fileReplacements} imports fixed`)
    totalReplacements += fileReplacements
  }
})

console.log(
  `\n✅ Total: ${totalReplacements} imports fixed across ${files.length} files`,
)
