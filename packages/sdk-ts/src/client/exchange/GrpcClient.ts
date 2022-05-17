import { MetaApi } from './grpc/MetaApi'
import { AccountApi } from './grpc/AccountApi'
import { AuctionApi } from './grpc/AuctionApi'
import { ExplorerApi } from './grpc/ExplorerApi'
import { OracleApi } from './grpc/OracleApi'
import { InsuranceFundApi } from './grpc/InsuranceFundApi'
import { DerivativesApi } from './grpc/DerivativesApi'
import { SpotApi } from './grpc/SpotApi'

export class GrpcClient {
  account: AccountApi

  auction: AuctionApi

  explorer: ExplorerApi

  meta: MetaApi

  oracle: OracleApi

  insuranceFund: InsuranceFundApi

  derivatives: DerivativesApi

  spot: SpotApi

  constructor(endpoint: string) {
    this.account = new AccountApi(endpoint)
    this.auction = new AuctionApi(endpoint)
    this.explorer = new ExplorerApi(endpoint)
    this.meta = new MetaApi(endpoint)
    this.oracle = new OracleApi(endpoint)
    this.insuranceFund = new InsuranceFundApi(endpoint)
    this.derivatives = new DerivativesApi(endpoint)
    this.spot = new SpotApi(endpoint)
  }
}
