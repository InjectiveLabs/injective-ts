import path from 'path'
import { defineConfig } from 'tsup'
import { readdirSync, statSync } from 'fs'

function findFiles(dir: string): string[] {
  const result: string[] = []

  function traverse(currentDir: string) {
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

export default defineConfig(() => {
  // Automatically find all generated files
  const generatedFiles = findFiles('src/generated')

  const entries: Record<string, string> = {
    index: 'src/index.ts',
  }

  // Add all generated files as entry points
  generatedFiles.forEach((file: string) => {
    const key = path.relative('src', file).replace(/\.ts$/, '')
    entries[key] = file
  })

  return [
    {
      entry: entries,
      outDir: 'proto-ts',
      format: ['esm'],
      dts: false, // Disable DTS generation in tsup (use generate-dts.mjs instead)
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
})
