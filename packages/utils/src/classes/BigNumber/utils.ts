import { BigNumber } from 'bignumber.js'

export const bigNumberBaseToWei = <T extends string | number | BigNumber, P>(
  value: T,
  decimals = 18,
): P =>
  new BigNumber(value).multipliedBy(
    new BigNumber(10).pow(decimals),
  ) as unknown as P

export const bigNumberWeiToBase = <T extends string | number | BigNumber, P>(
  value: T,
  decimals = 18,
): P =>
  new BigNumber(value).dividedBy(
    new BigNumber(10).pow(decimals),
  ) as unknown as P
