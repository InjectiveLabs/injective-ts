import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import { getEthereumAddress, toUtf8 } from '../../../../utils'

export declare namespace MsgSignData {
  export interface Params {
    sender: string
    data: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgSignData
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

    const message = InjectiveExchangeV1Beta1Tx.MsgSignData.create()

    message.Signer = Buffer.from(getEthereumAddress(params.sender), 'hex')
    message.Data = Buffer.from(toUtf8(params.data), 'utf-8')

    return InjectiveExchangeV1Beta1Tx.MsgSignData.fromPartial(message)
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
      ...snakecaseKeys(proto),
    }

    return {
      type: 'sign/MsgSignData',
      value: message,
    }
  }

  public toWeb3() {
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
    return InjectiveExchangeV1Beta1Tx.MsgSignData.encode(
      this.toProto(),
    ).finish()
  }
}
