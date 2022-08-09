import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgExec as BaseMsgExec } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { ExecArgs } from '../../exec-args'
import { MsgBase } from '../../MsgBase'
import snakeCaseKeys from 'snakecase-keys'

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

  export interface Amino extends BaseMsgExec.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgExec'
  }

  export type Proto = BaseMsgExec
}

export default class MsgExec extends MsgBase<
  MsgExec.Params,
  MsgExec.Data,
  MsgExec.Proto,
  MsgExec.Amino,
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

  toAmino(): MsgExec.Amino {
    const { params } = this
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto.toObject()),
    }

    if (params.subaccountDeposits) {
      // @ts-ignore
      message['deposit_funds'] = [params.subaccountDeposits]
    }

    if (params.bankFunds) {
      // @ts-ignore
      message['bank_funds'] = [params.bankFunds]
    }

    // @ts-ignore
    delete message.bank_funds_list
    // @ts-ignore
    delete message.bankFundsList
    // @ts-ignore
    delete message.depositFundsList
    // @ts-ignore
    delete message.deposit_funds_list

    const messageWithProperKeys = snakeCaseKeys(message)

    return {
      '@type': '/injective.exchange.v1beta1.MsgExec',
      ...messageWithProperKeys,
    } as unknown as MsgExec.Amino
  }

  toDirectSign(): MsgExec.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgExec',
      message: proto,
    }
  }
}
