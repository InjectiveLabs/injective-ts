import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgReclaimLockedFunds {
  export interface Params {
    sender: string
    lockedAccountPubKey: string
    signature: Uint8Array
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgReclaimLockedFunds
}

/**
 * @category Messages
 */
export default class MsgReclaimLockedFunds extends MsgBase<
  MsgReclaimLockedFunds.Params,
  MsgReclaimLockedFunds.Proto
> {
  static fromJSON(params: MsgReclaimLockedFunds.Params): MsgReclaimLockedFunds {
    return new MsgReclaimLockedFunds(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV1Beta1Tx.MsgReclaimLockedFunds.create()

    message.sender = params.sender
    message.lockedAccountPubKey = Buffer.from(
      params.lockedAccountPubKey,
      'base64',
    )
    message.signature = params.signature

    return InjectiveExchangeV1Beta1Tx.MsgReclaimLockedFunds.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgReclaimLockedFunds',
      value: {
        sender: message.sender,
        locked_account_pub_key: message.locked_account_pub_key,
        signature: message.signature,
      },
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgReclaimLockedFunds',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgReclaimLockedFunds',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgReclaimLockedFunds.encode(
      this.toProto(),
    ).finish()
  }
}
