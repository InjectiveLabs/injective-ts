import { MsgRevoke as BaseMsgRevoke } from '@injectivelabs/chain-api/cosmos/authz/v1beta1/tx_pb'
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

  export interface Data extends BaseMsgRevoke.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgRevoke'
  }

  export interface Amino extends BaseMsgRevoke.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgRevoke'
  }

  export type Proto = BaseMsgRevoke
}

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

  toProto(): MsgRevoke.Proto {
    const { params } = this

    const message = new BaseMsgRevoke()
    message.setGrantee(params.grantee)
    message.setGranter(params.granter)
    message.setMsgTypeUrl(params.messageType)

    return message
  }

  toData(): MsgRevoke.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgRevoke',
      ...proto.toObject(),
    }
  }

  toAmino(): MsgRevoke.Amino {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgRevoke',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgRevoke.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.authz.v1beta1.MsgRevoke',
      message: proto,
    }
  }
}
