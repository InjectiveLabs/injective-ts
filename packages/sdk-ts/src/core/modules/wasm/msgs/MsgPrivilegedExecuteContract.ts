import { MsgPrivilegedExecuteContract as BaseMsgPrivilegedExecuteContract } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { ExecArgs } from '../exec-args'
import { MsgBase } from '../../MsgBase'
import snakeCaseKeys from 'snakecase-keys'

export declare namespace MsgPrivilegedExecuteContract {
  export interface Params {
    sender: string
    funds: string
    contractAddress: string
    data: ExecArgs
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract'
    message: BaseMsgPrivilegedExecuteContract
  }

  export interface Data extends BaseMsgPrivilegedExecuteContract.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract'
  }

  export interface Amino extends BaseMsgPrivilegedExecuteContract.AsObject {
    type: 'exchange/MsgPrivilegedExecuteContract'
  }

  export interface Web3 extends BaseMsgPrivilegedExecuteContract.AsObject {
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

    const message = new BaseMsgPrivilegedExecuteContract()

    message.setSender(params.sender)
    message.setFunds(params.funds)
    message.setContractAddress(params.contractAddress)
    message.setData(params.data.toExecJSON())

    return message
  }

  public toData(): MsgPrivilegedExecuteContract.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgPrivilegedExecuteContract',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgPrivilegedExecuteContract.Amino {
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto.toObject()),
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
}
