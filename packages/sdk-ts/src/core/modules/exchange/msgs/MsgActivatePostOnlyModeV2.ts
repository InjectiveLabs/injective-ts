import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import type { TypedDataField } from '../../../tx/eip712/types.js'

export declare namespace MsgActivatePostOnlyModeV2 {
  export interface Params {
    sender: string
    blocksAmount: number
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgActivatePostOnlyMode
}

/**
 * @category Messages
 */
export default class MsgActivatePostOnlyModeV2 extends MsgBase<
  MsgActivatePostOnlyModeV2.Params,
  MsgActivatePostOnlyModeV2.Proto
> {
  static fromJSON(
    params: MsgActivatePostOnlyModeV2.Params,
  ): MsgActivatePostOnlyModeV2 {
    return new MsgActivatePostOnlyModeV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgActivatePostOnlyMode.create({
      sender: params.sender,
      blocksAmount: params.blocksAmount,
    })
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgActivatePostOnlyMode',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgActivatePostOnlyMode',
      value: {
        sender: proto.sender,
        blocks_amount: proto.blocksAmount,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAmino()

    return {
      '@type': '/injective.exchange.v2.MsgActivatePostOnlyMode',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgActivatePostOnlyMode',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgActivatePostOnlyMode.toBinary(
      this.toProto(),
    )
  }

  public toEip712Types(): Map<string, TypedDataField[]> {
    const map = new Map<string, TypedDataField[]>()

    map.set('MsgValue', [
      { name: 'sender', type: 'string' },
      { name: 'blocks_amount', type: 'uint32' },
    ])

    return map
  }
}
