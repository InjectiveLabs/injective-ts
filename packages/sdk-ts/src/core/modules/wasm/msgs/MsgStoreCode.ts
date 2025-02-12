import { fromUtf8 } from '../../../../utils/utf8.js'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import { CosmwasmWasmV1Tx } from '@injectivelabs/core-proto-ts'
import { AccessConfig } from '@injectivelabs/core-proto-ts/cjs/cosmwasm/wasm/v1/types.js'

export declare namespace MsgStoreCode {
  export interface Params {
    sender: string
    wasmBytes: Uint8Array | string
    instantiatePermission?: AccessConfig
  }

  export type Proto = CosmwasmWasmV1Tx.MsgStoreCode
}

/**
 * @category Messages
 */
export default class MsgStoreCode extends MsgBase<
  MsgStoreCode.Params,
  MsgStoreCode.Proto
> {
  static fromJSON(params: MsgStoreCode.Params): MsgStoreCode {
    return new MsgStoreCode(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmwasmWasmV1Tx.MsgStoreCode.create()

    message.sender = params.sender
    message.wasmByteCode =
      typeof params.wasmBytes === 'string'
        ? fromUtf8(params.wasmBytes)
        : params.wasmBytes

    if (params.instantiatePermission) {
      message.instantiatePermission = params.instantiatePermission
    }

    return CosmwasmWasmV1Tx.MsgStoreCode.fromPartial(message)
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
      ...snakecaseKeys(proto),
    }

    return {
      type: 'wasm/MsgStoreCode',
      value: { ...message },
    }
  }

  public toWeb3Gw() {
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
    return CosmwasmWasmV1Tx.MsgStoreCode.encode(this.toProto()).finish()
  }
}
