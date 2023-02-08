import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgExecuteContract as BaseMsgExecuteContract } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import { ExecArgs } from '../exec-args'
import { MsgBase } from '../../MsgBase'
import { fromUtf8 } from '../../../../utils/utf8'
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
    const msg = this.getMsgObject()

    message.setMsg(fromUtf8(JSON.stringify(msg)))
    message.setSender(params.sender)
    message.setContract(params.contractAddress)

    if (params.funds) {
      const fundsToArray = Array.isArray(params.funds)
        ? params.funds
        : [params.funds]

      const funds = fundsToArray.map((coin) => {
        const funds = new Coin()

        funds.setAmount(coin.amount)
        funds.setDenom(coin.denom)

        return funds
      })

      message.setFundsList(funds)
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
    const funds = params.funds && {
      funds: proto
        .getFundsList()
        .map((amount) => snakeCaseKeys(amount.toObject())),
    }

    const message = {
      ...snakeCaseKeys(proto.toObject()),
      ...funds,
      msg: this.getMsgObject(),
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
