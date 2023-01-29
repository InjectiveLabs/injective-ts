import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgInstantiateContract as BaseMsgInstantiateContract } from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '../../../../utils'
import { MsgBase } from '../../MsgBase'
import snakeCaseKeys from 'snakecase-keys'

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

  export interface DirectSign {
    type: '/cosmwasm.wasm.v1.MsgInstantiateContract'
    message: BaseMsgInstantiateContract
  }

  export interface Data extends BaseMsgInstantiateContract {
    '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract'
  }

  export interface Amino extends BaseMsgInstantiateContract {
    type: 'wasm/MsgInstantiateContract'
  }

  export interface Web3 extends BaseMsgInstantiateContract {
    '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract'
  }

  export type Proto = BaseMsgInstantiateContract
}

/**
 * @category Messages
 */
export default class MsgInstantiateContract extends MsgBase<
  MsgInstantiateContract.Params,
  MsgInstantiateContract.Data,
  MsgInstantiateContract.Proto,
  MsgInstantiateContract.Amino,
  MsgInstantiateContract.DirectSign
> {
  static fromJSON(
    params: MsgInstantiateContract.Params,
  ): MsgInstantiateContract {
    return new MsgInstantiateContract(params)
  }

  public toProto(): MsgInstantiateContract.Proto {
    const { params } = this

    const message = BaseMsgInstantiateContract.create()

    message.msg = toUtf8(JSON.stringify(params.msg))
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

  public toData(): MsgInstantiateContract.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...proto,
    }
  }

  public toAmino(): MsgInstantiateContract.Amino {
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto),
    }

    const messageWithProperKeys = snakeCaseKeys(message)

    return {
      type: 'wasm/MsgInstantiateContract',
      ...messageWithProperKeys,
    } as unknown as MsgInstantiateContract.Amino
  }

  public toWeb3(): MsgInstantiateContract.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...rest,
    } as unknown as MsgInstantiateContract.Web3
  }

  public toDirectSign(): MsgInstantiateContract.DirectSign {
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
