import * as PlatformServicesArchiverPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_injective_archiver_rpc_pb'
import { InjectiveArchiverRPCClient } from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_injective_archiver_rpc_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { PlatformServicesGrpcArchiverTransformer } from '../transformers/index.js'
import type {
  PlatformServicesArchiverAccountParams,
  PlatformServicesArchiverAccountStatsParams,
  PlatformServicesHistoricalTradesParams,
} from '../types/index.js'

export class ArchiverGrpcApi extends BaseGrpcConsumer {
  protected module: string = 'platform-services'

  private get client() {
    return this.initClient(InjectiveArchiverRPCClient)
  }

  async fetchBalance(params: PlatformServicesArchiverAccountParams) {
    const request = PlatformServicesArchiverPb.BalanceRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.BalanceRequest,
      PlatformServicesArchiverPb.BalanceResponse
    >(request, this.client.balance.bind(this.client))

    return PlatformServicesGrpcArchiverTransformer.grpcBalanceToBalance(response)
  }

  async fetchAccountStats(params: PlatformServicesArchiverAccountStatsParams) {
    const request = PlatformServicesArchiverPb.AccountStatsRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.AccountStatsRequest,
      PlatformServicesArchiverPb.AccountStatsResponse
    >(request, this.client.accountStats.bind(this.client))

    return PlatformServicesGrpcArchiverTransformer.grpcAccountStatsToAccountStats(
      response,
    )
  }

  async fetchRpnl(params: PlatformServicesArchiverAccountParams) {
    const request = PlatformServicesArchiverPb.RpnlRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.RpnlRequest,
      PlatformServicesArchiverPb.RpnlResponse
    >(request, this.client.rpnl.bind(this.client))

    return PlatformServicesGrpcArchiverTransformer.grpcRpnlToRpnl(response)
  }

  async fetchHistoricalTrades(params?: PlatformServicesHistoricalTradesParams) {
    const request = PlatformServicesArchiverPb.HistoricalTradesRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesArchiverPb.HistoricalTradesRequest,
      PlatformServicesArchiverPb.HistoricalTradesResponse
    >(request, this.client.historicalTrades.bind(this.client))

    return PlatformServicesGrpcArchiverTransformer.grpcHistoricalTradesToHistoricalTrades(
      response,
    )
  }
}
