import {
  AccountPortfolioRequest,
  AccountPortfolioResponse,
} from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb'
import { InjectivePortfolioRPC } from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountPortfolioApi extends BaseConsumer {
  protected module: string = IndexerModule.Portfolio

  async fetchAccountPortfolio(address: string) {
    const request = new AccountPortfolioRequest()

    request.setAccountAddress(address)

    try {
      const response = await this.request<
        AccountPortfolioRequest,
        AccountPortfolioResponse,
        typeof InjectivePortfolioRPC.AccountPortfolio
      >(request, InjectivePortfolioRPC.AccountPortfolio)

      return IndexerGrpcAccountPortfolioTransformer.accountPortfolioResponseToAccountPortfolio(
        response,
      )
    } catch (e: unknown) {
      if ((e as Error)?.message === 'account address not found') {
        return undefined
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
