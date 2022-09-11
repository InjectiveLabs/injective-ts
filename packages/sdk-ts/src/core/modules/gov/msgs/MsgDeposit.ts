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

  export interface Amino extends BaseMsgDeposit.AsObject {
    type: 'cosmos-sdk/MsgDeposit'
  }

  export interface Web3 extends BaseMsgDeposit.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgDeposit'
  }

  export type Proto = BaseMsgDeposit
}

/**
 * @category Messages
 */
export default class MsgDeposit extends MsgBase<
  MsgDeposit.Params,
  MsgDeposit.Data,
  MsgDeposit.Proto,
  MsgDeposit.Amino,
  MsgDeposit.DirectSign
> {
  static fromJSON(params: MsgDeposit.Params): MsgDeposit {
    return new MsgDeposit(params)
  }

  public toProto(): MsgDeposit.Proto {
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

  public toData(): MsgDeposit.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgDeposit.Amino {
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
      ...message,
    } as unknown as MsgDeposit.Amino
  }

  public toWeb3(): MsgDeposit.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...rest,
    } as unknown as MsgDeposit.Web3
  }

  public toDirectSign(): MsgDeposit.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgDeposit',
      message: proto,
    }
  }
}
