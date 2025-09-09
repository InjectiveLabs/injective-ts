#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { execSync } from 'child_process'
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
} from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Ensure directories exist
const distDir = join(rootDir, 'bundle-analysis', 'dist')
const reportsDir = join(rootDir, 'bundle-analysis', 'reports')

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}
if (!existsSync(reportsDir)) {
  mkdirSync(reportsDir, { recursive: true })
}

/**
 * Dynamically discover packages by scanning the packages directory
 * @returns {string[]} Array of package paths
 */
function discoverPackages() {
  const packages = []
  const packagesDir = join(rootDir, 'packages')

  // Scan top-level packages (exceptions, networks, sdk-ts, etc.)
  const topLevelPackages = readdirSync(packagesDir)
    .filter((item) => {
      const itemPath = join(packagesDir, item)
      return (
        statSync(itemPath).isDirectory() &&
        existsSync(join(itemPath, 'package.json')) &&
        existsSync(join(itemPath, 'test-import-size', 'index.ts'))
      )
    })
    .map((pkg) => pkg)

  packages.push(...topLevelPackages)

  // Scan wallets subdirectory
  const walletsDir = join(packagesDir, 'wallets')
  if (existsSync(walletsDir)) {
    const walletPackages = readdirSync(walletsDir)
      .filter((item) => {
        const itemPath = join(walletsDir, item)
        return (
          statSync(itemPath).isDirectory() &&
          existsSync(join(itemPath, 'package.json')) &&
          existsSync(join(itemPath, 'test-import-size', 'index.ts'))
        )
      })
      .map((pkg) => `wallets/${pkg}`)

    packages.push(...walletPackages)
  }

  return packages.sort()
}

// Get all packages dynamically
let packages = discoverPackages()

// Filter to specific package if provided as command line argument
const targetPackage = process.argv[2]
if (targetPackage) {
  packages = packages.filter(
    (pkg) => pkg === targetPackage || pkg === `wallets/${targetPackage}`,
  )
  if (packages.length === 0) {
    console.log(`❌ Package '${targetPackage}' not found`)
    console.log(`Available packages: ${discoverPackages().join(', ')}`)
    process.exit(1)
  }
}

console.log(
  `🔍 Starting bundle analysis for ${
    targetPackage ? `package: ${targetPackage}` : 'all packages'
  }...`,
)
console.log(`📦 Found ${packages.length} packages: ${packages.join(', ')}\n`)

const results = []

for (const packagePath of packages) {
  const packageName = packagePath.replace('wallets/', '')
  const testImportDir = join(
    rootDir,
    'packages',
    packagePath,
    'test-import-size',
  )
  const testImportFile = join(testImportDir, 'index.ts')

  // Check if test-import-size directory and index.ts exist
  if (!existsSync(testImportDir) || !existsSync(testImportFile)) {
    console.log(
      `⚠️  Skipping ${packageName} - test-import-size/index.ts not found`,
    )
    continue
  }

  console.log(`📦 Analyzing ${packageName}...`)

  try {
    // Discover all test files in the test-import-size directory
    const testFiles = readdirSync(testImportDir)
      .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
      .map((file) => file.replace('.ts', ''))

    // Run rollup for the main bundle (index.ts)
    const rollupConfig = join(rootDir, 'bundle-size', 'rollup.config.ts')
    const command = `npx rollup -c ${rollupConfig} --input ${testImportFile}`

    execSync(command, {
      cwd: rootDir,
      stdio: 'pipe',
      env: { ...process.env, PACKAGE_NAME: packageName },
    })

    // Get main bundle size
    const bundleFile = join(distDir, `${packageName}-bundle.js`)
    let mainBundleSize = 0
    let mainBundleSizeKB = 0

    if (existsSync(bundleFile)) {
      const stats = readFileSync(bundleFile, 'utf8')
      mainBundleSize = Buffer.byteLength(stats, 'utf8')
      mainBundleSizeKB = parseFloat((mainBundleSize / 1024).toFixed(2))
    }

    // Analyze individual test files if they exist
    const fileResults = []
    for (const testFile of testFiles) {
      const testFilePath = join(testImportDir, `${testFile}.ts`)
      if (existsSync(testFilePath)) {
        try {
          const testCommand = `npx rollup -c ${rollupConfig} --input ${testFilePath}`
          execSync(testCommand, {
            cwd: rootDir,
            stdio: 'pipe',
            env: { ...process.env, PACKAGE_NAME: `${packageName}-${testFile}` },
          })

          const testBundleFile = join(
            distDir,
            `${packageName}-${testFile}-bundle.js`,
          )
          if (existsSync(testBundleFile)) {
            const testStats = readFileSync(testBundleFile, 'utf8')
            const testSizeInBytes = Buffer.byteLength(testStats, 'utf8')
            const testSizeInKB = parseFloat((testSizeInBytes / 1024).toFixed(2))

            fileResults.push({
              file: testFile,
              size: testSizeInBytes,
              sizeKB: testSizeInKB,
              status: 'success',
            })
          }
        } catch (error) {
          fileResults.push({
            file: testFile,
            size: 0,
            sizeKB: 0,
            status: 'error',
            error: error.message,
          })
        }
      }
    }

    // Add main bundle result
    results.push({
      file: `${packageName}/test-import-size/index.ts`,
      size: mainBundleSize,
      sizeKB: mainBundleSizeKB,
      status: mainBundleSize > 0 ? 'success' : 'error',
      package: packageName,
    })

    // Add individual test file results
    fileResults.forEach((fileResult) => {
      results.push({
        file: `${packageName}/test-import-size/${fileResult.file}.ts`,
        size: fileResult.size,
        sizeKB: fileResult.sizeKB,
        status: fileResult.status,
        package: packageName,
        error: fileResult.error,
      })
    })

    console.log(`✅ ${packageName}`)
  } catch (error) {
    results.push({
      file: `${packageName}/test-import-size/index.ts`,
      size: 0,
      sizeKB: 0,
      status: 'error',
      package: packageName,
      error: error.message,
    })
    console.log(`❌ ${packageName}: ${error.message}`)
  }
}

// Sort results by size
results.sort((a, b) => b.sizeKB - a.sizeKB)

console.log('\n📊 Bundle Analysis Results:')
console.log('='.repeat(70))
console.log(`${'File'.padEnd(50)} | ${'Size (KB)'.padEnd(12)}`)
console.log('-'.repeat(70))

results.forEach((result) => {
  const sizeStr = result.status === 'success' ? result.sizeKB.toFixed(2) : 'N/A'

  console.log(`${result.file.padEnd(50)} | ${sizeStr.padEnd(12)}`)
})

// Group results by package for additional insights
const packageGroups = results.reduce((acc, result) => {
  if (!acc[result.package]) {
    acc[result.package] = []
  }
  acc[result.package].push(result)
  return acc
}, {})

console.log('\n📁 Package Breakdown:')
console.log('='.repeat(60))

Object.entries(packageGroups).forEach(([packageName, files]) => {
  const successfulFiles = files.filter((f) => f.status === 'success')
  const totalSize = successfulFiles.reduce((sum, f) => sum + f.sizeKB, 0)

  console.log(`\n${packageName}:`)

  files.forEach((file) => {
    const status = file.status === 'success' ? '✅' : '❌'
    const sizeStr =
      file.status === 'success' ? `${file.sizeKB.toFixed(2)} KB` : 'Failed'
    console.log(`  ${status} ${file.file.split('/').pop()}: ${sizeStr}`)
  })
})

// Save results to JSON
const resultsFile = join(rootDir, 'bundle-analysis', 'results.json')
writeFileSync(resultsFile, JSON.stringify(results, null, 2))
console.log(`\n💾 Results saved to: ${resultsFile}`)
