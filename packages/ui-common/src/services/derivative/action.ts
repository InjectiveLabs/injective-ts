import { Web3Exception } from '@injectivelabs/exceptions'
import {
  BigNumberInBase,
  BigNumberInWei,
  mapMultipleComposerResponseMessages,
} from '@injectivelabs/utils'
import {
  DerivativeMarketComposer,
  DerivativeOrderSide,
} from '@injectivelabs/derivatives-consumer'
import { MarketComposer } from '@injectivelabs/exchange-consumer'
import { BaseActionService } from '../BaseActionService'
import { DerivativesMetrics } from '../../types'
import { ZERO_TO_STRING } from '../../constants'
import { derivativeOrderTypeToGrpcOrderType } from './utils'

export class DerivativeActionService extends BaseActionService {
  /**
   * Price/Margin should always be in x * 10^(quoteDecimals) format
   * where x is a human readable number.
   * Use `derivativePriceToChainPrice/derivativeMarginToChainMargin` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted price/margin
   *
   * Quantity should always be in x format
   * where x is a human readable number.
   * */
  async submitLimitOrder({
    price,
    quantity,
    orderType,
    address,
    marketId,
    reduceOnly,
    margin,
    injectiveAddress,
    subaccountId,
    feeRecipient,
    triggerPrice = ZERO_TO_STRING,
  }: {
    feeRecipient: string
    margin: string
    price: string
    quantity: string
    reduceOnly: boolean
    orderType: DerivativeOrderSide
    subaccountId: string
    marketId: string
    address: string
    injectiveAddress: string
    triggerPrice?: string
  }) {
    const message = DerivativeMarketComposer.createLimitOrder({
      subaccountId,
      injectiveAddress,
      marketId,
      order: {
        feeRecipient,
        orderType: derivativeOrderTypeToGrpcOrderType(orderType),
        price: new BigNumberInWei(price).toFixed(),
        margin: reduceOnly
          ? ZERO_TO_STRING
          : new BigNumberInWei(margin).toFixed(),
        quantity: new BigNumberInBase(quantity).toFixed(),
        triggerPrice,
      },
    })

    try {
      return await this.txProvider.broadcast({
        bucket: DerivativesMetrics.CreateLimitOrder,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  /**
   * Price/Margin should always be in x * 10^(quoteDecimals) format
   * where x is a human readable number.
   * Use `derivativePriceToChainPrice/derivativeMarginToChainMargin` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted price/margin
   *
   * Quantity should always be in x format
   * where x is a human readable number.
   * */
  async submitMarketOrder({
    quantity,
    price,
    reduceOnly,
    orderType,
    address,
    marketId,
    margin,
    injectiveAddress,
    feeRecipient,
    subaccountId,
    triggerPrice = ZERO_TO_STRING,
  }: {
    margin: string
    quantity: string
    price: string
    orderType: DerivativeOrderSide
    subaccountId: string
    reduceOnly: boolean
    marketId: string
    address: string
    feeRecipient: string
    injectiveAddress: string
    triggerPrice?: string
  }) {
    const message = DerivativeMarketComposer.createMarketOrder({
      subaccountId,
      injectiveAddress,
      marketId,
      order: {
        feeRecipient,
        price: new BigNumberInWei(price).toFixed(),
        margin: reduceOnly
          ? ZERO_TO_STRING
          : new BigNumberInWei(margin).toFixed(),
        quantity: new BigNumberInBase(quantity).toFixed(),
        orderType: derivativeOrderTypeToGrpcOrderType(orderType),
        triggerPrice,
      },
    })

    try {
      return await this.txProvider.broadcast({
        bucket: DerivativesMetrics.CreateMarketOrder,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  /**
   * Price should always be in x * 10^(quoteDecimals) format
   * where x is a human readable number.
   * Use `derivativePriceToChainPrice` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted price
   *
   * Quantity should always be in x format
   * where x is a human readable number.
   * */
  async closeAllPosition({
    positions,
    address,
    feeRecipient,
    injectiveAddress,
    subaccountId,
    triggerPrice = ZERO_TO_STRING,
  }: {
    positions: {
      orderType: DerivativeOrderSide
      marketId: string
      price: string
      quantity: string
    }[]
    subaccountId: string
    address: string
    feeRecipient: string
    injectiveAddress: string
    triggerPrice?: string
  }) {
    const messages = positions.map((position) =>
      DerivativeMarketComposer.createMarketOrder({
        subaccountId,
        injectiveAddress,
        marketId: position.marketId,
        order: {
          feeRecipient,
          triggerPrice,
          price: new BigNumberInWei(position.price).toFixed(),
          quantity: new BigNumberInBase(position.quantity).toFixed(),
          orderType: derivativeOrderTypeToGrpcOrderType(position.orderType),
          margin: ZERO_TO_STRING,
        },
      }),
    )
    const mappedMessages = mapMultipleComposerResponseMessages(messages)

    try {
      return await this.txProvider.broadcast({
        bucket: DerivativesMetrics.CreateMarketOrder,
        message: mappedMessages,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  /**
   * Price should always be in x * 10^(quoteDecimals) format
   * where x is a human readable number.
   * Use `derivativePriceToChainPrice` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted price
   *
   * Quantity should always be in x format
   * where x is a human readable number.
   * */
  async closePosition({
    quantity,
    price,
    orderType,
    address,
    marketId,
    injectiveAddress,
    subaccountId,
    feeRecipient,
    triggerPrice = ZERO_TO_STRING,
  }: {
    quantity: string
    price: string
    orderType: DerivativeOrderSide
    subaccountId: string
    marketId: string
    address: string
    feeRecipient: string
    injectiveAddress: string
    triggerPrice?: string
  }) {
    const message = DerivativeMarketComposer.createMarketOrder({
      subaccountId,
      injectiveAddress,
      marketId,
      order: {
        triggerPrice,
        feeRecipient,
        price: new BigNumberInWei(price).toFixed(),
        quantity: new BigNumberInBase(quantity).toFixed(),
        orderType: derivativeOrderTypeToGrpcOrderType(orderType),
        margin: ZERO_TO_STRING,
      },
    })

    try {
      return await this.txProvider.broadcast({
        bucket: DerivativesMetrics.CreateMarketOrder,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  /**
   * Price should always be in x * 10^(quoteDecimals) format
   * where x is a human readable number.
   * Use `derivativePriceToChainPrice` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted price
   *
   * Quantity should always be in x format
   * where x is a human readable number.
   * */
  async closePositionAndReduceOnlyOrders({
    quantity,
    price,
    orderType,
    address,
    marketId,
    injectiveAddress,
    subaccountId,
    feeRecipient,
    reduceOnlyOrders,
  }: {
    quantity: string
    price: string
    orderType: DerivativeOrderSide
    subaccountId: string
    marketId: string
    address: string
    feeRecipient: string
    injectiveAddress: string
    reduceOnlyOrders: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
  }) {
    const message = MarketComposer.batchUpdateOrders({
      subaccountId,
      injectiveAddress,
      derivativeOrdersToCancel: reduceOnlyOrders,
      derivativeOrdersToCreate: [
        {
          feeRecipient,
          marketId,
          margin: ZERO_TO_STRING,
          triggerPrice: ZERO_TO_STRING,
          orderType: derivativeOrderTypeToGrpcOrderType(orderType),
          price: new BigNumberInWei(price).toFixed(),
          quantity: new BigNumberInBase(quantity).toFixed(),
        },
      ],
    })

    try {
      return await this.txProvider.broadcast({
        bucket: DerivativesMetrics.BatchUpdateOrders,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  /**
   * Amount should always be in x * 10^(quoteDecimals) format
   * where x is a human readable number.
   * Use `derivativeMarginToChainMargin` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted amount
   * */
  async addMarginToPosition({
    amount,
    address,
    marketId,
    injectiveAddress,
    srcSubaccountId,
    dstSubaccountId,
  }: {
    amount: string
    srcSubaccountId: string
    dstSubaccountId: string
    marketId: string
    address: string
    feeRecipient: string
    injectiveAddress: string
  }) {
    const message = DerivativeMarketComposer.addMarginToPosition({
      srcSubaccountId,
      dstSubaccountId,
      injectiveAddress,
      marketId,
      amount: new BigNumberInWei(amount).toFixed(),
    })

    try {
      return await this.txProvider.broadcast({
        bucket: DerivativesMetrics.CreateMarketOrder,
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
    const message = DerivativeMarketComposer.cancelDerivativeOrder({
      subaccountId,
      marketId,
      injectiveAddress,
      order: {
        orderHash,
      },
    })

    try {
      return await this.txProvider.broadcast({
        bucket: DerivativesMetrics.CancelLimitOrder,
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
    const message = DerivativeMarketComposer.batchCancelDerivativeOrder({
      injectiveAddress,
      orders,
    })

    try {
      return await this.txProvider.broadcast({
        bucket: DerivativesMetrics.BatchCancelLimitOrders,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
