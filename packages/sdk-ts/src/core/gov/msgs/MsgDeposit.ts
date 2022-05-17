import { MsgDeposit as BaseMsgDeposit } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgDeposit {
  export interface Params {
    proposalId: number
    amount: {
      denom: string
      amount: string
    }
    depositor: string
  }

  export interface DirectSign {
    type: '/cosmos.gov.v1beta1.MsgDeposit'
    message: BaseMsgDeposit
  }

  export interface Data extends BaseMsgDeposit.AsObject {
    '@type': '/cosmos.gov.v1beta1.MsgDeposit'
  }

  export interface Web3 extends BaseMsgDeposit.AsObject {
    '@type': '/cosmos.gov.v1beta1.MsgDeposit'
  }

  export type Proto = BaseMsgDeposit
}

export default class MsgDeposit extends MsgBase<
  MsgDeposit.Params,
  MsgDeposit.Data,
  MsgDeposit.Proto,
  MsgDeposit.Web3,
  MsgDeposit.DirectSign
> {
  static fromJSON(params: MsgDeposit.Params): MsgDeposit {
    return new MsgDeposit(params)
  }

  toProto(): MsgDeposit.Proto {
    const { params } = this

    const deposit = new Coin()
    deposit.setAmount(params.amount.amount)
    deposit.setDenom(params.amount.denom)

    const message = new BaseMsgDeposit()
    message.setDepositor(params.depositor)
    message.setProposalId(params.proposalId)
    message.setAmountList([deposit])

    return message
  }

  toData(): MsgDeposit.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgDeposit.Web3 {
    const { params } = this
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto.toObject()),
      amount: [{ ...snakeCaseKeys(params.amount) }],
    }

    // @ts-ignore
    delete message.amount_list

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...message,
    } as unknown as MsgDeposit.Web3
  }

  toDirectSign(): MsgDeposit.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgDeposit',
      message: proto,
    }
  }
}
