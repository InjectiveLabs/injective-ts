import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import {
  base64ToUint8Array,
  uint8ArrayToBase64,
} from '../../../../utils/encoding.js'

export declare namespace MsgReclaimLockedFundsV2 {
  export interface Params {
    sender: string
    lockedAccountPubKey: string
    signature: Uint8Array
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgReclaimLockedFunds
}

/**
 * @category Messages
 */
export default class MsgReclaimLockedFundsV2 extends MsgBase<
  MsgReclaimLockedFundsV2.Params,
  MsgReclaimLockedFundsV2.Proto
> {
  static fromJSON(
    params: MsgReclaimLockedFundsV2.Params,
  ): MsgReclaimLockedFundsV2 {
    return new MsgReclaimLockedFundsV2(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV2TxPb.MsgReclaimLockedFunds.create({
      sender: params.sender,
      lockedAccountPubKey: base64ToUint8Array(params.lockedAccountPubKey),
      signature: params.signature,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgReclaimLockedFunds',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    const message = {
      sender: proto.sender,
      lockedAccountPubKey: uint8ArrayToBase64(proto.lockedAccountPubKey),
      signature: uint8ArrayToBase64(proto.signature),
    }

    return {
      type: 'exchange/MsgReclaimLockedFunds',
      value: message,
    }
  }

  public toWeb3Gw(): never {
    throw new GeneralException(
      new Error('EIP712 is not supported for MsgReclaimLockedFunds.'),
    )
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error('EIP712 is not supported for MsgReclaimLockedFunds.'),
    )
  }

  public toEip712V2(): never {
    throw new GeneralException(
      new Error('EIP712 is not supported for MsgReclaimLockedFunds.'),
    )
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgReclaimLockedFunds',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgReclaimLockedFunds.toBinary(
      this.toProto(),
    )
  }
}
