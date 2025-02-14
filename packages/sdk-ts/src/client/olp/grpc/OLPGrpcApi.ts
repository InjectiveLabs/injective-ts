import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
  IndexerErrorModule,
} from '@injectivelabs/exceptions'
import { InjectiveDmmRpc } from '@injectivelabs/olp-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { DmmGrpcTransformer } from './transformers/index.js'

export class OLPGrpcApi extends BaseGrpcConsumer {
  protected module: string = IndexerErrorModule.OLP

  protected client: InjectiveDmmRpc.InjectiveDmmV2RPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveDmmRpc.InjectiveDmmV2RPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchEpochs(status?: string) {
    const request = InjectiveDmmRpc.GetEpochsRequest.create()

    if (status) {
      request.status = status
    }

    try {
      const response = await this.retry<InjectiveDmmRpc.GetEpochsResponse>(() =>
        this.client.GetEpochs(request),
      )

      return DmmGrpcTransformer.epochsResponseToEpochs(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetEpochs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetEpochs',
        contextModule: this.module,
      })
    }
  }

  async fetchMarketRewards(epochId: string) {
    const request = InjectiveDmmRpc.GetMarketRewardsRequest.create()

    request.epochId = epochId.toString()

    try {
      const response =
        await this.retry<InjectiveDmmRpc.GetMarketRewardsResponse>(() =>
          this.client.GetMarketRewards(request),
        )

      return DmmGrpcTransformer.marketRewardsResponseToMarketRewards(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetMarketRewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetMarketRewards',
        contextModule: this.module,
      })
    }
  }

  async fetchEligibleAddresses({
    epochId,
    page,
  }: {
    epochId: string
    page?: InjectiveDmmRpc.Pagination
  }) {
    const request = InjectiveDmmRpc.GetEligibleAddressesRequest.create()
    InjectiveDmmRpc.GetRewardsDistributionRequest
    request.epochId = epochId

    if (page) {
      request.page = page
    }

    try {
      const response =
        await this.retry<InjectiveDmmRpc.GetEligibleAddressesResponse>(() =>
          this.client.GetEligibleAddresses(request),
        )

      return DmmGrpcTransformer.eligibleAddressesResponseToEligibleAddresses(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetEligibleAddresses',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetEligibleAddresses',
        contextModule: this.module,
      })
    }
  }

  async fetchEpochScores({
    epochId,
    page,
  }: {
    epochId: string
    page?: InjectiveDmmRpc.Pagination
  }) {
    const request = InjectiveDmmRpc.GetEpochScoresRequest.create()

    request.epochId = epochId

    if (page) {
      request.page = page
    }

    try {
      const response = await this.retry<InjectiveDmmRpc.GetEpochScoresResponse>(
        () => this.client.GetEpochScores(request),
      )

      return DmmGrpcTransformer.epochScoresResponseToEpochScores(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetEpochScores',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetEpochScores',
        contextModule: this.module,
      })
    }
  }

  async fetchEpochScoresHistory({
    epochId,
    accountAddress,
    page,
  }: {
    epochId: string
    accountAddress: string
    page?: InjectiveDmmRpc.Pagination
  }) {
    const request = InjectiveDmmRpc.GetEpochScoresHistoryRequest.create()

    request.epochId = epochId
    request.accountAddress = accountAddress

    if (page) {
      request.page = page
    }

    try {
      const response =
        await this.retry<InjectiveDmmRpc.GetEpochScoresHistoryResponse>(() =>
          this.client.GetEpochScoresHistory(request),
        )

      return DmmGrpcTransformer.epochScoresHistoryResponseToEpochScoresHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetEpochScoresHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetEpochScoresHistory',
        contextModule: this.module,
      })
    }
  }

  async fetchTotalScores({
    epochId,
    marketId,
    page,
  }: {
    epochId: string
    marketId: string
    page?: InjectiveDmmRpc.Pagination
  }) {
    const request = InjectiveDmmRpc.GetTotalScoresRequest.create()

    request.epochId = epochId
    request.marketId = marketId

    if (page) {
      request.page = page
    }

    try {
      const response = await this.retry<InjectiveDmmRpc.GetTotalScoresResponse>(
        () => this.client.GetTotalScores(request),
      )

      return DmmGrpcTransformer.totalScoresResponseToTotalScores(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetTotalScores',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetTotalScores',
        contextModule: this.module,
      })
    }
  }

  async fetchTotalScoresHistory({
    epochId,
    marketId,
    accountAddress,
    page,
  }: {
    epochId: string
    marketId: string
    accountAddress: string
    page?: InjectiveDmmRpc.Pagination
  }) {
    const request = InjectiveDmmRpc.GetTotalScoresHistoryRequest.create()

    request.epochId = epochId
    request.marketId = marketId
    request.accountAddress = accountAddress

    if (page) {
      request.page = page
    }

    try {
      const response =
        await this.retry<InjectiveDmmRpc.GetTotalScoresHistoryResponse>(() =>
          this.client.GetTotalScoresHistory(request),
        )

      return DmmGrpcTransformer.totalScoresHistoryResponseToTotalScoresHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetTotalScoresHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetTotalScoresHistory',
        contextModule: this.module,
      })
    }
  }

  async fetchRewardsDistribution({
    epochId,
    height,
    page,
  }: {
    epochId: string
    height?: string
    page?: InjectiveDmmRpc.Pagination
  }) {
    const request = InjectiveDmmRpc.GetRewardsDistributionRequest.create()

    request.epochId = epochId

    if (height) {
      request.height = height
    }

    if (page) {
      request.page = page
    }

    try {
      const response =
        await this.retry<InjectiveDmmRpc.GetRewardsDistributionResponse>(() =>
          this.client.GetRewardsDistribution(request),
        )

      return DmmGrpcTransformer.rewardsDistributionResponseToRewardsDistribution(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetRewardsDistribution',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetRewardsDistribution',
        contextModule: this.module,
      })
    }
  }

  async fetchAccountVolumes({
    epochId,
    accountAddress,
  }: {
    epochId: string
    accountAddress: string
  }) {
    const request = InjectiveDmmRpc.GetAccountVolumesRequest.create()

    request.epochId = epochId
    request.accountAddress = accountAddress

    try {
      const response =
        await this.retry<InjectiveDmmRpc.GetAccountVolumesResponse>(() =>
          this.client.GetAccountVolumes(request),
        )

      return DmmGrpcTransformer.accountVolumesResponseToAccountVolumes(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetAccountVolumes',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetAccountVolumes',
        contextModule: this.module,
      })
    }
  }

  async fetchRewardsEligibility({
    epochId,
    accountAddress,
  }: {
    epochId?: string
    accountAddress?: string
  }) {
    const request = InjectiveDmmRpc.GetRewardsEligibilityRequest.create()

    if (epochId) {
      request.epochId = epochId
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    try {
      const response =
        await this.retry<InjectiveDmmRpc.GetRewardsEligibilityResponse>(() =>
          this.client.GetRewardsEligibility(request),
        )

      return DmmGrpcTransformer.rewardsEligibilityResponseToRewardsEligibility(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetRewardsEligibility',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetRewardsEligibility',
        contextModule: this.module,
      })
    }
  }

  async fetchMinMaxRewards({
    epochId,
    marketId,
  }: {
    epochId: string
    marketId?: string
  }) {
    const request = InjectiveDmmRpc.GetMarketMinMaxRewardsRequest.create()

    request.epochId = epochId
    request.marketId = marketId

    try {
      const response =
        await this.retry<InjectiveDmmRpc.GetMarketMinMaxRewardsResponse>(() =>
          this.client.GetMarketMinMaxRewards(request),
        )

      return DmmGrpcTransformer.minMaxRewardsResponseToMinMaxRewards(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetMarketMinMaxRewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetMarketMinMaxRewards',
        contextModule: this.module,
      })
    }
  }
}
