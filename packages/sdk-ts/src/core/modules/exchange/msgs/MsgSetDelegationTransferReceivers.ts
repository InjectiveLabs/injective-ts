import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import { InjectiveExchangeV2Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgSetDelegationTransferReceivers {
  export interface Params {
    sender: string
    receivers: string[]
  }

  export type Proto = InjectiveExchangeV2Tx.MsgSetDelegationTransferReceivers
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
      InjectiveExchangeV2Tx.MsgSetDelegationTransferReceivers.create()

    message.sender = params.sender
    message.receivers = params.receivers

    return InjectiveExchangeV2Tx.MsgSetDelegationTransferReceivers.fromPartial(
      message,
    )
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
      ...snakecaseKeys(proto),
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
    return InjectiveExchangeV2Tx.MsgSetDelegationTransferReceivers.encode(
      this.toProto(),
    ).finish()
  }
}
