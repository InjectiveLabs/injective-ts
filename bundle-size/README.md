# Bundle Size Analysis

This directory contains tools for analyzing the bundle size of packages in the Injective TypeScript SDK.

## Overview

The bundle analysis system supports testing entire folders instead of just single files, allowing for more comprehensive bundle size analysis across different import patterns.

## Structure

### Package Structure

Each package that wants to be analyzed should have a `test-import-size` directory with the following structure:

```
packages/[package-name]/
├── test-import-size/
│   ├── index.ts          # Main test file (required)
│   ├── [test-name].ts    # Additional test files (optional)
│   └── ...
└── src/
    └── ...
```

### Test Files

- **`index.ts`**: The main test file that imports the primary exports from the package
- **`[test-name].ts`**: Additional test files that can test specific subsets of functionality

## How to Add New Test Files

Create additional `.ts` files in the `test-import-size` directory to test specific functionality:

```typescript
// packages/[package-name]/test-import-size/specific-feature.ts
import { SpecificClass } from '../src/specific-module.js'

// Test just this specific feature
const instance = new SpecificClass()
console.log('Specific feature loaded:', instance.name)
```

### Run the analysis

```bash
# Analyze all packages
pnpm test-import-size

# Analyze a specific package
pnpm test-import-size <package-name>

# Examples:
pnpm test-import-size networks
pnpm test-import-size wallet-evm
pnpm test-import-size sdk-ts
```

## Output

The analysis provides:

1. **File-based Results**: Each test file is listed individually with its bundle size
2. **Success/Failure Status**: Clear indication of which files built successfully
3. **Package Breakdown**: Grouped view showing total size per package
4. **Summary Statistics**: Total files analyzed, success/failure counts
5. **Size Comparison**: When previous results exist, shows size changes with color-coded output
6. **Change Detection**: Identifies new files, removed files, and size changes

### Example Output

#### First Run (Baseline)
```
📊 No previous results found - this will be the baseline

📊 Bundle Analysis Results:======================================================================
File                                               | Size (KB)
----------------------------------------------------------------------
networks/test-import-size/index.ts                      | 10.48
networks/test-import-size/utils-only.ts                 | 10.46
networks/test-import-size/network-only.ts               | 0.66

📁 Package Breakdown:
============================================================

networks:
  ✅ index.ts: 12.17 KB
  ✅ network-only.ts: 0.65 KB
  ❌ utils-only.ts: Failed
```

#### Subsequent Runs (With Comparison)
```
📊 Found previous results with 3 entries

🔄 Bundle Size Comparison:
================================================================================
📈 Overall Size Change: +2.15 KB
📊 Files Changed: 2
➕ New Files: 1
➖ Removed Files: 0

📋 Significant Changes (Top 10):
--------------------------------------------------------------------------------
File                                               | Previous  | Current   | Change
--------------------------------------------------------------------------------
networks/test-import-size/index.ts                 | 10.48     | 12.63     | +2.15 KB
networks/test-import-size/network-only.ts          | 0.66      | 0.65      | -0.01 KB

➕ New Files:
------------------------------------------------------------
  networks/test-import-size/new-feature.ts: 1.25 KB

📦 Package-Level Changes:
------------------------------------------------------------
  networks: +2.14 KB (2 files)
```

## Size Comparison Features

The enhanced bundle analysis script now includes powerful comparison capabilities:

### Automatic Comparison
- **Baseline Creation**: First run creates a baseline for future comparisons
- **Change Detection**: Automatically detects size increases, decreases, and new/removed files
- **Color-coded Output**: Red for increases, green for decreases, yellow for no change
- **Simple File Management**: Uses a single `results.json` file for clean file system

### Comparison Metrics
- **File-level Changes**: Shows before/after sizes for each file
- **Package-level Summary**: Aggregated changes per package
- **Overall Impact**: Total size change across all files
- **Significant Changes**: Highlights the top 10 most impactful changes

### Use Cases
- **Code Review**: Quickly see bundle size impact of changes
- **Performance Monitoring**: Track bundle size trends over time
- **Regression Detection**: Identify unexpected size increases
- **Optimization Validation**: Confirm that optimizations reduce bundle size

## Benefits

1. **Comprehensive Testing**: Test different import patterns and subsets of functionality
2. **Modular Analysis**: Understand which parts of your package contribute most to bundle size
3. **Easy Extension**: Simply add new `.ts` files to test additional scenarios
4. **Detailed Reporting**: Get granular insights into bundle composition
5. **Change Tracking**: Monitor bundle size changes over time with detailed comparisons
6. **Visual Feedback**: Color-coded output makes it easy to spot size changes at a glance
