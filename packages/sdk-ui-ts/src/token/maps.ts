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

  const usdcEtDenom =
    'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk'

  if ([market.baseDenom, market.quoteDenom].includes(usdcEtDenom)) {
    {
      return {
        ...market,
        slug: slug.replace('usdc', 'usdcet'),
        ticker: market.ticker.replace('USDC', 'USDCet'),
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

  const nonjaUnverifiedDenom =
    'factory/inj1alwxgkns9x7d2sprymwwfvzl5t7teetym02lrj/NONJA'

  if (market.baseDenom === nonjaUnverifiedDenom) {
    {
      return {
        ...market,
        slug: slug.replace('nonja', 'nonjaunverified'),
        ticker: market.ticker.replace('NONJA', 'NONJAunverified'),
        baseToken,
        quoteToken,
      } as UiBaseSpotMarketWithToken
    }
  }

  const solanaLegacyDenom =
    'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1sthrn5ep8ls5vzz8f9gp89khhmedahhdkqa8z3'

  if (market.baseDenom === solanaLegacyDenom) {
    {
      return {
        ...market,
        slug,
        ticker: market.ticker.replace('SOL', 'SOLlegacy'),
        baseToken,
        quoteToken,
      } as UiBaseSpotMarketWithToken
    }
  }

  const arbLegacyDenom =
    'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1d5vz0uzwlpfvgwrwulxg6syy82axa58y4fuszd'

  if (market.baseDenom === arbLegacyDenom) {
    {
      return {
        ...market,
        slug,
        ticker: market.ticker.replace('ARB', 'ARBlegacy'),
        baseToken,
        quoteToken,
      } as UiBaseSpotMarketWithToken
    }
  }

  const wmaticLegacyDenom =
    'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1dxv423h8ygzgxmxnvrf33ws3k94aedfdevxd8h'

  if (market.baseDenom === wmaticLegacyDenom) {
    {
      return {
        ...market,
        slug,
        ticker: market.ticker.replace('WMATIC', 'WMATIClegacy'),
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
