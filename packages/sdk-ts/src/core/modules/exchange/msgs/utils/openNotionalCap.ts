import type * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'

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
