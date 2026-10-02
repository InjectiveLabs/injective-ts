import { toPascalCase } from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmwasmWasmV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb'
import * as CosmwasmWasmV1TypesPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/types_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgUpdateInstantiateConfig {
  export interface Params {
    sender: string
    codeId: number | string | bigint
    newInstantiatePermission: CosmwasmWasmV1TypesPb.AccessConfig
  }

  export type Proto = CosmwasmWasmV1TxPb.MsgUpdateInstantiateConfig
}

/**
 * @category Messages
 */
export default class MsgUpdateInstantiateConfig extends MsgBase<
  MsgUpdateInstantiateConfig.Params,
  MsgUpdateInstantiateConfig.Proto
> {
  static fromJSON(
    params: MsgUpdateInstantiateConfig.Params,
  ): MsgUpdateInstantiateConfig {
    return new MsgUpdateInstantiateConfig(params)
  }

  public toProto() {
    const { params } = this

    return CosmwasmWasmV1TxPb.MsgUpdateInstantiateConfig.create({
      sender: params.sender,
      codeId: BigInt(params.codeId),
      newInstantiatePermission: CosmwasmWasmV1TypesPb.AccessConfig.create(
        params.newInstantiatePermission,
      ),
    })
  }

  public toData() {
    return {
      '@type': '/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig',
      ...this.toProto(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const permission = proto.newInstantiatePermission!

    return {
      type: 'wasm/MsgUpdateInstantiateConfig',
      value: {
        sender: proto.sender,
        code_id: proto.codeId.toString(),
        new_instantiate_permission: {
          permission: toPascalCase(
            CosmwasmWasmV1TypesPb.AccessType[permission.permission].replace(
              'ACCESS_TYPE_',
              '',
            ),
          ),
          addresses: permission.addresses,
        },
      },
    }
  }

  public toWeb3Gw() {
    return {
      '@type': '/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig',
      ...this.toAmino().value,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgUpdateInstantiateConfig. Please use EIP712_v2',
      ),
    )
  }

  public toDirectSign() {
    return {
      type: '/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig',
      message: this.toProto(),
    }
  }

  public toBinary(): Uint8Array {
    return CosmwasmWasmV1TxPb.MsgUpdateInstantiateConfig.toBinary(
      this.toProto(),
    )
  }
}
