import { WasmContractQueryResponse } from '../types'
import { toUtf8 } from '../../../utils'
import { AssetInfo, PriceResponse } from './types'

export class PriceQueryTransformer {
  static contractPricesResponseToPrices(
    response: WasmContractQueryResponse,
  ): Array<{ assetInfo: AssetInfo; price: string }> {
    const data = JSON.parse(toUtf8(response.data)) as PriceResponse

    return data.map(([assetInfo, priceInfo]) => ({
      assetInfo,
      price: priceInfo.price,
    }))
  }
}
