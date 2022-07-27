import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgExecuteContract as BaseMsgExecuteContract } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
import { toUtf8 } from '../../../utils'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgExecuteContract {
  export interface Params {
    amount?: {
      denom: string
      amount: string
    }
    sender: string
    contractAddress: string
    msg: Object
  }

  export interface DirectSign {
    type: '/cosmwasm.wasm.v1.MsgExecuteContract'
    message: BaseMsgExecuteContract
  }

  export interface Data extends BaseMsgExecuteContract.AsObject {
    '@type': '/cosmwasm.wasm.v1.MsgExecuteContract'
  }

  export interface Web3 extends BaseMsgExecuteContract.AsObject {
    '@type': '/cosmwasm.wasm.v1.MsgExecuteContract'
  }

  export type Proto = BaseMsgExecuteContract
}

export default class MsgExecuteContract extends MsgBase<
  MsgExecuteContract.Params,
  MsgExecuteContract.Data,
  MsgExecuteContract.Proto,
  MsgExecuteContract.Web3,
  MsgExecuteContract.DirectSign
> {
  static fromJSON(params: MsgExecuteContract.Params): MsgExecuteContract {
    return new MsgExecuteContract(params)
  }

  toProto(): MsgExecuteContract.Proto {
    const { params } = this

    console.log(params)

    const message = new BaseMsgExecuteContract()
    message.setMsg(toUtf8(JSON.stringify(params.msg)))
    message.setSender(params.sender)
    message.setContract(params.contractAddress)

    if (params.amount) {
      const funds = new Coin()

      funds.setAmount(params.amount.amount)
      funds.setDenom(params.amount.denom)

      message.setFundsList([funds])
    }

    return message
  }

  toData(): MsgExecuteContract.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgExecuteContract.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgExecuteContract.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgExecuteContract',
      message: proto,
    }
  }
}
