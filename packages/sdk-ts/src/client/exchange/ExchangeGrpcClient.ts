import { ExchangeGrpcMetaApi } from './grpc/ExchangeGrpcMetaApi'
import { ExchangeGrpcAccountApi } from './grpc/ExchangeGrpcAccountApi'
import { ExchangeGrpcAuctionApi } from './grpc/ExchangeGrpcAuctionApi'
import { ExchangeGrpcExplorerApi } from './grpc/ExchangeGrpcExplorerApi'
import { ExchangeGrpcOracleApi } from './grpc/ExchangeGrpcOracleApi'
import { ExchangeGrpcInsuranceFundApi } from './grpc/ExchangeGrpcInsuranceFundApi'
import { ExchangeGrpcDerivativesApi } from './grpc/ExchangeGrpcDerivativesApi'
import { ExchangeGrpcSpotApi } from './grpc/ExchangeGrpcSpotApi'

/**
 * @category Exchange Grpc API
 * @hidden
 */
export class ExchangeGrpcClient {
  account: ExchangeGrpcAccountApi

  auction: ExchangeGrpcAuctionApi

  explorer: ExchangeGrpcExplorerApi

  meta: ExchangeGrpcMetaApi

  oracle: ExchangeGrpcOracleApi

  insuranceFund: ExchangeGrpcInsuranceFundApi

  derivatives: ExchangeGrpcDerivativesApi

  spot: ExchangeGrpcSpotApi

  constructor(endpoint: string) {
    this.account = new ExchangeGrpcAccountApi(endpoint)
    this.auction = new ExchangeGrpcAuctionApi(endpoint)
    this.explorer = new ExchangeGrpcExplorerApi(endpoint)
    this.meta = new ExchangeGrpcMetaApi(endpoint)
    this.oracle = new ExchangeGrpcOracleApi(endpoint)
    this.insuranceFund = new ExchangeGrpcInsuranceFundApi(endpoint)
    this.derivatives = new ExchangeGrpcDerivativesApi(endpoint)
    this.spot = new ExchangeGrpcSpotApi(endpoint)
  }
}
