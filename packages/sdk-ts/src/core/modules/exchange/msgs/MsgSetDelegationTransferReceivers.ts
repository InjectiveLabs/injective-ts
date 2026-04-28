import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgSetDelegationTransferReceivers {
  export interface Params {
    sender: string
    receivers: string[]
  }

  // Note: MsgSetDelegationTransferReceivers doesn't exist in v2 proto package yet
  export type Proto = {
    sender: string
    receivers: string[]
  }
}

/**
 * @deprecated no longer supported on chain
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

    // Note: MsgSetDelegationTransferReceivers doesn't exist in v2 proto package yet
    // Returning a plain object for now
    const message = {
      sender: params.sender,
      receivers: params.receivers,
    }

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
    // Note: MsgSetDelegationTransferReceivers doesn't exist in v2 proto package yet
    // Returning empty bytes for now
    return new Uint8Array(0)
  }
}
