import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmwasmWasmV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { fromUtf8 } from '../../../../utils/encoding.js'
import { safeBigIntStringify } from '../../../../utils/helpers.js'

export declare namespace MsgMigrateContract {
  export interface Params {
    sender: string
    contract: string
    codeId: number
    msg: object
  }

  export type Proto = CosmwasmWasmV1TxPb.MsgMigrateContract

  export type Object = Omit<CosmwasmWasmV1TxPb.MsgMigrateContract, 'msg'> & {
    msg: any
  }
}

/**
 * @category Messages
 */
export default class MsgMigrateContract extends MsgBase<
  MsgMigrateContract.Params,
  MsgMigrateContract.Proto,
  MsgMigrateContract.Object
> {
  static fromJSON(params: MsgMigrateContract.Params): MsgMigrateContract {
    return new MsgMigrateContract(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmwasmWasmV1TxPb.MsgMigrateContract.create({
      sender: params.sender,
      contract: params.contract,
      codeId: BigInt(params.codeId),
      msg: fromUtf8(safeBigIntStringify(params.msg)),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgMigrateContract',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const proto = this.toProto()

    const message = {
      sender: proto.sender,
      contract: proto.contract,
      code_id: proto.codeId.toString(),
      msg: safeBigIntStringify(params.msg),
    }

    return {
      type: 'wasm/MsgMigrateContract',
      value: message as unknown as MsgMigrateContract.Object,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgMigrateContract',
      ...value,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgMigrateContract. Please use EIP712_v2',
      ),
    )
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgMigrateContract',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmwasmWasmV1TxPb.MsgMigrateContract.toBinary(this.toProto())
  }
}
