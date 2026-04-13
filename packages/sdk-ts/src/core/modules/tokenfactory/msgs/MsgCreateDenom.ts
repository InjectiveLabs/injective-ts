import * as InjectiveTokenFactoryV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCreateDenom {
  export interface Params {
    sender: string
    subdenom: string
    decimals?: number
    name?: string
    symbol?: string
    allowAdminBurn?: boolean
  }

  export type Proto = InjectiveTokenFactoryV1Beta1TxPb.MsgCreateDenom
}

/**
 * @category Messages
 */
export default class MsgCreateDenom extends MsgBase<
  MsgCreateDenom.Params,
  MsgCreateDenom.Proto
> {
  static fromJSON(params: MsgCreateDenom.Params): MsgCreateDenom {
    return new MsgCreateDenom(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveTokenFactoryV1Beta1TxPb.MsgCreateDenom.create({
      sender: params.sender,
      subdenom: params.subdenom,
      name: params.name || '',
      symbol: params.symbol || '',
      decimals: params.decimals || 0,
      ...(params.allowAdminBurn !== undefined && {
        allowAdminBurn: params.allowAdminBurn,
      }),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgCreateDenom',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      subdenom: proto.subdenom,
      name: proto.name,
      symbol: proto.symbol,
      decimals: proto.decimals,
      ...(proto.allowAdminBurn !== undefined && {
        allow_admin_burn: proto.allowAdminBurn,
      }),
    }

    return {
      type: 'injective/tokenfactory/create-denom',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgCreateDenom',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgCreateDenom',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1TxPb.MsgCreateDenom.toBinary(
      this.toProto(),
    )
  }
}
