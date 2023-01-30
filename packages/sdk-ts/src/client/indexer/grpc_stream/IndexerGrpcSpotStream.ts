import {
  InjectiveSpotExchangeRPCClientImpl,
  StreamOrderbookRequest,
  StreamOrderbookResponse,
  StreamOrderbookV2Request,
  StreamOrderbookV2Response,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamTradesRequest,
  StreamTradesResponse,
  StreamMarketsRequest,
  StreamMarketsResponse,
  StreamOrdersHistoryRequest,
  StreamOrdersHistoryResponse,
} from '@injectivelabs/indexer-proto-ts/injective_spot_exchange_rpc'
import {
  TradeExecutionSide,
  TradeDirection,
  TradeExecutionType,
} from '../../../types'
import { StreamStatusResponse } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { SpotOrderSide, SpotOrderState } from '../types/spot'
import { IndexerSpotStreamTransformer } from '../transformers'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

export type MarketsStreamCallback = (response: StreamMarketsResponse) => void

export type SpotOrderbookStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookStreamCallback
  >,
) => void

export type SpotOrderbookV2StreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookV2StreamCallback
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
  protected client: InjectiveSpotExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveSpotExchangeRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  streamSpotOrderbook({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: SpotOrderbookStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = StreamOrderbookRequest.create()

    request.marketIds = marketIds

    const stream = this.client.StreamOrderbook(request)

    return stream.subscribe({
      next(response: StreamOrderbookResponse) {
        callback(IndexerSpotStreamTransformer.orderbookStreamCallback(response))
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
    orderSide?: SpotOrderSide
    callback: SpotOrdersStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = StreamOrdersRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (orderSide) {
      request.orderSide = orderSide
    }

    const stream = this.client.StreamOrders(request)

    return stream.subscribe({
      next(response: StreamOrdersResponse) {
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
    orderTypes?: SpotOrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    state?: SpotOrderState
    callback: SpotOrderHistoryStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = StreamOrdersHistoryRequest.create()

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

    const stream = this.client.StreamOrdersHistory(request)

    return stream.subscribe({
      next(response: StreamOrdersHistoryResponse) {
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
  }) {
    const request = StreamTradesRequest.create()

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

    const stream = this.client.StreamTrades(request)

    return stream.subscribe({
      next(response: StreamTradesResponse) {
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
  }) {
    const request = StreamMarketsRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    const stream = this.client.StreamMarkets(request)

    return stream.subscribe({
      next(response: StreamMarketsResponse) {
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
  }) {
    const request = new StreamOrderbookV2Request()
    request.setMarketIdsList(marketIds)

    const stream = this.client.streamOrderbookV2(request)

    stream.on('data', (response: StreamOrderbookV2Response) => {
      callback(IndexerSpotStreamTransformer.orderbookV2StreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }
}
