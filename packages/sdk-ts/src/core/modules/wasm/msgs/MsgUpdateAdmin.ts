import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import { CosmwasmWasmV1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgUpdateAdmin {
  export interface Params {
    sender: string
    newAdmin: string
    contract: string
  }

  export type Proto = CosmwasmWasmV1Tx.MsgUpdateAdmin
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

    const message = CosmwasmWasmV1Tx.MsgUpdateAdmin.create()

    message.sender = params.sender
    message.newAdmin = params.newAdmin
    message.contract = params.contract

    return CosmwasmWasmV1Tx.MsgUpdateAdmin.fromPartial(message)
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

  public toWeb3Gw() {
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
    return CosmwasmWasmV1Tx.MsgUpdateAdmin.encode(this.toProto()).finish()
  }
}
