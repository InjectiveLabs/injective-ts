import { MsgMultiExecute as BaseMsgMultiExecute } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../msgs'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgMultiExecute {
  export interface Params {
    msgs: Msgs[]
    injectiveAddress: string
  }

  export type Proto = BaseMsgMultiExecute

  export type Object = BaseMsgMultiExecute.AsObject
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
      const messageAny = new Any()
      messageAny.setValue(m.toProto().serializeBinary())
      messageAny.setTypeUrl(m.toDirectSign().type)

      return messageAny
    })

    const message = new BaseMsgMultiExecute()
    message.setSender(params.injectiveAddress)
    message.setMsgsList(messagesAny)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgMultiExecute',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'exchange/MsgMultiExecute',
      value: message as unknown as SnakeCaseKeys<MsgMultiExecute.Object>,
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
}
