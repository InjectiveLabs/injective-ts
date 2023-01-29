import { MsgRevoke as BaseMsgRevoke } from '@injectivelabs/core-proto-ts/cosmos/authz/v1beta1/tx'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgRevoke {
  export interface Params {
    messageType: string
    grantee: string
    granter: string
  }

  export interface DirectSign {
    type: '/cosmos.authz.v1beta1.MsgRevoke'
    message: BaseMsgRevoke
  }

  export interface Data extends BaseMsgRevoke {
    '@type': '/cosmos.authz.v1beta1.MsgRevoke'
  }

  export interface Amino extends BaseMsgRevoke {
    type: 'cosmos-sdk/MsgRevoke'
  }

  export interface Web3 extends BaseMsgRevoke {
    '@type': '/cosmos.authz.v1beta1.MsgRevoke'
  }

  export type Proto = BaseMsgRevoke
}

/**
 * @category Messages
 */
export default class MsgRevoke extends MsgBase<
  MsgRevoke.Params,
  MsgRevoke.Data,
  MsgRevoke.Proto,
  MsgRevoke.Amino,
  MsgRevoke.DirectSign
> {
  static fromJSON(params: MsgRevoke.Params): MsgRevoke {
    return new MsgRevoke(params)
  }

  public toProto(): MsgRevoke.Proto {
    const { params } = this

    const message = BaseMsgRevoke.create()
    message.grantee = params.grantee
    message.granter = params.granter
    message.msgTypeUrl = params.messageType

    return BaseMsgRevoke.fromPartial(message)
  }

  public toData(): MsgRevoke.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgRevoke',
      ...proto,
    }
  }

  public toAmino(): MsgRevoke.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgRevoke',
      ...proto,
    }
  }

  public toWeb3(): MsgRevoke.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.authz.v1beta1.MsgRevoke',
      ...rest,
    }
  }

  public toDirectSign(): MsgRevoke.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.authz.v1beta1.MsgRevoke',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgRevoke.encode(this.toProto()).finish()
  }
}
