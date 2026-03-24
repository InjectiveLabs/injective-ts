import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveSpotExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcSpotTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type {
  OrderSide,
  OrderState,
  TradeDirection,
  GrpcCallOptions,
  PaginationOption,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcSpotApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Spot

  private get client() {
    return this.initClient(InjectiveSpotExchangeRPCClient)
  }

  async fetchMarkets(
    params?: {
      baseDenom?: string
      marketStatus?: string
      quoteDenom?: string
      marketStatuses?: string[]
    },
    options?: GrpcCallOptions,
  ) {
    const { baseDenom, marketStatus, quoteDenom, marketStatuses } = params || {}
    const request = InjectiveSpotExchangeRpcPb.MarketsRequest.create()

    if (baseDenom) {
      request.baseDenom = baseDenom
    }

    if (marketStatus) {
      request.marketStatus = marketStatus
    }

    if (marketStatuses) {
      request.marketStatuses = marketStatuses
    }

    if (quoteDenom) {
      request.quoteDenom = quoteDenom
    }

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.MarketsRequest,
      InjectiveSpotExchangeRpcPb.MarketsResponse
    >(request, this.client.markets.bind(this.client), options?.signal)

    return IndexerGrpcSpotTransformer.marketsResponseToMarkets(response)
  }

  async fetchMarket(marketId: string, options?: GrpcCallOptions) {
    const request = InjectiveSpotExchangeRpcPb.MarketRequest.create()

    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.MarketRequest,
      InjectiveSpotExchangeRpcPb.MarketResponse
    >(request, this.client.market.bind(this.client), options?.signal)

    return IndexerGrpcSpotTransformer.marketResponseToMarket(response)
  }

  /** @deprecated - use fetchOrderbookV2 */
  async fetchOrderbook(_marketId: string) {
    throw new GeneralException(new Error('deprecated - use fetchOrderbookV2'))
  }

  async fetchOrders(
    params?: {
      marketId?: string
      marketIds?: string[]
      subaccountId?: string
      orderSide?: OrderSide
      isConditional?: boolean
      pagination?: PaginationOption
      cid?: string
      tradeId?: string
    },
    options?: GrpcCallOptions,
  ) {
    const {
      cid,
      tradeId,
      marketId,
      marketIds,
      orderSide,
      pagination,
      subaccountId,
    } = params || {}
    const request = InjectiveSpotExchangeRpcPb.OrdersRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (orderSide) {
      request.orderSide = orderSide
    }

    if (cid) {
      request.cid = cid
    }

    if (tradeId) {
      request.tradeId = tradeId
    }

    // if (isConditional !== undefined) {
    //   request.isConditional = isConditional
    // }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }

      if (pagination.startTime !== undefined) {
        request.startTime = BigInt(pagination.startTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.OrdersRequest,
      InjectiveSpotExchangeRpcPb.OrdersResponse
    >(request, this.client.orders.bind(this.client), options?.signal)

    return IndexerGrpcSpotTransformer.ordersResponseToOrders(response)
  }

  async fetchOrderHistory(
    params?: {
      cid?: string
      state?: OrderState
      tradeId?: string
      marketId?: string
      marketIds?: string[]
      direction?: TradeDirection
      orderTypes?: OrderSide[]
      pagination?: PaginationOption
      isConditional?: boolean
      executionTypes?: TradeExecutionType[]
      subaccountId?: string
    },
    options?: GrpcCallOptions,
  ) {
    const {
      cid,
      state,
      tradeId,
      marketId,
      direction,
      marketIds,
      orderTypes,
      pagination,
      subaccountId,
      executionTypes,
    } = params || {}

    const request = InjectiveSpotExchangeRpcPb.OrdersHistoryRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (orderTypes) {
      request.orderTypes = orderTypes
    }

    if (executionTypes) {
      request.executionTypes = executionTypes
    }

    if (direction) {
      request.direction = direction
    }

    if (state) {
      request.state = state
    }

    if (cid) {
      request.cid = cid
    }

    if (tradeId) {
      request.tradeId = tradeId
    }

    /*
    if (isConditional !== undefined) {
      request.isConditional =isConditional
    }
    */

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }

      if (pagination.startTime !== undefined) {
        request.startTime = BigInt(pagination.startTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.OrdersHistoryRequest,
      InjectiveSpotExchangeRpcPb.OrdersHistoryResponse
    >(request, this.client.ordersHistory.bind(this.client), options?.signal)

    return IndexerGrpcSpotTransformer.orderHistoryResponseToOrderHistory(
      response,
    )
  }

  async fetchTrades(
    params?: {
      endTime?: number
      tradeId?: string
      marketId?: string
      startTime?: number
      marketIds?: string[]
      subaccountId?: string
      accountAddress?: string
      direction?: TradeDirection
      pagination?: PaginationOption
      executionSide?: TradeExecutionSide
      executionTypes?: TradeExecutionType[]
      cid?: string
    },
    options?: GrpcCallOptions,
  ) {
    const {
      endTime,
      tradeId,
      marketId,
      startTime,
      direction,
      marketIds,
      pagination,
      subaccountId,
      executionSide,
      executionTypes,
      accountAddress,
      cid,
    } = params || {}

    const request = InjectiveSpotExchangeRpcPb.TradesRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (tradeId) {
      request.tradeId = tradeId
    }

    if (executionTypes) {
      request.executionTypes = executionTypes
    }

    if (executionSide) {
      request.executionSide = executionSide
    }

    if (direction) {
      request.direction = direction
    }

    if (startTime) {
      request.startTime = BigInt(startTime)
    }

    if (endTime) {
      request.endTime = BigInt(endTime)
    }

    if (cid) {
      request.cid = cid
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }

      if (pagination.startTime !== undefined) {
        request.startTime = BigInt(pagination.startTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.TradesRequest,
      InjectiveSpotExchangeRpcPb.TradesResponse
    >(request, this.client.trades.bind(this.client), options?.signal)

    return IndexerGrpcSpotTransformer.tradesResponseToTrades(response)
  }

  async fetchSubaccountOrdersList(
    params?: {
      subaccountId?: string
      marketId?: string
      pagination?: PaginationOption
    },
    options?: GrpcCallOptions,
  ) {
    const { subaccountId, marketId, pagination } = params || {}
    const request =
      InjectiveSpotExchangeRpcPb.SubaccountOrdersListRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.SubaccountOrdersListRequest,
      InjectiveSpotExchangeRpcPb.SubaccountOrdersListResponse
    >(
      request,
      this.client.subaccountOrdersList.bind(this.client),
      options?.signal,
    )

    return IndexerGrpcSpotTransformer.ordersResponseToOrders(response)
  }

  async fetchSubaccountTradesList(
    params?: {
      subaccountId?: string
      marketId?: string
      direction?: TradeDirection
      executionType?: TradeExecutionType
      pagination?: PaginationOption
    },
    options?: GrpcCallOptions,
  ) {
    const { subaccountId, marketId, direction, executionType, pagination } =
      params || {}
    const request =
      InjectiveSpotExchangeRpcPb.SubaccountTradesListRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (direction) {
      request.direction = direction
    }

    if (executionType) {
      request.executionType = executionType
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.SubaccountTradesListRequest,
      InjectiveSpotExchangeRpcPb.SubaccountTradesListResponse
    >(
      request,
      this.client.subaccountTradesList.bind(this.client),
      options?.signal,
    )

    return IndexerGrpcSpotTransformer.subaccountTradesListResponseToTradesList(
      response,
    )
  }

  /** @deprecated - use fetchOrderbooksV2 */
  async fetchOrderbooks(_marketIds: string[]) {
    throw new GeneralException(new Error('deprecated - use fetchOrderbooksV2'))
  }

  async fetchOrderbooksV2(marketIds: string[], options?: GrpcCallOptions) {
    const request = InjectiveSpotExchangeRpcPb.OrderbooksV2Request.create()

    if (marketIds.length > 0) {
      request.marketIds = marketIds
    }

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.OrderbooksV2Request,
      InjectiveSpotExchangeRpcPb.OrderbooksV2Response
    >(request, this.client.orderbooksV2.bind(this.client), options?.signal)

    return IndexerGrpcSpotTransformer.orderbooksV2ResponseToOrderbooksV2(
      response,
    )
  }

  async fetchOrderbookV2(marketId: string, options?: GrpcCallOptions) {
    const request = InjectiveSpotExchangeRpcPb.OrderbookV2Request.create()

    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.OrderbookV2Request,
      InjectiveSpotExchangeRpcPb.OrderbookV2Response
    >(request, this.client.orderbookV2.bind(this.client), options?.signal)

    return IndexerGrpcSpotTransformer.orderbookV2ResponseToOrderbookV2(response)
  }

  async fetchAtomicSwapHistory(
    params: {
      address: string
      contractAddress: string
      pagination?: PaginationOption
    },
    options?: GrpcCallOptions,
  ) {
    const { address, contractAddress, pagination } = params || {}
    const request = InjectiveSpotExchangeRpcPb.AtomicSwapHistoryRequest.create()

    request.address = address
    request.contractAddress = contractAddress

    if (pagination) {
      if (pagination.fromNumber !== undefined) {
        request.fromNumber = pagination.fromNumber
      }

      if (pagination.toNumber !== undefined) {
        request.toNumber = pagination.toNumber
      }

      if (pagination.skip !== undefined) {
        request.skip = pagination.skip
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveSpotExchangeRpcPb.AtomicSwapHistoryRequest,
      InjectiveSpotExchangeRpcPb.AtomicSwapHistoryResponse
    >(request, this.client.atomicSwapHistory.bind(this.client), options?.signal)

    return IndexerGrpcSpotTransformer.grpcAtomicSwapHistoryListToAtomicSwapHistoryList(
      response,
    )
  }
}
