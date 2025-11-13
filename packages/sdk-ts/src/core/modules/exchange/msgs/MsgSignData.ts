import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import { toUtf8, getEthereumAddress } from '../../../../utils/index.js'
import {
  hexToUint8Array,
  uint8ArrayToHex,
  stringToUint8Array,
} from '../../../../utils/encoding.js'

export declare namespace MsgSignData {
  export interface Params {
    sender: string
    data: string
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgSignData
}

/**
 * @category Messages
 */
export default class MsgSignData extends MsgBase<
  MsgSignData.Params,
  MsgSignData.Proto
> {
  static fromJSON(params: MsgSignData.Params): MsgSignData {
    return new MsgSignData(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV1Beta1TxPb.MsgSignData.create({
      signer: hexToUint8Array(getEthereumAddress(params.sender)),
      data: stringToUint8Array(toUtf8(params.data)),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgSignData',
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
      '@type': '/injective.exchange.v1beta1.MsgSignData',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgSignData',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgSignData.toBinary(this.toProto())
  }
}
