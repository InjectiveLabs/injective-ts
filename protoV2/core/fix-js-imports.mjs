#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Recursively find all .mjs files
function findMjsFiles(dir) {
  const results = []
  const items = readdirSync(dir)

  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      results.push(...findMjsFiles(fullPath))
    } else if (item.endsWith('.mjs')) {
      results.push(fullPath)
    }
  }

  return results
}

// Find all .mjs files in proto-ts/esm
const esmDir = join(__dirname, 'proto-ts/esm')
const files = findMjsFiles(esmDir)

console.log(`Found ${files.length} .mjs files to process`)

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
    const relativePath = fullPath.replace(__dirname + '/', '')
    console.log(`  ✓ ${relativePath}: ${fileReplacements} imports fixed`)
    totalReplacements += fileReplacements
  }
})

console.log(
  `\n✅ Total: ${totalReplacements} imports fixed across ${files.length} files`,
)
