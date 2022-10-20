/*
import { MsgReclaimLockedFunds as BaseMsgReclaimLockedFunds } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgReclaimLockedFunds {
  export interface Params {
    sender: string
    lockedAccount: string
    lockedAccountPubKey: Uint8Array | string
    unlockAuthorizationSignature: Uint8Array | string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgReclaimLockedFunds'
    message: BaseMsgReclaimLockedFunds
  }

  export interface Data extends BaseMsgReclaimLockedFunds.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds'
  }

  export interface Amino extends BaseMsgReclaimLockedFunds.AsObject {
    type: 'exchange/MsgReclaimLockedFunds'
  }

  export interface Web3 extends BaseMsgReclaimLockedFunds.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds'
  }

  export type Proto = BaseMsgReclaimLockedFunds
}

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

    const message = new BaseMsgReclaimLockedFunds()
    message.setSender(params.sender)
    message.setLockedAccount(params.lockedAccount)
    message.setLockedAccountPubKey(params.lockedAccountPubKey)
    message.setUnlockAuthorizationSignature(params.unlockAuthorizationSignature)

    return message
  }

  public toData(): MsgReclaimLockedFunds.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgReclaimLockedFunds.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgReclaimLockedFunds',
      ...proto.toObject(),
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
}
*/
