import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmwasmWasmV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import { fromUtf8 } from '../../../../utils/utf8.js'
import type { ExecArgs } from '../exec-args.js'

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

  export type Proto = CosmwasmWasmV1TxPb.MsgExecuteContract

  export type Object = Omit<CosmwasmWasmV1TxPb.MsgExecuteContract, 'msg'> & {
    msg: any
  }
}

/**
 * @category Messages
 */
export default class MsgExecuteContract extends MsgBase<
  MsgExecuteContract.Params,
  MsgExecuteContract.Proto,
  MsgExecuteContract.Object
> {
  static fromJSON(params: MsgExecuteContract.Params): MsgExecuteContract {
    return new MsgExecuteContract(params)
  }

  public toProto() {
    const { params } = this
    const msg = this.getMsgObject()

    const funds = params.funds
      ? (Array.isArray(params.funds) ? params.funds : [params.funds]).map(
          (coin) =>
            CosmosBaseV1Beta1CoinPb.Coin.create({
              denom: coin.denom,
              amount: coin.amount,
            }),
        )
      : []

    const message = CosmwasmWasmV1TxPb.MsgExecuteContract.create({
      sender: params.sender,
      contract: params.contractAddress,
      msg: fromUtf8(JSON.stringify(msg)),
      funds: funds,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const msg = this.getMsgObject()

    const message = {
      sender: proto.sender,
      contract: proto.contract,
      msg: msg,
      funds: proto.funds,
    }

    return {
      type: 'wasm/MsgExecuteContract',
      value: message as unknown as MsgExecuteContract.Object,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...value,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgExecuteContract. Please use EIP712_v2',
      ),
    )
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgExecuteContract',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmwasmWasmV1TxPb.MsgExecuteContract.toBinary(this.toProto())
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
