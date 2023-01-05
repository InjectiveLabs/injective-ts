import { MsgMigrateContract as BaseMsgMigrateContract } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
import { toUtf8 } from '../../../../utils'
import { MsgBase } from '../../MsgBase'
import snakeCaseKeys from 'snakecase-keys'

export declare namespace MsgMigrateContract {
  export interface Params {
    sender: string,
    contract: string,
    codeId: number,
    msg: object,
  }

  export interface DirectSign {
    type: '/cosmwasm.wasm.v1.MsgMigrateContract'
    message: BaseMsgMigrateContract
  }

  export interface Data extends BaseMsgMigrateContract.AsObject {
    '@type': '/cosmwasm.wasm.v1.MsgMigrateContract'
  }

  export interface Amino extends BaseMsgMigrateContract.AsObject {
    type: 'wasm/MsgMigrateContract'
  }

  export interface Web3 extends BaseMsgMigrateContract.AsObject {
    '@type': '/cosmwasm.wasm.v1.MsgMigrateContract'
  }

  export type Proto = BaseMsgMigrateContract
}

/**
 * @category Messages
 */
export default class MsgMigrateContract extends MsgBase<
  MsgMigrateContract.Params,
  MsgMigrateContract.Data,
  MsgMigrateContract.Proto,
  MsgMigrateContract.Amino,
  MsgMigrateContract.DirectSign
> {
  static fromJSON(params: MsgMigrateContract.Params): MsgMigrateContract {
    return new MsgMigrateContract(params)
  }

  public toProto(): MsgMigrateContract.Proto {
    const { params } = this

    const message = new BaseMsgMigrateContract()
    message.setCodeId(params.codeId)
    message.setContract(params.contract)
    message.setSender(params.sender)
    message.setMsg(toUtf8(JSON.stringify(params.msg)))

    return message
  }

  public toData(): MsgMigrateContract.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgMigrateContract',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgMigrateContract.Amino {
    const { params } = this
    const proto = this.toProto()

    const message = {
      ...snakeCaseKeys(proto.toObject()),
      msg: params.msg,
    }

    return {
      type: 'wasm/MsgExecuteContract',
      ...message,
    } as unknown as MsgMigrateContract.Amino
  }

  public toWeb3(): MsgMigrateContract.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgMigrateContract',
      ...rest,
    } as unknown as MsgMigrateContract.Web3
  }

  public toDirectSign(): MsgMigrateContract.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgMigrateContract',
      message: proto,
    }
  }
}
