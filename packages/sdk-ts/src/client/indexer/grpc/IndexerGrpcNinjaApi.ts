import { IndexerGrpcNinjaTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveMetaRpc } from '@injectivelabs/indexer-proto-ts'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { NinjaApi } from '@injectivelabs/ninja-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcNinjaApi {
  protected module: string = IndexerModule.Ninja

  protected client: NinjaApi.NinjaAPIClientImpl

  constructor(endpoint: string) {
    this.client = new NinjaApi.NinjaAPIClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchVault({
    contractAddress,
    slug,
  }: {
    contractAddress?: string
    slug?: string
  }) {
    const request = NinjaApi.GetVaultRequest.create()

    if (contractAddress) {
      request.contractAddress = contractAddress
    }

    if (slug) {
      request.slug = slug
    }

    try {
      const response = await this.client.GetVault(request)

      return IndexerGrpcNinjaTransformer.vaultResponseToVault(response)
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
    const request = NinjaApi.GetVaultsRequest.create()

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

      return IndexerGrpcNinjaTransformer.vaultsResponseToVaults(response)
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
    const request = NinjaApi.LPTokenPriceChartRequest.create()

    request.vaultAddress = vaultAddress

    if (from) {
      request.fromTime = from
    }

    if (to) {
      request.toTime = to
    }

    try {
      const response = await this.client.LPTokenPriceChart(request)

      return IndexerGrpcNinjaTransformer.LPTokenPriceChartResponseToLPTokenPriceChart(
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
    const request = NinjaApi.TVLChartRequest.create()

    request.vaultAddress = vaultAddress

    if (from) {
      request.fromTime = from
    }

    if (to) {
      request.toTime = to
    }

    try {
      const response = await this.client.TVLChart(request)

      return IndexerGrpcNinjaTransformer.LPTokenPriceChartResponseToLPTokenPriceChart(
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
    const request = NinjaApi.VaultsByHolderAddressRequest.create()

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

      return IndexerGrpcNinjaTransformer.VaultsByHolderAddressResponseToVaultsByHolderAddress(
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
    const request = NinjaApi.LPHoldersRequest.create()

    request.vaultAddress = vaultAddress

    if (pageSize) {
      request.pageSize = pageSize
    }

    if (pageIndex) {
      request.pageIndex = pageIndex
    }

    try {
      const response = await this.client.LPHolders(request)

      return IndexerGrpcNinjaTransformer.LPHoldersResponseToLPHolders(response)
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
    const request = NinjaApi.PortfolioRequest.create()

    request.holderAddress = holderAddress

    try {
      const response = await this.client.Portfolio(request)

      return IndexerGrpcNinjaTransformer.PortfolioResponseToPortfolio(response)
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
    const request = NinjaApi.LeaderboardRequest.create()

    try {
      const response = await this.client.Leaderboard(request)

      return IndexerGrpcNinjaTransformer.LeaderboardResponseToLeaderboard(
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
