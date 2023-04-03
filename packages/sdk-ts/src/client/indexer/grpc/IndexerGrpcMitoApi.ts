import { IndexerGrpcMitoTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveMetaRpc } from '@injectivelabs/indexer-proto-ts'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { MitoApi } from '@injectivelabs/mito-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMitoApi {
  protected module: string = IndexerModule.Mito

  protected client: MitoApi.MitoAPIClientImpl

  constructor(endpoint: string) {
    this.client = new MitoApi.MitoAPIClientImpl(getGrpcIndexerWebImpl(endpoint))
  }

  async fetchVault({
    contractAddress,
    slug,
  }: {
    contractAddress?: string
    slug?: string
  }) {
    const request = MitoApi.GetVaultRequest.create()

    if (contractAddress) {
      request.contractAddress = contractAddress
    }

    if (slug) {
      request.slug = slug
    }

    try {
      const response = await this.client.GetVault(request)

      return IndexerGrpcMitoTransformer.vaultResponseToVault(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
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

  async fetchVaults({
    pageSize,
    pageIndex,
    codeId,
  }: {
    pageSize?: number
    pageIndex?: number
    codeId?: string
  }) {
    const request = MitoApi.GetVaultsRequest.create()

    if (pageSize) {
      request.pageSize = pageSize
    }

    if (pageIndex) {
      request.pageIndex = pageIndex
    }

    if (codeId) {
      request.codeId = codeId
    }

    try {
      const response = await this.client.GetVaults(request)

      return IndexerGrpcMitoTransformer.vaultsResponseToVaults(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
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

  async fetchLpTokenPriceChart({
    vaultAddress,
    from,
    to,
  }: {
    vaultAddress: string
    from?: string
    to?: string
  }) {
    const request = MitoApi.LPTokenPriceChartRequest.create()

    request.vaultAddress = vaultAddress

    if (from) {
      request.fromTime = from
    }

    if (to) {
      request.toTime = to
    }

    try {
      const response = await this.client.LPTokenPriceChart(request)

      return IndexerGrpcMitoTransformer.LPTokenPriceChartResponseToLPTokenPriceChart(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
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

  async fetchTVLChartRequest({
    vaultAddress,
    from,
    to,
  }: {
    vaultAddress: string
    from?: string
    to?: string
  }) {
    const request = MitoApi.TVLChartRequest.create()

    request.vaultAddress = vaultAddress

    if (from) {
      request.fromTime = from
    }

    if (to) {
      request.toTime = to
    }

    try {
      const response = await this.client.TVLChart(request)

      return IndexerGrpcMitoTransformer.LPTokenPriceChartResponseToLPTokenPriceChart(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
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

  async fetchVaultsByHolderAddress({
    pageSize,
    pageIndex,
    holderAddress,
    vaultAddress,
  }: {
    pageSize?: number
    pageIndex?: number
    holderAddress: string
    vaultAddress?: string
  }) {
    const request = MitoApi.VaultsByHolderAddressRequest.create()

    request.holderAddress = holderAddress

    if (vaultAddress) {
      request.vaultAddress = vaultAddress
    }

    if (pageSize) {
      request.pageSize = pageSize
    }

    if (pageIndex) {
      request.pageIndex = pageIndex
    }

    try {
      const response = await this.client.VaultsByHolderAddress(request)

      return IndexerGrpcMitoTransformer.VaultsByHolderAddressResponseToVaultsByHolderAddress(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
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

  async fetchLPHolders({
    pageSize,
    pageIndex,
    vaultAddress,
  }: {
    pageSize?: number
    pageIndex?: number
    vaultAddress: string
  }) {
    const request = MitoApi.LPHoldersRequest.create()

    request.vaultAddress = vaultAddress

    if (pageSize) {
      request.pageSize = pageSize
    }

    if (pageIndex) {
      request.pageIndex = pageIndex
    }

    try {
      const response = await this.client.LPHolders(request)

      return IndexerGrpcMitoTransformer.LPHoldersResponseToLPHolders(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
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

  async fetchHolderPortfolio(holderAddress: string) {
    const request = MitoApi.PortfolioRequest.create()

    request.holderAddress = holderAddress

    try {
      const response = await this.client.Portfolio(request)

      return IndexerGrpcMitoTransformer.PortfolioResponseToPortfolio(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
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

  async fetchLeaderboard() {
    const request = MitoApi.LeaderboardRequest.create()

    try {
      const response = await this.client.Leaderboard(request)

      return IndexerGrpcMitoTransformer.LeaderboardResponseToLeaderboard(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
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
