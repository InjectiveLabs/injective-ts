import { ChainGrpcGovApi } from './grpc/ChainGrpcGovApi.js'
import { ChainGrpcIbcApi } from './grpc/ChainGrpcIbcApi.js'
import { ChainGrpcEvmApi } from './grpc/ChainGrpcEvmApi.js'
import { ChainGrpcAuthApi } from './grpc/ChainGrpcAuthApi.js'
import { ChainGrpcBankApi } from './grpc/ChainGrpcBankApi.js'
import { ChainGrpcMintApi } from './grpc/ChainGrpcMintApi.js'
import { ChainGrpcWasmApi } from './grpc/ChainGrpcWasmApi.js'
import { ChainGrpcPeggyApi } from './grpc/ChainGrpcPeggyApi.js'
import { ChainGrpcWasmXApi } from './grpc/ChainGrpcWasmXApi.js'
import { ChainGrpcErc20Api } from './grpc/ChainGrpcErc20Api.js'
import { ChainGrpcOracleApi } from './grpc/ChainGrpcOracleApi.js'
import { ChainGrpcAuctionApi } from './grpc/ChainGrpcAuctionApi.js'
import { ChainGrpcStakingApi } from './grpc/ChainGrpcStakingApi.js'
import { ChainGrpcExchangeApi } from './grpc/ChainGrpcExchangeApi.js'
import { ChainGrpcPermissionsApi } from './grpc/ChainGrpcPermissionsApi.js'
import { ChainGrpcDistributionApi } from './grpc/ChainGrpcDistributionApi.js'
import { ChainGrpcTokenFactoryApi } from './grpc/ChainGrpcTokenFactoryApi.js'
import { ChainGrpcInsuranceFundApi } from './grpc/ChainGrpcInsuranceFundApi.js'

/**
 * @category Chain Grpc API
 * @hidden
 */
export class ChainGrpcClient {
  gov: ChainGrpcGovApi
  ibc: ChainGrpcIbcApi
  evm: ChainGrpcEvmApi
  auth: ChainGrpcAuthApi
  bank: ChainGrpcBankApi
  mint: ChainGrpcMintApi
  wasm: ChainGrpcWasmApi
  peggy: ChainGrpcPeggyApi
  wasmX: ChainGrpcWasmXApi
  erc20: ChainGrpcErc20Api
  oracle: ChainGrpcOracleApi
  auction: ChainGrpcAuctionApi
  staking: ChainGrpcStakingApi
  exchange: ChainGrpcExchangeApi
  permissions: ChainGrpcPermissionsApi
  distribution: ChainGrpcDistributionApi
  tokenfactory: ChainGrpcTokenFactoryApi
  insuranceFund: ChainGrpcInsuranceFundApi

  constructor(endpoint: string) {
    this.evm = new ChainGrpcEvmApi(endpoint)
    this.gov = new ChainGrpcGovApi(endpoint)
    this.ibc = new ChainGrpcIbcApi(endpoint)
    this.auth = new ChainGrpcAuthApi(endpoint)
    this.bank = new ChainGrpcBankApi(endpoint)
    this.mint = new ChainGrpcMintApi(endpoint)
    this.wasm = new ChainGrpcWasmApi(endpoint)
    this.erc20 = new ChainGrpcErc20Api(endpoint)
    this.peggy = new ChainGrpcPeggyApi(endpoint)
    this.wasmX = new ChainGrpcWasmXApi(endpoint)
    this.oracle = new ChainGrpcOracleApi(endpoint)
    this.auction = new ChainGrpcAuctionApi(endpoint)
    this.staking = new ChainGrpcStakingApi(endpoint)
    this.exchange = new ChainGrpcExchangeApi(endpoint)
    this.permissions = new ChainGrpcPermissionsApi(endpoint)
    this.distribution = new ChainGrpcDistributionApi(endpoint)
    this.tokenfactory = new ChainGrpcTokenFactoryApi(endpoint)
    this.insuranceFund = new ChainGrpcInsuranceFundApi(endpoint)
  }
}
