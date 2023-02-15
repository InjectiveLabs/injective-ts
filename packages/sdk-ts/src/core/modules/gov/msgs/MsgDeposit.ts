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

  export type Proto = BaseMsgDeposit

  export type Object = BaseMsgDeposit.AsObject
}

/**
 * @category Messages
 */
export default class MsgDeposit extends MsgBase<
  MsgDeposit.Params,
  MsgDeposit.Proto,
  MsgDeposit.Object
> {
  static fromJSON(params: MsgDeposit.Params): MsgDeposit {
    return new MsgDeposit(params)
  }

  public toProto() {
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

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto.toObject()),
      amount: proto
        .getAmountList()
        .map((amount) => snakeCaseKeys(amount.toObject())),
    }

    // @ts-ignore
    delete message.amount_list

    return {
      type: 'cosmos-sdk/MsgDeposit',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgDeposit',
      message: proto,
    }
  }
}
