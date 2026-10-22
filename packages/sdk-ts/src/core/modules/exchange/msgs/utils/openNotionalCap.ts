import { toChainFormat } from '@injectivelabs/utils'
import type * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'

/**
 * The proto stores the capped value as a LegacyDec, i.e. the human-readable value
 * scaled by 1e18 (same conversion the V2 order msgs apply to prices in toProto)
 */
export const openNotionalCapToChainFormat = (
  openNotionalCap: InjectiveExchangeV2MarketPb.OpenNotionalCap,
): InjectiveExchangeV2MarketPb.OpenNotionalCap =>
  openNotionalCap.cap.oneofKind === 'capped'
    ? {
        cap: {
          oneofKind: 'capped',
          capped: {
            value: toChainFormat(openNotionalCap.cap.capped.value).toFixed(),
          },
        },
      }
    : openNotionalCap

/**
 * proto-JSON shape (web3gw / EIP712 V2): `{ capped: { value } }` or `{ uncapped: {} }`
 */
export const toOpenNotionalCap = (
  openNotionalCap?: InjectiveExchangeV2MarketPb.OpenNotionalCap,
  formatValue: (value: string) => string = (value) => value,
) => {
  if (!openNotionalCap) {
    return undefined
  }

  const { cap } = openNotionalCap

  if (!cap) {
    throw new Error('Invalid OpenNotionalCap: missing cap union value')
  }

  if (cap.oneofKind === 'uncapped') {
    return { uncapped: {} }
  }

  if (cap.oneofKind === 'capped') {
    return {
      capped: {
        value: formatValue(cap.capped.value),
      },
    }
  }

  throw new Error(
    `Invalid OpenNotionalCap: unsupported cap kind ${cap.oneofKind}`,
  )
}
