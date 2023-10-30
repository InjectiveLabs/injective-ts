import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveMetaRpc } from '@injectivelabs/indexer-proto-ts'
import { InjectiveCampaignRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../BaseGrpcConsumer'
import { IndexerCampaignTransformer } from '../transformers'
import { IndexerModule } from '../types'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcCampaignApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Campaign

  protected client: InjectiveCampaignRpc.InjectiveCampaignRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveCampaignRpc.InjectiveCampaignRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchCampaign({
    skip,
    limit,
    marketId,
    campaignId,
    accountAddress,
  }: {
    skip?: string
    limit?: number
    marketId?: string
    campaignId: string
    accountAddress?: string
  }) {
    const request = InjectiveCampaignRpc.RankingRequest.create()

    request.campaignId = campaignId

    if (skip) {
      request.skip = skip
    }

    if (limit) {
      request.limit = limit
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    try {
      const response = await this.retry<InjectiveCampaignRpc.RankingResponse>(
        () => this.client.Ranking(request),
      )

      return IndexerCampaignTransformer.CampaignResponseToCampaign(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'FetchCampaign',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FetchCampaign',
        contextModule: this.module,
      })
    }
  }
}
