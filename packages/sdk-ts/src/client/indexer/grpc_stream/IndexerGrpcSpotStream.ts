import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'
import { StreamStatusResponse } from '../types/index.js'
import { PaginationOption } from '../../../types/pagination.js'
import { OrderSide, OrderState } from '@injectivelabs/ts-types'
import { IndexerSpotStreamTransformer } from '../transformers/index.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { Subscription } from 'rxjs'
import { InjectiveSpotExchangeRpc } from '@injectivelabs/indexer-proto-ts'
import { GeneralException } from '@injectivelabs/exceptions'

export type MarketsStreamCallback = (
  response: InjectiveSpotExchangeRpc.StreamMarketsResponse,
) => void

export type SpotOrderbookV2StreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookV2StreamCallback
  >,
) => void

export type SpotOrderbookUpdateStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookUpdateStreamCallback
  >,
) => void

export type SpotOrdersStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.ordersStreamCallback
  >,
) => void

export type SpotOrderHistoryStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderHistoryStreamCallback
  >,
) => void

export type SpotTradesStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.tradesStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcSpotStream {
  protected client: InjectiveSpotExchangeRpc.InjectiveSpotExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client =
      new InjectiveSpotExchangeRpc.InjectiveSpotExchangeRPCClientImpl(
        getGrpcIndexerWebImpl(endpoint),
      )
  }

  /** @deprecated - use streamSpotOrderbookV2 */
  streamSpotOrderbook(_args: {
    marketIds: string[]
    callback: any
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    throw new GeneralException(
      new Error('deprecated - use streamDerivativeOrderbookV2'),
    )
  }

  streamSpotOrders({
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
    callback: SpotOrdersStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveSpotExchangeRpc.StreamOrdersRequest.create()

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
      next(response: InjectiveSpotExchangeRpc.StreamOrdersResponse) {
        callback(IndexerSpotStreamTransformer.ordersStreamCallback(response))
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

  streamSpotOrderHistory({
    marketId,
    subaccountId,
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
    callback: SpotOrderHistoryStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveSpotExchangeRpc.StreamOrdersHistoryRequest.create()

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
      next(response: InjectiveSpotExchangeRpc.StreamOrdersHistoryResponse) {
        callback(
          IndexerSpotStreamTransformer.orderHistoryStreamCallback(response),
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

  streamSpotTrades({
    marketIds,
    marketId,
    subaccountIds,
    subaccountId,
    pagination,
    direction,
    executionSide,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    marketId?: string
    subaccountIds?: string[]
    subaccountId?: string
    pagination?: PaginationOption
    direction?: TradeDirection
    executionSide?: TradeExecutionSide
    callback: SpotTradesStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveSpotExchangeRpc.StreamTradesRequest.create()

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
      next(response: InjectiveSpotExchangeRpc.StreamTradesResponse) {
        callback(IndexerSpotStreamTransformer.tradesStreamCallback(response))
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

  streamSpotMarket({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    callback: MarketsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveSpotExchangeRpc.StreamMarketsRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    const subscription = this.client.StreamMarkets(request).subscribe({
      next(response: InjectiveSpotExchangeRpc.StreamMarketsResponse) {
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

  streamSpotOrderbookV2({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: SpotOrderbookV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveSpotExchangeRpc.StreamOrderbookV2Request.create()

    request.marketIds = marketIds

    const subscription = this.client.StreamOrderbookV2(request).subscribe({
      next(response: InjectiveSpotExchangeRpc.StreamOrderbookV2Response) {
        callback(
          IndexerSpotStreamTransformer.orderbookV2StreamCallback(response),
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

  streamSpotOrderbookUpdate({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: SpotOrderbookUpdateStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request =
      InjectiveSpotExchangeRpc.StreamOrderbookUpdateRequest.create()

    request.marketIds = marketIds

    const subscription = this.client.StreamOrderbookUpdate(request).subscribe({
      next(response: InjectiveSpotExchangeRpc.StreamOrderbookUpdateResponse) {
        callback(
          IndexerSpotStreamTransformer.orderbookUpdateStreamCallback(response),
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
