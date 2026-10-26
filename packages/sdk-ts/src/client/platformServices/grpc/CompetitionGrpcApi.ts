import { throwIfAborted } from '@injectivelabs/utils'
import * as PlatformServicesCompetitionPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_tc_competition_service_pb'
import { TCCompetitionServiceClient } from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_tc_competition_service_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { PlatformServicesGrpcCompetitionTransformer } from '../transformers/index.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type {
  PlatformServicesCompetitionAccountParams,
  PlatformServicesListCompetitionReferrerInviteesParams,
} from '../types/index.js'

export class CompetitionGrpcApi extends BaseGrpcConsumer {
  protected module: string = 'platform-services'

  private get client() {
    return this.initClient(TCCompetitionServiceClient)
  }

  async fetchCurrentCompetition(options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const request =
      PlatformServicesCompetitionPb.GetCurrentCompetitionRequest.create()

    const response = await this.executeGrpcCall<
      PlatformServicesCompetitionPb.GetCurrentCompetitionRequest,
      PlatformServicesCompetitionPb.GetCurrentCompetitionResponse
    >(request, this.client.getCurrentCompetition.bind(this.client), options)

    return PlatformServicesGrpcCompetitionTransformer.grpcGetCurrentCompetitionToCurrentCompetition(
      response,
    )
  }

  async fetchCompetitionTrader(
    params: PlatformServicesCompetitionAccountParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { id, accountAddress } = params

    const request =
      PlatformServicesCompetitionPb.GetCompetitionTraderRequest.create({
        id,
        accountAddress,
      })

    const response = await this.executeGrpcCall<
      PlatformServicesCompetitionPb.GetCompetitionTraderRequest,
      PlatformServicesCompetitionPb.GetCompetitionTraderResponse
    >(request, this.client.getCompetitionTrader.bind(this.client), options)

    return PlatformServicesGrpcCompetitionTransformer.grpcGetCompetitionTraderToCompetitionTrader(
      response,
    )
  }

  async fetchCompetitionReferrer(
    params: PlatformServicesCompetitionAccountParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { id, accountAddress } = params

    const request =
      PlatformServicesCompetitionPb.GetCompetitionReferrerRequest.create({
        id,
        accountAddress,
      })

    const response = await this.executeGrpcCall<
      PlatformServicesCompetitionPb.GetCompetitionReferrerRequest,
      PlatformServicesCompetitionPb.GetCompetitionReferrerResponse
    >(request, this.client.getCompetitionReferrer.bind(this.client), options)

    return PlatformServicesGrpcCompetitionTransformer.grpcGetCompetitionReferrerToCompetitionReferrer(
      response,
    )
  }

  async fetchCompetitionReferrerInvitees(
    params: PlatformServicesListCompetitionReferrerInviteesParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { id, accountAddress, invitee } = params

    const request =
      PlatformServicesCompetitionPb.ListCompetitionReferrerInviteesRequest.create(
        {
          id,
          accountAddress,
          invitee,
        },
      )

    const response = await this.executeGrpcCall<
      PlatformServicesCompetitionPb.ListCompetitionReferrerInviteesRequest,
      PlatformServicesCompetitionPb.ListCompetitionReferrerInviteesResponse
    >(
      request,
      this.client.listCompetitionReferrerInvitees.bind(this.client),
      options,
    )

    return PlatformServicesGrpcCompetitionTransformer.grpcListCompetitionReferrerInviteesToListCompetitionReferrerInvitees(
      response,
    )
  }
}
