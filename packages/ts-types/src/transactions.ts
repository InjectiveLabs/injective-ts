import { AccountAddress } from './aliases'

export interface TransactionOptions {
  from?: AccountAddress
  to?: AccountAddress
  gasPrice?: string
  gas?: number
}
