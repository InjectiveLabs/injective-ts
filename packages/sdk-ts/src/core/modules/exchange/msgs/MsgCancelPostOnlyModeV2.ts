import snakecaseKeys from 'snakecase-keys'
import { InjectiveExchangeV2Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCancelPostOnlyModeV2 {
  export interface Params {
    sender: string
  }

  export type Proto = InjectiveExchangeV2Tx.MsgCancelPostOnlyMode
}

const createMessage = (params: MsgCancelPostOnlyModeV2.Params) => {
  const message = InjectiveExchangeV2Tx.MsgCancelPostOnlyMode.create()

  message.sender = params.sender

  return InjectiveExchangeV2Tx.MsgCancelPostOnlyMode.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgCancelPostOnlyModeV2 extends MsgBase<
  MsgCancelPostOnlyModeV2.Params,
  MsgCancelPostOnlyModeV2.Proto
> {
  static fromJSON(
    params: MsgCancelPostOnlyModeV2.Params,
  ): MsgCancelPostOnlyModeV2 {
    return new MsgCancelPostOnlyModeV2(params)
  }

  public toProto() {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
    } as MsgCancelPostOnlyModeV2.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgCancelPostOnlyMode',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const msg = createMessage(params)
    const message = {
      ...snakecaseKeys(msg),
    }

    return {
      type: 'exchange/MsgCancelPostOnlyMode',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgCancelPostOnlyMode',
      ...value,
    }
  }

  public toEip712() {
    const amino = this.toAmino()
    const { type, value } = amino

    const messageAdjusted = {
      ...value,
    }

    return {
      type,
      value: messageAdjusted,
    }
  }

  public toEip712V2() {
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgCancelPostOnlyMode',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2Tx.MsgCancelPostOnlyMode.encode(
      this.toProto(),
    ).finish()
  }
}
