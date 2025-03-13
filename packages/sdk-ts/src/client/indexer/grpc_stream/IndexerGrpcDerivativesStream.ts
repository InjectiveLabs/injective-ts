import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'
import { StreamStatusResponse } from '../types/index.js'
import { PaginationOption } from '../../../types/pagination.js'
import { OrderSide, OrderState } from '@injectivelabs/ts-types'
import { IndexerDerivativeStreamTransformer } from '../transformers/index.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { Subscription } from 'rxjs'
import { InjectiveDerivativeExchangeRpc } from '@injectivelabs/indexer-proto-ts'
import { GeneralException } from '@injectivelabs/exceptions'

export type DerivativeOrderbookV2StreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookV2StreamCallback
  >,
) => void

export type DerivativeOrderbookUpdateStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookUpdateStreamCallback
  >,
) => void

export type DerivativeOrdersStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.ordersStreamCallback
  >,
) => void

export type DerivativeOrderHistoryStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderHistoryStreamCallback
  >,
) => void

export type DerivativeTradesStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.tradesStreamCallback
  >,
) => void

export type PositionsStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.positionStreamCallback
  >,
) => void

export type PositionsV2StreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.positionV2StreamCallback
  >,
) => void

export type MarketStreamCallback = (
  response: InjectiveDerivativeExchangeRpc.StreamMarketResponse,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcDerivativesStream {
  protected client: InjectiveDerivativeExchangeRpc.InjectiveDerivativeExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client =
      new InjectiveDerivativeExchangeRpc.InjectiveDerivativeExchangeRPCClientImpl(
        getGrpcIndexerWebImpl(endpoint),
      )
  }

  /** @deprecated - use streamDerivativeOrderbookV2 */
  streamDerivativeOrderbook(_args: {
    marketIds: string[]
    callback: any
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    throw new GeneralException(
      new Error('deprecated - use streamDerivativeOrderbookV2'),
    )
  }

  streamDerivativeOrders({
    marketId,
    subaccountId,
    orderSide,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    orderSide?: OrderSide
    callback: DerivativeOrdersStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveDerivativeExchangeRpc.StreamOrdersRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (orderSide) {
      request.orderSide = orderSide
    }

    const subscription = this.client.StreamOrders(request).subscribe({
      next(response: InjectiveDerivativeExchangeRpc.StreamOrdersResponse) {
        callback(
          IndexerDerivativeStreamTransformer.ordersStreamCallback(response),
        )
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

  streamDerivativeOrderHistory({
    subaccountId,
    marketId,
    orderTypes,
    executionTypes,
    direction,
    state,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    orderTypes?: OrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    state?: OrderState
    callback: DerivativeOrderHistoryStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request =
      InjectiveDerivativeExchangeRpc.StreamOrdersHistoryRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (orderTypes) {
      request.orderTypes = orderTypes
    }

    if (direction) {
      request.direction = direction
    }

    if (state) {
      request.state = state
    }

    if (executionTypes) {
      request.executionTypes = executionTypes
    }

    const subscription = this.client.StreamOrdersHistory(request).subscribe({
      next(
        response: InjectiveDerivativeExchangeRpc.StreamOrdersHistoryResponse,
      ) {
        callback(
          IndexerDerivativeStreamTransformer.orderHistoryStreamCallback(
            response,
          ),
        )
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

  streamDerivativeTrades({
    marketIds,
    marketId,
    subaccountIds,
    subaccountId,
    callback,
    pagination,
    executionSide,
    direction,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    marketId?: string
    subaccountIds?: string[]
    subaccountId?: string
    pagination?: PaginationOption
    executionSide?: TradeExecutionSide
    direction?: TradeDirection
    callback: DerivativeTradesStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveDerivativeExchangeRpc.StreamTradesRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountIds) {
      request.subaccountIds = subaccountIds
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (executionSide) {
      request.executionSide = executionSide
    }

    if (direction) {
      request.direction = direction
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = pagination.skip.toString()
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    const subscription = this.client.StreamTrades(request).subscribe({
      next(response: InjectiveDerivativeExchangeRpc.StreamTradesResponse) {
        callback(
          IndexerDerivativeStreamTransformer.tradesStreamCallback(response),
        )
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

  streamDerivativePositions({
    marketId,
    subaccountId,
    callback,
    address,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    address?: string
    subaccountId?: string
    callback: PositionsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request =
      InjectiveDerivativeExchangeRpc.StreamPositionsRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (address) {
      request.accountAddress = address
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    const subscription = this.client.StreamPositions(request).subscribe({
      next(response: InjectiveDerivativeExchangeRpc.StreamPositionsResponse) {
        callback(
          IndexerDerivativeStreamTransformer.positionStreamCallback(response),
        )
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

  streamDerivativeMarket({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    callback: MarketStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveDerivativeExchangeRpc.StreamMarketRequest.create()

    if (marketIds && marketIds.length) {
      request.marketIds = marketIds
    }

    const subscription = this.client.StreamMarket(request).subscribe({
      next(response: InjectiveDerivativeExchangeRpc.StreamMarketResponse) {
        callback(response)
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

  streamDerivativeOrderbookV2({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request =
      InjectiveDerivativeExchangeRpc.StreamOrderbookV2Request.create()
    request.marketIds = marketIds

    const subscription = this.client.StreamOrderbookV2(request).subscribe({
      next(response: InjectiveDerivativeExchangeRpc.StreamOrderbookV2Response) {
        callback(
          IndexerDerivativeStreamTransformer.orderbookV2StreamCallback(
            response,
          ),
        )
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

  streamDerivativeOrderbookUpdate({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request =
      InjectiveDerivativeExchangeRpc.StreamOrderbookUpdateRequest.create()

    request.marketIds = marketIds

    const subscription = this.client.StreamOrderbookUpdate(request).subscribe({
      next(
        response: InjectiveDerivativeExchangeRpc.StreamOrderbookUpdateResponse,
      ) {
        callback(
          IndexerDerivativeStreamTransformer.orderbookUpdateStreamCallback(
            response,
          ),
        )
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

  streamDerivativePositionsV2({
    marketId,
    subaccountId,
    callback,
    address,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    address?: string
    subaccountId?: string
    callback: PositionsV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request =
      InjectiveDerivativeExchangeRpc.StreamPositionsV2Request.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (address) {
      request.accountAddress = address
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    const subscription = this.client.StreamPositionsV2(request).subscribe({
      next(response: InjectiveDerivativeExchangeRpc.StreamPositionsV2Response) {
        callback(
          IndexerDerivativeStreamTransformer.positionV2StreamCallback(response),
        )
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }
}
