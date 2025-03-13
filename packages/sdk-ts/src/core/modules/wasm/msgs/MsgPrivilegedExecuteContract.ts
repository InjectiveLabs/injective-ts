import { ExecPrivilegedArgs } from '../exec-args.js'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgPrivilegedExecuteContract {
  export interface Params {
    sender: string
    funds: string
    contractAddress: string
    data: ExecPrivilegedArgs
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgPrivilegedExecuteContract
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
      InjectiveExchangeV1Beta1Tx.MsgPrivilegedExecuteContract.create()

    message.sender = params.sender
    message.funds = params.funds
    message.contractAddress = params.contractAddress
    message.data = params.data.toExecJSON()

    return InjectiveExchangeV1Beta1Tx.MsgPrivilegedExecuteContract.fromPartial(
      message,
    )
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
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgPrivilegedExecuteContract>,
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
    return InjectiveExchangeV1Beta1Tx.MsgPrivilegedExecuteContract.encode(
      this.toProto(),
    ).finish()
  }
}
