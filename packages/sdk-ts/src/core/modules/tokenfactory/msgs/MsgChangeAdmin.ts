import * as InjectiveTokenFactoryV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgChangeAdmin {
  export interface Params {
    sender: string
    denom: string
    newAdmin: string
  }

  export type Proto = InjectiveTokenFactoryV1Beta1TxPb.MsgChangeAdmin
}

/**
 * @category Messages
 */
export default class MsgChangeAdmin extends MsgBase<
  MsgChangeAdmin.Params,
  MsgChangeAdmin.Proto
> {
  static fromJSON(params: MsgChangeAdmin.Params): MsgChangeAdmin {
    return new MsgChangeAdmin(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveTokenFactoryV1Beta1TxPb.MsgChangeAdmin.create({
      sender: params.sender,
      denom: params.denom,
      newAdmin: params.newAdmin,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgChangeAdmin',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      denom: proto.denom,
      new_admin: proto.newAdmin,
    }

    return {
      type: 'injective/tokenfactory/change-admin',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgChangeAdmin',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgChangeAdmin',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1TxPb.MsgChangeAdmin.toBinary(
      this.toProto(),
    )
  }
}
