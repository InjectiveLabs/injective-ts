import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgAuthorizeStakeGrants {
  export interface Params {
    grantee: string
    injectiveAddress: string
    amount: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgAuthorizeStakeGrants
}

/**
 * @category Messages
 */
export default class MsgAuthorizeStakeGrants extends MsgBase<
  MsgAuthorizeStakeGrants.Params,
  MsgAuthorizeStakeGrants.Proto
> {
  static fromJSON(
    params: MsgAuthorizeStakeGrants.Params,
  ): MsgAuthorizeStakeGrants {
    return new MsgAuthorizeStakeGrants(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV1Beta1Tx.MsgAuthorizeStakeGrants.create()

    message.sender = params.injectiveAddress
    message.grants = [
      {
        grantee: params.grantee,
        amount: params.amount,
      },
    ]

    return InjectiveExchangeV1Beta1Tx.MsgAuthorizeStakeGrants.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgAuthorizeStakeGrants',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
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
      '@type': '/injective.exchange.v1beta1.MsgAuthorizeStakeGrants',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgAuthorizeStakeGrants',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgAuthorizeStakeGrants.encode(
      this.toProto(),
    ).finish()
  }
}
