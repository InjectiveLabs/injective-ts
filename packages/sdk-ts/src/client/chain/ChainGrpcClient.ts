import { ChainGrpcAuctionApi } from './grpc/ChainGrpcAuctionApi.js'
import { ChainGrpcBankApi } from './grpc/ChainGrpcBankApi.js'
import { ChainGrpcAuthApi } from './grpc/ChainGrpcAuthApi.js'
import { ChainGrpcDistributionApi } from './grpc/ChainGrpcDistributionApi.js'
import { ChainGrpcExchangeApi } from './grpc/ChainGrpcExchangeApi.js'
import { ChainGrpcGovApi } from './grpc/ChainGrpcGovApi.js'
import { ChainGrpcIbcApi } from './grpc/ChainGrpcIbcApi.js'
import { ChainGrpcInsuranceFundApi } from './grpc/ChainGrpcInsuranceFundApi.js'
import { ChainGrpcMintApi } from './grpc/ChainGrpcMintApi.js'
import { ChainGrpcOracleApi } from './grpc/ChainGrpcOracleApi.js'
import { ChainGrpcPeggyApi } from './grpc/ChainGrpcPeggyApi.js'
import { ChainGrpcPermissionsApi } from './grpc/ChainGrpcPermissionsApi.js'
import { ChainGrpcStakingApi } from './grpc/ChainGrpcStakingApi.js'
import { ChainGrpcTokenFactoryApi } from './grpc/ChainGrpcTokenFactoryApi.js'
import { ChainGrpcWasmApi } from './grpc/ChainGrpcWasmApi.js'
import { ChainGrpcWasmXApi } from './grpc/ChainGrpcWasmXApi.js'

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

  permissions: ChainGrpcPermissionsApi

  staking: ChainGrpcStakingApi

  tokenfactory: ChainGrpcTokenFactoryApi

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
    this.permissions = new ChainGrpcPermissionsApi(endpoint)
    this.staking = new ChainGrpcStakingApi(endpoint)
    this.tokenfactory = new ChainGrpcTokenFactoryApi(endpoint)
    this.wasm = new ChainGrpcWasmApi(endpoint)
    this.wasmX = new ChainGrpcWasmXApi(endpoint)
  }
}
