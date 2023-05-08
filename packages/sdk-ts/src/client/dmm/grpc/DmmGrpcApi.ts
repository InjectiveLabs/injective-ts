import { InjectiveDmmRpc } from '@injectivelabs/dmm-proto-ts'
import { getGrpcDmmWebImpl } from '../../BaseGrpcDmmWebConsumer'
import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
  DmmErrorModule,
} from '@injectivelabs/exceptions'

export class DmmGrpcApi {
  protected module: string = DmmErrorModule.Dmm
  protected client: InjectiveDmmRpc.InjectiveDmmV2RPCClientImpl
  constructor(endpoint: string) {
    this.client = new InjectiveDmmRpc.InjectiveDmmV2RPCClientImpl(
      getGrpcDmmWebImpl(endpoint),
    )
  }

  async fetchEpochs(status?: string) {
    const request = InjectiveDmmRpc.GetEpochsRequest.create()

    if (status) {
      request.status = status
    }

    try {
      const { epochs } = await this.client.GetEpochs(request)

      return epochs
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchMarketRewards(epochId: string) {
    const request = InjectiveDmmRpc.GetMarketRewardsRequest.create()

    request.epochId = epochId.toString()

    try {
      const { rewards } = await this.client.GetMarketRewards(request)

      return rewards
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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

    request.epochId = epochId

    if (page) {
      request.page = page
    }

    try {
      return await this.client.GetEligibleAddresses(request)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
      return await this.client.GetEpochScores(request)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
      return await this.client.GetEpochScoresHistory(request)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
      return await this.client.GetTotalScores(request)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
      return await this.client.GetTotalScoresHistory(request)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchLiquiditySnapshots({
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
    const request = InjectiveDmmRpc.GetLiquiditySnapshotsRequest.create()

    request.epochId = epochId
    request.marketId = marketId
    request.accountAddress = accountAddress

    if (page) {
      request.page = page
    }

    try {
      return await this.client.GetLiquiditySnapshots(request)
    } catch (e: unknown) {
      if (e instanceof InjectiveDmmRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
