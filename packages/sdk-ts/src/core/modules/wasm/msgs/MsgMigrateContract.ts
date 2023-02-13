import { MsgMigrateContract as BaseMsgMigrateContract } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
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

    const message = new BaseMsgMigrateContract()
    message.setCodeId(params.codeId)
    message.setContract(params.contract)
    message.setSender(params.sender)
    message.setMsg(fromUtf8(JSON.stringify(params.msg)))

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgMigrateContract',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const { params } = this
    const proto = this.toProto()

    const message = {
      ...snakecaseKeys(proto.toObject()),
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
}
