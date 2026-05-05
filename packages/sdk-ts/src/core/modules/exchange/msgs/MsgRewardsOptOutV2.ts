import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgRewardsOptOutV2 {
  export interface Params {
    sender: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgRewardsOptOut
}

/**
 * @category Messages
 */
export default class MsgRewardsOptOutV2 extends MsgBase<
  MsgRewardsOptOutV2.Params,
  MsgRewardsOptOutV2.Proto
> {
  static fromJSON(params: MsgRewardsOptOutV2.Params): MsgRewardsOptOutV2 {
    return new MsgRewardsOptOutV2(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV2TxPb.MsgRewardsOptOut.create({
      sender: params.sender,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgRewardsOptOut',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
    }

    return {
      type: 'exchange/MsgRewardsOptOut',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgRewardsOptOut',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgRewardsOptOut',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgRewardsOptOut.toBinary(this.toProto())
  }
}
