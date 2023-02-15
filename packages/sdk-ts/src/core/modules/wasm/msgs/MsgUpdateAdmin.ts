import { MsgUpdateAdmin as BaseMsgUpdateAdmin } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgUpdateAdmin {
  export interface Params {
    sender: string
    newAdmin: string
    contract: string
  }

  export type Proto = BaseMsgUpdateAdmin

  export type Object = BaseMsgUpdateAdmin.AsObject
}

/**
 * @category Messages
 */
export default class MsgUpdateAdmin extends MsgBase<
  MsgUpdateAdmin.Params,
  MsgUpdateAdmin.Proto,
  MsgUpdateAdmin.Object
> {
  static fromJSON(params: MsgUpdateAdmin.Params): MsgUpdateAdmin {
    return new MsgUpdateAdmin(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgUpdateAdmin()

    message.setSender(params.sender)
    message.setNewAdmin(params.newAdmin)
    message.setContract(params.contract)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgUpdateAdmin',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'wasm/MsgUpdateAdmin',
      value: { ...message },
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgUpdateAdmin',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgUpdateAdmin',
      message: proto,
    }
  }
}
