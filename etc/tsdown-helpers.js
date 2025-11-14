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
// Helper to retry file operations with exponential backoff
async function retryFileOperation(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 10))
    }
  }
}

export function createSimpleOnSuccess() {
  return async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    try {
      // Ensure directories exist with retry
      await retryFileOperation(async () => {
        await fs.mkdir('dist/cjs', { recursive: true })
        await fs.mkdir('dist/esm', { recursive: true })
      })

      // Move files to correct directories
      // Use try-catch for each file operation to handle race conditions
      let files
      try {
        files = await fs.readdir('dist')
      } catch (error) {
        // If dist doesn't exist, something went wrong - but don't fail the build
        if (error.code === 'ENOENT') {
          console.warn('Warning: dist directory not found after build')
          return
        }
        throw error
      }

      for (const file of files) {
        if (file === 'cjs' || file === 'esm') continue
        const srcPath = path.join('dist', file)
        try {
          const stat = await fs.stat(srcPath)
          if (stat.isFile()) {
            const destDir = file.endsWith('.cjs') || file.endsWith('.d.cts') 
              ? 'dist/cjs' 
              : (file.endsWith('.js') || file.endsWith('.d.ts') ? 'dist/esm' : null)
            
            if (destDir) {
              await retryFileOperation(async () => {
                await fs.rename(srcPath, path.join(destDir, file))
              })
            }
          }
        } catch (error) {
          // File might have been moved by another process or doesn't exist
          // This can happen in parallel builds - ignore and continue
          if (error.code !== 'ENOENT' && error.code !== 'EEXIST') {
            // Log but don't fail - continue with other files
            console.warn(`Warning: Failed to move ${file}:`, error.message)
          }
        }
      }

      // Create package.json markers with retry
      await retryFileOperation(async () => {
        await fs.writeFile(
          'dist/cjs/package.json',
          JSON.stringify({ type: 'commonjs' }, null, 2),
        )
      })
      await retryFileOperation(async () => {
        await fs.writeFile(
          'dist/esm/package.json',
          JSON.stringify({ type: 'module' }, null, 2),
        )
      })
    } catch (error) {
      // Log error but don't fail the build - tsdown has already succeeded
      console.warn('Warning: onSuccess hook encountered an error:', error.message)
    }
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

    try {
      // Ensure directories exist with retry
      await retryFileOperation(async () => {
        await fs.mkdir('dist/cjs', { recursive: true })
        await fs.mkdir('dist/esm', { recursive: true })
      })

      // Move files to correct directories (handles nested structures)
      const moveFiles = async (dir) => {
        try {
          const files = await fs.readdir(dir, { withFileTypes: true })
          for (const file of files) {
            if (file.name === 'cjs' || file.name === 'esm') continue
            const srcPath = path.join(dir, file.name)

            if (file.isDirectory()) {
              // Recursively handle subdirectories
              await moveFiles(srcPath)
            } else {
              try {
                const relativePath = path.relative('dist', srcPath)
                const isCjs = file.name.endsWith('.cjs') || file.name.endsWith('.d.cts')
                const isEsm = file.name.endsWith('.js') || file.name.endsWith('.d.ts')
                
                if (isCjs || isEsm) {
                  const destPath = path.join(
                    isCjs ? 'dist/cjs' : 'dist/esm',
                    relativePath
                  )
                  await retryFileOperation(async () => {
                    await fs.mkdir(path.dirname(destPath), { recursive: true })
                    await fs.rename(srcPath, destPath)
                  })
                }
              } catch (error) {
                // File might have been moved by another process or doesn't exist
                // This can happen in parallel builds - ignore and continue
                if (error.code !== 'ENOENT' && error.code !== 'EEXIST') {
                  console.warn(`Warning: Failed to move ${srcPath}:`, error.message)
                }
              }
            }
          }
        } catch (error) {
          // Directory might not exist or be accessible
          if (error.code !== 'ENOENT') {
            throw error
          }
        }
      }

      // Check if dist exists before proceeding
      try {
        await fs.access('dist')
        await moveFiles('dist')
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn('Warning: dist directory not found after build')
          return
        }
        throw error
      }

      // Clean up empty directories
      const cleanEmptyDirs = async (dir) => {
        try {
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
        } catch (error) {
          // Directory might not exist or be accessible
          if (error.code !== 'ENOENT') {
            throw error
          }
        }
      }
      await cleanEmptyDirs('dist')

      // Create package.json markers with retry
      await retryFileOperation(async () => {
        await fs.writeFile(
          'dist/cjs/package.json',
          JSON.stringify({ type: 'commonjs' }, null, 2),
        )
      })
      await retryFileOperation(async () => {
        await fs.writeFile(
          'dist/esm/package.json',
          JSON.stringify({ type: 'module' }, null, 2),
        )
      })
    } catch (error) {
      // Log error but don't fail the build - tsdown has already succeeded
      console.warn('Warning: onSuccess hook encountered an error:', error.message)
    }
  }
}
