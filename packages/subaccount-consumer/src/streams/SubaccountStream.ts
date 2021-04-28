import { BalanceStream, BalanceStreamCallback } from './Streams/BalanceStream'
import BaseConsumer from '../BaseConsumer'

export enum SubaccountStreamType {
  Balances = 'subaccount-balances',
}

export class SubaccountStream extends BaseConsumer {
  balances: BalanceStream

  constructor(endpoint: string) {
    super(endpoint)

    this.balances = new BalanceStream(this.endpoint)
  }
}

export { BalanceStreamCallback }
