import { isAbortError } from '@injectivelabs/utils'
import { throwIfAborted } from '@injectivelabs/utils'
import * as InjectivePortfolioRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb'
import { InjectivePortfolioRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers/index.js'
import type { RequestOptions } from '@injectivelabs/utils'
/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountPortfolioApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Portfolio

  private get client() {
    return this.initClient(InjectivePortfolioRPCClient)
  }

  async fetchAccountPortfolio(address: string, options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const request = InjectivePortfolioRpcPb.AccountPortfolioRequest.create()
    request.accountAddress = address

    try {
      const response = await this.executeGrpcCall<
        InjectivePortfolioRpcPb.AccountPortfolioRequest,
        InjectivePortfolioRpcPb.AccountPortfolioResponse
      >(request, this.client.accountPortfolio.bind(this.client), options)

      return IndexerGrpcAccountPortfolioTransformer.accountPortfolioResponseToAccountPortfolio(
        response,
        address,
      )
    } catch (e: unknown) {
      if (isAbortError(e)) {
        throw e
      }
      if ((e as any)?.message === 'account address not found') {
        return {
          accountAddress: address || '',
          bankBalancesList: [],
          subaccountsList: [],
          positionsWithUpnlList: [],
        }
      }

      throw e
    }
  }

  async fetchAccountPortfolioBalances(
    address: string,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request =
      InjectivePortfolioRpcPb.AccountPortfolioBalancesRequest.create()
    request.accountAddress = address

    try {
      const response = await this.executeGrpcCall<
        InjectivePortfolioRpcPb.AccountPortfolioBalancesRequest,
        InjectivePortfolioRpcPb.AccountPortfolioBalancesResponse
      >(
        request,
        this.client.accountPortfolioBalances.bind(this.client),
        options,
      )

      return IndexerGrpcAccountPortfolioTransformer.accountPortfolioBalancesResponseToAccountPortfolioBalances(
        response,
        address,
      )
    } catch (e: unknown) {
      if (isAbortError(e)) {
        throw e
      }
      if ((e as any)?.message === 'account address not found') {
        return {
          accountAddress: address || '',
          bankBalancesList: [],
          subaccountsList: [],
        }
      }

      throw e
    }
  }
}
