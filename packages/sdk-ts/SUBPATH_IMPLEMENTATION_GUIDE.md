# sdk-ts Subpath Implementation Guide

This document provides step-by-step instructions for implementing subpath imports in `@injectivelabs/sdk-ts`.

---

## Overview

**Goal:** Enable subpath imports like `@injectivelabs/sdk-ts/client/indexer` while maintaining backward compatibility with barrel imports.

**Subpaths to implement (12 total):**

| Subpath                 | Source Entry Point               |
| ----------------------- | -------------------------------- |
| `sdk-ts/client/indexer` | `src/client/indexer/index.ts`    |
| `sdk-ts/client/chain`   | `src/client/chain/index.ts`      |
| `sdk-ts/client/wasm`    | `src/client/wasm/index.ts`       |
| `sdk-ts/client/abacus`  | `src/client/abacus/index.ts`     |
| `sdk-ts/client/olp`     | `src/client/olp/index.ts`        |
| `sdk-ts/core/modules`   | `src/core/modules/index.ts`      |
| `sdk-ts/core/accounts`  | `src/core/accounts/index.ts`     |
| `sdk-ts/core/tx`        | `src/core/tx/index.ts`           |
| `sdk-ts/types`          | `src/types/index.ts`             |
| `sdk-ts/utils`          | `src/utils/index.ts`             |
| `sdk-ts/service`        | `src/service/index.ts`           |
| `sdk-ts/cosmjs`         | `src/cosmjs.ts` (already exists) |

---

## Phase 1: Update tsdown.config.ts

Update the entry points in `packages/sdk-ts/tsdown.config.ts`:

```typescript
import { defineConfig } from 'tsdown'
import { createNestedOnSuccess } from '../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: {
    // Existing entry points (keep for backward compatibility)
    index: './src/index.ts',
    exports: './src/exports.ts',
    cosmjs: './src/cosmjs.ts',

    // New subpath entry points
    'client/indexer': './src/client/indexer/index.ts',
    'client/chain': './src/client/chain/index.ts',
    'client/wasm': './src/client/wasm/index.ts',
    'client/abacus': './src/client/abacus/index.ts',
    'client/olp': './src/client/olp/index.ts',
    'core/modules': './src/core/modules/index.ts',
    'core/accounts': './src/core/accounts/index.ts',
    'core/tx': './src/core/tx/index.ts',
    types: './src/types/index.ts',
    utils: './src/utils/index.ts',
    service: './src/service/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  treeshake: true,
  platform: 'neutral',
  target: 'es2018',
  outDir: 'dist',
  external: [
    // External workspace dependencies
    '@injectivelabs/exceptions',
    '@injectivelabs/networks',
    '@injectivelabs/ts-types',
    '@injectivelabs/utils',
    // External proto packages
    '@injectivelabs/olp-proto-ts-v2',
    '@injectivelabs/mito-proto-ts-v2',
    '@injectivelabs/core-proto-ts-v2',
    '@injectivelabs/abacus-proto-ts-v2',
    '@injectivelabs/indexer-proto-ts-v2',
    // Other heavy external dependencies
    '@cosmjs/amino',
    '@cosmjs/proto-signing',
    '@cosmjs/stargate',
    'axios',
    'ethers',
    'rxjs',
  ],
  onSuccess: createNestedOnSuccess(),
})
```

---

## Phase 2: Update package.json exports

Replace the `exports` field in `packages/sdk-ts/package.json` with:

```json
{
  "exports": {
    ".": {
      "react-native": {
        "import": "./dist/esm/index.js",
        "require": "./dist/cjs/index.js",
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.js"
      },
      "require": {
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.js"
      },
      "import": {
        "types": "./dist/esm/index.d.ts",
        "default": "./dist/esm/index.js"
      },
      "default": {
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.js"
      }
    },
    "./exports": {
      "react-native": {
        "import": "./dist/esm/exports.js",
        "require": "./dist/cjs/exports.js",
        "types": "./dist/cjs/exports.d.ts",
        "default": "./dist/cjs/exports.js"
      },
      "require": {
        "types": "./dist/cjs/exports.d.ts",
        "default": "./dist/cjs/exports.js"
      },
      "import": {
        "types": "./dist/esm/exports.d.ts",
        "default": "./dist/esm/exports.js"
      },
      "default": {
        "types": "./dist/cjs/exports.d.ts",
        "default": "./dist/cjs/exports.js"
      }
    },
    "./cosmjs": {
      "react-native": {
        "import": "./dist/esm/cosmjs.js",
        "require": "./dist/cjs/cosmjs.js",
        "types": "./dist/cjs/cosmjs.d.ts",
        "default": "./dist/cjs/cosmjs.js"
      },
      "require": {
        "types": "./dist/cjs/cosmjs.d.ts",
        "default": "./dist/cjs/cosmjs.js"
      },
      "import": {
        "types": "./dist/esm/cosmjs.d.ts",
        "default": "./dist/esm/cosmjs.js"
      },
      "default": {
        "types": "./dist/cjs/cosmjs.d.ts",
        "default": "./dist/cjs/cosmjs.js"
      }
    },
    "./client/indexer": {
      "react-native": {
        "import": "./dist/esm/client/indexer.js",
        "require": "./dist/cjs/client/indexer.js",
        "types": "./dist/cjs/client/indexer.d.ts",
        "default": "./dist/cjs/client/indexer.js"
      },
      "require": {
        "types": "./dist/cjs/client/indexer.d.ts",
        "default": "./dist/cjs/client/indexer.js"
      },
      "import": {
        "types": "./dist/esm/client/indexer.d.ts",
        "default": "./dist/esm/client/indexer.js"
      },
      "default": {
        "types": "./dist/cjs/client/indexer.d.ts",
        "default": "./dist/cjs/client/indexer.js"
      }
    },
    "./client/chain": {
      "react-native": {
        "import": "./dist/esm/client/chain.js",
        "require": "./dist/cjs/client/chain.js",
        "types": "./dist/cjs/client/chain.d.ts",
        "default": "./dist/cjs/client/chain.js"
      },
      "require": {
        "types": "./dist/cjs/client/chain.d.ts",
        "default": "./dist/cjs/client/chain.js"
      },
      "import": {
        "types": "./dist/esm/client/chain.d.ts",
        "default": "./dist/esm/client/chain.js"
      },
      "default": {
        "types": "./dist/cjs/client/chain.d.ts",
        "default": "./dist/cjs/client/chain.js"
      }
    },
    "./client/wasm": {
      "react-native": {
        "import": "./dist/esm/client/wasm.js",
        "require": "./dist/cjs/client/wasm.js",
        "types": "./dist/cjs/client/wasm.d.ts",
        "default": "./dist/cjs/client/wasm.js"
      },
      "require": {
        "types": "./dist/cjs/client/wasm.d.ts",
        "default": "./dist/cjs/client/wasm.js"
      },
      "import": {
        "types": "./dist/esm/client/wasm.d.ts",
        "default": "./dist/esm/client/wasm.js"
      },
      "default": {
        "types": "./dist/cjs/client/wasm.d.ts",
        "default": "./dist/cjs/client/wasm.js"
      }
    },
    "./client/abacus": {
      "react-native": {
        "import": "./dist/esm/client/abacus.js",
        "require": "./dist/cjs/client/abacus.js",
        "types": "./dist/cjs/client/abacus.d.ts",
        "default": "./dist/cjs/client/abacus.js"
      },
      "require": {
        "types": "./dist/cjs/client/abacus.d.ts",
        "default": "./dist/cjs/client/abacus.js"
      },
      "import": {
        "types": "./dist/esm/client/abacus.d.ts",
        "default": "./dist/esm/client/abacus.js"
      },
      "default": {
        "types": "./dist/cjs/client/abacus.d.ts",
        "default": "./dist/cjs/client/abacus.js"
      }
    },
    "./client/olp": {
      "react-native": {
        "import": "./dist/esm/client/olp.js",
        "require": "./dist/cjs/client/olp.js",
        "types": "./dist/cjs/client/olp.d.ts",
        "default": "./dist/cjs/client/olp.js"
      },
      "require": {
        "types": "./dist/cjs/client/olp.d.ts",
        "default": "./dist/cjs/client/olp.js"
      },
      "import": {
        "types": "./dist/esm/client/olp.d.ts",
        "default": "./dist/esm/client/olp.js"
      },
      "default": {
        "types": "./dist/cjs/client/olp.d.ts",
        "default": "./dist/cjs/client/olp.js"
      }
    },
    "./core/modules": {
      "react-native": {
        "import": "./dist/esm/core/modules.js",
        "require": "./dist/cjs/core/modules.js",
        "types": "./dist/cjs/core/modules.d.ts",
        "default": "./dist/cjs/core/modules.js"
      },
      "require": {
        "types": "./dist/cjs/core/modules.d.ts",
        "default": "./dist/cjs/core/modules.js"
      },
      "import": {
        "types": "./dist/esm/core/modules.d.ts",
        "default": "./dist/esm/core/modules.js"
      },
      "default": {
        "types": "./dist/cjs/core/modules.d.ts",
        "default": "./dist/cjs/core/modules.js"
      }
    },
    "./core/accounts": {
      "react-native": {
        "import": "./dist/esm/core/accounts.js",
        "require": "./dist/cjs/core/accounts.js",
        "types": "./dist/cjs/core/accounts.d.ts",
        "default": "./dist/cjs/core/accounts.js"
      },
      "require": {
        "types": "./dist/cjs/core/accounts.d.ts",
        "default": "./dist/cjs/core/accounts.js"
      },
      "import": {
        "types": "./dist/esm/core/accounts.d.ts",
        "default": "./dist/esm/core/accounts.js"
      },
      "default": {
        "types": "./dist/cjs/core/accounts.d.ts",
        "default": "./dist/cjs/core/accounts.js"
      }
    },
    "./core/tx": {
      "react-native": {
        "import": "./dist/esm/core/tx.js",
        "require": "./dist/cjs/core/tx.js",
        "types": "./dist/cjs/core/tx.d.ts",
        "default": "./dist/cjs/core/tx.js"
      },
      "require": {
        "types": "./dist/cjs/core/tx.d.ts",
        "default": "./dist/cjs/core/tx.js"
      },
      "import": {
        "types": "./dist/esm/core/tx.d.ts",
        "default": "./dist/esm/core/tx.js"
      },
      "default": {
        "types": "./dist/cjs/core/tx.d.ts",
        "default": "./dist/cjs/core/tx.js"
      }
    },
    "./types": {
      "react-native": {
        "import": "./dist/esm/types.js",
        "require": "./dist/cjs/types.js",
        "types": "./dist/cjs/types.d.ts",
        "default": "./dist/cjs/types.js"
      },
      "require": {
        "types": "./dist/cjs/types.d.ts",
        "default": "./dist/cjs/types.js"
      },
      "import": {
        "types": "./dist/esm/types.d.ts",
        "default": "./dist/esm/types.js"
      },
      "default": {
        "types": "./dist/cjs/types.d.ts",
        "default": "./dist/cjs/types.js"
      }
    },
    "./utils": {
      "react-native": {
        "import": "./dist/esm/utils.js",
        "require": "./dist/cjs/utils.js",
        "types": "./dist/cjs/utils.d.ts",
        "default": "./dist/cjs/utils.js"
      },
      "require": {
        "types": "./dist/cjs/utils.d.ts",
        "default": "./dist/cjs/utils.js"
      },
      "import": {
        "types": "./dist/esm/utils.d.ts",
        "default": "./dist/esm/utils.js"
      },
      "default": {
        "types": "./dist/cjs/utils.d.ts",
        "default": "./dist/cjs/utils.js"
      }
    },
    "./service": {
      "react-native": {
        "import": "./dist/esm/service.js",
        "require": "./dist/cjs/service.js",
        "types": "./dist/cjs/service.d.ts",
        "default": "./dist/cjs/service.js"
      },
      "require": {
        "types": "./dist/cjs/service.d.ts",
        "default": "./dist/cjs/service.js"
      },
      "import": {
        "types": "./dist/esm/service.d.ts",
        "default": "./dist/esm/service.js"
      },
      "default": {
        "types": "./dist/cjs/service.d.ts",
        "default": "./dist/cjs/service.js"
      }
    },
    "./src/*": "./src/*"
  }
}
```

---

## Phase 3: Build and Verify

### 3.1 Build the package

```bash
cd packages/sdk-ts
pnpm build
```

### 3.2 Verify dist output structure

After build, verify these files exist:

```
dist/
├── esm/
│   ├── index.js
│   ├── index.d.ts
│   ├── cosmjs.js
│   ├── cosmjs.d.ts
│   ├── types.js
│   ├── types.d.ts
│   ├── utils.js
│   ├── utils.d.ts
│   ├── service.js
│   ├── service.d.ts
│   └── client/
│       ├── indexer.js
│       ├── indexer.d.ts
│       ├── chain.js
│       ├── chain.d.ts
│       ├── wasm.js
│       ├── wasm.d.ts
│       ├── abacus.js
│       ├── abacus.d.ts
│       ├── olp.js
│       └── olp.d.ts
│   └── core/
│       ├── modules.js
│       ├── modules.d.ts
│       ├── accounts.js
│       ├── accounts.d.ts
│       ├── tx.js
│       └── tx.d.ts
├── cjs/
│   └── (same structure as esm/)
```

### 3.3 Test imports work

Create a test file to verify:

```typescript
// test-subpaths.ts
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts/client/indexer'
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts/client/chain'
import { MsgSend } from '@injectivelabs/sdk-ts/core/modules'
import { Address } from '@injectivelabs/sdk-ts/core/accounts'
import { TokenStatic } from '@injectivelabs/sdk-ts/types'
import { formatAmountToAllowableAmount } from '@injectivelabs/sdk-ts/utils'
import { TokenStaticFactory } from '@injectivelabs/sdk-ts/service'

// Also verify barrel import still works
import { IndexerGrpcSpotApi as IndexerGrpcSpotApi2 } from '@injectivelabs/sdk-ts'

console.log('All imports work!')
```

---

## Phase 4: Migrate Monorepo Packages (Internal Enforcement)

After Phase 3 is verified, migrate all internal monorepo packages to use subpath imports.

### 4.1 Packages to migrate

Run this to find all internal sdk-ts imports:

```bash
rg "from '@injectivelabs/sdk-ts'" packages/ --type ts -l
```

### 4.2 Migration mappings

Use these mappings to update imports:

| Old Import                                                                        | New Import                             |
| --------------------------------------------------------------------------------- | -------------------------------------- |
| `IndexerGrpc*Api`, `IndexerRest*Api`, `IndexerGrpc*Stream`, `Indexer*Transformer` | `@injectivelabs/sdk-ts/client/indexer` |
| `ChainGrpc*Api`, `ChainRest*Api`, `Chain*Transformer`                             | `@injectivelabs/sdk-ts/client/chain`   |
| Wasm queries (swap, neptune, nameservice)                                         | `@injectivelabs/sdk-ts/client/wasm`    |
| `AbacusGrpcApi`                                                                   | `@injectivelabs/sdk-ts/client/abacus`  |
| `OLPGrpcApi`                                                                      | `@injectivelabs/sdk-ts/client/olp`     |
| `Msg*` classes                                                                    | `@injectivelabs/sdk-ts/core/modules`   |
| `Address`, `PrivateKey`, `PublicKey`, `BaseAccount`                               | `@injectivelabs/sdk-ts/core/accounts`  |
| `TxGrpcApi`, `TxRestApi`, broadcaster, eip712                                     | `@injectivelabs/sdk-ts/core/tx`        |
| `TokenStatic`, `TokenType`, `TradeDirection`, etc.                                | `@injectivelabs/sdk-ts/types`          |
| `formatAmount*`, `cosmosSdkDecToBigNumber`, etc.                                  | `@injectivelabs/sdk-ts/utils`          |
| `TokenStaticFactory`, `TokenPrice`                                                | `@injectivelabs/sdk-ts/service`        |
| Stargate, signers                                                                 | `@injectivelabs/sdk-ts/cosmjs`         |

### 4.3 Example migration

**Before:**

```typescript
import { IndexerGrpcSpotApi, IndexerGrpcSpotStream, MsgSend, Address, TokenStatic, formatAmountToAllowableAmount } from '@injectivelabs/sdk-ts'
```

**After:**

```typescript
import { IndexerGrpcSpotApi, IndexerGrpcSpotStream } from '@injectivelabs/sdk-ts/client/indexer'
import { MsgSend } from '@injectivelabs/sdk-ts/core/modules'
import { Address } from '@injectivelabs/sdk-ts/core/accounts'
import type { TokenStatic } from '@injectivelabs/sdk-ts/types'
import { formatAmountToAllowableAmount } from '@injectivelabs/sdk-ts/utils'
```

---

## Phase 5: Add ESLint Rule (Optional but Recommended)

Add an ESLint rule to enforce subpath imports within the monorepo.

### 5.1 Create the rule

Add to `scripts/eslint-rules/no-sdk-ts-barrel.js`:

```javascript
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow barrel imports from @injectivelabs/sdk-ts in internal packages',
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (source === '@injectivelabs/sdk-ts') {
          context.report({
            node,
            message: 'Use subpath imports instead of barrel import. ' + 'Example: @injectivelabs/sdk-ts/client/indexer',
          })
        }
      },
    }
  },
}
```

### 5.2 Add to eslint.config.js

```javascript
// In eslint.config.js
import noSdkTsBarrel from './scripts/eslint-rules/no-sdk-ts-barrel.js'

export default [
  // ... existing config
  {
    files: ['packages/**/*.ts'],
    plugins: {
      custom: {
        rules: {
          'no-sdk-ts-barrel': noSdkTsBarrel,
        },
      },
    },
    rules: {
      'custom/no-sdk-ts-barrel': 'error',
    },
  },
]
```

---

## Appendix A: injective-ui lazyImportSdkTs Enhancement

The `lazyImportSdkTs` pattern in injective-ui can be enhanced to use subpaths:

### Current implementation (loads entire sdk-ts):

```typescript
// injective-ui/utils/lib/utils.ts
export const lazyImportSdkTs = async <T>({ endpoint, className }: { endpoint: string; className: string }): Promise<T> => {
  const cacheKey = `${className}-${endpoint}`
  if (sdkTsApiCache.has(cacheKey)) {
    return sdkTsApiCache.get(cacheKey) as T
  }

  // This loads the ENTIRE sdk-ts barrel
  const module = await import('@injectivelabs/sdk-ts')

  const ApiClass = (module as any)[className] as ApiConstructor<T>
  // ...
}
```

### Enhanced implementation (loads specific subpath):

```typescript
type SubpathMap = {
  [className: string]: string
}

const CLASS_TO_SUBPATH: SubpathMap = {
  // Chain APIs
  ChainGrpcBankApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcStakingApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcExchangeApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcGovApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcWasmApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcOracleApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcMintApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcIbcApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcAuctionApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcPeggyApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcDistributionApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcInsuranceFundApi: '@injectivelabs/sdk-ts/client/chain',
  ChainGrpcTokenFactoryApi: '@injectivelabs/sdk-ts/client/chain',
  ChainRestAuthApi: '@injectivelabs/sdk-ts/client/chain',
  ChainRestWasmApi: '@injectivelabs/sdk-ts/client/chain',
  // Indexer APIs
  IndexerGrpcSpotApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerGrpcDerivativesApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerGrpcAccountApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerGrpcAccountPortfolioApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerGrpcOracleApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerGrpcInsuranceFundApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerGrpcExplorerApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerGrpcAuctionApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerGrpcMitoApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerRestExplorerApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerRestSpotChronosApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerRestDerivativesChronosApi: '@injectivelabs/sdk-ts/client/indexer',
  IndexerRestMarketChronosApi: '@injectivelabs/sdk-ts/client/indexer',
}

export const lazyImportSdkTs = async <T>({ endpoint, className }: { endpoint: string; className: string }): Promise<T> => {
  const cacheKey = `${className}-${endpoint}`
  if (sdkTsApiCache.has(cacheKey)) {
    return sdkTsApiCache.get(cacheKey) as T
  }

  // Load specific subpath instead of entire barrel
  const subpath = CLASS_TO_SUBPATH[className]
  if (!subpath) {
    throw new Error(`Unknown className: ${className}. Add it to CLASS_TO_SUBPATH mapping.`)
  }

  const module = await import(/* @vite-ignore */ subpath)

  const ApiClass = (module as any)[className] as ApiConstructor<T>
  if (typeof ApiClass !== 'function') {
    throw new Error(`"${className}" is not a valid constructor in ${subpath}`)
  }

  const instance = new ApiClass(endpoint)
  sdkTsApiCache.set(cacheKey, instance)
  return instance
}
```

**Benefits:**

- Smaller chunk sizes when code-splitting
- Better caching (separate chunks per subpath)
- Type-safe mapping catches typos at build time

---

## Appendix B: Troubleshooting

### Issue: Types not resolving

If TypeScript can't find types for subpath imports:

1. Ensure `moduleResolution` is set to `bundler`, `node16`, or `nodenext` in tsconfig.json
2. Verify the `.d.ts` files exist in `dist/esm/` and `dist/cjs/`
3. Check that `types` comes before `default` in the exports conditions

### Issue: Build fails with circular dependency

If tsdown reports circular dependencies:

1. Check which modules are involved using `madge`:
   ```bash
   npx madge --circular src/
   ```
2. Consider moving shared types to `src/types/` to break cycles

### Issue: React Native not working

React Native requires the `react-native` condition. Ensure:

1. The `react-native` condition is first in each export
2. Metro bundler is configured to use the `exports` field

---

## Checklist

- [ ] Phase 1: Update `tsdown.config.ts` with new entry points
- [ ] Phase 2: Update `package.json` exports field
- [ ] Phase 3: Build and verify dist output
- [ ] Phase 3: Test imports work (both subpath and barrel)
- [ ] Phase 4: Migrate internal monorepo packages
- [ ] Phase 5: Add ESLint rule (optional)
- [ ] Update injective-ui `lazyImportSdkTs` (separate task)
