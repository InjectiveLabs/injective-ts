import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgRewardsOptOut {
  export interface Params {
    sender: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgRewardsOptOut
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

    const message = InjectiveExchangeV1Beta1Tx.MsgRewardsOptOut.create()

    message.sender = params.sender

    return InjectiveExchangeV1Beta1Tx.MsgRewardsOptOut.fromPartial(message)
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
      ...snakecaseKeys(proto),
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
    return InjectiveExchangeV1Beta1Tx.MsgRewardsOptOut.encode(
      this.toProto(),
    ).finish()
  }
}
