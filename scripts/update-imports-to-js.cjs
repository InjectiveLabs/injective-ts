#!/usr/bin/env node
/**
 * Update all .mjs imports to .js in codebase
 */

const fs = require('fs')
const path = require('path')

// Recursively find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList)
    } else if (file.endsWith('.ts')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Find all TypeScript files
const files = findTsFiles('packages/sdk-ts/src')

console.log(`Found ${files.length} TypeScript files to check`)

let totalReplacements = 0

files.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8')

  // Count replacements for this file
  let fileReplacements = 0

  // Replace .mjs imports with .js
  const newContent = content.replace(
    /(@injectivelabs\/[^'"]+\.mjs['"])/g,
    (match) => {
      fileReplacements++
      return match.replace('.mjs', '.js')
    },
  )

  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8')
    console.log(`  ✓ ${filePath}: ${fileReplacements} imports fixed`)
    totalReplacements += fileReplacements
  }
})

console.log(
  `\n✅ Total: ${totalReplacements} imports fixed across ${files.length} files`,
)
