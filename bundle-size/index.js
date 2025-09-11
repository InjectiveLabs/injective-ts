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

/**
 * Compare previous and current results to detect size changes
 * @param {Array} previousResults - Previous bundle analysis results
 * @param {Array} currentResults - Current bundle analysis results
 * @returns {Object} Comparison data with changes and statistics
 */
function compareResults(previousResults, currentResults) {
  const comparison = {
    changes: [],
    newFiles: [],
    removedFiles: [],
    unchangedFiles: [],
    totalSizeChange: 0,
    totalSizeChangeKB: 0,
    packageChanges: {}
  }

  // Create a map of previous results for quick lookup
  const previousMap = new Map()
  previousResults.forEach(result => {
    previousMap.set(result.file, result)
  })

  // Process current results
  currentResults.forEach(current => {
    const previous = previousMap.get(current.file)

    if (!previous) {
      // New file
      comparison.newFiles.push({
        file: current.file,
        size: current.size,
        sizeKB: current.sizeKB,
        package: current.package
      })
    } else {
      // Existing file - compare sizes
      const sizeChange = current.size - previous.size
      const sizeChangeKB = current.sizeKB - previous.sizeKB
      const percentChange = previous.size > 0 ? (sizeChange / previous.size) * 100 : 0

      const change = {
        file: current.file,
        package: current.package,
        previousSize: previous.size,
        previousSizeKB: previous.sizeKB,
        currentSize: current.size,
        currentSizeKB: current.sizeKB,
        sizeChange: sizeChange,
        sizeChangeKB: sizeChangeKB,
        percentChange: percentChange
      }

      comparison.changes.push(change)
      comparison.totalSizeChange += sizeChange
      comparison.totalSizeChangeKB += sizeChangeKB

      // Track package-level changes
      if (!comparison.packageChanges[current.package]) {
        comparison.packageChanges[current.package] = {
          totalChange: 0,
          totalChangeKB: 0,
          fileCount: 0
        }
      }
      comparison.packageChanges[current.package].totalChange += sizeChange
      comparison.packageChanges[current.package].totalChangeKB += sizeChangeKB
      comparison.packageChanges[current.package].fileCount += 1
    }
  })

  // Find removed files (only if we're analyzing all packages)
  // If we're only analyzing specific packages, don't mark others as "removed"
  const isAnalyzingAllPackages = !targetPackage
  if (isAnalyzingAllPackages) {
    const currentFiles = new Set(currentResults.map(r => r.file))
    previousResults.forEach(previous => {
      if (!currentFiles.has(previous.file)) {
        comparison.removedFiles.push({
          file: previous.file,
          size: previous.size,
          sizeKB: previous.sizeKB,
          package: previous.package
        })
        comparison.totalSizeChange -= previous.size
        comparison.totalSizeChangeKB -= previous.sizeKB
      }
    })
  }

  // Sort changes by absolute size change
  comparison.changes.sort((a, b) => Math.abs(b.sizeChangeKB) - Math.abs(a.sizeChangeKB))

  return comparison
}

/**
 * Display comparison results with color coding and detailed statistics
 * @param {Object} comparisonData - Comparison data from compareResults
 */
function displayComparisonResults(comparisonData) {
  console.log('\n🔄 Bundle Size Comparison:')
  console.log('='.repeat(80))

  const resetColor = '\x1b[0m'

  // Show all changes
  if (comparisonData.changes.length > 0) {
    console.log('\n📋 Changes:')
    console.log('-'.repeat(80))
    console.log(`${'File'.padEnd(50)} | ${'Previous'.padEnd(10)} | ${'Current'.padEnd(10)} | ${'Change'.padEnd(12)}`)
    console.log('-'.repeat(80))

    comparisonData.changes.forEach(change => {
      const file = change.file.length > 47 ? change.file.substring(0, 44) + '...' : change.file
      const previous = change.previousSizeKB.toFixed(2)
      const current = change.currentSizeKB.toFixed(2)
      const changeStr = `${change.sizeChangeKB > 0 ? '+' : ''}${change.sizeChangeKB.toFixed(2)} KB`

      const changeColor = change.sizeChangeKB > 0 ? '\x1b[31m' : change.sizeChangeKB < 0 ? '\x1b[32m' : '\x1b[33m'

      console.log(`${file.padEnd(50)} | ${previous.padEnd(10)} | ${current.padEnd(10)} | ${changeColor}${changeStr.padEnd(12)}${resetColor}`)
    })
  }

  // Show new files
  if (comparisonData.newFiles.length > 0) {
    console.log('\n➕ New Files:')
    console.log('-'.repeat(60))
    comparisonData.newFiles.forEach(file => {
      console.log(`  ${file.file}: ${file.sizeKB.toFixed(2)} KB`)
    })
  }

  // Show removed files
  if (comparisonData.removedFiles.length > 0) {
    console.log('\n➖ Removed Files:')
    console.log('-'.repeat(60))
    comparisonData.removedFiles.forEach(file => {
      console.log(`  ${file.file}: ${file.sizeKB.toFixed(2)} KB`)
    })
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
      package: packageName,
    })

    // Add individual test file results
    fileResults.forEach((fileResult) => {
      results.push({
        file: `${packageName}/test-import-size/${fileResult.file}.ts`,
        size: fileResult.size,
        sizeKB: fileResult.sizeKB,
        package: packageName,
      })
    })

    console.log(`✅ ${packageName}`)
  } catch (error) {
    results.push({
      file: `${packageName}/test-import-size/index.ts`,
      size: 0,
      sizeKB: 0,
      package: packageName,
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
  const sizeStr = result.sizeKB.toFixed(2)

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
  const totalSize = files.reduce((sum, f) => sum + f.sizeKB, 0)

  console.log(`\n${packageName}:`)

  files.forEach((file) => {
    const sizeStr = `${file.sizeKB.toFixed(2)} KB`
    console.log(`  ✅ ${file.file.split('/').pop()}: ${sizeStr}`)
  })
})

// Load previous results for comparison and preservation
const resultsFile = join(rootDir, 'bundle-analysis', 'results.json')
let previousResults = []
let hasPreviousResults = false

if (existsSync(resultsFile)) {
  try {
    const previousData = readFileSync(resultsFile, 'utf8')
    previousResults = JSON.parse(previousData)
    hasPreviousResults = true
    console.log(`\n📊 Found previous results with ${previousResults.length} entries`)
  } catch (error) {
    console.log(`\n⚠️  Could not parse previous results: ${error.message}`)
  }
} else {
  console.log(`\n📊 No previous results found - this will be the baseline`)
}

// Create comparison data and display results if we have previous data
if (hasPreviousResults) {
  const comparisonData = compareResults(previousResults, results)
  displayComparisonResults(comparisonData)
} else {
  console.log('\n📊 No previous results to compare against - showing current results only')
}

// Merge new results with existing results to preserve previously cached bundle sizes
let finalResults = [...results]

if (hasPreviousResults) {
  // Create a map of current results for quick lookup
  const currentResultsMap = new Map()
  results.forEach(result => {
    currentResultsMap.set(result.file, result)
  })

  // Add previous results that weren't updated in this run
  previousResults.forEach(previousResult => {
    if (!currentResultsMap.has(previousResult.file)) {
      finalResults.push(previousResult)
    }
  })

  // Sort final results by size
  finalResults.sort((a, b) => b.sizeKB - a.sizeKB)

  console.log(`\n🔄 Merged results: ${results.length} updated, ${previousResults.length - results.length} preserved from cache`)
} else {
  console.log(`\n📊 No previous results to merge - using current results only`)
}

// Save merged results to JSON
writeFileSync(resultsFile, JSON.stringify(finalResults, null, 2))
console.log(`\n💾 Results saved to: ${resultsFile}`)
