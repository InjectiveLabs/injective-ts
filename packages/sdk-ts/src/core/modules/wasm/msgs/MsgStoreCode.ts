import { toPascalCase } from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmwasmWasmV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb.mjs'
import * as CosmwasmWasmV1TypesPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/types_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import { fromUtf8 } from '../../../../utils/utf8.js'

export declare namespace MsgStoreCode {
  export interface Params {
    sender: string
    wasmBytes: Uint8Array | string
    instantiatePermission?: {
      permission: CosmwasmWasmV1TypesPb.AccessType
      addresses: string[]
    }
  }

  export type Proto = CosmwasmWasmV1TxPb.MsgStoreCode
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

    const instantiatePermission = params.instantiatePermission
      ? CosmwasmWasmV1TypesPb.AccessConfig.create({
          permission: params.instantiatePermission.permission,
          addresses: params.instantiatePermission.addresses,
        })
      : undefined

    const message = CosmwasmWasmV1TxPb.MsgStoreCode.create({
      sender: params.sender,
      wasmByteCode:
        typeof params.wasmBytes === 'string'
          ? fromUtf8(params.wasmBytes)
          : params.wasmBytes,
      instantiatePermission: instantiatePermission,
    })

    return message
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
      sender: proto.sender,
      wasm_byte_code: Buffer.from(proto.wasmByteCode).toString('base64'),
      instantiate_permission: proto.instantiatePermission
        ? {
            permission: toPascalCase(
              CosmwasmWasmV1TypesPb.AccessType[
                proto.instantiatePermission.permission
              ].replace('ACCESS_TYPE_', ''),
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
    return CosmwasmWasmV1TxPb.MsgStoreCode.toBinary(this.toProto())
  }
}
