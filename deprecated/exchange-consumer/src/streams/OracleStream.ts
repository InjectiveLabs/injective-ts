import { PricesStream, PricesStreamCallback } from './Streams/PricesStream'
import BaseConsumer from '../BaseConsumer'

export enum OracleStreamType {
  Prices = 'oracle-prices',
}

export class OracleStream extends BaseConsumer {
  prices: PricesStream

  constructor(endpoint: string) {
    super(endpoint)

    this.prices = new PricesStream(this.endpoint)
  }
}

export { PricesStreamCallback }
