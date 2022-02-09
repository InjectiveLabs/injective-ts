import { Web3Exception } from '@injectivelabs/exceptions'
import { BigNumberInBase } from '@injectivelabs/utils'
import { SpotMarketComposer, SpotOrderSide } from '@injectivelabs/spot-consumer'
import { BaseActionService } from '../BaseActionService'
import { UiSpotMarketWithTokenMeta } from './types'
import { SpotMetrics } from '../types'
import { ZERO_TO_STRING } from '../constants'
import { spotOrderTypeToGrpcOrderType } from './utils'

export class SpotActionService extends BaseActionService {
  async submitLimitOrder({
    price,
    quantity,
    orderType,
    address,
    market,
    feeRecipient,
    injectiveAddress,
    subaccountId,
  }: {
    feeRecipient: string
    price: BigNumberInBase
    quantity: BigNumberInBase
    orderType: SpotOrderSide
    subaccountId: string
    market: UiSpotMarketWithTokenMeta
    address: string
    injectiveAddress: string
  }) {
    const relativePrice = price.toWei(
      market.quoteToken.decimals - market.baseToken.decimals,
    )
    const relativeQuantity = quantity.toWei(market.baseToken.decimals)

    const message = SpotMarketComposer.createLimitOrder({
      subaccountId,
      injectiveAddress,
      marketId: market.marketId,
      order: {
        feeRecipient,
        orderType: spotOrderTypeToGrpcOrderType(orderType),
        price: relativePrice.toFixed(),
        quantity: relativeQuantity.toFixed(),
        triggerPrice: ZERO_TO_STRING, // TODO
      },
    })

    try {
      return await this.txProvider.broadcast({
        bucket: SpotMetrics.CreateLimitOrder,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  async submitMarketOrder({
    quantity,
    price,
    orderType,
    address,
    market,
    feeRecipient,
    injectiveAddress,
    subaccountId,
  }: {
    quantity: BigNumberInBase
    price: BigNumberInBase
    orderType: SpotOrderSide
    subaccountId: string
    feeRecipient: string
    market: UiSpotMarketWithTokenMeta
    address: string
    injectiveAddress: string
  }) {
    const relativePrice = price.toWei(
      market.quoteToken.decimals - market.baseToken.decimals,
    )
    const relativeQuantity = quantity.toWei(market.baseToken.decimals)
    const message = SpotMarketComposer.createMarketOrder({
      subaccountId,
      injectiveAddress,
      marketId: market.marketId,
      order: {
        feeRecipient,
        price: relativePrice.toFixed(),
        orderType: spotOrderTypeToGrpcOrderType(orderType),
        quantity: relativeQuantity.toFixed(),
        triggerPrice: ZERO_TO_STRING, // TODO
      },
    })

    try {
      return await this.txProvider.broadcast({
        bucket: SpotMetrics.CreateMarketOrder,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  async cancelOrder({
    orderHash,
    address,
    marketId,
    injectiveAddress,
    subaccountId,
  }: {
    orderHash: string
    subaccountId: string
    marketId: string
    address: string
    injectiveAddress: string
  }) {
    const message = SpotMarketComposer.cancelSpotOrder({
      subaccountId,
      marketId,
      injectiveAddress,
      order: {
        orderHash,
      },
    })

    try {
      return await this.txProvider.broadcast({
        bucket: SpotMetrics.CancelLimitOrder,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  async batchCancelOrders({
    orders,
    address,
    injectiveAddress,
  }: {
    orders: {
      subaccountId: string
      marketId: string
      orderHash: string
    }[]
    address: string
    injectiveAddress: string
  }) {
    const message = SpotMarketComposer.batchCancelSpotOrder({
      injectiveAddress,
      orders,
    })

    try {
      return await this.txProvider.broadcast({
        bucket: SpotMetrics.BatchCancelLimitOrders,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
