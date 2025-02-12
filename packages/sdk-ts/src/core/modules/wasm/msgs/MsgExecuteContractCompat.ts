import snakecaseKeys from 'snakecase-keys'
import { ExecArgs } from '../exec-args.js'
import { MsgBase } from '../../MsgBase.js'
import { GeneralException } from '@injectivelabs/exceptions'
import { InjectiveWasmxV1Beta1Tx } from '@injectivelabs/core-proto-ts'

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

    /*
     * Pass any arbitrary message object to execute
     * example:
        exec: {
          action: "transfer",
          msg: {
            recipient: recipientAddress,
            amount: 100000,
          },
        },
     */
    exec?: {
      msg: Record<string, any>
      action: string
    }

    /**
     * Same as exec but you don't pass
     * the action as a separate property
     * but as a whole object
     * example:
        msg: {
          reset: {
            count: 10
          },
        },
     */
    msg?: Record<string, any>
  }

  export type Proto = InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat

  export type Object = Omit<
    InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat,
    'msg'
  > & {
    msg: string
  }
}

/**
 * @category Messages
 */
export default class MsgExecuteContractCompat extends MsgBase<
  MsgExecuteContractCompat.Params,
  MsgExecuteContractCompat.Proto,
  MsgExecuteContractCompat.Object
> {
  static fromJSON(
    params: MsgExecuteContractCompat.Params,
  ): MsgExecuteContractCompat {
    return new MsgExecuteContractCompat(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat.create()
    const msg = this.getMsgObject()

    message.sender = params.sender
    message.contract = params.contractAddress
    message.msg = JSON.stringify(msg)

    if (params.funds) {
      const fundsToArray = Array.isArray(params.funds)
        ? params.funds
        : [params.funds]

      const funds = fundsToArray.map((coin) => {
        return `${coin.amount}${coin.denom}`
      })

      message.funds = funds.join(',')
    } else {
      message.funds = '0'
    }

    return InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.wasmx.v1.MsgExecuteContractCompat',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
      msg: JSON.stringify(this.getMsgObject()),
    }

    // @ts-ignore
    delete message.funds_list

    return {
      type: 'wasmx/MsgExecuteContractCompat',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.wasmx.v1.MsgExecuteContractCompat',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.wasmx.v1.MsgExecuteContractCompat',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat.encode(
      this.toProto(),
    ).finish()
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
