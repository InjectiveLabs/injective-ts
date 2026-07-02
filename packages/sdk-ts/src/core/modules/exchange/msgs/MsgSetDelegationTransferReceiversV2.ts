import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgSetDelegationTransferReceiversV2 {
  export interface Params {
    sender: string
    receivers: string[]
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgSetDelegationTransferReceivers
}

/**
 * @deprecated Delegation transfer receiver support was removed. This message is kept for backward compatibility.
 * @category Messages
 */
export default class MsgSetDelegationTransferReceiversV2 extends MsgBase<
  MsgSetDelegationTransferReceiversV2.Params,
  MsgSetDelegationTransferReceiversV2.Proto
> {
  static fromJSON(
    params: MsgSetDelegationTransferReceiversV2.Params,
  ): MsgSetDelegationTransferReceiversV2 {
    return new MsgSetDelegationTransferReceiversV2(params)
  }

  public toProto() {
    const { params } = this

    const message =
      InjectiveExchangeV2TxPb.MsgSetDelegationTransferReceivers.create({
        sender: params.sender,
        receivers: params.receivers,
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgSetDelegationTransferReceivers',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      receivers: proto.receivers,
    }

    return {
      type: 'exchange/MsgSetDelegationTransferReceivers',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgSetDelegationTransferReceivers',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgSetDelegationTransferReceivers',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgSetDelegationTransferReceivers.toBinary(
      this.toProto(),
    )
  }
}
