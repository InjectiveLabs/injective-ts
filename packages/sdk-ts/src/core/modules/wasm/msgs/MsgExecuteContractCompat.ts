import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveWasmxV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/wasmx/v1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { safeBigIntStringify } from '../../../../utils/helpers.js'
import type { ExecArgs } from '../exec-args.js'

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

  export type Proto = InjectiveWasmxV1TxPb.MsgExecuteContractCompat

  export type Object = Omit<
    InjectiveWasmxV1TxPb.MsgExecuteContractCompat,
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
  MsgExecuteContractCompat.Proto
> {
  static fromJSON(
    params: MsgExecuteContractCompat.Params,
  ): MsgExecuteContractCompat {
    return new MsgExecuteContractCompat(params)
  }

  public toProto() {
    const { params } = this
    const msg = this.getMsgObject()

    const funds = params.funds
      ? (Array.isArray(params.funds) ? params.funds : [params.funds])
          .map((coin) => `${coin.amount}${coin.denom}`)
          .join(',')
      : '0'

    const message = InjectiveWasmxV1TxPb.MsgExecuteContractCompat.create({
      sender: params.sender,
      contract: params.contractAddress,
      msg: safeBigIntStringify(msg),
      funds: funds,
    })

    return message
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
      sender: proto.sender,
      contract: proto.contract,
      msg: safeBigIntStringify(this.getMsgObject()),
      funds: proto.funds,
    }

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
    return InjectiveWasmxV1TxPb.MsgExecuteContractCompat.toBinary(
      this.toProto(),
    )
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
