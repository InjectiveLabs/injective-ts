import { GeneralException } from '@injectivelabs/exceptions'
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

/**
 * Fails loudly for JS callers that still pass the retired binary-options batch fields. This
 * guard can go in a later major release. The empty `binary_options_*` fields it protects in the
 * signing payload cannot: they stay while core's MsgBatchUpdateOrders schema defines them.
 */
export const assertNoBinaryOptionsOrders = (params: object) => {
  // Legacy JavaScript callers can still supply the removed SDK parameters.
  const legacy = params as RetiredBatchFields

  if (
    legacy.binaryOptionsOrdersToCancel?.length ||
    legacy.binaryOptionsMarketIdsToCancelAll?.length ||
    legacy.binaryOptionsOrdersToCreate?.length ||
    legacy.binaryOptionsMarketOrdersToCreate?.length
  ) {
    throw new GeneralException(
      new Error('Binary options operations have been removed in v1.21'),
    )
  }
}
