import { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'
import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcMegaVaultTransformer } from '../transformers/index.js'
import { IndexerModule } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMegaVaultApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.MegaVault

  protected client: InjectiveMegaVaultRpc.InjectiveMegavaultRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveMegaVaultRpc.InjectiveMegavaultRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchVault({ vaultAddress }: { vaultAddress: string }) {
    const request = InjectiveMegaVaultRpc.GetVaultRequest.create()

    request.vaultAddress = vaultAddress

    try {
      const response = await this.retry<InjectiveMegaVaultRpc.GetVaultResponse>(
        () => this.client.GetVault(request, this.metadata),
      )

      return IndexerGrpcMegaVaultTransformer.vaultResponseToVault(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'fetchVault',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchVault',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultUser({
    vaultAddress,
    userAddress,
  }: {
    userAddress: string
    vaultAddress: string
  }) {
    const request = InjectiveMegaVaultRpc.GetUserRequest.create()

    request.vaultAddress = vaultAddress
    request.userAddress = userAddress

    try {
      const response = await this.retry<InjectiveMegaVaultRpc.GetUserResponse>(
        () => this.client.GetUser(request, this.metadata),
      )

      return IndexerGrpcMegaVaultTransformer.userResponseToUser(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'fetchVaultUser',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchVaultUser',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultSubscriptions({
    token,
    status,
    perPage,
    userAddress,
    vaultAddress,
  }: {
    token?: string
    status?: string
    perPage?: number
    userAddress: string
    vaultAddress: string
  }) {
    const request = InjectiveMegaVaultRpc.ListSubscriptionsRequest.create()

    request.vaultAddress = vaultAddress
    request.userAddress = userAddress

    if (status) {
      request.status = status
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    try {
      const response =
        await this.retry<InjectiveMegaVaultRpc.ListSubscriptionsResponse>(() =>
          this.client.ListSubscriptions(request, this.metadata),
        )

      return IndexerGrpcMegaVaultTransformer.subscriptionsResponseToSubscriptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'fetchVaultSubscriptions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchVaultSubscriptions',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultRedemptions({
    token,
    status,
    perPage,
    userAddress,
    vaultAddress,
  }: {
    token?: string
    status?: string
    perPage?: number
    vaultAddress: string
    userAddress: string
  }) {
    const request = InjectiveMegaVaultRpc.ListRedemptionsRequest.create()

    request.vaultAddress = vaultAddress
    request.userAddress = userAddress

    if (status) {
      request.status = status
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    try {
      const response =
        await this.retry<InjectiveMegaVaultRpc.ListRedemptionsResponse>(() =>
          this.client.ListRedemptions(request, this.metadata),
        )

      return IndexerGrpcMegaVaultTransformer.redemptionsResponseToRedemptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'fetchVaultRedemptions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchVaultRedemptions',
        contextModule: this.module,
      })
    }
  }

  async fetchOperatorRedemptionBuckets({
    vaultAddress,
    operatorAddress,
  }: {
    vaultAddress: string
    operatorAddress: string
  }) {
    const request =
      InjectiveMegaVaultRpc.GetOperatorRedemptionBucketsRequest.create()

    request.vaultAddress = vaultAddress
    request.operatorAddress = operatorAddress

    try {
      const response =
        await this.retry<InjectiveMegaVaultRpc.GetOperatorRedemptionBucketsResponse>(
          () =>
            this.client.GetOperatorRedemptionBuckets(request, this.metadata),
        )

      return IndexerGrpcMegaVaultTransformer.operatorRedemptionBucketsResponseToOperatorRedemptionBuckets(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'fetchOperatorRedemptionBuckets',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchOperatorRedemptionBuckets',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultTvlHistory({
    since,
    vaultAddress,
    maxDataPoints,
  }: {
    since: number
    vaultAddress: string
    maxDataPoints?: number
  }) {
    const request = InjectiveMegaVaultRpc.TvlHistoryRequest.create()

    request.vaultAddress = vaultAddress
    request.since = since.toString()

    if (maxDataPoints) {
      request.maxDataPoints = maxDataPoints
    }

    try {
      const response =
        await this.retry<InjectiveMegaVaultRpc.TvlHistoryResponse>(() =>
          this.client.TvlHistory(request, this.metadata),
        )

      return IndexerGrpcMegaVaultTransformer.tvlHistoryResponseToTvlHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'fetchVaultTvlHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchVaultTvlHistory',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultPnlHistory({
    since,
    vaultAddress,
    maxDataPoints,
  }: {
    since: number
    vaultAddress: string
    maxDataPoints?: number
  }) {
    const request = InjectiveMegaVaultRpc.PnlHistoryRequest.create()

    request.vaultAddress = vaultAddress
    request.since = since.toString()

    if (maxDataPoints) {
      request.maxDataPoints = maxDataPoints
    }

    try {
      const response =
        await this.retry<InjectiveMegaVaultRpc.PnlHistoryResponse>(() =>
          this.client.PnlHistory(request, this.metadata),
        )

      return IndexerGrpcMegaVaultTransformer.pnlHistoryResponseToPnlHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'fetchVaultPnlHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchVaultPnlHistory',
        contextModule: this.module,
      })
    }
  }
}
