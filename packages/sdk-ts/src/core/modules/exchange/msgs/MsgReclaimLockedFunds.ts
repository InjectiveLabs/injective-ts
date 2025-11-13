import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import {
  base64ToUint8Array,
  uint8ArrayToBase64,
} from '../../../../utils/encoding.js'

export declare namespace MsgReclaimLockedFunds {
  export interface Params {
    sender: string
    lockedAccountPubKey: string
    signature: Uint8Array
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgReclaimLockedFunds
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

    const message = InjectiveExchangeV1Beta1TxPb.MsgReclaimLockedFunds.create({
      sender: params.sender,
      lockedAccountPubKey: base64ToUint8Array(params.lockedAccountPubKey),
      signature: params.signature,
    })

    return message
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
      type: '/injective.exchange.v1beta1.MsgReclaimLockedFunds',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgReclaimLockedFunds.toBinary(
      this.toProto(),
    )
  }
}
