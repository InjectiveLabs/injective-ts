import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectivePortfolioRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers/index.js'

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
          this.client.AccountPortfolio(request, this.metadata),
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
          code: grpcErrorCodeToErrorCode(e.code),
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
          () => this.client.AccountPortfolioBalances(request, this.metadata),
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
          code: grpcErrorCodeToErrorCode(e.code),
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
