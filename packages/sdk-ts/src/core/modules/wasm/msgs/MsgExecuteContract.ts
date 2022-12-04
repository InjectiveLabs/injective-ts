import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgExecuteContract as BaseMsgExecuteContract } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import { ExecArgs } from '../exec-args'
import { MsgBase } from '../../MsgBase'
import { toUtf8 } from '../../../../utils/utf8'

export declare namespace MsgExecuteContract {
  export interface Params {
    funds?: {
      denom: string
      amount: string
    }
    sender: string
    contractAddress: string
    msg: ExecArgs | object
  }

  export interface DirectSign {
    type: '/cosmwasm.wasm.v1.MsgExecuteContract'
    message: BaseMsgExecuteContract
  }

  export interface Data extends BaseMsgExecuteContract.AsObject {
    '@type': '/cosmwasm.wasm.v1.MsgExecuteContract'
  }

  export interface Amino extends BaseMsgExecuteContract.AsObject {
    type: 'wasm/MsgExecuteContract'
  }

  export interface Web3 extends BaseMsgExecuteContract.AsObject {
    '@type': '/cosmwasm.wasm.v1.MsgExecuteContract'
  }

  export type Proto = BaseMsgExecuteContract
}

/**
 * @category Messages
 */
export default class MsgExecuteContract extends MsgBase<
  MsgExecuteContract.Params,
  MsgExecuteContract.Data,
  MsgExecuteContract.Proto,
  MsgExecuteContract.Amino,
  MsgExecuteContract.DirectSign
> {
  static fromJSON(params: MsgExecuteContract.Params): MsgExecuteContract {
    return new MsgExecuteContract(params)
  }

  public toProto(): MsgExecuteContract.Proto {
    const { params } = this

    const message = new BaseMsgExecuteContract()

    message.setMsg(
      (params.msg as ExecArgs).toExecJSON !== undefined
        ? (params.msg as ExecArgs).toExecJSON()
        : toUtf8(JSON.stringify(params.msg)),
    )
    message.setSender(params.sender)
    message.setContract(params.contractAddress)

    if (params.funds) {
      const funds = new Coin()

      funds.setAmount(params.funds.amount)
      funds.setDenom(params.funds.denom)

      message.setFundsList([funds])
    }

    return message
  }

  public toData(): MsgExecuteContract.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgExecuteContract.Amino {
    const { params } = this
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto.toObject()),
      ...(params.funds && {
        funds: proto
          .getFundsList()
          .map((amount) => snakeCaseKeys(amount.toObject())),
      }),
    }

    // @ts-ignore
    delete message.funds_list

    return {
      type: 'wasm/MsgExecuteContract',
      ...message,
    } as unknown as MsgExecuteContract.Amino
  }

  public toWeb3(): MsgExecuteContract.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...rest,
    } as unknown as MsgExecuteContract.Web3
  }

  public toDirectSign(): MsgExecuteContract.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgExecuteContract',
      message: proto,
    }
  }
}
