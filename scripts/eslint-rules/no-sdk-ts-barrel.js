/**
 * ESLint rule to enforce using subpath imports from @injectivelabs/sdk-ts
 * instead of the barrel import, for better tree-shaking and smaller bundle sizes.
 *
 * Bad:  import { MsgSend, IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
 * Good: import { MsgSend } from '@injectivelabs/sdk-ts/core/modules'
 * Good: import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts/client/indexer'
 */

// Mapping of common exports to their subpaths
const SUBPATH_MAPPINGS = {
  // client/indexer
  IndexerGrpcAccountApi: '/client/indexer',
  IndexerGrpcAccountPortfolioApi: '/client/indexer',
  IndexerGrpcAuctionApi: '/client/indexer',
  IndexerGrpcDerivativesApi: '/client/indexer',
  IndexerGrpcExplorerApi: '/client/indexer',
  IndexerGrpcInsuranceFundApi: '/client/indexer',
  IndexerGrpcMetaApi: '/client/indexer',
  IndexerGrpcMitoApi: '/client/indexer',
  IndexerGrpcOracleApi: '/client/indexer',
  IndexerGrpcSpotApi: '/client/indexer',
  IndexerGrpcTradingApi: '/client/indexer',
  IndexerRestExplorerApi: '/client/indexer',
  IndexerRestLeaderboardChronosApi: '/client/indexer',
  IndexerRestMarketChronosApi: '/client/indexer',
  IndexerGrpcArchiverApi: '/client/indexer',
  IndexerGrpcCampaignApi: '/client/indexer',
  IndexerGrpcAccountStreamTransformer: '/client/indexer',
  IndexerGrpcDerivativeStreamTransformer: '/client/indexer',
  IndexerGrpcSpotStreamTransformer: '/client/indexer',
  IndexerGrpcStreamTransformer: '/client/indexer',

  // client/chain
  ChainGrpcAuctionApi: '/client/chain',
  ChainGrpcAuthApi: '/client/chain',
  ChainGrpcAuthZApi: '/client/chain',
  ChainGrpcBankApi: '/client/chain',
  ChainGrpcDistributionApi: '/client/chain',
  ChainGrpcExchangeApi: '/client/chain',
  ChainGrpcGovApi: '/client/chain',
  ChainGrpcIbcApi: '/client/chain',
  ChainGrpcInsuranceFundApi: '/client/chain',
  ChainGrpcMintApi: '/client/chain',
  ChainGrpcOracleApi: '/client/chain',
  ChainGrpcPeggyApi: '/client/chain',
  ChainGrpcPermissionsApi: '/client/chain',
  ChainGrpcStakingApi: '/client/chain',
  ChainGrpcTokenFactoryApi: '/client/chain',
  ChainGrpcWasmApi: '/client/chain',
  ChainGrpcWasmXApi: '/client/chain',
  ChainRestAuthApi: '/client/chain',
  ChainRestBankApi: '/client/chain',
  ChainRestTendermintApi: '/client/chain',

  // client/wasm
  ExecAction: '/client/wasm',

  // core/modules - Msg classes
  MsgSend: '/core/modules',
  MsgExecuteContract: '/core/modules',
  MsgExecuteContractCompat: '/core/modules',
  MsgInstantiateContract: '/core/modules',
  MsgMigrateContract: '/core/modules',
  MsgStoreCode: '/core/modules',
  MsgDelegate: '/core/modules',
  MsgUndelegate: '/core/modules',
  MsgBeginRedelegate: '/core/modules',
  MsgWithdrawDelegatorReward: '/core/modules',
  MsgWithdrawValidatorCommission: '/core/modules',
  MsgVote: '/core/modules',
  MsgDeposit: '/core/modules',
  MsgSubmitProposal: '/core/modules',
  MsgGrant: '/core/modules',
  MsgRevoke: '/core/modules',
  MsgExec: '/core/modules',
  MsgTransfer: '/core/modules',
  MsgCreateSpotLimitOrder: '/core/modules',
  MsgCreateSpotMarketOrder: '/core/modules',
  MsgCancelSpotOrder: '/core/modules',
  MsgBatchCancelSpotOrders: '/core/modules',
  MsgCreateDerivativeLimitOrder: '/core/modules',
  MsgCreateDerivativeMarketOrder: '/core/modules',
  MsgCancelDerivativeOrder: '/core/modules',
  MsgBatchCancelDerivativeOrders: '/core/modules',
  MsgBatchUpdateOrders: '/core/modules',
  MsgIncreasePositionMargin: '/core/modules',
  MsgLiquidatePosition: '/core/modules',
  MsgSubaccountTransfer: '/core/modules',
  MsgExternalTransfer: '/core/modules',
  MsgPrivilegedExecuteContract: '/core/modules',
  MsgBid: '/core/modules',
  MsgSendToEth: '/core/modules',
  MsgCreateInsuranceFund: '/core/modules',
  MsgUnderwrite: '/core/modules',
  MsgRequestRedemption: '/core/modules',
  MsgRelayPriceFeedPrice: '/core/modules',
  MsgRelayProviderPrices: '/core/modules',
  MsgRelayPythPrices: '/core/modules',
  MsgBroadcasterWithPk: '/core/modules',

  // core/accounts
  Address: '/core/accounts',
  PublicKey: '/core/accounts',
  PrivateKey: '/core/accounts',

  // core/tx
  TxGrpcApi: '/core/tx',
  TxRestApi: '/core/tx',
  createTransaction: '/core/tx',
  createTxRawEIP712: '/core/tx',
  createTxRawFromSigResponse: '/core/tx',
  createWeb3Extension: '/core/tx',
  getEip712TypedData: '/core/tx',
  getInjectiveSignerAddress: '/core/tx',
  SIGN_DIRECT: '/core/tx',
  SIGN_AMINO: '/core/tx',

  // types
  TxRaw: '/types',
  AminoSignResponse: '/types',
  DirectSignResponse: '/types',
  TxResponse: '/types',
  Coin: '/types',

  // utils
  BigNumber: '/utils',
  BigNumberInBase: '/utils',
  BigNumberInWei: '/utils',
  DEFAULT_STD_FEE: '/utils',
  DEFAULT_BLOCK_TIMEOUT_HEIGHT: '/utils',
  getStdFee: '/utils',
  getDefaultSubaccountId: '/utils',
  getSubaccountId: '/utils',
  denomAmountFromGrpcChainDenomAmount: '/utils',
  denomAmountToGrpcChainDenomAmount: '/utils',
  denomAmountFromChainDenomAmount: '/utils',
  denomAmountToChainDenomAmount: '/utils',
  sleep: '/utils',
  binaryToBase64: '/utils',
}

// Known exceptions that should stay in barrel import
const BARREL_EXCEPTIONS = [
  'CosmosTxV1Beta1TxPb',
  'ofacWallets',
  // Proto types that are only in barrel
  /^Cosmos.*Pb$/,
  /^Injective.*Pb$/,
]

function isException(importName) {
  return BARREL_EXCEPTIONS.some((exception) => {
    if (typeof exception === 'string') {
      return importName === exception
    }
    if (exception instanceof RegExp) {
      return exception.test(importName)
    }
    return false
  })
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce using subpath imports from @injectivelabs/sdk-ts instead of barrel imports for better tree-shaking',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null, // Cannot auto-fix as it requires splitting imports
    schema: [],
    messages: {
      useSubpath:
        'Import "{{importName}}" from "@injectivelabs/sdk-ts{{subpath}}" instead of the barrel import for better tree-shaking.',
      avoidBarrel:
        'Avoid importing from "@injectivelabs/sdk-ts" barrel. Use subpath imports like /client/indexer, /client/chain, /core/modules, /core/accounts, /core/tx, /types, /utils, or /service.',
    },
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value

        // Only check imports from @injectivelabs/sdk-ts barrel (not subpaths)
        if (source !== '@injectivelabs/sdk-ts') {
          return
        }

        // Get the filename to exclude sdk-ts internal files
        const filename = context.getFilename()
        if (filename.includes('packages/sdk-ts/')) {
          return // Don't lint sdk-ts internal files
        }

        // Check each imported specifier
        const specifiers = node.specifiers.filter(
          (s) => s.type === 'ImportSpecifier',
        )

        for (const specifier of specifiers) {
          const importName = specifier.imported.name

          // Skip exceptions (proto types, etc.)
          if (isException(importName)) {
            continue
          }

          // Check if we know the subpath for this import
          const subpath = SUBPATH_MAPPINGS[importName]

          if (subpath) {
            context.report({
              node: specifier,
              messageId: 'useSubpath',
              data: { importName, subpath },
            })
          } else {
            // Unknown import from barrel - warn about it
            context.report({
              node: specifier,
              messageId: 'avoidBarrel',
            })
          }
        }
      },
    }
  },
}
