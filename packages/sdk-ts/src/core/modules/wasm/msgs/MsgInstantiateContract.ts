import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgInstantiateContract as BaseMsgInstantiateContract } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
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

  export type Object = BaseMsgInstantiateContract.AsObject
}

/**
 * @category Messages
 */
export default class MsgInstantiateContract extends MsgBase<
  MsgInstantiateContract.Params,
  MsgInstantiateContract.Proto,
  MsgInstantiateContract.Object
> {
  static fromJSON(
    params: MsgInstantiateContract.Params,
  ): MsgInstantiateContract {
    return new MsgInstantiateContract(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgInstantiateContract()

    message.setMsg(fromUtf8(JSON.stringify(params.msg)))
    message.setSender(params.sender)
    message.setAdmin(params.admin)
    message.setCodeId(params.codeId)
    message.setLabel(params.label)

    if (params.amount) {
      const funds = new Coin()

      funds.setAmount(params.amount.amount)
      funds.setDenom(params.amount.denom)

      message.setFundsList([funds])
    }

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    // @ts-ignore
    delete message.funds_list

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
}
