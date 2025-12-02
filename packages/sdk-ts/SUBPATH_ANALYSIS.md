# sdk-ts Subpath Import Analysis & Proposal

## Phase 1.1: Analysis Document

### Current Structure Overview

```
src/
├── index.ts          # Main barrel export (re-exports everything)
├── exports.ts        # Cosmjs-specific exports (deprecated)
├── cosmjs.ts         # Cosmjs signers
├── client/           # API clients (indexer, chain, wasm, abacus, olp)
├── core/             # Core modules (accounts, tx, modules/msgs)
├── types/            # Type definitions (token, exchange, cosmos)
├── utils/            # Utility functions
├── service/          # Token services
└── json/             # Static data (OFAC)
```

### Current Export Count by Category

| Category           | Subcategory      | Approx Exports |
| ------------------ | ---------------- | -------------- |
| **client/indexer** | grpc APIs        | 17 classes     |
| **client/indexer** | grpc streams     | 10 classes     |
| **client/indexer** | rest APIs        | 5 classes      |
| **client/indexer** | transformers     | 24 classes     |
| **client/indexer** | types            | ~100+ types    |
| **client/chain**   | grpc APIs        | 21 classes     |
| **client/chain**   | rest APIs        | 4 classes      |
| **client/chain**   | transformers     | 18 classes     |
| **client/chain**   | types            | ~80+ types     |
| **client/wasm**    | queries/services | ~20 classes    |
| **client/abacus**  | grpc API         | 1 class        |
| **client/olp**     | grpc API         | 1 class        |
| **core/modules**   | exchange msgs    | 29 classes     |
| **core/modules**   | bank msgs        | 2 classes      |
| **core/modules**   | staking msgs     | 7 classes      |
| **core/modules**   | gov msgs         | 10 classes     |
| **core/modules**   | authz msgs       | 5 classes      |
| **core/modules**   | other msgs       | ~15 classes    |
| **core/accounts**  | account classes  | 4 classes      |
| **core/tx**        | tx utilities     | ~10 exports    |
| **types**          | token/exchange   | ~15 types      |
| **utils**          | utilities        | ~50 functions  |
| **service**        | token services   | 3 classes      |

**Total: ~400+ exports**

---

## Proposed Subpath Structure (Medium Granularity: 12 Subpaths)

### Recommended Subpaths

| Subpath                 | Contents                                                       | Rationale                         |
| ----------------------- | -------------------------------------------------------------- | --------------------------------- |
| `sdk-ts/client/indexer` | IndexerGrpc*Api, IndexerRest*Api, streams, transformers, types | Most commonly used client APIs    |
| `sdk-ts/client/chain`   | ChainGrpc*Api, ChainRest*Api, transformers, types              | Chain query APIs                  |
| `sdk-ts/client/wasm`    | Wasm queries (swap, neptune, nameservice, strategies)          | CosmWasm interactions             |
| `sdk-ts/core/modules`   | All Msg\* classes (exchange, bank, staking, gov, etc.)         | Transaction messages              |
| `sdk-ts/core/accounts`  | Address, PrivateKey, PublicKey, BaseAccount                    | Account/key management            |
| `sdk-ts/core/tx`        | TxGrpcApi, TxRestApi, broadcaster, eip712                      | Transaction building/broadcasting |
| `sdk-ts/types`          | TokenStatic, TokenType, TradeDirection, etc.                   | Core type definitions             |
| `sdk-ts/utils`          | formatAmount\*, numbers, address, encoding, etc.               | Utility functions                 |
| `sdk-ts/service`        | TokenStaticFactory, TokenPrice                                 | Token services                    |
| `sdk-ts/client/abacus`  | AbacusGrpcApi                                                  | Abacus-specific (isolated)        |
| `sdk-ts/client/olp`     | OLPGrpcApi                                                     | OLP-specific (isolated)           |
| `sdk-ts/cosmjs`         | Stargate client, signers (already exists)                      | CosmJS compatibility              |

---

## Dependency Analysis

### Heavy Dependencies (candidates for isolation)

| Module           | Heavy Deps                    | Recommendation                                         |
| ---------------- | ----------------------------- | ------------------------------------------------------ |
| `core/tx/eip712` | ethers                        | Keep in `core/tx`, users who need eip712 expect ethers |
| `core/stargate`  | @cosmjs/\*                    | Already isolated in `sdk-ts/cosmjs`                    |
| `client/*`       | @injectivelabs/\*-proto-ts-v2 | Proto deps are external, tree-shaking works            |
| `utils/crypto`   | @noble/\*, secp256k1          | Keep in `utils`, commonly needed                       |

### Cross-Subpath Dependencies

```
client/indexer ──depends on──> types (types/exchange, types/token)
client/chain ──depends on──> types
core/modules ──depends on──> utils (for price/quantity formatting)
core/tx ──depends on──> core/accounts, core/modules
service ──depends on──> types
```

**Key insight:** `types` and `utils` are leaf dependencies - they don't depend on other subpaths. This makes them good candidates for separate subpaths.

---

## Proto Handling Recommendation

The proto-generated types come from external packages:

- `@injectivelabs/core-proto-ts-v2`
- `@injectivelabs/indexer-proto-ts-v2`
- `@injectivelabs/mito-proto-ts-v2`
- `@injectivelabs/abacus-proto-ts-v2`
- `@injectivelabs/olp-proto-ts-v2`

These are already **externalized** in `tsdown.config.ts`, meaning:

1. Proto code is NOT bundled into sdk-ts
2. Tree-shaking happens at the proto package level
3. **No special handling needed** - subpaths will naturally benefit

---

## Consumer Usage Patterns (from injective-helix analysis)

### Most Used Imports (Top 20)

| Import                          | Count | Proposed Subpath                |
| ------------------------------- | ----- | ------------------------------- |
| `PositionV2`                    | 22    | `sdk-ts/client/indexer` (types) |
| `TokenStatic`                   | 20    | `sdk-ts/types`                  |
| `Campaign`                      | 13    | `sdk-ts/client/indexer` (types) |
| `TradeDirection`                | 12    | `sdk-ts/types`                  |
| `CampaignV2`                    | 12    | `sdk-ts/client/indexer` (types) |
| `TradingStrategy`               | 9     | `sdk-ts/client/indexer` (types) |
| `DerivativeLimitOrder`          | 7     | `sdk-ts/client/indexer` (types) |
| `IndexerGrpcSpotStream`         | 4     | `sdk-ts/client/indexer`         |
| `formatAmountToAllowableAmount` | 4     | `sdk-ts/utils`                  |
| `MsgExecuteContractCompat`      | 2     | `sdk-ts/core/modules`           |

### Import Pattern Observations

1. **Types dominate** - 54.6% are type-only imports
2. **Indexer types most common** - Position, Order, Trade types
3. **Stream classes** - Used but not as heavily as types
4. **Msg classes** - Used in store/message.ts files
5. **Utils** - formatAmount\*, cosmosSdkDecToBigNumber used frequently

---

## Implementation Plan

### Step 1: Create Subpath Entry Points

Create new index files for each subpath:

```typescript
// src/client/indexer/subpath.ts (new file)
// Re-export only what should be in this subpath
export * from './grpc/index.js'
export * from './grpc_stream/index.js'
export * from './rest/index.js'
export * from './transformers/index.js'
export * from './types/index.js'
```

### Step 2: Update tsdown.config.ts

```typescript
export default defineConfig({
  entry: {
    // Existing
    index: './src/index.ts',
    exports: './src/exports.ts',
    cosmjs: './src/cosmjs.ts',
    // New subpaths
    'client/indexer': './src/client/indexer/subpath.ts',
    'client/chain': './src/client/chain/subpath.ts',
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
  // ... rest of config
})
```

### Step 3: Update package.json exports

```json
{
  "exports": {
    ".": {
      /* existing */
    },
    "./client/indexer": {
      "types": "./dist/esm/client/indexer.d.ts",
      "import": "./dist/esm/client/indexer.js",
      "require": "./dist/cjs/client/indexer.js"
    }
    // ... repeat for each subpath
  }
}
```

---

## Tree-Shaking Impact Estimate

| Scenario                       | Before (barrel)      | After (subpath)     | Reduction |
| ------------------------------ | -------------------- | ------------------- | --------- |
| Only need `TokenStatic` type   | ~400+ exports parsed | ~15 exports parsed  | ~96%      |
| Only need `IndexerGrpcSpotApi` | ~400+ exports parsed | ~50 exports parsed  | ~87%      |
| Need indexer + types           | ~400+ exports parsed | ~115 exports parsed | ~71%      |
| Need everything                | ~400+ exports        | ~400+ exports       | 0%        |

**Note:** These are estimates. Actual bundler behavior depends on the tool (Vite, webpack, etc.) and its tree-shaking capabilities.

---

## Questions to Resolve

1. **Subpath naming:** Should streams be separate (`sdk-ts/client/indexer/streams`) or combined with APIs?

   - **Recommendation:** Keep combined for simplicity (medium granularity)

2. **Types location:** Should indexer types stay in `client/indexer` or move to `types`?

   - **Recommendation:** Keep domain-specific types with their domain (indexer types in indexer subpath)

3. **Transformers:** Expose in subpaths or keep internal?
   - **Recommendation:** Expose - consumers sometimes use transformers directly

---

## Next Steps

1. **Review this proposal** - Any changes to subpath structure?
2. **Proceed to implementation** - Create entry points and update build config
3. **Test tree-shaking** - Verify bundle size improvements
4. **Update package.json exports** - Enable subpath imports
