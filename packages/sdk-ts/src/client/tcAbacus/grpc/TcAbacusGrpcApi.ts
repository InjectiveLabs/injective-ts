import { IndexerErrorModule } from '@injectivelabs/exceptions'
import * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/injective_tc_abacus_rpc_pb'
import { InjectiveTCAbacusRPCClient } from '@injectivelabs/tc-abacus-proto-ts-v2/generated/injective_tc_abacus_rpc_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { TcAbacusGrpcTransformer } from './transformers/index.js'
import type { GrpcCallOptions } from '../../../types/index.js'

export class TcAbacusGrpcApi extends BaseGrpcConsumer {
  protected module: string = IndexerErrorModule.Abacus

  private get client() {
    return this.initClient(InjectiveTCAbacusRPCClient)
  }

  async fetchHealthCheck(options?: GrpcCallOptions) {
    const request = TcAbacusPb.HealthCheckRequest.create({})

    const response = await this.executeGrpcCall<
      TcAbacusPb.HealthCheckRequest,
      TcAbacusPb.HealthCheckResponse
    >(request, this.client.healthCheck.bind(this.client), options?.signal)

    return TcAbacusGrpcTransformer.grpcHealthCheckToHealthCheck(response)
  }

  async fetchAccountPoints(
    address: string,
    cursor?: string,
    limit?: number,
    options?: GrpcCallOptions,
  ) {
    const request = TcAbacusPb.GetAccountPointsRequest.create({
      limit,
      cursor,
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetAccountPointsRequest,
      TcAbacusPb.GetAccountPointsResponse
    >(request, this.client.getAccountPoints.bind(this.client), options?.signal)

    return TcAbacusGrpcTransformer.grpcAccountPointsToAccountPoints(response)
  }

  async fetchAccountStats(address: string, options?: GrpcCallOptions) {
    const request = TcAbacusPb.GetAccountStatsRequest.create({
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetAccountStatsRequest,
      TcAbacusPb.GetAccountStatsResponse
    >(request, this.client.getAccountStats.bind(this.client), options?.signal)

    return TcAbacusGrpcTransformer.grpcAccountStatsToAccountStats(response)
  }

  async fetchReferrers(
    cursor?: string,
    limit?: number,
    options?: GrpcCallOptions,
  ) {
    const request = TcAbacusPb.ListReferrersRequest.create({
      limit,
      cursor,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.ListReferrersRequest,
      TcAbacusPb.ListReferrersResponse
    >(request, this.client.listReferrers.bind(this.client), options?.signal)

    return TcAbacusGrpcTransformer.grpcListReferrersToListReferrers(response)
  }

  async fetchAccountInvitees(
    address: string,
    cursor?: string,
    limit?: number,
    options?: GrpcCallOptions,
  ) {
    const request = TcAbacusPb.GetAccountInviteesRequest.create({
      limit,
      cursor,
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetAccountInviteesRequest,
      TcAbacusPb.GetAccountInviteesResponse
    >(
      request,
      this.client.getAccountInvitees.bind(this.client),
      options?.signal,
    )

    return TcAbacusGrpcTransformer.grpcAccountInviteesToAccountInvitees(
      response,
    )
  }
}
