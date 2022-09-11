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
    }[]
    subaccountId?: string
    subaccountDeposits?: {
      denom: string
      amount: string
    }[]
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
    type: 'exchange/MsgExec'
  }

  export interface Web3 extends BaseMsgExec.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgExec'
  }

  export type Proto = BaseMsgExec
}

/**
 * @category Messages
 */
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

  public toProto(): MsgExec.Proto {
    const { params } = this

    const message = new BaseMsgExec()

    if (params.subaccountId) {
      message.setDepositsSubaccountId(params.subaccountId!)
    }

    if (params.subaccountDeposits) {
      const depositFundList = params.subaccountDeposits.map(
        ({ amount, denom }) => {
          const funds = new Coin()

          funds.setAmount(amount)
          funds.setDenom(denom)

          return funds
        },
      )

      message.setDepositFundsList(depositFundList)
    }

    if (params.bankFunds) {
      const bankFundList = params.bankFunds.map(({ amount, denom }) => {
        const funds = new Coin()

        funds.setAmount(amount)
        funds.setDenom(denom)

        return funds
      })

      message.setBankFundsList(bankFundList)
    }

    message.setSender(params.sender)
    message.setContractAddress(params.contractAddress)
    message.setData(params.data.toExecJSON())

    return message
  }

  public toData(): MsgExec.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExec',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgExec.Amino {
    const { params } = this
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto.toObject()),
    }

    if (params.subaccountDeposits) {
      // @ts-ignore
      message['deposit_funds'] = params.subaccountDeposits
    }

    if (params.bankFunds) {
      // @ts-ignore
      message['bank_funds'] = params.bankFunds
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
      type: 'exchange/MsgExec',
      ...messageWithProperKeys,
    } as unknown as MsgExec.Amino
  }

  public toWeb3(): MsgExec.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgExec',
      ...rest,
    } as unknown as MsgExec.Web3
  }

  public toDirectSign(): MsgExec.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgExec',
      message: proto,
    }
  }
}
