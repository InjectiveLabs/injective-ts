import { Web3Exception } from '@injectivelabs/exceptions'
import {
  BigNumberInBase,
  BigNumberInWei,
  DEFAULT_EXCHANGE_LIMIT,
} from '@injectivelabs/utils'
import {
  DerivativeMarketComposer,
  DerivativeOrderSide,
} from '@injectivelabs/derivatives-consumer'
import { MarketComposer } from '@injectivelabs/exchange-consumer'
import { BaseActionService } from '../BaseActionService'
import { UiDerivativeMarketWithTokenMeta } from './types'
import { DerivativesMetrics } from '../types'
import { ZERO_TO_STRING } from '../constants'
import { derivativeOrderTypeToGrpcOrderType } from './utils'

export class DerivativeActionService extends BaseActionService {
  async submitLimitOrder({
    price,
    quantity,
    orderType,
    address,
    market,
    reduceOnly,
    margin,
    injectiveAddress,
    subaccountId,
    feeRecipient,
  }: {
    feeRecipient: string
    margin: BigNumberInBase
    price: BigNumberInBase
    reduceOnly: boolean
    quantity: BigNumberInBase
    orderType: DerivativeOrderSide
    subaccountId: string
    market: UiDerivativeMarketWithTokenMeta
    address: string
    injectiveAddress: string
  }) {
    const message = DerivativeMarketComposer.createLimitOrder({
      subaccountId,
      injectiveAddress,
      marketId: market.marketId,
      order: {
        feeRecipient,
        orderType: derivativeOrderTypeToGrpcOrderType(orderType),
        price: price.toWei(market.quoteToken.decimals).toFixed(),
        margin: reduceOnly
          ? ZERO_TO_STRING
          : margin.toWei(market.quoteToken.decimals).toFixed(),
        quantity: quantity.toFixed(),
        triggerPrice: ZERO_TO_STRING, // TODO
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

  async submitMarketOrder({
    quantity,
    price,
    reduceOnly,
    orderType,
    address,
    market,
    margin,
    injectiveAddress,
    feeRecipient,
    subaccountId,
  }: {
    margin: BigNumberInBase
    quantity: BigNumberInBase
    price: BigNumberInBase
    orderType: DerivativeOrderSide
    subaccountId: string
    reduceOnly: boolean
    market: UiDerivativeMarketWithTokenMeta
    address: string
    feeRecipient: string
    injectiveAddress: string
  }) {
    const message = DerivativeMarketComposer.createMarketOrder({
      subaccountId,
      injectiveAddress,
      marketId: market.marketId,
      order: {
        feeRecipient,
        price: price.toWei(market.quoteToken.decimals).toFixed(),
        margin: reduceOnly
          ? ZERO_TO_STRING
          : margin.toWei(market.quoteToken.decimals).toFixed(),
        quantity: quantity.toFixed(),
        orderType: derivativeOrderTypeToGrpcOrderType(orderType),
        triggerPrice: ZERO_TO_STRING, // TODO
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

  async closeAllPosition({
    positions,
    address,
    feeRecipient,
    injectiveAddress,
    subaccountId,
  }: {
    positions: {
      market: UiDerivativeMarketWithTokenMeta
      orderType: DerivativeOrderSide
      price: BigNumberInBase
      quantity: BigNumberInBase
    }[]
    subaccountId: string
    address: string
    feeRecipient: string
    injectiveAddress: string
  }) {
    const message = positions.map((position) => {
      const minTickPrice = new BigNumberInBase(
        new BigNumberInBase(1).shiftedBy(-position.market.priceDecimals),
      )
      const actualPrice = position.price.lte(0) ? minTickPrice : position.price

      return DerivativeMarketComposer.createMarketOrder({
        subaccountId,
        injectiveAddress,
        marketId: position.market.marketId,
        order: {
          feeRecipient,
          price: new BigNumberInBase(
            actualPrice.toFixed(
              position.market.priceDecimals,
              position.orderType === DerivativeOrderSide.Buy
                ? BigNumberInBase.ROUND_DOWN
                : BigNumberInBase.ROUND_UP,
            ),
          )
            .toWei(position.market.quoteToken.decimals)
            .toFixed(),
          margin: ZERO_TO_STRING,
          quantity: position.quantity.toFixed(),
          orderType: derivativeOrderTypeToGrpcOrderType(position.orderType),
          triggerPrice: ZERO_TO_STRING, // TODO
        },
      })
    })

    try {
      return await this.txProvider.broadcast({
        gasLimit: new BigNumberInBase(
          new BigNumberInBase(DEFAULT_EXCHANGE_LIMIT)
            .times(positions.length)
            .dividedBy(4)
            .toFixed(0),
        ).toNumber(),
        bucket: DerivativesMetrics.CreateMarketOrder,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  async closePosition({
    quantity,
    price,
    orderType,
    address,
    market,
    injectiveAddress,
    subaccountId,
    feeRecipient,
  }: {
    quantity: BigNumberInBase
    price: BigNumberInBase
    orderType: DerivativeOrderSide
    subaccountId: string
    market: UiDerivativeMarketWithTokenMeta
    address: string
    feeRecipient: string
    injectiveAddress: string
  }) {
    const executionPrice = new BigNumberInBase(
      price.toFixed(
        market.priceDecimals,
        orderType === DerivativeOrderSide.Buy
          ? BigNumberInBase.ROUND_DOWN
          : BigNumberInBase.ROUND_UP,
      ),
    )
    const minTickPrice = new BigNumberInBase(
      new BigNumberInBase(1).shiftedBy(-market.priceDecimals),
    )
    const actualExecutionPrice = executionPrice.lte(0)
      ? minTickPrice
      : executionPrice

    const message = DerivativeMarketComposer.createMarketOrder({
      subaccountId,
      injectiveAddress,
      marketId: market.marketId,
      order: {
        feeRecipient,
        price: new BigNumberInBase(actualExecutionPrice)
          .toWei(market.quoteToken.decimals)
          .toFixed(),
        margin: ZERO_TO_STRING,
        quantity: quantity.toFixed(),
        orderType: derivativeOrderTypeToGrpcOrderType(orderType),
        triggerPrice: ZERO_TO_STRING, // TODO
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

  async closePositionAndReduceOnlyOrders({
    quantity,
    price,
    orderType,
    address,
    market,
    injectiveAddress,
    subaccountId,
    feeRecipient,
    reduceOnlyOrders,
  }: {
    quantity: BigNumberInBase
    price: BigNumberInBase
    orderType: DerivativeOrderSide
    subaccountId: string
    market: UiDerivativeMarketWithTokenMeta
    address: string
    feeRecipient: string
    injectiveAddress: string
    reduceOnlyOrders: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
  }) {
    const executionPrice = new BigNumberInBase(
      price.toFixed(
        market.priceDecimals,
        orderType === DerivativeOrderSide.Buy
          ? BigNumberInBase.ROUND_DOWN
          : BigNumberInBase.ROUND_UP,
      ),
    )
    const minTickPrice = new BigNumberInBase(
      new BigNumberInBase(1).shiftedBy(-market.priceDecimals),
    )
    const actualExecutionPrice = executionPrice.lte(0)
      ? minTickPrice
      : executionPrice

    const message = MarketComposer.batchUpdateOrders({
      subaccountId,
      injectiveAddress,
      derivativeOrdersToCancel: reduceOnlyOrders,
      derivativeOrdersToCreate: [
        {
          feeRecipient,
          marketId: market.marketId,
          orderType: derivativeOrderTypeToGrpcOrderType(orderType),
          triggerPrice: ZERO_TO_STRING,
          price: new BigNumberInBase(actualExecutionPrice)
            .toWei(market.quoteToken.decimals)
            .toFixed(),
          margin: ZERO_TO_STRING,
          quantity: quantity.toFixed(),
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

  async addMarginToPosition({
    amount,
    address,
    market,
    injectiveAddress,
    srcSubaccountId,
    dstSubaccountId,
  }: {
    amount: BigNumberInWei
    srcSubaccountId: string
    dstSubaccountId: string
    market: UiDerivativeMarketWithTokenMeta
    address: string
    feeRecipient: string
    injectiveAddress: string
  }) {
    const message = DerivativeMarketComposer.addMarginToPosition({
      srcSubaccountId,
      dstSubaccountId,
      injectiveAddress,
      amount: amount.toFixed(),
      marketId: market.marketId,
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
