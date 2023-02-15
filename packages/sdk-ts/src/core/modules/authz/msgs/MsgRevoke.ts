import { MsgRevoke as BaseMsgRevoke } from '@injectivelabs/chain-api/cosmos/authz/v1beta1/tx_pb'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgRevoke {
  export interface Params {
    messageType: string
    grantee: string
    granter: string
  }

  export type Proto = BaseMsgRevoke

  export type Object = BaseMsgRevoke.AsObject
}

/**
 * @category Messages
 */
export default class MsgRevoke extends MsgBase<
  MsgRevoke.Params,
  MsgRevoke.Proto,
  MsgRevoke.Object
> {
  static fromJSON(params: MsgRevoke.Params): MsgRevoke {
    return new MsgRevoke(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgRevoke()
    message.setGrantee(params.grantee)
    message.setGranter(params.granter)
    message.setMsgTypeUrl(params.messageType)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgRevoke',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'cosmos-sdk/MsgRevoke',
      value: message as unknown as SnakeCaseKeys<MsgRevoke.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.authz.v1beta1.MsgRevoke',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.authz.v1beta1.MsgRevoke',
      message: proto,
    }
  }
}
