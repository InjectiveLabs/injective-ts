import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectivePortfolioRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer'
import { IndexerModule } from '../types'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountPortfolioApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Portfolio

  protected client: InjectivePortfolioRpc.InjectivePortfolioRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectivePortfolioRpc.InjectivePortfolioRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchAccountPortfolio(address: string) {
    const request = InjectivePortfolioRpc.AccountPortfolioRequest.create()

    request.accountAddress = address

    try {
      const response =
        await this.retry<InjectivePortfolioRpc.AccountPortfolioResponse>(() =>
          this.client.AccountPortfolio(request),
        )

      return IndexerGrpcAccountPortfolioTransformer.accountPortfolioResponseToAccountPortfolio(
        response,
        address,
      )
    } catch (e: unknown) {
      if ((e as any)?.message === 'account address not found') {
        return {
          accountAddress: address || '',
          bankBalancesList: [],
          subaccountsList: [],
          positionsWithUpnlList: [],
        }
      }

      if (e instanceof InjectivePortfolioRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'AccountPortfolio',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AccountPortfolio',
        contextModule: this.module,
      })
    }
  }

  async fetchAccountPortfolioBalances(address: string) {
    const request =
      InjectivePortfolioRpc.AccountPortfolioBalancesRequest.create()

    request.accountAddress = address

    try {
      const response =
        await this.retry<InjectivePortfolioRpc.AccountPortfolioBalancesResponse>(
          () => this.client.AccountPortfolioBalances(request),
        )

      return IndexerGrpcAccountPortfolioTransformer.accountPortfolioBalancesResponseToAccountPortfolioBalances(
        response,
        address,
      )
    } catch (e: unknown) {
      if ((e as any)?.message === 'account address not found') {
        return {
          accountAddress: address || '',
          bankBalancesList: [],
          subaccountsList: [],
        }
      }

      if (e instanceof InjectivePortfolioRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'AccountPortfolio',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AccountPortfolio',
        contextModule: this.module,
      })
    }
  }

  async fetchAccountPortfolioTokenHolders({
    denom,
    cursor,
    limit,
  }: {
    denom: string
    cursor?: string
    limit?: number
  }) {
    const request = InjectivePortfolioRpc.TokenHoldersRequest.create()

    request.denom = denom

    if (cursor) {
      request.cursor = cursor
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response =
        await this.retry<InjectivePortfolioRpc.TokenHoldersResponse>(() =>
          this.client.TokenHolders(request),
        )

      return IndexerGrpcAccountPortfolioTransformer.tokenHoldersResponseToTokenHolders(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectivePortfolioRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TokenHolders',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TokenHolders',
        contextModule: this.module,
      })
    }
  }
}
