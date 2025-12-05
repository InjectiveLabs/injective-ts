import snakecaseKeys from 'snakecase-keys'
import * as CosmosFeegrantV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/feegrant/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

type SnakeCaseKeys<T extends Record<string, any> | readonly any[]> =
  snakecaseKeys.SnakeCaseKeys<T>

export declare namespace MsgRevokeAllowance {
  export interface Params {
    granter: string
    grantee: string
  }

  export type Proto = CosmosFeegrantV1Beta1TxPb.MsgRevokeAllowance
}

/**
 * @category Messages
 */
export default class MsgRevokeAllowance extends MsgBase<
  MsgRevokeAllowance.Params,
  MsgRevokeAllowance.Proto
> {
  static fromJSON(params: MsgRevokeAllowance.Params): MsgRevokeAllowance {
    return new MsgRevokeAllowance(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmosFeegrantV1Beta1TxPb.MsgRevokeAllowance.create({
      granter: params.granter,
      grantee: params.grantee,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto as unknown as Record<string, unknown>),
    }

    return {
      type: 'cosmos-sdk/MsgRevokeAllowance',
      value: message as unknown as SnakeCaseKeys<MsgRevokeAllowance>,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosFeegrantV1Beta1TxPb.MsgRevokeAllowance.toBinary(this.toProto())
  }
}
