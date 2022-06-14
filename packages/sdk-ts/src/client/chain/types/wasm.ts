import { PageResponse } from './base'

export interface ContractAccountBalance {
  account: string
  balance: string
}

export interface ContractAccountsBalanceWithPagination {
  contractAccountsBalance: ContractAccountBalance[]
  pagination?: PageResponse
}
