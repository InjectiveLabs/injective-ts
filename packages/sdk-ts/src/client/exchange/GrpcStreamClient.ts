import { AccountStream } from './grpc_stream/AccountStream'
import { AuctionStream } from './grpc_stream/AuctionStream'
import { DerivativesStream } from './grpc_stream/DerivativesStream'
import { OracleStream } from './grpc_stream/OracleStream'
import { SpotStream } from './grpc_stream/SpotStream'
import { ExplorerStream } from './grpc_stream/ExplorerStream'

export class GrpcStreamClient {
  derivatives: DerivativesStream

  spot: SpotStream

  account: AccountStream

  auction: AuctionStream

  oracle: OracleStream

  explorer: ExplorerStream

  constructor(endpoint: string) {
    this.derivatives = new DerivativesStream(endpoint)
    this.spot = new SpotStream(endpoint)
    this.account = new AccountStream(endpoint)
    this.auction = new AuctionStream(endpoint)
    this.oracle = new OracleStream(endpoint)
    this.explorer = new ExplorerStream(endpoint)
  }
}
