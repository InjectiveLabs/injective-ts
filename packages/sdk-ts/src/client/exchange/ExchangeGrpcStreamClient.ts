import { ExchangeGrpcAccountStream } from './grpc_stream/ExchangeGrpcAccountStream'
import { ExchangeGrpcAuctionStream } from './grpc_stream/ExchangeGrpcAuctionStream'
import { ExchangeGrpcDerivativesStream } from './grpc_stream/ExchangeGrpcDerivativesStream'
import { ExchangeGrpcOracleStream } from './grpc_stream/ExchangeGrpcOracleStream'
import { ExchangeGrpcSpotStream } from './grpc_stream/ExchangeGrpcSpotStream'
import { ExchangeGrpcExplorerStream } from './grpc_stream/ExchangeGrpcExplorerStream'

/**
 * @category Exchange Grpc Stream
 * @hidden
 */
export class ExchangeGrpcStreamClient {
  derivatives: ExchangeGrpcDerivativesStream

  spot: ExchangeGrpcSpotStream

  account: ExchangeGrpcAccountStream

  auction: ExchangeGrpcAuctionStream

  oracle: ExchangeGrpcOracleStream

  explorer: ExchangeGrpcExplorerStream

  constructor(endpoint: string) {
    this.derivatives = new ExchangeGrpcDerivativesStream(endpoint)
    this.spot = new ExchangeGrpcSpotStream(endpoint)
    this.account = new ExchangeGrpcAccountStream(endpoint)
    this.auction = new ExchangeGrpcAuctionStream(endpoint)
    this.oracle = new ExchangeGrpcOracleStream(endpoint)
    this.explorer = new ExchangeGrpcExplorerStream(endpoint)
  }
}
