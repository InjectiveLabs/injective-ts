import path from 'path'
import { readdirSync, statSync } from 'fs'

/**
 * Recursively find all TypeScript files in a directory.
 * @param {string} dir - Directory to search
 * @returns {string[]} Array of file paths
 */
export function findFiles(dir) {
  const result = []

  function traverse(currentDir) {
    const files = readdirSync(currentDir)

    for (const file of files) {
      const fullPath = path.join(currentDir, file)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (
        file.endsWith('.ts') &&
        !file.endsWith('.d.ts') &&
        !file.endsWith('.spec.ts')
      ) {
        result.push(fullPath)
      }
    }
  }

  traverse(dir)
  return result
}

/**
 * Create tsup configuration for proto packages.
 * All proto packages share the same build configuration.
 * @returns {import('tsup').Options[]}
 */
export function createProtoTsupConfig() {
  // Automatically find all generated files
  const generatedFiles = findFiles('src/generated')

  const entries = {
    index: 'src/index.ts',
  }

  // Add all generated files as entry points
  generatedFiles.forEach((file) => {
    const key = path.relative('src', file).replace(/\.ts$/, '')
    entries[key] = file
  })

  return [
    {
      entry: entries,
      outDir: 'proto-ts',
      format: ['esm'],
      dts: false, // Disable DTS generation in tsup (too slow/memory intensive)
      sourcemap: false,
      clean: true,
      splitting: false,
      treeshake: false,
      minify: false,
      bundle: false,
      outExtension: () => ({ js: '.js' }),
      external: [
        '@protobuf-ts/runtime',
        '@protobuf-ts/runtime-rpc',
        '@protobuf-ts/grpcweb-transport',
      ],
    },
  ]
}
