import { MitoAPIClient } from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb.client'
import * as GoadesignGoagenMitoApiPb from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcMitoTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { GrpcCallOptions } from '../../../types/index.js'
/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMitoApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Mito

  private get client() {
    return this.initClient(MitoAPIClient)
  }

  async fetchVault(
    {
      contractAddress,
      slug,
    }: {
      contractAddress?: string
      slug?: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetVaultRequest.create()

    if (slug) {
      request.slug = slug
    }

    if (contractAddress) {
      request.contractAddress = contractAddress
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetVaultRequest,
      GoadesignGoagenMitoApiPb.GetVaultResponse
    >(request, this.client.getVault.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.vaultResponseToVault(response)
  }

  async fetchVaults(
    {
      limit,
      codeId,
      pageIndex,
    }: {
      limit?: number
      codeId?: string
      pageIndex?: number
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetVaultsRequest.create()

    if (codeId) {
      request.codeId = BigInt(codeId)
    }

    if (limit) {
      request.limit = limit
    }

    if (pageIndex) {
      request.pageIndex = pageIndex
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetVaultsRequest,
      GoadesignGoagenMitoApiPb.GetVaultsResponse
    >(request, this.client.getVaults.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.vaultsResponseToVaults(response)
  }

  async fetchLpTokenPriceChart(
    {
      to,
      from,
      vaultAddress,
    }: {
      to?: string
      from?: string
      vaultAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.LPTokenPriceChartRequest.create()

    request.vaultAddress = vaultAddress

    if (from) {
      request.fromTime = BigInt(from)
    }

    if (to) {
      request.toTime = BigInt(to)
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.LPTokenPriceChartRequest,
      GoadesignGoagenMitoApiPb.LPTokenPriceChartResponse
    >(request, this.client.lPTokenPriceChart.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.lpTokenPriceChartResponseToLPTokenPriceChart(
      response,
    )
  }

  async fetchTVLChartRequest(
    {
      to,
      from,
      vaultAddress,
    }: {
      to?: string
      from?: string
      vaultAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.TVLChartRequest.create()

    request.vaultAddress = vaultAddress

    if (to) {
      request.toTime = BigInt(to)
    }

    if (from) {
      request.fromTime = BigInt(from)
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.TVLChartRequest,
      GoadesignGoagenMitoApiPb.TVLChartResponse
    >(request, this.client.tVLChart.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.lpTokenPriceChartResponseToLPTokenPriceChart(
      response,
    )
  }

  async fetchVaultsByHolderAddress(
    {
      skip,
      limit,
      holderAddress,
      vaultAddress,
    }: {
      skip?: number
      limit?: number
      holderAddress: string
      vaultAddress?: string
    },
    options?: GrpcCallOptions,
  ) {
    const request =
      GoadesignGoagenMitoApiPb.VaultsByHolderAddressRequest.create()

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

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.VaultsByHolderAddressRequest,
      GoadesignGoagenMitoApiPb.VaultsByHolderAddressResponse
    >(
      request,
      this.client.vaultsByHolderAddress.bind(this.client),
      options?.signal,
    )

    return IndexerGrpcMitoTransformer.vaultsByHolderAddressResponseToVaultsByHolderAddress(
      response,
    )
  }

  async fetchLPHolders(
    {
      skip,
      limit,
      vaultAddress,
      stakingContractAddress,
    }: {
      skip?: number
      limit?: number
      vaultAddress: string
      stakingContractAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.LPHoldersRequest.create()

    request.vaultAddress = vaultAddress
    request.stakingContractAddress = stakingContractAddress

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.LPHoldersRequest,
      GoadesignGoagenMitoApiPb.LPHoldersResponse
    >(request, this.client.lPHolders.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.lpHoldersResponseToLPHolders(response)
  }

  async fetchHolderPortfolio(
    {
      holderAddress,
      stakingContractAddress,
    }: {
      holderAddress: string
      stakingContractAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.PortfolioRequest.create()

    request.holderAddress = holderAddress
    request.stakingContractAddress = stakingContractAddress

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.PortfolioRequest,
      GoadesignGoagenMitoApiPb.PortfolioResponse
    >(request, this.client.portfolio.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.portfolioResponseToPortfolio(response)
  }

  async fetchLeaderboard(epochId?: number, options?: GrpcCallOptions) {
    const request = GoadesignGoagenMitoApiPb.LeaderboardRequest.create()

    if (epochId) {
      request.epochId = epochId
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.LeaderboardRequest,
      GoadesignGoagenMitoApiPb.LeaderboardResponse
    >(request, this.client.leaderboard.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.leaderboardResponseToLeaderboard(response)
  }

  async fetchTransferHistory(
    {
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
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.TransfersHistoryRequest.create()

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

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.TransfersHistoryRequest,
      GoadesignGoagenMitoApiPb.TransfersHistoryResponse
    >(request, this.client.transfersHistory.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.transferHistoryResponseToTransfer(
      response,
    )
  }

  async fetchLeaderboardEpochs(
    {
      limit,
      toEpochId,
      fromEpochId,
    }: {
      limit?: number
      toEpochId?: number
      fromEpochId?: number
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.LeaderboardEpochsRequest.create()

    if (limit) {
      request.limit = limit
    }

    if (toEpochId) {
      request.toEpochId = toEpochId
    }

    if (fromEpochId) {
      request.fromEpochId = fromEpochId
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.LeaderboardEpochsRequest,
      GoadesignGoagenMitoApiPb.LeaderboardEpochsResponse
    >(request, this.client.leaderboardEpochs.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.leaderboardEpochsResponseToLeaderboardEpochs(
      response,
    )
  }

  async fetchStakingPools(
    {
      staker,
      stakingContractAddress,
    }: {
      staker?: string
      stakingContractAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetStakingPoolsRequest.create()

    request.stakingContractAddress = stakingContractAddress

    if (staker) {
      request.staker = staker
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetStakingPoolsRequest,
      GoadesignGoagenMitoApiPb.GetStakingPoolsResponse
    >(request, this.client.getStakingPools.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.stakingPoolsResponseToStakingPools(
      response,
    )
  }

  async fetchStakingHistory(
    {
      staker,
      toNumber,
      limit,
      fromNumber,
    }: {
      staker?: string
      limit?: number
      toNumber?: number
      fromNumber?: number
    } = {},
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.StakingHistoryRequest.create()

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

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.StakingHistoryRequest,
      GoadesignGoagenMitoApiPb.StakingHistoryResponse
    >(request, this.client.stakingHistory.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.mitoStakingHistoryResponseTpStakingHistory(
      response,
    )
  }

  async fetchStakingRewardsByAccount(
    {
      staker,
      stakingContractAddress,
    }: {
      staker: string
      stakingContractAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request =
      GoadesignGoagenMitoApiPb.StakingRewardByAccountRequest.create()

    request.staker = staker
    request.stakingContractAddress = stakingContractAddress

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.StakingRewardByAccountRequest,
      GoadesignGoagenMitoApiPb.StakingRewardByAccountResponse
    >(
      request,
      this.client.stakingRewardByAccount.bind(this.client),
      options?.signal,
    )

    return IndexerGrpcMitoTransformer.stakingRewardByAccountResponseToStakingRewardByAccount(
      response,
    )
  }

  async fetchMissions(
    { accountAddress }: { accountAddress: string },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.MissionsRequest.create()

    request.accountAddress = accountAddress

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.MissionsRequest,
      GoadesignGoagenMitoApiPb.MissionsResponse
    >(request, this.client.missions.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.mitoMissionsResponseMissions(response)
  }

  async fetchMissionLeaderboard(
    userAddress?: string,
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.MissionLeaderboardRequest.create()

    if (userAddress) {
      request.userAddress = userAddress
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.MissionLeaderboardRequest,
      GoadesignGoagenMitoApiPb.MissionLeaderboardResponse
    >(
      request,
      this.client.missionLeaderboard.bind(this.client),
      options?.signal,
    )

    return IndexerGrpcMitoTransformer.mitoMissionLeaderboardResponseToMissionLeaderboard(
      response,
    )
  }

  async fetchIDO(
    {
      contractAddress,
      accountAddress,
    }: {
      contractAddress: string
      accountAddress?: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetIDORequest.create()

    request.contractAddress = contractAddress

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetIDORequest,
      GoadesignGoagenMitoApiPb.GetIDOResponse
    >(request, this.client.getIDO.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.mitoIDOResponseToIDO(response)
  }

  async fetchIDOs(
    {
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
    } = {},
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.ListIDOsRequest.create()

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

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.ListIDOsRequest,
      GoadesignGoagenMitoApiPb.ListIDOsResponse
    >(request, this.client.listIDOs.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.mitoListIDOsResponseToIDOs(response)
  }

  async fetchIDOSubscribers(
    {
      skip,
      limit,
      sortBy,
      contractAddress,
    }: {
      skip?: number
      limit?: number
      sortBy?: string
      contractAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetIDOSubscribersRequest.create()

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

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetIDOSubscribersRequest,
      GoadesignGoagenMitoApiPb.GetIDOSubscribersResponse
    >(request, this.client.getIDOSubscribers.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.mitoIDOSubscribersResponseToIDOSubscribers(
      response,
    )
  }

  async fetchIDOSubscription(
    {
      contractAddress,
      accountAddress,
    }: {
      contractAddress: string
      accountAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetIDOSubscriptionRequest.create()

    request.accountAddress = accountAddress
    request.contractAddress = contractAddress

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetIDOSubscriptionRequest,
      GoadesignGoagenMitoApiPb.GetIDOSubscriptionResponse
    >(
      request,
      this.client.getIDOSubscription.bind(this.client),
      options?.signal,
    )

    return IndexerGrpcMitoTransformer.mitoIDOSubscriptionResponseToIDOSubscription(
      response,
    )
  }

  async fetchIDOActivities(
    {
      contractAddress,
      accountAddress,
      limit,
      toNumber,
    }: {
      contractAddress?: string
      accountAddress?: string
      limit?: number
      toNumber?: string
    } = {},
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetIDOActivitiesRequest.create()

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

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetIDOActivitiesRequest,
      GoadesignGoagenMitoApiPb.GetIDOActivitiesResponse
    >(request, this.client.getIDOActivities.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.mitoIDOActivitiesResponseToIDOActivities(
      response,
    )
  }

  async fetchIDOWhitelist(
    {
      skip,
      limit,
      idoAddress,
    }: {
      skip?: number
      limit?: number
      idoAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetWhitelistRequest.create()

    request.idoAddress = idoAddress

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetWhitelistRequest,
      GoadesignGoagenMitoApiPb.GetWhitelistResponse
    >(request, this.client.getWhitelist.bind(this.client), options?.signal)

    return IndexerGrpcMitoTransformer.mitoWhitelistAccountResponseToWhitelistAccount(
      response,
    )
  }

  async fetchClaimReferences(
    {
      skip,
      limit,
      idoAddress,
      accountAddress,
    }: {
      skip?: number
      limit?: number
      idoAddress: string
      accountAddress: string
    },
    options?: GrpcCallOptions,
  ) {
    const request = GoadesignGoagenMitoApiPb.GetClaimReferencesRequest.create()

    request.idoAddress = idoAddress
    request.accountAddress = accountAddress

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    const response = await this.executeGrpcCall<
      GoadesignGoagenMitoApiPb.GetClaimReferencesRequest,
      GoadesignGoagenMitoApiPb.GetClaimReferencesResponse
    >(
      request,
      this.client.getClaimReferences.bind(this.client),
      options?.signal,
    )

    return IndexerGrpcMitoTransformer.claimReferencesResponseToClaimReferences(
      response,
    )
  }
}
