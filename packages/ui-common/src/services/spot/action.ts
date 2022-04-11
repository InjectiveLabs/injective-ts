import { Web3Exception } from '@injectivelabs/exceptions'
import { BigNumberInWei } from '@injectivelabs/utils'
import { SpotMarketComposer, SpotOrderSide } from '@injectivelabs/spot-consumer'
import { BaseActionService } from '../BaseActionService'
import { SpotMetrics } from '../../types'
import { ZERO_TO_STRING } from '../../constants'
import { spotOrderTypeToGrpcOrderType } from './utils'

export class SpotActionService extends BaseActionService {
  /**
   * Price should always be in x / 10^(quoteDecimals - baseDecimals) format
   * where x is a human readable number.
   * Use `spotPriceToChainPrice` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted price
   *
   * Quantity should always be in x * 10^(baseDecimals) format
   * where x is a human readable number.
   * Use `spotQuantityToChainQuantity` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted quantity
   * */
  async submitLimitOrder({
    price,
    quantity,
    orderType,
    address,
    marketId,
    feeRecipient,
    injectiveAddress,
    subaccountId,
    triggerPrice = ZERO_TO_STRING,
  }: {
    feeRecipient: string
    price: string
    quantity: string
    orderType: SpotOrderSide
    subaccountId: string
    marketId: string
    address: string
    injectiveAddress: string
    triggerPrice?: string
  }) {
    const message = SpotMarketComposer.createLimitOrder({
      subaccountId,
      injectiveAddress,
      marketId,
      order: {
        feeRecipient,
        triggerPrice,
        price: new BigNumberInWei(price).toFixed(),
        quantity: new BigNumberInWei(quantity).toFixed(),
        orderType: spotOrderTypeToGrpcOrderType(orderType),
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

  /**
   * Price should always be in x / 10^(quoteDecimals - baseDecimals) format
   * where x is a human readable number.
   * Use `spotPriceToChainPrice` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted price
   *
   * Quantity should always be in x * 10^(baseDecimals) format
   * where x is a human readable number.
   * Use `spotQuantityToChainQuantity` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted quantity
   * */
  async submitMarketOrder({
    quantity,
    price,
    orderType,
    address,
    marketId,
    feeRecipient,
    injectiveAddress,
    subaccountId,
    triggerPrice = ZERO_TO_STRING,
  }: {
    quantity: string
    price: string
    orderType: SpotOrderSide
    subaccountId: string
    feeRecipient: string
    marketId: string
    address: string
    injectiveAddress: string
    triggerPrice?: string
  }) {
    const message = SpotMarketComposer.createMarketOrder({
      subaccountId,
      injectiveAddress,
      marketId,
      order: {
        feeRecipient,
        triggerPrice,
        price: new BigNumberInWei(price).toFixed(),
        quantity: new BigNumberInWei(quantity).toFixed(),
        orderType: spotOrderTypeToGrpcOrderType(orderType),
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
