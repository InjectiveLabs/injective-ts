import { AccountStream } from './grpc_stream/AccountStream'
import { AuctionStream } from './grpc_stream/AuctionStream'
import { DerivativesStream } from './grpc_stream/DerivativesStream'
import { OracleStream } from './grpc_stream/OracleStream'
import { SpotStream } from './grpc_stream/SpotStream'
import { ExplorerStream } from './grpc_stream/ExplorerStream'

export class ExchangeGrpcStreamClient {
  derivativesStream: DerivativesStream

  spotStream: SpotStream

  accountStream: AccountStream

  auctionStream: AuctionStream

  oracleStream: OracleStream

  explorerStream: ExplorerStream

  constructor(endpoint: string) {
    this.derivativesStream = new DerivativesStream(endpoint)
    this.spotStream = new SpotStream(endpoint)
    this.accountStream = new AccountStream(endpoint)
    this.auctionStream = new AuctionStream(endpoint)
    this.oracleStream = new OracleStream(endpoint)
    this.explorerStream = new ExplorerStream(endpoint)
  }
}
