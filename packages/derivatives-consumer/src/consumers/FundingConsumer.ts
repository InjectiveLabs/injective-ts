import {
  FundingPaymentsRequest,
  FundingPaymentsResponse,
  FundingRatesRequest,
  FundingRatesResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPC } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import { PaginationOption } from '@injectivelabs/ts-types'
import BaseConsumer from '../BaseConsumer'

export class FundingConsumer extends BaseConsumer {
  async fetchFundingPayments({
    marketId,
    subaccountId,
    pagination,
  }: {
    marketId?: string
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const request = new FundingPaymentsRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.setSkip(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.setLimit(pagination.limit)
      }
    }

    try {
      const response = await this.request<
        FundingPaymentsRequest,
        FundingPaymentsResponse,
        typeof InjectiveDerivativeExchangeRPC.FundingPayments
      >(request, InjectiveDerivativeExchangeRPC.FundingPayments)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchFundingRates({
    marketId,
    pagination,
  }: {
    marketId?: string
    pagination?: PaginationOption
  }) {
    const request = new FundingRatesRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.setSkip(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.setLimit(pagination.limit)
      }
    }

    try {
      const response = await this.request<
        FundingRatesRequest,
        FundingRatesResponse,
        typeof InjectiveDerivativeExchangeRPC.FundingRates
      >(request, InjectiveDerivativeExchangeRPC.FundingRates)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
