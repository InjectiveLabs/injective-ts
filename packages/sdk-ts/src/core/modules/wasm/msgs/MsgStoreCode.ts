import { MsgStoreCode as BaseMsgStoreCode } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
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

    const message = new BaseMsgStoreCode()

    message.setSender(params.sender)
    message.setWasmByteCode(
      typeof params.wasmBytes === 'string'
        ? fromUtf8(params.wasmBytes)
        : params.wasmBytes,
    )

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgStoreCode',
      ...proto.toObject(),
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
}
