import { ChainGrpcAuctionApi } from './grpc/ChainGrpcAuctionApi'
import { ChainGrpcBankApi } from './grpc/ChainGrpcBankApi'
import { ChainGrpcAuthApi } from './grpc/ChainGrpcAuthApi'
import { ChainGrpcDistributionApi } from './grpc/ChainGrpcDistributionApi'
import { ChainGrpcExchangeApi } from './grpc/ChainGrpcExchangeApi'
import { ChainGrpcGovApi } from './grpc/ChainGrpcGovApi'
import { ChainGrpcIbcApi } from './grpc/ChainGrpcIbcApi'
import { ChainGrpcInsuranceFundApi } from './grpc/ChainGrpcInsuranceFundApi'
import { ChainGrpcMintApi } from './grpc/ChainGrpcMintApi'
import { ChainGrpcOracleApi } from './grpc/ChainGrpcOracleApi'
import { ChainGrpcPeggyApi } from './grpc/ChainGrpcPeggyApi'
import { ChainGrpcStakingApi } from './grpc/ChainGrpcStakingApi'
import { ChainGrpcWasmApi } from './grpc/ChainGrpcWasmApi'
import { ChainGrpcWasmXApi } from './grpc/ChainGrpcWasmXApi'

/**
 * @category Chain Grpc API
 * @hidden
 */
export class ChainGrpcClient {
  auction: ChainGrpcAuctionApi

  auth: ChainGrpcAuthApi

  bank: ChainGrpcBankApi

  distribution: ChainGrpcDistributionApi

  exchange: ChainGrpcExchangeApi

  gov: ChainGrpcGovApi

  ibc: ChainGrpcIbcApi

  insuranceFund: ChainGrpcInsuranceFundApi

  mint: ChainGrpcMintApi

  oracle: ChainGrpcOracleApi

  peggy: ChainGrpcPeggyApi

  staking: ChainGrpcStakingApi

  wasm: ChainGrpcWasmApi

  wasmX: ChainGrpcWasmXApi

  constructor(endpoint: string) {
    this.auction = new ChainGrpcAuctionApi(endpoint)
    this.auth = new ChainGrpcAuthApi(endpoint)
    this.bank = new ChainGrpcBankApi(endpoint)
    this.distribution = new ChainGrpcDistributionApi(endpoint)
    this.exchange = new ChainGrpcExchangeApi(endpoint)
    this.gov = new ChainGrpcGovApi(endpoint)
    this.ibc = new ChainGrpcIbcApi(endpoint)
    this.insuranceFund = new ChainGrpcInsuranceFundApi(endpoint)
    this.mint = new ChainGrpcMintApi(endpoint)
    this.oracle = new ChainGrpcOracleApi(endpoint)
    this.peggy = new ChainGrpcPeggyApi(endpoint)
    this.staking = new ChainGrpcStakingApi(endpoint)
    this.wasm = new ChainGrpcWasmApi(endpoint)
    this.wasmX = new ChainGrpcWasmXApi(endpoint)
  }
}
