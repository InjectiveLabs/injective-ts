import { Pagination } from './../../../types/pagination'

export interface ContractAccountBalance {
  account: string
  balance: string
}

export interface ContractAccountsBalanceWithPagination {
  contractAccountsBalance: ContractAccountBalance[]
  pagination?: Pagination
}
