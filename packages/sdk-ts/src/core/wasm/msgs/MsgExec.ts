import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgExec as BaseMsgExec } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { ExecArgs } from '../../exec-args'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgExec {
  export interface Params {
    bankFunds?: {
      denom: string
      amount: string
    }
    subaccountId?: string
    subaccountDeposits?: {
      denom: string
      amount: string
    }
    sender: string
    contractAddress: string
    data: ExecArgs
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgExec'
    message: BaseMsgExec
  }

  export interface Data extends BaseMsgExec.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgExec'
  }

  export interface Web3 extends BaseMsgExec.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgExec'
  }

  export type Proto = BaseMsgExec
}

export default class MsgExec extends MsgBase<
  MsgExec.Params,
  MsgExec.Data,
  MsgExec.Proto,
  MsgExec.Web3,
  MsgExec.DirectSign
> {
  static fromJSON(params: MsgExec.Params): MsgExec {
    return new MsgExec(params)
  }

  toProto(): MsgExec.Proto {
    const { params } = this
    const subaccountOrBankDeposit =
      (!params.subaccountDeposits || !params.subaccountId) && !params.bankFunds

    if (subaccountOrBankDeposit) {
      throw new Error('Subaccount or bank funds must be specified')
    }

    const message = new BaseMsgExec()
    const funds = new Coin()

    if (params.subaccountId) {
      message.setDepositsSubaccountId(params.subaccountId!)
    }

    if (params.subaccountDeposits) {
      funds.setAmount(params.subaccountDeposits.amount)
      funds.setDenom(params.subaccountDeposits.denom)
      message.setDepositFundsList([funds])
    }

    if (params.bankFunds) {
      funds.setAmount(params.bankFunds.amount)
      funds.setDenom(params.bankFunds.denom)
      message.setBankFundsList([funds])
    }

    message.setSender(params.sender)
    message.setContractAddress(params.contractAddress)
    message.setData(params.data.toExecJSON())

    return message
  }

  toData(): MsgExec.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExec',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgExec.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExec',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgExec.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgExec',
      message: proto,
    }
  }
}
