import * as InjectivePeggyV1MsgsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/msgs_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgRemoveRateLimit {
  export interface Params {
    injectiveAddress: string
    tokenAddress: string
  }

  export type Proto = InjectivePeggyV1MsgsPb.MsgRemoveRateLimit
}

/**
 * @category Messages
 */
export default class MsgRemoveRateLimit extends MsgBase<
  MsgRemoveRateLimit.Params,
  MsgRemoveRateLimit.Proto
> {
  static fromJSON(params: MsgRemoveRateLimit.Params): MsgRemoveRateLimit {
    return new MsgRemoveRateLimit(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectivePeggyV1MsgsPb.MsgRemoveRateLimit.create({
      authority: params.injectiveAddress,
      tokenAddress: params.tokenAddress,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.peggy.v1.MsgRemoveRateLimit',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      authority: proto.authority,
      token_address: proto.tokenAddress,
    }

    return {
      type: 'peggy/MsgRemoveRateLimit',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.peggy.v1.MsgRemoveRateLimit',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.peggy.v1.MsgRemoveRateLimit',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePeggyV1MsgsPb.MsgRemoveRateLimit.toBinary(this.toProto())
  }
}
