import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { MitoApi } from '@injectivelabs/mito-proto-ts'
import { InjectiveMetaRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcMitoTransformer } from '../transformers/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMitoApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Mito

  protected client: MitoApi.MitoAPIClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new MitoApi.MitoAPIClientImpl(this.getGrpcWebImpl(endpoint))
  }

  async fetchVault({
    contractAddress,
    slug,
  }: {
    contractAddress?: string
    slug?: string
  }) {
    const request = MitoApi.GetVaultRequest.create()

    if (slug) {
      request.slug = slug
    }

    if (contractAddress) {
      request.contractAddress = contractAddress
    }

    try {
      const response = await this.retry<MitoApi.GetVaultResponse>(() =>
        this.client.GetVault(request),
      )

      return IndexerGrpcMitoTransformer.vaultResponseToVault(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
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

  async fetchVaults({
    limit,
    codeId,
    pageIndex,
  }: {
    limit?: number
    codeId?: string
    pageIndex?: number
  }) {
    const request = MitoApi.GetVaultsRequest.create()

    if (codeId) {
      request.codeId = codeId
    }

    if (limit) {
      request.limit = limit
    }

    if (pageIndex) {
      request.pageIndex = pageIndex
    }

    try {
      const response = await this.retry<MitoApi.GetVaultsResponse>(() =>
        this.client.GetVaults(request),
      )

      return IndexerGrpcMitoTransformer.vaultsResponseToVaults(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetVaults',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetVaults',
        contextModule: this.module,
      })
    }
  }

  async fetchLpTokenPriceChart({
    to,
    from,
    vaultAddress,
  }: {
    to?: string
    from?: string
    vaultAddress: string
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
      const response = await this.retry<MitoApi.LPTokenPriceChartResponse>(() =>
        this.client.LPTokenPriceChart(request),
      )

      return IndexerGrpcMitoTransformer.lpTokenPriceChartResponseToLPTokenPriceChart(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'LPTokenPriceChart',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'LPTokenPriceChart',
        contextModule: this.module,
      })
    }
  }

  async fetchTVLChartRequest({
    to,
    from,
    vaultAddress,
  }: {
    to?: string
    from?: string
    vaultAddress: string
  }) {
    const request = MitoApi.TVLChartRequest.create()

    request.vaultAddress = vaultAddress

    if (to) {
      request.toTime = to
    }

    if (from) {
      request.fromTime = from
    }

    try {
      const response = await this.retry<MitoApi.TVLChartResponse>(() =>
        this.client.TVLChart(request),
      )

      return IndexerGrpcMitoTransformer.lpTokenPriceChartResponseToLPTokenPriceChart(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'TVLChart',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TVLChart',
        contextModule: this.module,
      })
    }
  }

  async fetchVaultsByHolderAddress({
    skip,
    limit,
    holderAddress,
    vaultAddress,
  }: {
    skip?: number
    limit?: number
    holderAddress: string
    vaultAddress?: string
  }) {
    const request = MitoApi.VaultsByHolderAddressRequest.create()

    request.holderAddress = holderAddress

    if (vaultAddress) {
      request.vaultAddress = vaultAddress
    }

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response = await this.retry<MitoApi.VaultsByHolderAddressResponse>(
        () => this.client.VaultsByHolderAddress(request),
      )

      return IndexerGrpcMitoTransformer.vaultsByHolderAddressResponseToVaultsByHolderAddress(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'VaultsByHolderAddress',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'VaultsByHolderAddress',
        contextModule: this.module,
      })
    }
  }

  async fetchLPHolders({
    skip,
    limit,
    vaultAddress,
    stakingContractAddress,
  }: {
    skip?: number
    limit?: number
    vaultAddress: string
    stakingContractAddress: string
  }) {
    const request = MitoApi.LPHoldersRequest.create()

    request.vaultAddress = vaultAddress
    request.stakingContractAddress = stakingContractAddress

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response = await this.retry<MitoApi.LPHoldersResponse>(() =>
        this.client.LPHolders(request),
      )

      return IndexerGrpcMitoTransformer.lpHoldersResponseToLPHolders(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'LPHolders',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'LPHolders',
        contextModule: this.module,
      })
    }
  }

  async fetchHolderPortfolio({
    holderAddress,
    stakingContractAddress,
  }: {
    holderAddress: string
    stakingContractAddress: string
  }) {
    const request = MitoApi.PortfolioRequest.create()

    request.holderAddress = holderAddress
    request.stakingContractAddress = stakingContractAddress

    try {
      const response = await this.retry<MitoApi.PortfolioResponse>(() =>
        this.client.Portfolio(request),
      )

      return IndexerGrpcMitoTransformer.portfolioResponseToPortfolio(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Portfolio',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Portfolio',
        contextModule: this.module,
      })
    }
  }

  async fetchLeaderboard(epochId?: number) {
    const request = MitoApi.LeaderboardRequest.create()

    if (epochId) {
      request.epochId = epochId
    }

    try {
      const response = await this.retry<MitoApi.LeaderboardResponse>(() =>
        this.client.Leaderboard(request),
      )

      return IndexerGrpcMitoTransformer.leaderboardResponseToLeaderboard(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Leaderboard',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Leaderboard',
        contextModule: this.module,
      })
    }
  }

  async fetchTransferHistory({
    vault,
    account,
    limit,
    toNumber,
    fromNumber,
  }: {
    vault?: string
    account?: string
    limit?: number
    toNumber?: number
    fromNumber?: number
  }) {
    const request = MitoApi.TransfersHistoryRequest.create()

    if (vault) {
      request.vault = vault
    }

    if (account) {
      request.account = account
    }

    if (limit) {
      request.limit = limit
    }

    if (toNumber) {
      request.toNumber = toNumber
    }

    if (fromNumber) {
      request.fromNumber = fromNumber
    }

    try {
      const response = await this.retry<MitoApi.TransfersHistoryResponse>(() =>
        this.client.TransfersHistory(request),
      )

      return IndexerGrpcMitoTransformer.transferHistoryResponseToTransfer(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'TransfersHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TransfersHistory',
        contextModule: this.module,
      })
    }
  }

  async fetchLeaderboardEpochs({
    limit,
    toEpochId,
    fromEpochId,
  }: {
    limit?: number
    toEpochId?: number
    fromEpochId?: number
  }) {
    const request = MitoApi.LeaderboardEpochsRequest.create()

    if (limit) {
      request.limit = limit
    }

    if (toEpochId) {
      request.toEpochId = toEpochId
    }

    if (fromEpochId) {
      request.fromEpochId = fromEpochId
    }

    try {
      const response = await this.retry<MitoApi.LeaderboardEpochsResponse>(() =>
        this.client.LeaderboardEpochs(request),
      )

      return IndexerGrpcMitoTransformer.leaderboardEpochsResponseToLeaderboardEpochs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'LeaderboardEpochs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'LeaderboardEpochs',
        contextModule: this.module,
      })
    }
  }

  async fetchStakingPools({
    staker,
    stakingContractAddress,
  }: {
    staker?: string
    stakingContractAddress: string
  }) {
    const request = MitoApi.GetStakingPoolsRequest.create()

    request.stakingContractAddress = stakingContractAddress

    if (staker) {
      request.staker = staker
    }

    try {
      const response = await this.retry<MitoApi.GetStakingPoolsResponse>(() =>
        this.client.GetStakingPools(request),
      )

      return IndexerGrpcMitoTransformer.stakingPoolsResponseToStakingPools(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetStakingPools',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetStakingPools',
        contextModule: this.module,
      })
    }
  }

  async fetchStakingHistory({
    staker,
    toNumber,
    limit,
    fromNumber,
  }: {
    staker?: string
    limit?: number
    toNumber?: number
    fromNumber?: number
  } = {}) {
    const request = MitoApi.StakingHistoryRequest.create()

    if (limit) {
      request.limit = limit
    }

    if (staker) {
      request.staker = staker
    }

    if (toNumber) {
      request.toNumber = toNumber
    }

    if (fromNumber) {
      request.fromNumber = fromNumber
    }

    try {
      const response = await this.retry<MitoApi.StakingHistoryResponse>(() =>
        this.client.StakingHistory(request),
      )

      return IndexerGrpcMitoTransformer.mitoStakingHistoryResponseTpStakingHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'StakingHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'StakingHistory',
        contextModule: this.module,
      })
    }
  }

  async fetchStakingRewardsByAccount({
    staker,
    stakingContractAddress,
  }: {
    staker: string
    stakingContractAddress: string
  }) {
    const request = MitoApi.StakingRewardByAccountRequest.create()

    request.staker = staker
    request.stakingContractAddress = stakingContractAddress

    try {
      const response = await this.retry<MitoApi.StakingRewardByAccountResponse>(
        () => this.client.StakingRewardByAccount(request),
      )

      return IndexerGrpcMitoTransformer.stakingRewardByAccountResponseToStakingRewardByAccount(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'StakingReward',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'StakingReward',
        contextModule: this.module,
      })
    }
  }

  async fetchMissions({ accountAddress }: { accountAddress: string }) {
    const request = MitoApi.MissionsRequest.create()

    request.accountAddress = accountAddress

    try {
      const response = await this.retry<MitoApi.MissionsResponse>(() =>
        this.client.Missions(request),
      )

      return IndexerGrpcMitoTransformer.mitoMissionsResponseMissions(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Missions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Missions',
        contextModule: this.module,
      })
    }
  }

  async fetchMissionLeaderboard(userAddress?: string) {
    const request = MitoApi.MissionLeaderboardRequest.create()

    if (userAddress) {
      request.userAddress = userAddress
    }

    try {
      const response = await this.retry<MitoApi.MissionLeaderboardResponse>(
        () => this.client.MissionLeaderboard(request),
      )

      return IndexerGrpcMitoTransformer.mitoMissionLeaderboardResponseToMissionLeaderboard(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'MissionLeaderboard',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'MissionLeaderboard',
        contextModule: this.module,
      })
    }
  }

  async fetchIDO({
    contractAddress,
    accountAddress,
  }: {
    contractAddress: string
    accountAddress?: string
  }) {
    const request = MitoApi.GetIDORequest.create()

    request.contractAddress = contractAddress

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    try {
      const response = await this.retry<MitoApi.GetIDOResponse>(() =>
        this.client.GetIDO(request),
      )

      return IndexerGrpcMitoTransformer.mitoIDOResponseToIDO(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetIDO',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetIdo',
        contextModule: this.module,
      })
    }
  }

  async fetchIDOs({
    status,
    limit,
    toNumber,
    accountAddress,
    ownerAddress,
  }: {
    status?: string
    limit?: number
    toNumber?: number
    accountAddress?: string
    ownerAddress?: string
  } = {}) {
    const request = MitoApi.ListIDOsRequest.create()

    if (status) {
      request.status = status
    }

    if (limit) {
      request.limit = limit
    }

    if (toNumber) {
      request.toNumber = toNumber
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (ownerAddress) {
      request.ownerAddress = ownerAddress
    }

    try {
      const response = await this.retry<MitoApi.ListIDOsResponse>(() =>
        this.client.ListIDOs(request),
      )

      return IndexerGrpcMitoTransformer.mitoListIDOsResponseToIDOs(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'ListIDOs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ListIDOs',
        contextModule: this.module,
      })
    }
  }

  async fetchIDOSubscribers({
    skip,
    limit,
    sortBy,
    contractAddress,
  }: {
    skip?: number
    limit?: number
    sortBy?: string
    contractAddress: string
  }) {
    const request = MitoApi.GetIDOSubscribersRequest.create()

    request.contractAddress = contractAddress

    if (limit) {
      request.limit = limit
    }

    if (skip) {
      request.skip = skip
    }

    if (sortBy) {
      request.sortBy = sortBy
    }

    try {
      const response = await this.retry<MitoApi.GetIDOSubscribersResponse>(() =>
        this.client.GetIDOSubscribers(request),
      )

      return IndexerGrpcMitoTransformer.mitoIDOSubscribersResponseToIDOSubscribers(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetIDOSubscribers',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetIDOSubscribers',
        contextModule: this.module,
      })
    }
  }

  async fetchIDOSubscription({
    contractAddress,
    accountAddress,
  }: {
    contractAddress: string
    accountAddress: string
  }) {
    const request = MitoApi.GetIDOSubscriptionRequest.create()

    request.accountAddress = accountAddress
    request.contractAddress = contractAddress

    try {
      const response = await this.retry<MitoApi.GetIDOSubscriptionResponse>(
        () => this.client.GetIDOSubscription(request),
      )

      return IndexerGrpcMitoTransformer.mitoIDOSubscriptionResponseToIDOSubscription(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetIDOSubscription',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetIDOSubscription',
        contextModule: this.module,
      })
    }
  }

  async fetchIDOActivities({
    contractAddress,
    accountAddress,
    limit,
    toNumber,
  }: {
    contractAddress?: string
    accountAddress?: string
    limit?: number
    toNumber?: string
  } = {}) {
    const request = MitoApi.GetIDOActivitiesRequest.create()

    if (contractAddress) {
      request.contractAddress = contractAddress
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (limit) {
      request.limit = limit
    }

    if (toNumber) {
      request.toNumber = toNumber
    }

    try {
      const response = await this.retry<MitoApi.GetIDOActivitiesResponse>(() =>
        this.client.GetIDOActivities(request),
      )

      return IndexerGrpcMitoTransformer.mitoIDOActivitiesResponseToIDOActivities(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetIDOActivities',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetIDOActivities',
        contextModule: this.module,
      })
    }
  }

  async fetchIDOWhitelist({
    skip,
    limit,
    idoAddress,
  }: {
    skip?: number
    limit?: number
    idoAddress: string
  }) {
    const request = MitoApi.GetWhitelistRequest.create()

    request.idoAddress = idoAddress

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response = await this.retry<MitoApi.GetWhitelistResponse>(() =>
        this.client.GetWhitelist(request),
      )

      return IndexerGrpcMitoTransformer.mitoWhitelistAccountResponseToWhitelistAccount(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetWhitelist',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetWhitelist',
        contextModule: this.module,
      })
    }
  }

  async fetchClaimReferences({
    skip,
    limit,
    idoAddress,
    accountAddress,
  }: {
    skip?: number
    limit?: number
    idoAddress: string
    accountAddress: string
  }) {
    const request = MitoApi.GetClaimReferencesRequest.create()

    request.idoAddress = idoAddress
    request.accountAddress = accountAddress

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response = await this.retry<MitoApi.GetClaimReferencesResponse>(
        () => this.client.GetClaimReferences(request),
      )

      return IndexerGrpcMitoTransformer.claimReferencesResponseToClaimReferences(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetClaimReferences',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetClaimReferences',
        contextModule: this.module,
      })
    }
  }
}
