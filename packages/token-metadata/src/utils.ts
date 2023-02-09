import { Cw20Token, Cw20TokenSingle, Cw20TokenSource } from './types'

export const getCw20TokenSingle = ({
  token,
  address,
  source,
}: {
  token: Cw20Token
  address?: string
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
    if (address) {
      const cw20 = token.cw20s.find(
        (cw20) => cw20.address.toLowerCase() === address.toLowerCase(),
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
