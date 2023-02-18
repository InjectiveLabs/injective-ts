import { MsgCreateInsuranceFund as BaseMsgCreateInsuranceFund } from '@injectivelabs/core-proto-ts/injective/insurance/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { OracleType } from '@injectivelabs/core-proto-ts/injective/oracle/v1beta1/oracle'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgCreateInsuranceFund {
  export interface Params {
    fund: {
      ticker: string
      quoteDenom: string
      oracleBase: string
      oracleQuote: string
      oracleType: OracleType
      expiry?: number
    }
    deposit: {
      amount: string
      denom: string
    }
    injectiveAddress: string
  }

  export type Proto = BaseMsgCreateInsuranceFund

  export type Object = BaseMsgCreateInsuranceFund.AsObject
}

/**
 * @category Messages
 */
export default class MsgCreateInsuranceFund extends MsgBase<
  MsgCreateInsuranceFund.Params,
  MsgCreateInsuranceFund.Proto,
  MsgCreateInsuranceFund.Object
> {
  static fromJSON(
    params: MsgCreateInsuranceFund.Params,
  ): MsgCreateInsuranceFund {
    return new MsgCreateInsuranceFund(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = Coin.create()
    amountCoin.amount = params.deposit.amount
    amountCoin.denom = params.deposit.denom

    const message = BaseMsgCreateInsuranceFund.create()
    message.ticker = params.fund.ticker
    message.quoteDenom = params.fund.quoteDenom
    message.oracleBase = params.fund.oracleBase
    message.oracleQuote = params.fund.oracleQuote
    message.oracleType = params.fund.oracleType
    message.sender = params.injectiveAddress
    message.initialDeposit = amountCoin
    message.expiry = (params.fund.expiry ? params.fund.expiry : -1).toString()

    return BaseMsgCreateInsuranceFund.fromPartial(message)
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

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.insurance.v1beta1.MsgCreateInsuranceFund',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgCreateInsuranceFund',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgCreateInsuranceFund.encode(this.toProto()).finish()
  }
}
