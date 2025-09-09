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

### Example Output

```
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

## Benefits

1. **Comprehensive Testing**: Test different import patterns and subsets of functionality
2. **Modular Analysis**: Understand which parts of your package contribute most to bundle size
3. **Easy Extension**: Simply add new `.ts` files to test additional scenarios
4. **Detailed Reporting**: Get granular insights into bundle composition
