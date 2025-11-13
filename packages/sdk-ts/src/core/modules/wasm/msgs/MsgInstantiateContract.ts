import snakecaseKeys from 'snakecase-keys'
import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmwasmWasmV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import { fromUtf8 } from '../../../../utils/encoding.js'

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

  export type Proto = CosmwasmWasmV1TxPb.MsgInstantiateContract
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

    const funds = params.amount
      ? [
          CosmosBaseV1Beta1CoinPb.Coin.create({
            denom: params.amount.denom,
            amount: params.amount.amount,
          }),
        ]
      : []

    const message = CosmwasmWasmV1TxPb.MsgInstantiateContract.create({
      sender: params.sender,
      admin: params.admin,
      codeId: BigInt(params.codeId),
      label: params.label,
      msg: fromUtf8(JSON.stringify(params.msg)),
      funds: funds,
    })

    return message
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
    return CosmwasmWasmV1TxPb.MsgInstantiateContract.toBinary(this.toProto())
  }
}
