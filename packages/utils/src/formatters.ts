import { AccountAddress } from '@injectivelabs/ts-types'

export const formatWalletAddress = (
  address: AccountAddress,
  substrLength = 6,
): string => {
  if (address.length <= 10) {
    return address
  }

  return `${address.slice(0, substrLength)}...${address.slice(
    address.length - substrLength,
    address.length,
  )}`
}

export const toPascalCase = (str: string): string => {
  return `${str}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      (_$1, $2, $3) => `${$2.toUpperCase() + $3}`,
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

export const snakeToPascal = (str: string): string => {
  return str
    .split('/')
    .map((snake) =>
      snake
        .split('_')
        .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
        .join(''),
    )
    .join('/')
}
