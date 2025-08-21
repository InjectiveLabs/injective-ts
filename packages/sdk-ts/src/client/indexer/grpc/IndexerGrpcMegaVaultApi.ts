import { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcMegaVaultTransformer } from '../transformers/index.js'
import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'

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

      return IndexerGrpcMegaVaultTransformer.getVaultResponseToVault(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetVault',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetVault',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultUser({
    vaultAddress,
    userAddress,
  }: {
    vaultAddress: string
    userAddress: string
  }) {
    const request = InjectiveMegaVaultRpc.GetUserRequest.create()

    request.vaultAddress = vaultAddress
    request.userAddress = userAddress

    try {
      const response = await this.retry<InjectiveMegaVaultRpc.GetUserResponse>(
        () => this.client.GetUser(request, this.metadata),
      )

      return IndexerGrpcMegaVaultTransformer.getUserResponseToUser(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetUser',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetUser',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultSubscriptions({
    vaultAddress,
    userAddress,
    status,
    perPage,
    token,
  }: {
    vaultAddress: string
    userAddress: string
    status?: string
    perPage?: number
    token?: string
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

      return IndexerGrpcMegaVaultTransformer.listSubscriptionsResponseToSubscriptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ListSubscriptions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ListSubscriptions',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultRedemptions({
    vaultAddress,
    userAddress,
    status,
    perPage,
    token,
  }: {
    vaultAddress: string
    userAddress: string
    status?: string
    perPage?: number
    token?: string
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

      return IndexerGrpcMegaVaultTransformer.listRedemptionsResponseToRedemptions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ListRedemptions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ListRedemptions',
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

      return IndexerGrpcMegaVaultTransformer.getOperatorRedemptionBucketsResponseToOperatorRedemptionBuckets(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMegaVaultRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'GetOperatorRedemptionBuckets',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetOperatorRedemptionBuckets',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultTvlHistory({
    vaultAddress,
    since,
    maxDataPoints,
  }: {
    vaultAddress: string
    since: number
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
          context: 'TvlHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TvlHistory',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultPnlHistory({
    vaultAddress,
    since,
    maxDataPoints,
  }: {
    vaultAddress: string
    since: number
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
          context: 'PnlHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PnlHistory',
        contextModule: this.module,
      })
    }
  }
}
