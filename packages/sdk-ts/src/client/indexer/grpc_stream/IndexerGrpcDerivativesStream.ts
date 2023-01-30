import {
  InjectiveDerivativeExchangeRPCClientImpl,
  StreamOrderbookRequest,
  StreamOrderbookResponse,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamTradesRequest,
  StreamTradesResponse,
  StreamPositionsRequest,
  StreamPositionsResponse,
  StreamMarketRequest,
  StreamMarketResponse,
  StreamOrdersHistoryRequest,
  StreamOrdersHistoryResponse,
} from '@injectivelabs/indexer-proto-ts/injective_derivative_exchange_rpc'
import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types'
import { StreamStatusResponse } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { DerivativeOrderSide, DerivativeOrderState } from '../types/derivatives'
import { IndexerDerivativeStreamTransformer } from '../transformers'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

export type DerivativeOrderbookStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookStreamCallback
  >,
) => void

export type DerivativeOrdersStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.ordersStreamCallback
  >,
) => void

export type DerivativeOrderHistoryStreamCallback = (
  resposne: ReturnType<
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

export type MarketStreamCallback = (response: StreamMarketResponse) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcDerivativesStream {
  protected client: InjectiveDerivativeExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveDerivativeExchangeRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  streamDerivativeOrderbook({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = StreamOrderbookRequest.create()

    request.marketIds = marketIds

    const stream = this.client.StreamOrderbook(request)

    return stream.subscribe({
      next(response: StreamOrderbookResponse) {
        callback(
          IndexerDerivativeStreamTransformer.orderbookStreamCallback(response),
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
    orderSide?: DerivativeOrderSide
    callback: DerivativeOrdersStreamCallback
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
    orderTypes?: DerivativeOrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    state?: DerivativeOrderState
    callback: DerivativeOrderHistoryStreamCallback
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
  }

  streamDerivativePositions({
    marketId,
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    callback: PositionsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = StreamPositionsRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    const stream = this.client.StreamPositions(request)

    return stream.subscribe({
      next(response: StreamPositionsResponse) {
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
  }) {
    const request = StreamMarketRequest.create()

    if (marketIds && marketIds.length) {
      request.marketIds = marketIds
    }

    const stream = this.client.StreamMarket(request)

    return stream.subscribe({
      next(response: StreamMarketResponse) {
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
}
