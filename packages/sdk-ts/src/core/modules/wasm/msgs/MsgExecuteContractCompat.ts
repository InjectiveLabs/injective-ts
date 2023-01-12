import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgExecuteContractCompat as BaseMsgExecuteContractCompat } from '@injectivelabs/chain-api/injective/wasmx/v1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import { ExecArgs } from '../exec-args'
import { MsgBase } from '../../MsgBase'
import { GeneralException } from '@injectivelabs/exceptions'

export declare namespace MsgExecuteContractCompat {
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
    type: '/injective.wasmx.v1.MsgExecuteContractCompat'
    message: BaseMsgExecuteContractCompat
  }

  export interface Data extends BaseMsgExecuteContractCompat.AsObject {
    '@type': '/injective.wasmx.v1.MsgExecuteContractCompat'
  }

  export interface Amino extends BaseMsgExecuteContractCompat.AsObject {
    type: 'wasmx/MsgExecuteContractCompat'
  }

  export interface Web3 extends BaseMsgExecuteContractCompat.AsObject {
    '@type': '/injective.wasmx.v1.MsgExecuteContractCompat'
  }

  export type Proto = BaseMsgExecuteContractCompat
}

/**
 * @category Messages
 */
export default class MsgExecuteContractCompat extends MsgBase<
  MsgExecuteContractCompat.Params,
  MsgExecuteContractCompat.Data,
  MsgExecuteContractCompat.Proto,
  MsgExecuteContractCompat.Amino,
  MsgExecuteContractCompat.DirectSign
> {
  static fromJSON(
    params: MsgExecuteContractCompat.Params,
  ): MsgExecuteContractCompat {
    return new MsgExecuteContractCompat(params)
  }

  public toProto(): MsgExecuteContractCompat.Proto {
    const { params } = this

    const message = new BaseMsgExecuteContractCompat()
    const msg = this.getMsgObject()

    message.setMsg(JSON.stringify(msg))
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

  public toData(): MsgExecuteContractCompat.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.wasmx.v1.MsgExecuteContractCompat',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgExecuteContractCompat.Amino {
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
      msg: JSON.stringify(this.getMsgObject()),
    }

    // @ts-ignore
    delete message.funds_list

    return {
      type: 'wasmx/MsgExecuteContractCompat',
      ...message,
    } as unknown as MsgExecuteContractCompat.Amino
  }

  public toWeb3(): MsgExecuteContractCompat.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.wasmx.v1.MsgExecuteContractCompat',
      ...rest,
    } as unknown as MsgExecuteContractCompat.Web3
  }

  public toDirectSign(): MsgExecuteContractCompat.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.wasmx.v1.MsgExecuteContractCompat',
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
