import { MetaApi } from './grpc/MetaApi'
import { AccountApi } from './grpc/AccountApi'
import { AuctionApi } from './grpc/AuctionApi'
import { ExplorerApi } from './grpc/ExplorerApi'
import { OracleApi } from './grpc/OracleApi'
import { InsuranceFundApi } from './grpc/InsuranceFundApi'
import { DerivativesApi } from './grpc/DerivativesApi'
import { SpotApi } from './grpc/SpotApi'

export class ExchangeGrpcClient {
  accountApi: AccountApi

  auctionApi: AuctionApi

  explorerApi: ExplorerApi

  metaApi: MetaApi

  oracleApi: OracleApi

  insuranceFundApi: InsuranceFundApi

  derivativesApi: DerivativesApi

  spotApi: SpotApi

  constructor(endpoint: string) {
    this.accountApi = new AccountApi(endpoint)
    this.auctionApi = new AuctionApi(endpoint)
    this.explorerApi = new ExplorerApi(endpoint)
    this.metaApi = new MetaApi(endpoint)
    this.oracleApi = new OracleApi(endpoint)
    this.insuranceFundApi = new InsuranceFundApi(endpoint)
    this.derivativesApi = new DerivativesApi(endpoint)
    this.spotApi = new SpotApi(endpoint)
  }
}
