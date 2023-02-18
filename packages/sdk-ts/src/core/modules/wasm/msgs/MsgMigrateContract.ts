import { MsgMigrateContract as BaseMsgMigrateContract } from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/tx'
import { fromUtf8 } from '../../../../utils'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgMigrateContract {
  export interface Params {
    sender: string
    contract: string
    codeId: number
    msg: object
  }

  export type Proto = BaseMsgMigrateContract

  export type Object = BaseMsgMigrateContract.AsObject
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

    const message = BaseMsgMigrateContract.create()
    message.codeId = params.codeId.toString()
    message.contract = params.contract
    message.sender = params.sender
    message.msg = fromUtf8(JSON.stringify(params.msg))

    return BaseMsgMigrateContract.fromPartial(message)
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
      value: message as unknown as SnakeCaseKeys<MsgMigrateContract.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgMigrateContract',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgMigrateContract',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgMigrateContract.encode(this.toProto()).finish()
  }
}
