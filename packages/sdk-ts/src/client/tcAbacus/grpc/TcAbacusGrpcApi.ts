import { IndexerErrorModule } from '@injectivelabs/exceptions'
import * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/injective_tc_abacus_rpc_pb'
import { InjectiveTCAbacusRPCClient } from '@injectivelabs/tc-abacus-proto-ts-v2/generated/injective_tc_abacus_rpc_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { TcAbacusGrpcTransformer } from './transformers/index.js'

export class TcAbacusGrpcApi extends BaseGrpcConsumer {
  protected module: string = IndexerErrorModule.Abacus

  private get client() {
    return this.initClient(InjectiveTCAbacusRPCClient)
  }

  async fetchCurrentEpoch() {
    const request = TcAbacusPb.GetCurrentEpochRequest.create({})

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetCurrentEpochRequest,
      TcAbacusPb.GetCurrentEpochResponse
    >(request, this.client.getCurrentEpoch.bind(this.client))

    return TcAbacusGrpcTransformer.grpcCurrentEpochToCurrentEpoch(response)
  }

  async fetchHealthCheck() {
    const request = TcAbacusPb.HealthCheckRequest.create({})

    const response = await this.executeGrpcCall<
      TcAbacusPb.HealthCheckRequest,
      TcAbacusPb.HealthCheckResponse
    >(request, this.client.healthCheck.bind(this.client))

    return TcAbacusGrpcTransformer.grpcHealthCheckToHealthCheck(response)
  }

  async fetchAccountPoints(address: string, cursor?: string, limit?: number) {
    const request = TcAbacusPb.GetAccountPointsRequest.create({
      limit,
      cursor,
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetAccountPointsRequest,
      TcAbacusPb.GetAccountPointsResponse
    >(request, this.client.getAccountPoints.bind(this.client))

    return TcAbacusGrpcTransformer.grpcAccountPointsToAccountPoints(response)
  }

  async fetchAccountStats(address: string) {
    const request = TcAbacusPb.GetAccountStatsRequest.create({
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetAccountStatsRequest,
      TcAbacusPb.GetAccountStatsResponse
    >(request, this.client.getAccountStats.bind(this.client))

    return TcAbacusGrpcTransformer.grpcAccountStatsToAccountStats(response)
  }

  async fetchReferrers(cursor?: string, limit?: number) {
    const request = TcAbacusPb.ListReferrersRequest.create({
      limit,
      cursor,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.ListReferrersRequest,
      TcAbacusPb.ListReferrersResponse
    >(request, this.client.listReferrers.bind(this.client))

    return TcAbacusGrpcTransformer.grpcListReferrersToListReferrers(response)
  }

  async fetchAccountInvitees(address: string, cursor?: string, limit?: number) {
    const request = TcAbacusPb.GetAccountInviteesRequest.create({
      limit,
      cursor,
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetAccountInviteesRequest,
      TcAbacusPb.GetAccountInviteesResponse
    >(request, this.client.getAccountInvitees.bind(this.client))

    return TcAbacusGrpcTransformer.grpcAccountInviteesToAccountInvitees(
      response,
    )
  }

  async fetchReferrerEligibility(address: string) {
    const request = TcAbacusPb.GetReferrerElegibilityRequest.create({
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetReferrerElegibilityRequest,
      TcAbacusPb.GetReferrerElegibilityResponse
    >(request, this.client.getReferrerElegibility.bind(this.client))

    return TcAbacusGrpcTransformer.grpcReferrerEligibilityToReferrerEligibility(
      response,
    )
  }

  async createReferrerCode(address: string, code: string) {
    const request = TcAbacusPb.CreateReferrerCodeRequest.create({
      code,
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.CreateReferrerCodeRequest,
      TcAbacusPb.CreateReferrerCodeResponse
    >(request, this.client.createReferrerCode.bind(this.client))

    return response // has no response fields
  }

  async fetchReferrerCodes(address: string, cursor?: string, limit?: number) {
    const request = TcAbacusPb.ListReferrerCodesRequest.create({
      limit,
      cursor,
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.ListReferrerCodesRequest,
      TcAbacusPb.ListReferrerCodesResponse
    >(request, this.client.listReferrerCodes.bind(this.client))

    return TcAbacusGrpcTransformer.grpcListReferrerCodesToListReferrerCodes(
      response,
    )
  }

  async fetchInviteeReferrer(address: string) {
    const request = TcAbacusPb.GetInviteeReferrerRequest.create({
      address,
    })

    const response = await this.executeGrpcCall<
      TcAbacusPb.GetInviteeReferrerRequest,
      TcAbacusPb.GetInviteeReferrerResponse
    >(request, this.client.getInviteeReferrer.bind(this.client))

    return TcAbacusGrpcTransformer.grpcInviteeReferrerToInviteeReferrer(
      response,
    )
  }
}
