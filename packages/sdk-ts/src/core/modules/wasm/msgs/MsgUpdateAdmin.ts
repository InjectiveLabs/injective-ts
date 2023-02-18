import { MsgUpdateAdmin as BaseMsgUpdateAdmin } from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/tx'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgUpdateAdmin {
  export interface Params {
    sender: string
    newAdmin: string
    contract: string
  }

  export type Proto = BaseMsgUpdateAdmin
}

/**
 * @category Messages
 */
export default class MsgUpdateAdmin extends MsgBase<
  MsgUpdateAdmin.Params,
  MsgUpdateAdmin.Proto
> {
  static fromJSON(params: MsgUpdateAdmin.Params): MsgUpdateAdmin {
    return new MsgUpdateAdmin(params)
  }

  public toProto() {
    const { params } = this

    const message = BaseMsgUpdateAdmin.create()

    message.sender = params.sender
    message.newAdmin = params.newAdmin
    message.contract = params.contract

    return BaseMsgUpdateAdmin.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgUpdateAdmin',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
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

  public toBinary(): Uint8Array {
    return BaseMsgUpdateAdmin.encode(this.toProto()).finish()
  }
}
