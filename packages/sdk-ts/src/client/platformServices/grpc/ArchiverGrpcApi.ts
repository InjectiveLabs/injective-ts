import { throwIfAborted } from '@injectivelabs/utils'
import * as PlatformServicesArchiverPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_injective_archiver_rpc_pb'
import { InjectiveArchiverRPCClient } from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_injective_archiver_rpc_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { PlatformServicesGrpcArchiverTransformer } from '../transformers/index.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type {
  PlatformServicesArchiverAccountParams,
  PlatformServicesHistoricalTradesParams,
  PlatformServicesArchiverAccountStatsParams,
  PlatformServicesArchiverListAccountStatsParams,
} from '../types/index.js'

export class ArchiverGrpcApi extends BaseGrpcConsumer {
  protected module: string = 'platform-services'

  private get client() {
    return this.initClient(InjectiveArchiverRPCClient)
  }

  async fetchBalance(
    params: PlatformServicesArchiverAccountParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request = PlatformServicesArchiverPb.BalanceRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.BalanceRequest,
      PlatformServicesArchiverPb.BalanceResponse
    >(request, this.client.balance.bind(this.client), options)

    return PlatformServicesGrpcArchiverTransformer.grpcBalanceToBalance(
      response,
    )
  }

  async fetchAccountStats(
    params: PlatformServicesArchiverAccountStatsParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      PlatformServicesArchiverPb.AccountStatsRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.AccountStatsRequest,
      PlatformServicesArchiverPb.AccountStatsResponse
    >(request, this.client.accountStats.bind(this.client), options)

    return PlatformServicesGrpcArchiverTransformer.grpcAccountStatsToAccountStats(
      response,
    )
  }

  async fetchAccountMaxDrawdown(
    params: PlatformServicesArchiverListAccountStatsParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { account, period, pageSize, nextToken } = params

    const request = PlatformServicesArchiverPb.ListAccountStatsRequest.create({
      account,
      period,
      pageSize,
      nextToken,
    })

    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.ListAccountStatsRequest,
      PlatformServicesArchiverPb.ListAccountStatsResponse
    >(request, this.client.listAccountStats.bind(this.client), options)

    return PlatformServicesGrpcArchiverTransformer.grpcListAccountStatsToListAccountStats(
      response,
    )
  }

  async fetchRpnl(
    params: PlatformServicesArchiverAccountParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request = PlatformServicesArchiverPb.RpnlRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.RpnlRequest,
      PlatformServicesArchiverPb.RpnlResponse
    >(request, this.client.rpnl.bind(this.client), options)

    return PlatformServicesGrpcArchiverTransformer.grpcRpnlToRpnl(response)
  }

  async fetchHistoricalTrades(
    params?: PlatformServicesHistoricalTradesParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      PlatformServicesArchiverPb.HistoricalTradesRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.HistoricalTradesRequest,
      PlatformServicesArchiverPb.HistoricalTradesResponse
    >(request, this.client.historicalTrades.bind(this.client), options)

    return PlatformServicesGrpcArchiverTransformer.grpcHistoricalTradesToHistoricalTrades(
      response,
    )
  }
}
