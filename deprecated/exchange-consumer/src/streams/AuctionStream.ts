import { BidsStream, BidsStreamCallback } from './Streams/BidsStream'
import BaseConsumer from '../BaseConsumer'

export enum AuctionStreamType {
  Bids = 'bids',
}

export class AuctionStream extends BaseConsumer {
  bids: BidsStream

  constructor(endpoint: string) {
    super(endpoint)

    this.bids = new BidsStream(this.endpoint)
  }
}

export { BidsStreamCallback }
