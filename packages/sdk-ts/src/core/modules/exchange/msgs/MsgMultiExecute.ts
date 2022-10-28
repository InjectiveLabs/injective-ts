import { MsgMultiExecute as BaseMsgMultiExecute } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../msgs'
import { Any } from 'google-protobuf/google/protobuf/any_pb'

export declare namespace MsgMultiExecute {
  export interface Params {
    msgs: Msgs[]
    injectiveAddress: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgMultiExecute'
    message: BaseMsgMultiExecute
  }

  export interface Data extends BaseMsgMultiExecute.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgMultiExecute'
  }

  export interface Amino extends BaseMsgMultiExecute.AsObject {
    type: 'exchange/MsgMultiExecute'
  }

  export interface Web3 extends BaseMsgMultiExecute.AsObject {
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

  public toData(): MsgMultiExecute.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgMultiExecute',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgMultiExecute.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgMultiExecute',
      ...proto.toObject(),
    } as unknown as MsgMultiExecute.Amino
  }

  public toWeb3(): MsgMultiExecute.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgMultiExecute',
      ...proto.toObject(),
    } as unknown as MsgMultiExecute.Web3
  }

  public toDirectSign(): MsgMultiExecute.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgMultiExecute',
      message: proto,
    }
  }
}
