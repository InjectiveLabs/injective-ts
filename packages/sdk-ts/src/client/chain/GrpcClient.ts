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
  auctionApi: AuctionApi

  authApi: AuthApi

  bankApi: BankApi

  distributionApi: DistributionApi

  exchangeApi: ExchangeApi

  govApi: GovApi

  ibcApi: IbcApi

  insuranceFundApi: InsuranceFundApi

  mintApi: MintApi

  oracleApi: OracleApi

  peggyApi: PeggyApi

  stakingApi: StakingApi

  constructor(endpoint: string) {
    this.auctionApi = new AuctionApi(endpoint)
    this.authApi = new AuthApi(endpoint)
    this.bankApi = new BankApi(endpoint)
    this.distributionApi = new DistributionApi(endpoint)
    this.exchangeApi = new ExchangeApi(endpoint)
    this.govApi = new GovApi(endpoint)
    this.ibcApi = new IbcApi(endpoint)
    this.insuranceFundApi = new InsuranceFundApi(endpoint)
    this.mintApi = new MintApi(endpoint)
    this.oracleApi = new OracleApi(endpoint)
    this.peggyApi = new PeggyApi(endpoint)
    this.stakingApi = new StakingApi(endpoint)
  }
}
