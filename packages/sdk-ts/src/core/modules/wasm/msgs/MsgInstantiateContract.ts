import { fromUtf8 } from '../../../../utils/utf8.js'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmwasmWasmV1Tx,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'
import { GeneralException } from '@injectivelabs/exceptions'

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

  export type Proto = CosmwasmWasmV1Tx.MsgInstantiateContract
}

/**
 * @category Messages
 */
export default class MsgInstantiateContract extends MsgBase<
  MsgInstantiateContract.Params,
  MsgInstantiateContract.Proto
> {
  static fromJSON(
    params: MsgInstantiateContract.Params,
  ): MsgInstantiateContract {
    return new MsgInstantiateContract(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmwasmWasmV1Tx.MsgInstantiateContract.create()

    message.sender = params.sender
    message.admin = params.admin
    message.codeId = params.codeId.toString()
    message.label = params.label
    message.msg = fromUtf8(JSON.stringify(params.msg))

    if (params.amount) {
      const funds = CosmosBaseV1Beta1Coin.Coin.create()

      funds.denom = params.amount.denom
      funds.amount = params.amount.amount

      message.funds = [funds]
    }

    return CosmwasmWasmV1Tx.MsgInstantiateContract.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'wasm/MsgInstantiateContract',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgInstantiateContract',
      ...value,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgInstantiateContract. Please use EIP712_v2',
      ),
    )
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgInstantiateContract',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmwasmWasmV1Tx.MsgInstantiateContract.encode(
      this.toProto(),
    ).finish()
  }
}
