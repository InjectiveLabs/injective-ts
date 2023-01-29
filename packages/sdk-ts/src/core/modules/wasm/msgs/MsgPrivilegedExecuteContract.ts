import { MsgPrivilegedExecuteContract as BaseMsgPrivilegedExecuteContract } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { ExecPrivilegedArgs } from '../exec-args'
import { MsgBase } from '../../MsgBase'
import snakeCaseKeys from 'snakecase-keys'

export declare namespace MsgPrivilegedExecuteContract {
  export interface Params {
    sender: string
    funds: string
    contractAddress: string
    data: ExecPrivilegedArgs
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract'
    message: BaseMsgPrivilegedExecuteContract
  }

  export interface Data extends BaseMsgPrivilegedExecuteContract {
    '@type': '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract'
  }

  export interface Amino extends BaseMsgPrivilegedExecuteContract {
    type: 'exchange/MsgPrivilegedExecuteContract'
  }

  export interface Web3 extends BaseMsgPrivilegedExecuteContract {
    '@type': '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract'
  }

  export type Proto = BaseMsgPrivilegedExecuteContract
}

/**
 * @category Messages
 */
export default class MsgPrivilegedExecuteContract extends MsgBase<
  MsgPrivilegedExecuteContract.Params,
  MsgPrivilegedExecuteContract.Data,
  MsgPrivilegedExecuteContract.Proto,
  MsgPrivilegedExecuteContract.Amino,
  MsgPrivilegedExecuteContract.DirectSign
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

  public toData(): MsgPrivilegedExecuteContract.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract',
      ...proto,
    }
  }

  public toAmino(): MsgPrivilegedExecuteContract.Amino {
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto),
    }

    const messageWithProperKeys = snakeCaseKeys(message)

    return {
      type: 'exchange/MsgPrivilegedExecuteContract',
      ...messageWithProperKeys,
    } as unknown as MsgPrivilegedExecuteContract.Amino
  }

  public toWeb3(): MsgPrivilegedExecuteContract.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract',
      ...rest,
    } as unknown as MsgPrivilegedExecuteContract.Web3
  }

  public toDirectSign(): MsgPrivilegedExecuteContract.DirectSign {
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
