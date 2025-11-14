import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import type { SnakeCaseKeys } from 'snakecase-keys'
import type { ExecPrivilegedArgs } from '../exec-args.js'

export declare namespace MsgPrivilegedExecuteContract {
  export interface Params {
    sender: string
    funds: string
    contractAddress: string
    data: ExecPrivilegedArgs
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgPrivilegedExecuteContract
}

/**
 * @category Messages
 */
export default class MsgPrivilegedExecuteContract extends MsgBase<
  MsgPrivilegedExecuteContract.Params,
  MsgPrivilegedExecuteContract.Proto
> {
  static fromJSON(
    params: MsgPrivilegedExecuteContract.Params,
  ): MsgPrivilegedExecuteContract {
    return new MsgPrivilegedExecuteContract(params)
  }

  public toProto(): MsgPrivilegedExecuteContract.Proto {
    const { params } = this

    const message =
      InjectiveExchangeV1Beta1TxPb.MsgPrivilegedExecuteContract.create({
        sender: params.sender,
        funds: params.funds,
        contractAddress: params.contractAddress,
        data: params.data.toExecJSON(),
      })

    return message
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
      sender: proto.sender,
      funds: proto.funds,
      contract_address: proto.contractAddress,
      data: proto.data,
    }

    return {
      type: 'exchange/MsgPrivilegedExecuteContract',
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1TxPb.MsgPrivilegedExecuteContract>,
    }
  }

  public toWeb3Gw() {
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
    return InjectiveExchangeV1Beta1TxPb.MsgPrivilegedExecuteContract.toBinary(
      this.toProto(),
    )
  }
}
