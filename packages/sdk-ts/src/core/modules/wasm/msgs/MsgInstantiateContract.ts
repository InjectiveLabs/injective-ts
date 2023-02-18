import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgInstantiateContract as BaseMsgInstantiateContract } from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/tx'
import { fromUtf8 } from '../../../../utils'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgInstantiateContract {
  export interface Params {
    sender: string
    admin: string
    codeId: number
    label: string
    msg: Object
    amount?: {
      denom: string
      amount: string
    }
  }

  export type Proto = BaseMsgInstantiateContract
}

/**
 * @category Messages
 */
export default class MsgInstantiateContract extends MsgBase<
  MsgInstantiateContract.Params,
  MsgInstantiateContract.Proto
> {
  static fromJSON(
    params: MsgInstantiateContract.Params,
  ): MsgInstantiateContract {
    return new MsgInstantiateContract(params)
  }

  public toProto() {
    const { params } = this

    const message = BaseMsgInstantiateContract.create()

    message.msg = fromUtf8(JSON.stringify(params.msg))
    message.sender = params.sender
    message.admin = params.admin
    message.codeId = params.codeId.toString()
    message.label = params.label

    if (params.amount) {
      const funds = Coin.create()

      funds.amount = params.amount.amount
      funds.denom = params.amount.denom

      message.funds = [funds]
    }

    return BaseMsgInstantiateContract.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'wasm/MsgInstantiateContract',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgInstantiateContract',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgInstantiateContract.encode(this.toProto()).finish()
  }
}
