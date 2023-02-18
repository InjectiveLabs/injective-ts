import { MsgStoreCode as BaseMsgStoreCode } from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/tx'
import { fromUtf8 } from '../../../../utils'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgStoreCode {
  export interface Params {
    sender: string
    wasmBytes: Uint8Array | string
  }

  export type Proto = BaseMsgStoreCode

  export type Object = BaseMsgStoreCode.AsObject
}

/**
 * @category Messages
 */
export default class MsgStoreCode extends MsgBase<
  MsgStoreCode.Params,
  MsgStoreCode.Proto,
  MsgStoreCode.Object
> {
  static fromJSON(params: MsgStoreCode.Params): MsgStoreCode {
    return new MsgStoreCode(params)
  }

  public toProto() {
    const { params } = this

    const message = BaseMsgStoreCode.create()

    message.sender = params.sender
    message.wasmByteCode =
      typeof params.wasmBytes === 'string'
        ? fromUtf8(params.wasmBytes)
        : params.wasmBytes

    return BaseMsgStoreCode.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgStoreCode',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'wasm/MsgStoreCode',
      value: { ...message },
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgStoreCode',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgStoreCode',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgStoreCode.encode(this.toProto()).finish()
  }
}
