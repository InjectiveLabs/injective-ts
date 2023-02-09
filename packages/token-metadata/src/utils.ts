import { Cw20Token, Cw20TokenSingle, Cw20TokenSource } from './types'

/**
 * This class can be used to get a token with
 * cw20 information when we have multiple
 * cw20 variations of the same token based on the address/denom
 */
export const getCw20TokenSingle = ({
  token,
  denom,
  source,
}: {
  token: Cw20Token
  denom?: string
  source?: Cw20TokenSource
}): Cw20TokenSingle | undefined => {
  if (!token.cw20 && !token.cw20s) {
    return
  }

  if (token.cw20) {
    return {
      ...token,
      cw20: token.cw20,
    }
  }

  if (token.cw20s) {
    if (denom) {
      const [cw20Address] = denom.startsWith('inj')
        ? [denom]
        : denom.split('/').reverse()

      const cw20 = token.cw20s.find(
        (cw20) => cw20.address.toLowerCase() === cw20Address.toLowerCase(),
      )

      return cw20
        ? {
            ...token,
            cw20,
          }
        : undefined
    }

    if (source) {
      const cw20 = token.cw20s.find(
        (cw20) => cw20.source.toLowerCase() === source.toLowerCase(),
      )

      return cw20
        ? {
            ...token,
            cw20,
          }
        : undefined
    }
  }

  return undefined
}
