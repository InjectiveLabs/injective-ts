import { MsgDeposit as BaseMsgDeposit } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
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

  export interface Data extends BaseMsgDeposit {
    '@type': '/cosmos.gov.v1beta1.MsgDeposit'
  }

  export interface Amino extends BaseMsgDeposit {
    type: 'cosmos-sdk/MsgDeposit'
  }

  export interface Web3 extends BaseMsgDeposit {
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

    const deposit = Coin.create()
    deposit.amount = params.amount.amount
    deposit.denom = params.amount.denom

    const message = BaseMsgDeposit.create()
    message.depositor = params.depositor
    message.proposalId = params.proposalId.toString()
    message.amount = [deposit]

    return BaseMsgDeposit.fromPartial(message)
  }

  public toData(): MsgDeposit.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...proto,
    }
  }

  public toAmino(): MsgDeposit.Amino {
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto),
    }

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

  public toBinary(): Uint8Array {
    return BaseMsgDeposit.encode(this.toProto()).finish()
  }
}
