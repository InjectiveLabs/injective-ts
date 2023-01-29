import { MsgReclaimLockedFunds as BaseMsgReclaimLockedFunds } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgReclaimLockedFunds {
  export interface Params {
    sender: string
    lockedAccountPubKey: string
    signature: Uint8Array
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgReclaimLockedFunds'
    message: BaseMsgReclaimLockedFunds
  }

  export interface Data extends BaseMsgReclaimLockedFunds {
    '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds'
  }

  export interface Amino extends BaseMsgReclaimLockedFunds {
    type: 'exchange/MsgReclaimLockedFunds'
  }

  export interface Web3 extends BaseMsgReclaimLockedFunds {
    '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds'
  }

  export type Proto = BaseMsgReclaimLockedFunds
}

/**
 * @category Messages
 */
export default class MsgReclaimLockedFunds extends MsgBase<
  MsgReclaimLockedFunds.Params,
  MsgReclaimLockedFunds.Data,
  MsgReclaimLockedFunds.Proto,
  MsgReclaimLockedFunds.Amino,
  MsgReclaimLockedFunds.DirectSign
> {
  static fromJSON(params: MsgReclaimLockedFunds.Params): MsgReclaimLockedFunds {
    return new MsgReclaimLockedFunds(params)
  }

  public toProto(): MsgReclaimLockedFunds.Proto {
    const { params } = this

    const message = BaseMsgReclaimLockedFunds.create()
    message.sender = params.sender
    message.lockedAccountPubKey = Buffer.from(
      params.lockedAccountPubKey,
      'base64',
    )
    message.signature = params.signature

    return BaseMsgReclaimLockedFunds.fromPartial(message)
  }

  public toData(): MsgReclaimLockedFunds.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds',
      ...proto,
    }
  }

  public toAmino(): MsgReclaimLockedFunds.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgReclaimLockedFunds',
      ...proto,
    }
  }

  public toWeb3(): MsgReclaimLockedFunds.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds',
      ...rest,
    } as unknown as MsgReclaimLockedFunds.Web3
  }

  public toDirectSign(): MsgReclaimLockedFunds.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgReclaimLockedFunds',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgReclaimLockedFunds.encode(this.toProto()).finish()
  }
}
