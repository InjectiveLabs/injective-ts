import * as CosmwasmWasmV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgUpdateAdmin {
  export interface Params {
    sender: string
    newAdmin: string
    contract: string
  }

  export type Proto = CosmwasmWasmV1TxPb.MsgUpdateAdmin
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

    const message = CosmwasmWasmV1TxPb.MsgUpdateAdmin.create({
      sender: params.sender,
      newAdmin: params.newAdmin,
      contract: params.contract,
    })

    return message
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
      sender: proto.sender,
      new_admin: proto.newAdmin,
      contract: proto.contract,
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
    return CosmwasmWasmV1TxPb.MsgUpdateAdmin.toBinary(this.toProto())
  }
}
