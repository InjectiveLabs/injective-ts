import { AccountAddress } from './aliases.js'

export interface TransactionOptions {
  from?: AccountAddress
  to?: AccountAddress
  gasPrice?: string
  gas?: number
}
