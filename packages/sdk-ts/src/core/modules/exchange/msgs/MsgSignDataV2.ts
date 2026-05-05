import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toUtf8, getEthereumAddress } from '../../../../utils/index.js'
import {
  hexToUint8Array,
  uint8ArrayToHex,
  stringToUint8Array,
} from '../../../../utils/encoding.js'

export declare namespace MsgSignDataV2 {
  export interface Params {
    sender: string
    data: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgSignData
}

/**
 * @category Messages
 */
export default class MsgSignDataV2 extends MsgBase<
  MsgSignDataV2.Params,
  MsgSignDataV2.Proto
> {
  static fromJSON(params: MsgSignDataV2.Params): MsgSignDataV2 {
    return new MsgSignDataV2(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV2TxPb.MsgSignData.create({
      signer: hexToUint8Array(getEthereumAddress(params.sender)),
      data: stringToUint8Array(toUtf8(params.data)),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgSignData',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      signer: uint8ArrayToHex(proto.signer),
      data: toUtf8(proto.data),
    }

    return {
      type: 'sign/MsgSignData',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgSignData',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgSignData',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgSignData.toBinary(this.toProto())
  }
}
