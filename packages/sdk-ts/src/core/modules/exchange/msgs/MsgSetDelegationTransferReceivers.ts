import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgSetDelegationTransferReceivers {
  export interface Params {
    sender: string
    receivers: string[]
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgSetDelegationTransferReceivers
}

/**
 * @category Messages
 */
export default class MsgSetDelegationTransferReceivers extends MsgBase<
  MsgSetDelegationTransferReceivers.Params,
  MsgSetDelegationTransferReceivers.Proto
> {
  static fromJSON(
    params: MsgSetDelegationTransferReceivers.Params,
  ): MsgSetDelegationTransferReceivers {
    return new MsgSetDelegationTransferReceivers(params)
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
