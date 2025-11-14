import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgRewardsOptOut {
  export interface Params {
    sender: string
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgRewardsOptOut
}

/**
 * @category Messages
 */
export default class MsgRewardsOptOut extends MsgBase<
  MsgRewardsOptOut.Params,
  MsgRewardsOptOut.Proto
> {
  static fromJSON(params: MsgRewardsOptOut.Params): MsgRewardsOptOut {
    return new MsgRewardsOptOut(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV1Beta1TxPb.MsgRewardsOptOut.create({
      sender: params.sender,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgRewardsOptOut',
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
      '@type': '/injective.exchange.v1beta1.MsgRewardsOptOut',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgRewardsOptOut',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgRewardsOptOut.toBinary(
      this.toProto(),
    )
  }
}
