import { UiBaseSpotMarket, UiBaseSpotMarketWithToken } from '../client'
import type { Token } from '@injectivelabs/token-metadata'

export const spotMarketTickerMaps = ({
  market,
  slug,
  baseToken,
  quoteToken,
}: {
  market: UiBaseSpotMarket
  slug: string
  baseToken?: Token
  quoteToken?: Token
}) => {
  if (
    baseToken?.symbol === 'APP' &&
    quoteToken?.symbol === 'USDT' &&
    market.ticker === 'APP/INJ'
  ) {
    return {
      ...market,
      slug: 'app-usdt',
      ticker: 'APP/USDT',
      baseToken,
      quoteToken,
    } as UiBaseSpotMarketWithToken
  }

  if (
    baseToken?.symbol === 'ANDR' &&
    quoteToken?.symbol === 'USDT' &&
    market.ticker === 'ANDR/INJ'
  ) {
    return {
      ...market,
      slug: 'andr-usdt',
      ticker: 'ANDR/USDT',
      baseToken,
      quoteToken,
    } as UiBaseSpotMarketWithToken
  }

  const pythLegacyDenom =
    'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1tjcf9497fwmrnk22jfu5hsdq82qshga54ajvzy'

  if (market.baseDenom === pythLegacyDenom) {
    {
      return {
        ...market,
        slug: slug.replace('pyth', 'pythlegacy'),
        ticker: market.ticker.replace('PYTH', 'PYTHlegacy'),
        baseToken,
        quoteToken,
      } as UiBaseSpotMarketWithToken
    }
  }

  const usdcLegacyDenom = 'peggy0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

  if ([market.baseDenom, market.quoteDenom].includes(usdcLegacyDenom)) {
    {
      return {
        ...market,
        slug: slug.replace('usdc', 'usdclegacy'),
        ticker: market.ticker.replace('USDC', 'USDClegacy'),
        baseToken,
        quoteToken,
      } as UiBaseSpotMarketWithToken
    }
  }

  const usdcNobleDenom =
    'ibc/2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E'

  if ([market.baseDenom, market.quoteDenom].includes(usdcNobleDenom)) {
    {
      return {
        ...market,
        slug: slug.replace('usdcnb', 'usdc'),
        ticker: market.ticker.replace('USDCnb', 'USDC'),
        baseToken,
        quoteToken,
      } as UiBaseSpotMarketWithToken
    }
  }

  return {
    ...market,
    slug,
    baseToken,
    quoteToken,
  } as UiBaseSpotMarketWithToken
}
