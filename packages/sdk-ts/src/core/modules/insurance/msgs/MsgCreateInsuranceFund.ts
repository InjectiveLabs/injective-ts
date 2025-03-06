import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  InjectiveInsuranceV1Beta1Tx,
  InjectiveOracleV1Beta1Oracle,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgCreateInsuranceFund {
  export interface Params {
    fund: {
      ticker: string
      quoteDenom: string
      oracleBase: string
      oracleQuote: string
      oracleType: InjectiveOracleV1Beta1Oracle.OracleType
      expiry?: number
    }
    deposit: {
      amount: string
      denom: string
    }
    injectiveAddress: string
  }

  export type Proto = InjectiveInsuranceV1Beta1Tx.MsgCreateInsuranceFund
}

/**
 * @category Messages
 */
export default class MsgCreateInsuranceFund extends MsgBase<
  MsgCreateInsuranceFund.Params,
  MsgCreateInsuranceFund.Proto
> {
  static fromJSON(
    params: MsgCreateInsuranceFund.Params,
  ): MsgCreateInsuranceFund {
    return new MsgCreateInsuranceFund(params)
  }

  public toProto() {
    const { params } = this

    const coin = CosmosBaseV1Beta1Coin.Coin.create()

    coin.denom = params.deposit.denom
    coin.amount = params.deposit.amount

    const message = InjectiveInsuranceV1Beta1Tx.MsgCreateInsuranceFund.create()

    message.sender = params.injectiveAddress
    message.ticker = params.fund.ticker
    message.quoteDenom = params.fund.quoteDenom
    message.oracleBase = params.fund.oracleBase
    message.oracleQuote = params.fund.oracleQuote
    message.oracleType = params.fund.oracleType
    message.expiry = (params.fund.expiry ? params.fund.expiry : -1).toString()
    message.initialDeposit = coin

    return InjectiveInsuranceV1Beta1Tx.MsgCreateInsuranceFund.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgCreateInsuranceFund',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'insurance/MsgCreateInsuranceFund',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.insurance.v1beta1.MsgCreateInsuranceFund',
      ...value,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
      oracle_type: InjectiveOracleV1Beta1Oracle.oracleTypeToJSON(
        params.fund.oracleType,
      ),
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgCreateInsuranceFund',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveInsuranceV1Beta1Tx.MsgCreateInsuranceFund.encode(
      this.toProto(),
    ).finish()
  }
}
