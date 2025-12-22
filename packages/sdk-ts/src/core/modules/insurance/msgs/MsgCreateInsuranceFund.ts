import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCreateInsuranceFund {
  export interface Params {
    fund: {
      ticker: string
      quoteDenom: string
      oracleBase: string
      oracleQuote: string
      oracleType: InjectiveOracleV1Beta1OraclePb.OracleType
      expiry?: number
    }
    deposit: {
      amount: string
      denom: string
    }
    injectiveAddress: string
  }

  export type Proto = InjectiveInsuranceV1Beta1TxPb.MsgCreateInsuranceFund
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

    const coin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.deposit.denom,
      amount: params.deposit.amount,
    })

    const message = InjectiveInsuranceV1Beta1TxPb.MsgCreateInsuranceFund.create(
      {
        sender: params.injectiveAddress,
        ticker: params.fund.ticker,
        quoteDenom: params.fund.quoteDenom,
        oracleBase: params.fund.oracleBase,
        oracleQuote: params.fund.oracleQuote,
        oracleType: params.fund.oracleType,
        expiry: BigInt(params.fund.expiry ? params.fund.expiry : -1),
        initialDeposit: coin,
      },
    )

    return message
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
      sender: proto.sender,
      ticker: proto.ticker,
      quote_denom: proto.quoteDenom,
      oracle_base: proto.oracleBase,
      oracle_quote: proto.oracleQuote,
      oracle_type: proto.oracleType,
      expiry: proto.expiry.toString(),
      initial_deposit: proto.initialDeposit,
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
      oracle_type:
        InjectiveOracleV1Beta1OraclePb.OracleType[params.fund.oracleType],
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
    return InjectiveInsuranceV1Beta1TxPb.MsgCreateInsuranceFund.toBinary(
      this.toProto(),
    )
  }
}
