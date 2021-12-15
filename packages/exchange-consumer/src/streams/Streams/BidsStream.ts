import { InjectiveAuctionRPCClient } from '@injectivelabs/exchange-api/injective_auction_rpc_pb_service'
import {
  StreamBidsRequest,
  StreamBidsResponse,
} from '@injectivelabs/exchange-api/injective_auction_rpc_pb'
import { StreamOperation, StreamStatusResponse } from '@injectivelabs/ts-types'
import { Bid } from '../../types/index'
import { AuctionTransformer } from '../../transformers/AuctionTransformer'

export type BidsStreamCallback = ({
  bid,
  operation,
}: {
  bid: Bid
  operation: StreamOperation
}) => void

const transformer = (response: StreamBidsResponse) => ({
  bid: AuctionTransformer.grpcStreamBidToBid(response),
  operation: StreamOperation.Insert,
})

export class BidsStream {
  protected client: InjectiveAuctionRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveAuctionRPCClient(endpoint)
  }

  start({
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
      callback(transformer(response))
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
