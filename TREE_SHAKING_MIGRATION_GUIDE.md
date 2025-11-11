# Tree-Shaking Migration Guide

## Overview

This guide provides instructions for migrating proto imports in `@sdk-ts` to use tree-shaking friendly patterns. The goal is to standardize all imports to directly reference generated proto files instead of going through barrel exports.

## Why This Matters

**Current Problem:**

- Inconsistent import patterns across the codebase
- Many files import from barrel files (`index.ts`) which use `export * as` namespace re-exports
- This prevents optimal tree-shaking and increases bundle sizes

**Benefits of Migration:**

- **10-30% smaller bundle sizes** for applications using specific APIs
- **Better tree-shaking**: Bundlers can eliminate unused code more effectively
- **Consistency**: Same pattern across the entire codebase
- **Explicit dependencies**: Clear which proto files are being used

## Import Pattern Standard

### ✅ CORRECT Pattern (Tree-Shaking Friendly)

```typescript
// Import proto types namespace
import * as InjectiveAuctionV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/query_pb.mjs'

// Import client class
import { QueryClient as InjectiveAuctionV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/query_pb.client.mjs'
```

### ❌ INCORRECT Pattern (Not Tree-Shaking Friendly)

```typescript
// Importing from barrel file
import {
  MitoAPIClient,
  GoadesignGoagenMitoApiPb,
} from '@injectivelabs/mito-proto-ts-v2'
```

---

## Migration Instructions by Package

### Package: `@injectivelabs/indexer-proto-ts-v2`

#### Pattern Mapping

| Barrel Import                          | Direct Import                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| `InjectiveAccountsRpcPb`               | `@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb`                   |
| `InjectiveAccountsRPCClient`           | `@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb.client`            |
| `InjectiveArchiverRpcPb`               | `@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb`                   |
| `InjectiveArchiverRPCClient`           | `@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb.client`            |
| `InjectiveAuctionRpcPb`                | `@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb`                    |
| `InjectiveAuctionRPCClient`            | `@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb.client`             |
| `InjectiveCampaignRpcPb`               | `@injectivelabs/indexer-proto-ts-v2/generated/injective_campaign_rpc_pb`                   |
| `InjectiveCampaignRPCClient`           | `@injectivelabs/indexer-proto-ts-v2/generated/injective_campaign_rpc_pb.client`            |
| `InjectiveDerivativeExchangeRpcPb`     | `@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb`        |
| `InjectiveDerivativeExchangeRPCClient` | `@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb.client` |
| `InjectiveExchangeRpcPb`               | `@injectivelabs/indexer-proto-ts-v2/generated/injective_exchange_rpc_pb`                   |
| `InjectiveExchangeRPCClient`           | `@injectivelabs/indexer-proto-ts-v2/generated/injective_exchange_rpc_pb.client`            |
| `InjectiveExplorerRpcPb`               | `@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb`                   |
| `InjectiveExplorerRPCClient`           | `@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb.client`            |
| `InjectiveInsuranceRpcPb`              | `@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb`                  |
| `InjectiveInsuranceRPCClient`          | `@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb.client`           |
| `InjectiveMegavaultRpcPb`              | `@injectivelabs/indexer-proto-ts-v2/generated/injective_megavault_rpc_pb`                  |
| `InjectiveMegavaultRPCClient`          | `@injectivelabs/indexer-proto-ts-v2/generated/injective_megavault_rpc_pb.client`           |
| `InjectiveMetaRpcPb`                   | `@injectivelabs/indexer-proto-ts-v2/generated/injective_meta_rpc_pb`                       |
| `InjectiveMetaRPCClient`               | `@injectivelabs/indexer-proto-ts-v2/generated/injective_meta_rpc_pb.client`                |
| `InjectiveOracleRpcPb`                 | `@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb`                     |
| `InjectiveOracleRPCClient`             | `@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb.client`              |
| `InjectivePortfolioRpcPb`              | `@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb`                  |
| `InjectivePortfolioRPCClient`          | `@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb.client`           |
| `InjectiveSpotExchangeRpcPb`           | `@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb`              |
| `InjectiveSpotExchangeRPCClient`       | `@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb.client`       |
| `InjectiveTradingRpcPb`                | `@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb`                    |
| `InjectiveTradingRPCClient`            | `@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb.client`             |

### Package: `@injectivelabs/mito-proto-ts-v2`

| Barrel Import              | Direct Import                                                                   |
| -------------------------- | ------------------------------------------------------------------------------- |
| `GoadesignGoagenMitoApiPb` | `@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb`        |
| `MitoAPIClient`            | `@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb.client` |

### Package: `@injectivelabs/olp-proto-ts-v2`

| Barrel Import             | Direct Import                                            |
| ------------------------- | -------------------------------------------------------- |
| `DmmPb`                   | `@injectivelabs/olp-proto-ts-v2/generated/dmm_pb`        |
| `InjectiveDmmV2RPCClient` | `@injectivelabs/olp-proto-ts-v2/generated/dmm_pb.client` |

### Package: `@injectivelabs/core-proto-ts-v2`

| Barrel Import           | Direct Import                                                             |
| ----------------------- | ------------------------------------------------------------------------- |
| `CosmwasmWasmV1TypesPb` | `@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/types_pb.mjs` |

---

## Files to Migrate

### Priority 1: GRPC API Files (High Impact)

These are the main entry points and have the highest impact on bundle size.

#### Indexer GRPC APIs

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcAccountApi.ts`

- Change: `InjectiveAccountsRpcPb` → Direct import
- Change: `InjectiveAccountsRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcArchiverApi.ts`

- Change: `InjectiveArchiverRpcPb` → Direct import
- Change: `InjectiveArchiverRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcAuctionApi.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcCampaignApi.ts`

- Change: `InjectiveCampaignRpcPb` → Direct import
- Change: `InjectiveCampaignRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcDerivativesApi.ts`

- Change: `InjectiveDerivativeExchangeRpcPb` → Direct import
- Change: `InjectiveDerivativeExchangeRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcExplorerApi.ts`

- Change: `InjectiveExplorerRpcPb` → Direct import
- Change: `InjectiveExplorerRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcInsuranceFundApi.ts`

- Change: `InjectiveInsuranceRpcPb` → Direct import
- Change: `InjectiveInsuranceRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcMegaVaultApi.ts`

- Change: `InjectiveMegavaultRpcPb` → Direct import
- Change: `InjectiveMegavaultRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcMetaApi.ts`

- Change: `InjectiveMetaRpcPb` → Direct import
- Change: `InjectiveMetaRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcMitoApi.ts`

- Change: `GoadesignGoagenMitoApiPb` → Direct import
- Change: `MitoAPIClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcOracleApi.ts`

- Change: `InjectiveOracleRpcPb` → Direct import
- Change: `InjectiveOracleRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcReferralApi.ts`

- Change: `InjectiveReferralRpcPb` → Direct import
- Change: `InjectiveReferralRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcSpotApi.ts`

- Change: `InjectiveSpotExchangeRpcPb` → Direct import
- Change: `InjectiveSpotExchangeRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcTradingApi.ts`

- Change: `InjectiveTradingRpcPb` → Direct import
- Change: `InjectiveTradingRPCClient` → Direct import

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcWeb3GwApi.ts`

- Change: `InjectiveExchangeRpcPb` → Direct import

#### OLP GRPC APIs

**File:** `packages/sdk-ts/src/client/olp/grpc/OLPGrpcApi.ts`

- Change: `DmmPb` → Direct import
- Change: `InjectiveDmmV2RPCClient` → Direct import

---

### Priority 2: Stream Files (High Impact)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcAccountPortfolioStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcAccountStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcArchiverStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcAuctionStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcDerivativesStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcExplorerStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcMitoStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcOracleStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcSpotStream.ts`

- ✅ Already uses direct imports (no changes needed)

**File:** `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcTradingStream.ts`

- ✅ Already uses direct imports (no changes needed)

---

### Priority 3: Transformer Files (Medium Impact)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerAccountPortfolioTransformer.ts`

- Change: `InjectivePortfolioRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcAccountTransformer.ts`

- Change: `InjectiveAccountsRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcArchiverTransformer.ts`

- Change: `InjectiveArchiverRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcDerivativeTransformer.ts`

- Change: `InjectiveDerivativeExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcExplorerTransformer.ts`

- Change: `InjectiveExplorerRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcInsuranceFundTransformer.ts`

- Change: `InjectiveInsuranceRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcMegaVaultTransformer.ts`

- Change: `InjectiveMegavaultRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcMitoTransformer.ts`

- Change: `GoadesignGoagenMitoApiPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcMitoStreamTransformer.ts`

- Change: `GoadesignGoagenMitoApiPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcOracleTransformer.ts`

- Change: `InjectiveOracleRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcSpotTransformer.ts`

- Change: `InjectiveExplorerRpcPb` → Direct import (type only)
- Change: `InjectiveSpotExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerDerivativeStreamTransformer.ts`

- Change: `InjectiveDerivativeExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerSpotStreamTransformer.ts`

- Change: `InjectiveSpotExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerAccountPortfolioStreamTransformer.ts`

- Change: `InjectivePortfolioRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerAccountStreamTransformer.ts`

- Change: `InjectiveAccountsRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerArchiverStreamTransformer.ts`

- Change: `InjectiveArchiverRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerAuctionStreamTransformer.ts`

- Change: `InjectiveAuctionRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerExplorerStreamTransformer.ts`

- Change: `InjectiveExplorerRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/transformers/IndexerOracleStreamTransformer.ts`

- Change: `InjectiveOracleRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/olp/grpc/transformers/index.ts`

- Change: `DmmPb` → Direct import (type only)

---

### Priority 4: Type Definition Files (Lower Impact)

**File:** `packages/sdk-ts/src/client/indexer/types/account.ts`

- Change: `InjectiveAccountsRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/account-portfolio.ts`

- Change: `InjectivePortfolioRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/archiver.ts`

- Change: `InjectiveArchiverRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/derivatives.ts`

- Change: `InjectiveDerivativeExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/exchange.ts`

- Change: `InjectiveSpotExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/insurance-funds.ts`

- Change: `InjectiveInsuranceRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/mega-vault.ts`

- Change: `InjectiveMegavaultRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/mito.ts`

- Change: `GoadesignGoagenMitoApiPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/oracle.ts`

- Change: `InjectiveOracleRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/types/spot.ts`

- Change: `InjectiveSpotExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/olp/grpc/types/index.ts`

- Change: `DmmPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/chain/types/wasm.ts`

- Change: `CosmwasmWasmV1TypesPb` → Direct import

---

### Priority 5: Test/Spec Files (Lower Impact)

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcWeb3GwApi.spec.ts`

- Change: `InjectiveExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcTransactionApi.spec.ts`

- Change: `InjectiveExchangeRpcPb` → Direct import (type only)

**File:** `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcTradingApi.spec.ts`

- Change: `InjectiveTradingRpcPb` → Direct import (type only)

---

## Migration Examples

### Example 1: IndexerGrpcMitoApi.ts

**Before:**

```typescript
import {
  MitoAPIClient,
  GoadesignGoagenMitoApiPb,
} from '@injectivelabs/mito-proto-ts-v2'
```

**After:**

```typescript
import * as GoadesignGoagenMitoApiPb from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb'
import { MitoAPIClient } from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb.client'
```

### Example 2: IndexerGrpcSpotApi.ts

**Before:**

```typescript
import {
  InjectiveSpotExchangeRpcPb,
  InjectiveSpotExchangeRPCClient,
} from '@injectivelabs/indexer-proto-ts-v2'
```

**After:**

```typescript
import * as InjectiveSpotExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb.client'
```

### Example 3: Type Files (Type-only imports)

**Before:**

```typescript
import type { GoadesignGoagenMitoApiPb } from '@injectivelabs/mito-proto-ts-v2'
```

**After:**

```typescript
import type * as GoadesignGoagenMitoApiPb from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb'
```

### Example 4: OLPGrpcApi.ts

**Before:**

```typescript
import { DmmPb, InjectiveDmmV2RPCClient } from '@injectivelabs/olp-proto-ts-v2'
```

**After:**

```typescript
import * as DmmPb from '@injectivelabs/olp-proto-ts-v2/generated/dmm_pb'
import { InjectiveDmmV2RPCClient } from '@injectivelabs/olp-proto-ts-v2/generated/dmm_pb.client'
```

---

## Summary Statistics

### Total Files to Migrate: **43 files**

**By Priority:**

- Priority 1 (GRPC APIs): 16 files
- Priority 2 (Streams): 0 files (already correct)
- Priority 3 (Transformers): 20 files
- Priority 4 (Types): 11 files
- Priority 5 (Tests): 3 files

**By Package:**

- `@injectivelabs/indexer-proto-ts-v2`: 37 files
- `@injectivelabs/mito-proto-ts-v2`: 4 files
- `@injectivelabs/olp-proto-ts-v2`: 3 files
- `@injectivelabs/core-proto-ts-v2`: 1 file

---

## Testing After Migration

After migrating, ensure:

1. **All tests pass**: Run `pnpm test` or equivalent
2. **Type checking passes**: Run `pnpm typecheck` or equivalent
3. **Build succeeds**: Run `pnpm build`
4. **Bundle size reduced**: Compare bundle sizes before/after
5. **Runtime behavior unchanged**: Test key functionality

---

## Automation Opportunity

Consider creating a codemod script to automate this migration:

```bash
# Pseudo-code for codemod
1. Find all imports from proto packages
2. Parse import specifiers
3. Map to direct import paths
4. Rewrite import statements
5. Preserve type-only imports
```

---

## Future: ESLint Rule

To prevent regression, consider adding an ESLint rule:

```javascript
// .eslintrc.js
{
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@injectivelabs/*-proto-ts-v2'],
            message: 'Import directly from /generated/ path for better tree-shaking'
          }
        ]
      }
    ]
  }
}
```

---

## Questions?

If you encounter any issues during migration:

1. Check that the generated file exists in the proto package
2. Verify the import path matches the file structure
3. Ensure `.mjs` extension is used for core-proto-ts-v2 files
4. Check that client imports use `.client` suffix

---

## Completion Checklist

- [ ] Migrate Priority 1 files (GRPC APIs)
- [ ] Migrate Priority 2 files (Streams) - Already done!
- [ ] Migrate Priority 3 files (Transformers)
- [ ] Migrate Priority 4 files (Types)
- [ ] Migrate Priority 5 files (Tests)
- [ ] Run tests
- [ ] Verify bundle size reduction
- [ ] Update documentation
- [ ] Add ESLint rule (optional)
- [ ] Create PR with changes

---

**Estimated Time:** 2-4 hours for manual migration
**Estimated Bundle Size Reduction:** 10-30% for applications using specific APIs
