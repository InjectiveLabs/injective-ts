import { ReferencePriceSource } from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'
import type * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'

// protobuf-ts strips this prefix from the TS enum keys
const REFERENCE_PRICE_SOURCE_PREFIX = 'REFERENCE_PRICE_SOURCE_'

/**
 * proto-JSON shape (web3gw / EIP712 V2): enum as its full proto name, `null` when unset
 */
export const toReferencePriceGateConfig = (
  config?: InjectiveExchangeV2MarketPb.ReferencePriceGateConfig,
) =>
  config
    ? {
        reference_price_source: `${REFERENCE_PRICE_SOURCE_PREFIX}${ReferencePriceSource[config.referencePriceSource]}`,
        reference_window_seconds: config.referenceWindowSeconds,
        max_open_deviation_bps: config.maxOpenDeviationBps,
      }
    : null
