import { WasmContractQueryResponse } from '../types.js'
import { toUtf8 } from '../../../utils/index.js'
import { AssetInfo, PriceResponse, LendingRateResponse } from './types.js'

export class NeptuneQueryTransformer {
  static contractPricesResponseToPrices(
    response: WasmContractQueryResponse,
  ): Array<{ assetInfo: AssetInfo; price: string }> {
    const data = JSON.parse(toUtf8(response.data)) as PriceResponse

    return data.map(([assetInfo, priceInfo]) => ({
      assetInfo,
      price: priceInfo.price,
    }))
  }

  static contractLendingRatesResponseToLendingRates(
    response: WasmContractQueryResponse,
  ): Array<{ assetInfo: AssetInfo; lendingRate: string }> {
    const data = JSON.parse(toUtf8(response.data)) as LendingRateResponse

    return data.map(([assetInfo, lendingRate]) => ({
      assetInfo,
      lendingRate,
    }))
  }
}
