import { BigNumberInBase } from '@injectivelabs/utils'
import { MarketType } from '../types/common'
import { getDecimalsFromNumber } from '@injectivelabs/sdk-ts'
import {
  UiBaseBinaryOptionsMarketWithToken,
  UiBinaryOptionsMarketWithToken,
} from '../types/binary-options'

export class UiBinaryOptionsTransformer {
  static binaryOptionsMarketToUiBinaryOptionsMarket(
    market: UiBaseBinaryOptionsMarketWithToken,
  ): UiBinaryOptionsMarketWithToken {
    return {
      ...market,
      type: MarketType.Derivative,
      subType: MarketType.BinaryOptions,
      quantityDecimals: getDecimalsFromNumber(market.minQuantityTickSize),
      priceDecimals: getDecimalsFromNumber(
        new BigNumberInBase(market.minPriceTickSize)
          .toWei(-market.quoteToken.decimals)
          .toNumber(),
      ),
    }
  }

  static binaryOptionsMarketsToUiBinaryOptionsMarkets(
    markets: UiBaseBinaryOptionsMarketWithToken[],
  ) {
    return markets.map(
      UiBinaryOptionsTransformer.binaryOptionsMarketToUiBinaryOptionsMarket,
    )
  }
}
