import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgInstantiateContract as BaseMsgInstantiateContract } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
import { toUtf8 } from '../../../utils'
import { InstantiateExecArgs } from '../../exec-args'
import { MsgBase } from '../../MsgBase'
import snakeCaseKeys from 'snakecase-keys'

export declare namespace MsgInstantiateContract {
  export interface Params {
    sender: string
    admin: string
    codeId: string
    label: string
    data: InstantiateExecArgs
    amount?: {
      denom: string
      amount: string
    }
  }

  export interface DirectSign {
    type: '/cosmwasm.wasm.v1.MsgInstantiateContract'
    message: BaseMsgInstantiateContract
  }

  export interface Data extends BaseMsgInstantiateContract.AsObject {
    '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract'
  }

  export interface Web3 extends BaseMsgInstantiateContract.AsObject {
    '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract'
  }

  export type Proto = BaseMsgInstantiateContract
}

export default class MsgInstantiateContract extends MsgBase<
  MsgInstantiateContract.Params,
  MsgInstantiateContract.Data,
  MsgInstantiateContract.Proto,
  MsgInstantiateContract.Web3,
  MsgInstantiateContract.DirectSign
> {
  static fromJSON(
    params: MsgInstantiateContract.Params,
  ): MsgInstantiateContract {
    return new MsgInstantiateContract(params)
  }

  toProto(): MsgInstantiateContract.Proto {
    const { params } = this

    const message = new BaseMsgInstantiateContract()

    message.setMsg(toUtf8(JSON.stringify(params.data.toJSON())))
    message.setSender(params.sender)
    message.setAdmin(params.admin)
    message.setCodeId(Number(params.codeId))
    message.setLabel(params.label)

    if (params.amount) {
      const funds = new Coin()

      funds.setAmount(params.amount.amount)
      funds.setDenom(params.amount.denom)

      message.setFundsList([funds])
    }

    return message
  }

  toData(): MsgInstantiateContract.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgInstantiateContract.Web3 {
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto.toObject()),
    }

    // @ts-ignore
    delete message.funds_list

    const messageWithProperKeys = snakeCaseKeys(message)

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...messageWithProperKeys,
    } as unknown as MsgInstantiateContract.Web3
  }

  toDirectSign(): MsgInstantiateContract.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgInstantiateContract',
      message: proto,
    }
  }
}
