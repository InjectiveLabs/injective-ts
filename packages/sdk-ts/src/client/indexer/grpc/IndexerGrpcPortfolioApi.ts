import { IndexerGrpcAccountPortfolioTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { InjectivePortfolioRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountPortfolioApi {
  protected module: string = IndexerModule.Portfolio

  protected client: InjectivePortfolioRpc.InjectivePortfolioRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectivePortfolioRpc.InjectivePortfolioRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchAccountPortfolio(address: string) {
    const request = InjectivePortfolioRpc.AccountPortfolioRequest.create()

    request.accountAddress = address

    try {
      const response = await this.client.AccountPortfolio(request)

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
}
