import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgExecuteContract as BaseMsgExecuteContract } from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/tx'
import snakeCaseKeys from 'snakecase-keys'
import { ExecArgs } from '../exec-args'
import { MsgBase } from '../../MsgBase'
import { toUtf8 } from '../../../../utils/utf8'
import { GeneralException } from '@injectivelabs/exceptions'

export declare namespace MsgExecuteContract {
  export interface Params {
    /* Keep in mind that funds have to be lexicographically sorted by denom */
    funds?:
      | {
          denom: string
          amount: string
        }
      | {
          denom: string
          amount: string
        }[]
    sender: string
    contractAddress: string
    /* Used to provide type safety for execution messages */
    execArgs?: ExecArgs
    /* Pass any arbitrary message object to execute */
    exec?: {
      msg: object
      action: string
    }
    /**
     * Same as exec but you don't pass
     * the action as a separate property
     * but as a whole object
     */
    msg?: object
  }

  export interface DirectSign {
    type: '/cosmwasm.wasm.v1.MsgExecuteContract'
    message: BaseMsgExecuteContract
  }

  export interface Data extends BaseMsgExecuteContract {
    '@type': '/cosmwasm.wasm.v1.MsgExecuteContract'
  }

  export interface Amino extends BaseMsgExecuteContract {
    type: 'wasm/MsgExecuteContract'
  }

  export interface Web3 extends BaseMsgExecuteContract {
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

    const message = BaseMsgExecuteContract.create()
    const msg = this.getMsgObject()

    message.msg = toUtf8(JSON.stringify(msg))
    message.sender = params.sender
    message.contract = params.contractAddress

    if (params.funds) {
      const fundsToArray = Array.isArray(params.funds)
        ? params.funds
        : [params.funds]

      const funds = fundsToArray.map((coin) => {
        const funds = Coin.create()

        funds.amount = coin.amount
        funds.denom = coin.denom

        return funds
      })

      message.funds = funds
    }

    return BaseMsgExecuteContract.fromPartial(message)
  }

  public toData(): MsgExecuteContract.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...proto,
    }
  }

  public toAmino(): MsgExecuteContract.Amino {
    const proto = this.toProto()

    const message = {
      ...snakeCaseKeys(proto),
      msg: this.getMsgObject(),
    }

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

  public toBinary(): Uint8Array {
    return BaseMsgExecuteContract.encode(this.toProto()).finish()
  }

  private getMsgObject() {
    const { params } = this

    if ((params.exec || params.msg) && params.execArgs) {
      throw new GeneralException(
        new Error('Please provide only one exec|msg argument'),
      )
    }

    if (params.execArgs) {
      return params.execArgs.toExecData()
    }

    if (params.exec) {
      return {
        [params.exec.action]: params.exec.msg,
      }
    }

    if (params.msg) {
      return params.msg
    }

    throw new GeneralException(
      new Error('Please provide at least one exec argument'),
    )
  }
}
