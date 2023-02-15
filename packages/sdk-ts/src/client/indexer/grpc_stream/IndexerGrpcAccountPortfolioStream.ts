import { InjectivePortfolioRPCClient } from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb_service'
import {
  StreamAccountPortfolioRequest,
  StreamAccountPortfolioResponse,
} from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb'
import { StreamStatusResponse } from '../types'
import { IndexerAccountPortfolioStreamTransformer } from '../transformers'
import { getGrpcTransport } from '../../../utils/grpc'

export type AccountPortfolioStreamCallback = (
  response: ReturnType<
    typeof IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcAccountPortfolioStream {
  protected client: InjectivePortfolioRPCClient

  constructor(endpoint: string) {
    this.client = new InjectivePortfolioRPCClient(endpoint, {
      transport: getGrpcTransport(),
    })
  }

  streamAccountPortfolio({
    subaccountId,
    accountAddress,
    type,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    accountAddress: string
    subaccountId?: string
    type?: string
    callback: AccountPortfolioStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamAccountPortfolioRequest()
    request.setAccountAddress(accountAddress)

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (type) {
      request.setType(type)
    }

    const stream = this.client.streamAccountPortfolio(request)

    stream.on('data', (response: StreamAccountPortfolioResponse) => {
      callback(
        IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback(
          response,
        ),
      )
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }
}
