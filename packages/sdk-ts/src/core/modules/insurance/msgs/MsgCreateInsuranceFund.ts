import { MsgCreateInsuranceFund as BaseMsgCreateInsuranceFund } from '@injectivelabs/chain-api/injective/insurance/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { OracleTypeMap } from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgCreateInsuranceFund {
  export interface Params {
    fund: {
      ticker: string
      quoteDenom: string
      oracleBase: string
      oracleQuote: string
      oracleType: OracleTypeMap[keyof OracleTypeMap]
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

    const amountCoin = new Coin()
    amountCoin.setAmount(params.deposit.amount)
    amountCoin.setDenom(params.deposit.denom)

    const message = new BaseMsgCreateInsuranceFund()
    message.setTicker(params.fund.ticker)
    message.setQuoteDenom(params.fund.quoteDenom)
    message.setOracleBase(params.fund.oracleBase)
    message.setOracleQuote(params.fund.oracleQuote)
    message.setOracleType(params.fund.oracleType)
    message.setSender(params.injectiveAddress)
    message.setInitialDeposit(amountCoin)
    message.setExpiry(params.fund.expiry ? params.fund.expiry : -1)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgCreateInsuranceFund',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
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
}
