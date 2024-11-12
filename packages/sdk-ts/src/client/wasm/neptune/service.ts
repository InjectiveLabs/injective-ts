import {
  Network,
  isMainnet,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import { NetworkEndpoints } from '@injectivelabs/networks'
import { AssetInfo, NEPTUNE_USDT_CW20_CONTRACT, AssetInfoWithPrice } from './types'
import { ChainGrpcWasmApi } from '../../chain'
import { QueryGetPrices } from './queries'
import { PriceQueryTransformer } from './transformer'
import ExecArgNeptuneDeposit from '../../../core/modules/wasm/exec-args/ExecArgNeptuneDeposit'
import ExecArgNeptuneWithdraw from '../../../core/modules/wasm/exec-args/ExecArgNeptuneWithdraw'

import MsgExecuteContractCompat from '../../../core/modules/wasm/msgs/MsgExecuteContractCompat'

import { GeneralException } from '@injectivelabs/exceptions'
import { NEPTUNE_PRICE_CONTRACT } from './index'

const NEPTUNE_USDT_MARKET_CONTRACT = 'inj1nc7gjkf2mhp34a6gquhurg8qahnw5kxs5u3s4u'

export class NeptuneService {
  private client: ChainGrpcWasmApi
  private priceOracleContract: string

  /**
   * Constructs a new NeptuneService instan ce.
   * @param network The network to use (default: Mainnet).
   * @param endpoints Optional custom network endpoints.
   */
  constructor(
    network: Network = Network.MainnetSentry,
    endpoints?: NetworkEndpoints
  ) {
    if (!isMainnet(network)) {
      throw new GeneralException(new Error('Please switch to mainnet network'))
    }

    const networkEndpoints = endpoints || getNetworkEndpoints(network)
    this.client = new ChainGrpcWasmApi(networkEndpoints.grpc)
    this.priceOracleContract = NEPTUNE_PRICE_CONTRACT
  }

  /**
   * Fetch prices for given assets from the Neptune Price Oracle contract.
   * @param assets Array of AssetInfo objects.
   * @returns Array of Price objects.
   */
  async fetchPrices(assets: AssetInfo[]): Promise<AssetInfoWithPrice[]> {
    const queryGetPricesPayload = new QueryGetPrices({ assets }).toPayload()

    try {
      const response = await this.client.fetchSmartContractState(
        this.priceOracleContract,
        queryGetPricesPayload
      )

      const prices = PriceQueryTransformer.contractPricesResponseToPrices(response)

      return prices
    } catch (error) {
      console.error('Error fetching prices:', error)
      throw new GeneralException(new Error('Failed to fetch prices'))
    }
  }

  /**
   * Fetch the redemption ratio based on CW20 and native asset prices.
   * @param cw20Asset AssetInfo for the CW20 token.
   * @param nativeAsset AssetInfo for the native token.
   * @returns Redemption ratio as a number.
   */
  async fetchRedemptionRatio({ cw20Asset, nativeAsset }: {
    cw20Asset: AssetInfo,
    nativeAsset: AssetInfo
  }): Promise<number> {
    const prices = await this.fetchPrices([cw20Asset, nativeAsset])

    const [cw20Price] = prices
    const [nativePrice] = prices.reverse()

    if (!cw20Price || !nativePrice) {
      throw new GeneralException(new Error('Failed to compute redemption ratio'))
    }

    return Number(cw20Price.price) / Number(nativePrice.price)
  }

  /**
   * Convert CW20 nUSDT to bank nUSDT using the redemption ratio.
   * @param amountCW20 Amount in CW20 nUSDT.
   * @param redemptionRatio Redemption ratio.
   * @returns Amount in bank nUSDT.
   */
  calculateBankAmount(amountCW20: number, redemptionRatio: number): number {
    return amountCW20 * redemptionRatio
  }

  /**
   * Convert bank nUSDT to CW20 nUSDT using the redemption ratio.
   * @param amountBank Amount in bank nUSDT.
   * @param redemptionRatio Redemption ratio.
   * @returns Amount in CW20 nUSDT.
   */
  calculateCw20Amount(amountBank: number, redemptionRatio: number): number {
    return amountBank / redemptionRatio
  }

  /**
   * Create a deposit message.
   * @param sender Sender's Injective address.
   * @param contractAddress USDT market contract address.
   * @param denom Denomination of the asset.
   * @param amount Amount to deposit as a string.
   * @returns MsgExecuteContractCompat message.
   */
  createDepositMsg({ denom, amount, sender, contractAddress = NEPTUNE_USDT_MARKET_CONTRACT }: {
    denom: string,
    amount: string,
    sender: string,
    contractAddress?: string
  }): MsgExecuteContractCompat {
    return MsgExecuteContractCompat.fromJSON({
      sender,
      contractAddress,
      execArgs: ExecArgNeptuneDeposit.fromJSON({}),
      funds: {
        denom,
        amount,
      },
    })
  }

  /**
   * Create a withdraw message.
   * @param sender Sender's Injective address.
   * @param contractAddress nUSDT contract address.
   * @param amount Amount to withdraw as a string.
   * @returns MsgExecuteContractCompat message.
   */
  createWithdrawMsg({
    amount,
    sender,
    cw20ContractAddress = NEPTUNE_USDT_CW20_CONTRACT,
    marketContractAddress = NEPTUNE_USDT_MARKET_CONTRACT,
  }: {
    amount: string,
    sender: string,
    cw20ContractAddress?: string,
    marketContractAddress?: string,
  }): MsgExecuteContractCompat {
    return MsgExecuteContractCompat.fromJSON({
      sender,
      contractAddress: cw20ContractAddress,
      execArgs: ExecArgNeptuneWithdraw.fromJSON({
        amount,
        contract: marketContractAddress,
      }),
    })
  }
}
