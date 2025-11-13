/**
 * Shared helper functions for tsdown configurations across the monorepo.
 * This ensures consistent build output structure for all packages.
 */

/**
 * Reorganizes tsdown output into cjs/ and esm/ subdirectories with package.json markers.
 * Use this for simple packages with flat file structure (single entry point).
 *
 * @example
 * ```typescript
 * import { defineConfig } from 'tsdown'
 * import { createSimpleOnSuccess } from '../../etc/tsdown-helpers'
 *
 * export default defineConfig({
 *   // ... other config
 *   onSuccess: createSimpleOnSuccess(),
 * })
 * ```
 */
export function createSimpleOnSuccess() {
  return async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    await fs.mkdir('dist/cjs', { recursive: true })
    await fs.mkdir('dist/esm', { recursive: true })

    // Move files to correct directories
    const files = await fs.readdir('dist')
    for (const file of files) {
      if (file === 'cjs' || file === 'esm') continue
      const srcPath = path.join('dist', file)
      const stat = await fs.stat(srcPath)
      if (stat.isFile()) {
        if (file.endsWith('.cjs') || file.endsWith('.d.cts')) {
          await fs.rename(srcPath, path.join('dist/cjs', file))
        } else if (file.endsWith('.js') || file.endsWith('.d.ts')) {
          await fs.rename(srcPath, path.join('dist/esm', file))
        }
      }
    }

    // Create package.json markers
    await fs.writeFile(
      'dist/cjs/package.json',
      JSON.stringify({ type: 'commonjs' }, null, 2),
    )
    await fs.writeFile(
      'dist/esm/package.json',
      JSON.stringify({ type: 'module' }, null, 2),
    )
  }
}

/**
 * Reorganizes tsdown output including nested directories (e.g., test-utils/, client/gql/).
 * Use this for packages with multiple entry points or nested directory structures.
 *
 * @example
 * ```typescript
 * import { defineConfig } from 'tsdown'
 * import { createNestedOnSuccess } from '../../etc/tsdown-helpers'
 *
 * export default defineConfig({
 *   entry: {
 *     index: './src/index.ts',
 *     'test-utils/index': './src/test-utils/index.ts',
 *   },
 *   // ... other config
 *   onSuccess: createNestedOnSuccess(),
 * })
 * ```
 */
export function createNestedOnSuccess() {
  return async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    await fs.mkdir('dist/cjs', { recursive: true })
    await fs.mkdir('dist/esm', { recursive: true })

    // Move files to correct directories (handles nested structures)
    const moveFiles = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true })
      for (const file of files) {
        if (file.name === 'cjs' || file.name === 'esm') continue
        const srcPath = path.join(dir, file.name)

        if (file.isDirectory()) {
          // Recursively handle subdirectories
          await moveFiles(srcPath)
        } else {
          const relativePath = path.relative('dist', srcPath)
          if (file.name.endsWith('.cjs') || file.name.endsWith('.d.cts')) {
            const destPath = path.join('dist/cjs', relativePath)
            await fs.mkdir(path.dirname(destPath), { recursive: true })
            await fs.rename(srcPath, destPath)
          } else if (file.name.endsWith('.js') || file.name.endsWith('.d.ts')) {
            const destPath = path.join('dist/esm', relativePath)
            await fs.mkdir(path.dirname(destPath), { recursive: true })
            await fs.rename(srcPath, destPath)
          }
        }
      }
    }

    await moveFiles('dist')

    // Clean up empty directories
    const cleanEmptyDirs = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true })
      for (const file of files) {
        if (file.name === 'cjs' || file.name === 'esm') continue
        const filePath = path.join(dir, file.name)
        if (file.isDirectory()) {
          await cleanEmptyDirs(filePath)
          try {
            await fs.rmdir(filePath)
          } catch {
            // Directory not empty, ignore
          }
        }
      }
    }
    await cleanEmptyDirs('dist')

    // Create package.json markers
    await fs.writeFile(
      'dist/cjs/package.json',
      JSON.stringify({ type: 'commonjs' }, null, 2),
    )
    await fs.writeFile(
      'dist/esm/package.json',
      JSON.stringify({ type: 'module' }, null, 2),
    )
  }
}
