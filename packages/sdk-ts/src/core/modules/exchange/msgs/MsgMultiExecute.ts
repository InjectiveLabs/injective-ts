import { MsgMultiExecute as BaseMsgMultiExecute } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../msgs'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'

export declare namespace MsgMultiExecute {
  export interface Params {
    msgs: Msgs[]
    injectiveAddress: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgMultiExecute'
    message: BaseMsgMultiExecute
  }

  export interface Data extends BaseMsgMultiExecute {
    '@type': '/injective.exchange.v1beta1.MsgMultiExecute'
  }

  export interface Amino extends BaseMsgMultiExecute {
    type: 'exchange/MsgMultiExecute'
  }

  export interface Web3 extends BaseMsgMultiExecute {
    '@type': '/injective.exchange.v1beta1.MsgMultiExecute'
  }

  export type Proto = BaseMsgMultiExecute
}

/**
 * @category Messages
 */
export default class MsgMultiExecute extends MsgBase<
  MsgMultiExecute.Params,
  MsgMultiExecute.Data,
  MsgMultiExecute.Proto,
  MsgMultiExecute.Amino,
  MsgMultiExecute.DirectSign
> {
  static fromJSON(params: MsgMultiExecute.Params): MsgMultiExecute {
    return new MsgMultiExecute(params)
  }

  public toProto(): MsgMultiExecute.Proto {
    const { params } = this

    const messagesAny = params.msgs.map((m) => {
      const messageAny = Any.create()
      messageAny.value = m.toBinary()
      messageAny.typeUrl = m.toDirectSign().type

      return messageAny
    })

    const message = BaseMsgMultiExecute.create()
    message.sender = params.injectiveAddress
    message.msgs = messagesAny

    return BaseMsgMultiExecute.fromPartial(message)
  }

  public toData(): MsgMultiExecute.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgMultiExecute',
      ...proto,
    }
  }

  public toAmino(): MsgMultiExecute.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgMultiExecute',
      ...proto,
    } as unknown as MsgMultiExecute.Amino
  }

  public toWeb3(): MsgMultiExecute.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgMultiExecute',
      ...proto,
    } as unknown as MsgMultiExecute.Web3
  }

  public toDirectSign(): MsgMultiExecute.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgMultiExecute',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgMultiExecute.encode(this.toProto()).finish()
  }
}
