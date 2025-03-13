import { fromUtf8 } from '../../../../utils/utf8.js'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import { CosmwasmWasmV1Tx } from '@injectivelabs/core-proto-ts'
import { GeneralException } from '@injectivelabs/exceptions'

export declare namespace MsgMigrateContract {
  export interface Params {
    sender: string
    contract: string
    codeId: number
    msg: object
  }

  export type Proto = CosmwasmWasmV1Tx.MsgMigrateContract

  export type Object = Omit<CosmwasmWasmV1Tx.MsgMigrateContract, 'msg'> & {
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

    const message = CosmwasmWasmV1Tx.MsgMigrateContract.create()

    message.sender = params.sender
    message.contract = params.contract
    message.codeId = params.codeId.toString()
    message.msg = fromUtf8(JSON.stringify(params.msg))

    return CosmwasmWasmV1Tx.MsgMigrateContract.fromPartial(message)
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
      ...snakecaseKeys(proto),
      msg: params.msg,
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
    return CosmwasmWasmV1Tx.MsgMigrateContract.encode(this.toProto()).finish()
  }
}
