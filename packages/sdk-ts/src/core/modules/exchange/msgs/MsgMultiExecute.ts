import { MsgMultiExecute as BaseMsgMultiExecute } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../msgs'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgMultiExecute {
  export interface Params {
    msgs: Msgs[]
    injectiveAddress: string
  }

  export type Proto = BaseMsgMultiExecute

  export type Object = Omit<BaseMsgMultiExecute, 'msgs'> & { msgs: any }
}

/**
 * @category Messages
 */
export default class MsgMultiExecute extends MsgBase<
  MsgMultiExecute.Params,
  MsgMultiExecute.Proto,
  MsgMultiExecute.Object
> {
  static fromJSON(params: MsgMultiExecute.Params): MsgMultiExecute {
    return new MsgMultiExecute(params)
  }

  public toProto() {
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

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgMultiExecute',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgMultiExecute',
      value: message as unknown as MsgMultiExecute.Object,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgMultiExecute',
      ...value,
    }
  }

  public toDirectSign() {
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
