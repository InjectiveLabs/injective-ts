import {
  AccountPortfolioRequest,
  InjectivePortfolioRPCClientImpl,
} from '@injectivelabs/indexer-proto-ts/injective_portfolio_rpc'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/indexer-proto-ts/injective_portfolio_rpc'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountPortfolioApi {
  protected module: string = IndexerModule.Portfolio

  protected client: InjectivePortfolioRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectivePortfolioRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchAccountPortfolio(address: string) {
    const request = AccountPortfolioRequest.create()

    request.accountAddress = address

    try {
      const response = await this.client.AccountPortfolio(request)

      return IndexerGrpcAccountPortfolioTransformer.accountPortfolioResponseToAccountPortfolio(
        response,
      )
    } catch (e: unknown) {
      if ((e as any).message === 'account address not found') {
        return undefined
      }

      if (e instanceof GrpcWebError) {
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
