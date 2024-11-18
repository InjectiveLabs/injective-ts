export type AssetInfo =
  | {
      token: {
        contract_addr: string
      }
    }
  | {
      native_token: {
        denom: string
      }
    }

export type AssetInfoWithPrice = {assetInfo: AssetInfo, price: string }

export type PriceResponse = Array<[AssetInfo, { price: string }]>
export type LendingRateResponse = Array<[AssetInfo, string]>

export const NEPTUNE_USDT_CW20_CONTRACT =
  'inj1cy9hes20vww2yr6crvs75gxy5hpycya2hmjg9s'
