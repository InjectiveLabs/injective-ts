import {
  Portfolio as GrpcAccountPortfolioV2,
  SubaccountBalanceV2 as GrpcPortfolioSubaccountBalanceV2,
} from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb'
import { Coin } from '@injectivelabs/ts-types'

export interface PortfolioSubaccountBalanceV2 {
  subaccountId: string
  availableBalancesList: Coin[]
  marginHoldList: Coin[]
  unrealizedPnlList: Coin[]
}

export interface AccountPortfolioV2 {
  accountAddress: string
  bankBalancesList: Coin[]
  subaccountsList: PortfolioSubaccountBalanceV2[]
}

export { GrpcAccountPortfolioV2, GrpcPortfolioSubaccountBalanceV2 }
