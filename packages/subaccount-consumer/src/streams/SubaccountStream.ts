import {
  SubaccountBalanceStream,
  SubaccountBalanceStreamCallback,
} from './Subaccount/SubaccountBalanceStream'
import BaseConsumer from '../BaseConsumer'

export enum SubaccountStreamType {
  Balances = 'subaccount-balances',
}

export class SubaccountStream extends BaseConsumer {
  balances: SubaccountBalanceStream

  constructor(endpoint: string) {
    super(endpoint)

    this.balances = new SubaccountBalanceStream(this.endpoint)
  }
}

export { SubaccountBalanceStreamCallback }
