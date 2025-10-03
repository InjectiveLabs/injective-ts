const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const PNPM_GLOBAL_PATH = path.join(require('os').homedir(), '.pnpm-global')
const MONOREPO_ROOT = process.cwd() // Run from your monorepo root

// Find all package.json files recursively
function findPackages(dir) {
  let results = []
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (fullPath.endsWith('injective-ts/package.json')) {
      return
    }

    if (stat.isDirectory()) {
      if (file === 'node_modules') {
        return
      }

      if (file.endsWith('cjs') || file.endsWith('esm')) {
        return
      }

      if (file.includes('proto') || file.includes('etc')) {
        return
      }

      results = results.concat(findPackages(fullPath))
    } else if (file === 'package.json') {
      results.push(path.dirname(fullPath))
    }
  })

  return results
}

// Check if package is already linked globally
function isPackageLinked(packageDir) {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(packageDir, 'package.json'), 'utf-8'),
  )
  const globalPackagePath = path.join(
    PNPM_GLOBAL_PATH,
    '5',
    'node_modules',
    pkg.name,
  )

  try {
    fs.accessSync(globalPackagePath)
    return true
  } catch (e) {
    return false
  }
}

// Main script
function linkUnlinkedPackages() {
  const packages = findPackages(MONOREPO_ROOT)

  console.log(packages)

  packages.forEach((pkgDir) => {
    if (!isPackageLinked(pkgDir)) {
      console.log(`Linking ${pkgDir}...`)
      try {
        execSync('pnpm link -g', { cwd: pkgDir, stdio: 'inherit' })
      } catch (e) {
        console.error(`Failed to link ${pkgDir}:`, e.message)
      }
    } else {
      console.log(`Skipping (already linked): ${pkgDir}`)
    }
  })
}

linkUnlinkedPackages()
