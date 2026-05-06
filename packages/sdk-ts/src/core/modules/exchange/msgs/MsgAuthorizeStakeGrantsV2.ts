import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgAuthorizeStakeGrantsV2 {
  export interface Params {
    injectiveAddress: string
    grants: Array<{ grantee: string; amount: string }>
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgAuthorizeStakeGrants
}

/**
 * @category Messages
 */
export default class MsgAuthorizeStakeGrantsV2 extends MsgBase<
  MsgAuthorizeStakeGrantsV2.Params,
  MsgAuthorizeStakeGrantsV2.Proto
> {
  static fromJSON(
    params: MsgAuthorizeStakeGrantsV2.Params,
  ): MsgAuthorizeStakeGrantsV2 {
    return new MsgAuthorizeStakeGrantsV2(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV2TxPb.MsgAuthorizeStakeGrants.create({
      sender: params.injectiveAddress,
      grants: params.grants.map(({ grantee, amount }) => ({ grantee, amount })),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgAuthorizeStakeGrants',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      grants: proto.grants,
    }

    return {
      type: 'exchange/MsgAuthorizeStakeGrants',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgAuthorizeStakeGrants',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgAuthorizeStakeGrants',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgAuthorizeStakeGrants.toBinary(
      this.toProto(),
    )
  }
}
