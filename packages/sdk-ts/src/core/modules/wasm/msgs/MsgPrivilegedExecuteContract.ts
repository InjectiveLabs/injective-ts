import { MsgPrivilegedExecuteContract as BaseMsgPrivilegedExecuteContract } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { ExecPrivilegedArgs } from '../exec-args'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgPrivilegedExecuteContract {
  export interface Params {
    sender: string
    funds: string
    contractAddress: string
    data: ExecPrivilegedArgs
  }

  export type Proto = BaseMsgPrivilegedExecuteContract

  export type Object = BaseMsgPrivilegedExecuteContract.AsObject
}

/**
 * @category Messages
 */
export default class MsgPrivilegedExecuteContract extends MsgBase<
  MsgPrivilegedExecuteContract.Params,
  MsgPrivilegedExecuteContract.Proto,
  MsgPrivilegedExecuteContract.Object
> {
  static fromJSON(
    params: MsgPrivilegedExecuteContract.Params,
  ): MsgPrivilegedExecuteContract {
    return new MsgPrivilegedExecuteContract(params)
  }

  public toProto(): MsgPrivilegedExecuteContract.Proto {
    const { params } = this

    const message = BaseMsgPrivilegedExecuteContract.create()

    message.sender = params.sender
    message.funds = params.funds
    message.contractAddress = params.contractAddress
    message.data = params.data.toExecJSON()

    return BaseMsgPrivilegedExecuteContract.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgPrivilegedExecuteContract',
      value:
        message as unknown as SnakeCaseKeys<MsgPrivilegedExecuteContract.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgPrivilegedExecuteContract.encode(this.toProto()).finish()
  }
}
