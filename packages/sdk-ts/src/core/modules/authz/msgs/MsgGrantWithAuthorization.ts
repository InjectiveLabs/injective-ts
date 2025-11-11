import snakecaseKeys from 'snakecase-keys'
import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmosAuthzV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/tx_pb.mjs'
import * as CosmosAuthzV1Beta1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/authz_pb.mjs'
import * as GoogleProtobufTimestampPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/timestamp_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import type { BaseAuthorization } from './authorizations/Base.js'

export declare namespace MsgGrantWithAuthorization {
  export interface Params {
    authorization: BaseAuthorization<unknown, unknown, unknown>
    grantee: string
    granter: string
    expiration?: number
    expiryInYears?: number
    expiryInSeconds?: number
  }

  export type Proto = CosmosAuthzV1Beta1TxPb.MsgGrant

  export type Object = Omit<CosmosAuthzV1Beta1TxPb.MsgGrant, 'msgs'> & {
    msgs: any
  }
}

/**
 * @category Messages
 */
export default class MsgGrantWithAuthorization extends MsgBase<
  MsgGrantWithAuthorization.Params,
  MsgGrantWithAuthorization.Proto
> {
  static fromJSON(
    params: MsgGrantWithAuthorization.Params,
  ): MsgGrantWithAuthorization {
    return new MsgGrantWithAuthorization(params)
  }

  public toProto() {
    const { params } = this

    const timestamp = this.getTimestamp()

    const grant = CosmosAuthzV1Beta1AuthzPb.Grant.create({
      authorization: params.authorization.toAny(),
      expiration: timestamp,
    })

    const message = CosmosAuthzV1Beta1TxPb.MsgGrant.create({
      granter: params.granter,
      grantee: params.grantee,
      grant: grant,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this

    const proto = this.toProto()
    const timestamp = this.getTimestamp()
    const message = proto

    const messageWithAuthorizationType = snakecaseKeys({
      ...message,
      grant: {
        authorization: params.authorization.toAmino(),
        expiration: new Date(Number(timestamp.seconds) * 1000)
          .toISOString()
          .replace('.000Z', 'Z'),
      },
    })

    return {
      type: 'cosmos-sdk/MsgGrant',
      value:
        messageWithAuthorizationType as unknown as MsgGrantWithAuthorization.Object,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.authz.v1beta1.MsgGrant',
      message: proto,
    }
  }

  public toWeb3Gw() {
    const { params } = this
    const amino = this.toAmino()
    const timestamp = this.getTimestamp()

    const messageWithAuthorizationType = {
      granter: amino.value.granter,
      grantee: amino.value.grantee,
      grant: {
        authorization: params.authorization.toWeb3(),
        expiration: new Date(Number(timestamp.seconds) * 1000)
          .toISOString()
          .replace('.000Z', 'Z'),
      },
    }

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...messageWithAuthorizationType,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgGrantWithAuthorization. Please use EIP712_v2',
      ),
    )
  }

  private getTimestamp() {
    const { params } = this

    if (params.expiration) {
      const timestamp = GoogleProtobufTimestampPb.Timestamp.create({
        seconds: BigInt(params.expiration),
      })

      return timestamp
    }

    const defaultExpiryYears = params.expiryInSeconds ? 0 : 5
    const dateNow = new Date()
    const expiration = new Date(
      dateNow.getFullYear() + (params.expiryInYears || defaultExpiryYears),
      dateNow.getMonth(),
      dateNow.getDate(),
    )

    const timestampInSeconds = (
      expiration.getTime() / 1000 +
      (params.expiryInSeconds || 0)
    ).toString()

    const timestamp = GoogleProtobufTimestampPb.Timestamp.create({
      seconds: BigInt(timestampInSeconds),
    })

    return timestamp
  }

  public toBinary(): Uint8Array {
    return CosmosAuthzV1Beta1TxPb.MsgGrant.toBinary(this.toProto())
  }
}
