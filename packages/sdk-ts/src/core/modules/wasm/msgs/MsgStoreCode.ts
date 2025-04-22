import { fromUtf8 } from '../../../../utils/utf8.js'
import { MsgBase } from '../../MsgBase.js'
import { toPascalCase } from '@injectivelabs/utils'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmwasmWasmV1Tx,
  CosmwasmWasmV1Types,
} from '@injectivelabs/core-proto-ts'
import { GeneralException } from '@injectivelabs/exceptions'

export declare namespace MsgStoreCode {
  export interface Params {
    sender: string
    wasmBytes: Uint8Array | string
    instantiatePermission?: {
      permission: CosmwasmWasmV1Types.AccessType
      addresses: string[]
    }
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
      const accessConfig = CosmwasmWasmV1Types.AccessConfig.create()

      accessConfig.permission = params.instantiatePermission.permission
      accessConfig.addresses = params.instantiatePermission.addresses

      message.instantiatePermission = accessConfig
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
      wasm_byte_code: Buffer.from(proto.wasmByteCode).toString('base64'),
      instantiate_permission: proto.instantiatePermission
        ? {
            permission: toPascalCase(
              CosmwasmWasmV1Types.accessTypeToJSON(
                proto.instantiatePermission.permission,
              ).replace('ACCESS_TYPE_', ''),
            ),
            addresses: proto.instantiatePermission.addresses || [],
          }
        : undefined,
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

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgStoreCode. Please use EIP712_v2',
      ),
    )
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
