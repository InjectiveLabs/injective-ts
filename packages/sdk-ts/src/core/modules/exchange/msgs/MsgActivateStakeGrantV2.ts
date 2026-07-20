import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgActivateStakeGrantV2 {
  export interface Params {
    sender: string
    granter: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgActivateStakeGrant
}

/**
 * @category Messages
 */
export default class MsgActivateStakeGrantV2 extends MsgBase<
  MsgActivateStakeGrantV2.Params,
  MsgActivateStakeGrantV2.Proto
> {
  static fromJSON(
    params: MsgActivateStakeGrantV2.Params,
  ): MsgActivateStakeGrantV2 {
    return new MsgActivateStakeGrantV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgActivateStakeGrant.create({
      sender: params.sender,
      granter: params.granter,
    })
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgActivateStakeGrant',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgActivateStakeGrant',
      value: {
        sender: proto.sender,
        granter: proto.granter,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAmino()

    return {
      '@type': '/injective.exchange.v2.MsgActivateStakeGrant',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgActivateStakeGrant',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgActivateStakeGrant.toBinary(
      this.toProto(),
    )
  }
}
