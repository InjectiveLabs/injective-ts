#!/usr/bin/env node
/**
 * Shared script to generate .d.ts files for proto packages.
 * Usage: node ../_scripts/generate-dts.mjs
 *
 * Must be run from a package directory (e.g., protoV2/core/)
 */
import { readdirSync, statSync, copyFileSync, mkdirSync } from 'fs'
import { join, relative } from 'path'

console.log('Generating .d.ts files...')

// Simply copy the .ts files as .d.ts files
// Since protobuf-ts generates type-safe code, the .ts files ARE the type definitions
function copyAsDts(srcDir, outDir) {
  function traverse(currentSrcDir, currentOutDir) {
    const files = readdirSync(currentSrcDir)

    for (const file of files) {
      const srcPath = join(currentSrcDir, file)
      const stat = statSync(srcPath)

      if (stat.isDirectory()) {
        const newOutDir = join(currentOutDir, file)
        mkdirSync(newOutDir, { recursive: true })
        traverse(srcPath, newOutDir)
      } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
        const dtsFile = file.replace(/\.ts$/, '.d.ts')
        const outPath = join(currentOutDir, dtsFile)

        console.log(
          `Copying ${relative('src', srcPath)} -> ${relative('proto-ts', outPath)}`,
        )
        copyFileSync(srcPath, outPath)
      }
    }
  }

  traverse(srcDir, outDir)
}

// Copy src files as .d.ts
copyAsDts('src/generated', 'proto-ts/generated')
copyFileSync('src/index.ts', 'proto-ts/index.d.ts')

console.log('✅ .d.ts files generated successfully!')
