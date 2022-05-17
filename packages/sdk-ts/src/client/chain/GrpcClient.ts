import { AuctionApi } from './grpc/AuctionApi'
import { BankApi } from './grpc/BankApi'
import { AuthApi } from './grpc/AuthApi'
import { DistributionApi } from './grpc/DistributionApi'
import { ExchangeApi } from './grpc/ExchangeApi'
import { GovApi } from './grpc/GovApi'
import { IbcApi } from './grpc/IbcApi'
import { InsuranceFundApi } from './grpc/InsuranceFundApi'
import { MintApi } from './grpc/MintApi'
import { OracleApi } from './grpc/OracleApi'
import { PeggyApi } from './grpc/PeggyApi'
import { StakingApi } from './grpc/StakingApi'

export class GrpcClient {
  auction: AuctionApi

  auth: AuthApi

  bank: BankApi

  distribution: DistributionApi

  exchange: ExchangeApi

  gov: GovApi

  ibc: IbcApi

  insuranceFund: InsuranceFundApi

  mint: MintApi

  oracle: OracleApi

  peggy: PeggyApi

  staking: StakingApi

  constructor(endpoint: string) {
    this.auction = new AuctionApi(endpoint)
    this.auth = new AuthApi(endpoint)
    this.bank = new BankApi(endpoint)
    this.distribution = new DistributionApi(endpoint)
    this.exchange = new ExchangeApi(endpoint)
    this.gov = new GovApi(endpoint)
    this.ibc = new IbcApi(endpoint)
    this.insuranceFund = new InsuranceFundApi(endpoint)
    this.mint = new MintApi(endpoint)
    this.oracle = new OracleApi(endpoint)
    this.peggy = new PeggyApi(endpoint)
    this.staking = new StakingApi(endpoint)
  }
}
