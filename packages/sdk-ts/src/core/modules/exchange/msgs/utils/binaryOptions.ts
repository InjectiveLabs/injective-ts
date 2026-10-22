import type * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'

type RetiredBatchFields = Partial<
  Pick<
    InjectiveExchangeV2TxPb.MsgBatchUpdateOrders,
    | 'binaryOptionsOrdersToCancel'
    | 'binaryOptionsMarketIdsToCancelAll'
    | 'binaryOptionsOrdersToCreate'
    | 'binaryOptionsMarketOrdersToCreate'
  >
>

export const assertNoBinaryOptionsOrders = (params: object) => {
  // Legacy JavaScript callers can still supply the removed SDK parameters.
  const legacy = params as RetiredBatchFields

  if (
    legacy.binaryOptionsOrdersToCancel?.length ||
    legacy.binaryOptionsMarketIdsToCancelAll?.length ||
    legacy.binaryOptionsOrdersToCreate?.length ||
    legacy.binaryOptionsMarketOrdersToCreate?.length
  ) {
    throw new Error('Binary options operations have been removed in v1.21')
  }
}
