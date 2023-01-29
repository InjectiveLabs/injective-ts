import { MsgCreateInsuranceFund as BaseMsgCreateInsuranceFund } from '@injectivelabs/core-proto-ts/injective/insurance/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { OracleType } from '@injectivelabs/core-proto-ts/injective/oracle/v1beta1/oracle'
import { MsgBase } from '../../MsgBase'

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

  export interface DirectSign {
    type: '/injective.insurance.v1beta1.MsgCreateInsuranceFund'
    message: BaseMsgCreateInsuranceFund
  }

  export interface Data extends BaseMsgCreateInsuranceFund {
    '@type': '/injective.insurance.v1beta1.MsgCreateInsuranceFund'
  }

  export interface Amino extends BaseMsgCreateInsuranceFund {
    type: 'insurance/MsgCreateInsuranceFund'
  }

  export interface Web3 extends BaseMsgCreateInsuranceFund {
    '@type': '/injective.insurance.v1beta1.MsgCreateInsuranceFund'
  }

  export type Proto = BaseMsgCreateInsuranceFund
}

/**
 * @category Messages
 */
export default class MsgCreateInsuranceFund extends MsgBase<
  MsgCreateInsuranceFund.Params,
  MsgCreateInsuranceFund.Data,
  MsgCreateInsuranceFund.Proto,
  MsgCreateInsuranceFund.Amino,
  MsgCreateInsuranceFund.DirectSign
> {
  static fromJSON(
    params: MsgCreateInsuranceFund.Params,
  ): MsgCreateInsuranceFund {
    return new MsgCreateInsuranceFund(params)
  }

  public toProto(): MsgCreateInsuranceFund.Proto {
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

  public toData(): MsgCreateInsuranceFund.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgCreateInsuranceFund',
      ...proto,
    }
  }

  public toAmino(): MsgCreateInsuranceFund.Amino {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgCreateInsuranceFund',
      ...proto,
    }
  }

  public toWeb3(): MsgCreateInsuranceFund.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.insurance.v1beta1.MsgCreateInsuranceFund',
      ...rest,
    } as unknown as MsgCreateInsuranceFund.Web3
  }

  public toDirectSign(): MsgCreateInsuranceFund.DirectSign {
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
