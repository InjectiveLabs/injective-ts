import { InjectiveAuctionRPCClient } from '@injectivelabs/exchange-api/injective_auction_rpc_pb_service'
import {
  StreamBidsRequest,
  StreamBidsResponse,
} from '@injectivelabs/exchange-api/injective_auction_rpc_pb'
import { StreamStatusResponse } from '../types'
import { isServerSide } from '../../../utils/helpers'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ExchangeAuctionStreamTransformer } from '../transformers'

export type BidsStreamCallback = (
  response: ReturnType<
    typeof ExchangeAuctionStreamTransformer.bidsStreamCallback
  >,
) => void

/**
 * @category Exchange Grpc Stream
 */
export class ExchangeGrpcAuctionStream {
  protected client: InjectiveAuctionRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveAuctionRPCClient(endpoint, {
      transport: isServerSide() ? NodeHttpTransport() : undefined,
    })
  }

  streamBids({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BidsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamBidsRequest()

    const stream = this.client.streamBids(request)

    stream.on('data', (response: StreamBidsResponse) => {
      callback(ExchangeAuctionStreamTransformer.bidsStreamCallback(response))
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
