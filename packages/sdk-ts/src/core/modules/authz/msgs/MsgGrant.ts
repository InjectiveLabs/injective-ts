import snakecaseKeys from 'snakecase-keys'
import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmosAuthzV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/tx_pb.mjs'
import * as GoogleProtobufTimestampPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/timestamp_pb.mjs'
import * as CosmosAuthzV1Beta1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/authz_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import { GrantAuthorizationType } from './../types.js'
import { getGenericAuthorizationFromMessageType } from '../utils.js'
import type * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'

/**
 * @deprecated please use MsgGrantWithAuthorization
 */
export declare namespace MsgGrant {
  export interface Params {
    /**
     * @deprecated Use `authorization` instead - for generic authorizations,
     * use `getGenericAuthorizationFromMessageType` function
     * to get the authorization object from messageType
     */
    messageType?: string
    authorization?: GoogleProtobufAnyPbPb.Any
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
export default class MsgGrant extends MsgBase<MsgGrant.Params, MsgGrant.Proto> {
  static fromJSON(params: MsgGrant.Params): MsgGrant {
    return new MsgGrant(params)
  }

  public toProto() {
    const { params } = this

    const timestamp = this.getTimestamp()

    if (!params.authorization && !params.messageType) {
      throw new GeneralException(
        new Error('Either authorization or messageType must be provided'),
      )
    }

    const authorization =
      params.authorization ||
      getGenericAuthorizationFromMessageType(params.messageType as string)

    const grant = CosmosAuthzV1Beta1AuthzPb.Grant.create({
      authorization: authorization,
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

    if (!params.authorization && !params.messageType) {
      throw new GeneralException(
        new Error('Either authorization or messageType must be provided'),
      )
    }

    const authorization =
      params.authorization ||
      getGenericAuthorizationFromMessageType(params.messageType as string)

    if (
      !authorization.typeUrl.includes(
        GrantAuthorizationType.GenericAuthorization,
      )
    ) {
      throw new GeneralException(
        new Error('Currently, only GenericAuthorization type is supported'),
      )
    }

    const genericAuthorization =
      CosmosAuthzV1Beta1AuthzPb.GenericAuthorization.fromBinary(
        authorization.value,
      )

    const messageWithAuthorizationType = snakecaseKeys({
      ...message,
      grant: {
        authorization: {
          type: 'cosmos-sdk/GenericAuthorization',
          value: { msg: genericAuthorization.msg },
        },
        expiration: new Date(Number(timestamp.seconds) * 1000)
          .toISOString()
          .replace('.000Z', 'Z'),
      },
    })

    return {
      type: 'cosmos-sdk/MsgGrant',
      value: messageWithAuthorizationType as unknown as MsgGrant.Object,
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

    if (!params.authorization && !params.messageType) {
      throw new GeneralException(
        new Error('Either authorization or messageType must be provided'),
      )
    }

    const authorization =
      params.authorization ||
      getGenericAuthorizationFromMessageType(params.messageType as string)

    if (
      !authorization.typeUrl.includes(
        GrantAuthorizationType.GenericAuthorization,
      )
    ) {
      throw new GeneralException(
        new Error('Currently, only GenericAuthorization type is supported'),
      )
    }

    const genericAuthorization =
      CosmosAuthzV1Beta1AuthzPb.GenericAuthorization.fromBinary(
        authorization.value,
      )

    const messageWithAuthorizationType = {
      granter: amino.value.granter,
      grantee: amino.value.grantee,
      grant: {
        authorization: {
          '@type': '/cosmos.authz.v1beta1.GenericAuthorization',
          msg: genericAuthorization.msg,
        },
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

  public getTimestamp() {
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
