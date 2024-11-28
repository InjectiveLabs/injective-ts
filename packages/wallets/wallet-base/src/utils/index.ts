export * from './address.js'
export * from './tx.js'
export * from './wallet.js'
export * from './constants.js'
export * from './alchemy.js'
export * from './cosmos.js'

export const capitalize = (str: string): string =>
  str[0].toUpperCase() + str.slice(1)
