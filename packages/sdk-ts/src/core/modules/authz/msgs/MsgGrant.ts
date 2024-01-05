import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import {
  GoogleProtobufAny,
  CosmosAuthzV1Beta1Tx,
  CosmosAuthzV1Beta1Authz,
  GoogleProtobufTimestamp,
} from '@injectivelabs/core-proto-ts'

const genericAuthorizationType = '/cosmos.authz.v1beta1.GenericAuthorization'

export declare namespace MsgGrant {
  export interface Params {
    messageType: string
    grantee: string
    granter: string
    expiration?: number
    expiryInYears?: number
    expiryInSeconds?: number
  }

  export type Proto = CosmosAuthzV1Beta1Tx.MsgGrant

  export type Object = Omit<CosmosAuthzV1Beta1Tx.MsgGrant, 'msgs'> & {
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
    const genericAuthorization =
      CosmosAuthzV1Beta1Authz.GenericAuthorization.create()
    genericAuthorization.msg = params.messageType

    const authorization = GoogleProtobufAny.Any.create()
    authorization.typeUrl = genericAuthorizationType
    authorization.value = Buffer.from(
      CosmosAuthzV1Beta1Authz.GenericAuthorization.encode(
        genericAuthorization,
      ).finish(),
    )

    const grant = CosmosAuthzV1Beta1Authz.Grant.create()
    grant.expiration = new Date(Number(timestamp.seconds) * 1000)
    grant.authorization = authorization

    const message = CosmosAuthzV1Beta1Tx.MsgGrant.create()
    message.grantee = params.grantee
    message.granter = params.granter
    message.grant = grant

    return CosmosAuthzV1Beta1Tx.MsgGrant.fromJSON(message)
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
        ...message.grant,
        authorization: {
          type: 'cosmos-sdk/GenericAuthorization',
          value: { msg: params.messageType },
        },
        expiration: new Date(Number(timestamp.seconds) * 1000),
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

  public toWeb3() {
    const { params } = this
    const amino = this.toAmino()
    const timestamp = this.getTimestamp()

    const messageWithAuthorizationType = {
      granter: amino.value.granter,
      grantee: amino.value.grantee,
      grant: {
        authorization: {
          '@type': '/cosmos.authz.v1beta1.GenericAuthorization',
          msg: params.messageType,
        },
        expiration: new Date(Number(timestamp.seconds) * 1000),
      },
    }

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...messageWithAuthorizationType,
    }
  }

  private getTimestamp() {
    const { params } = this

    if (params.expiration) {
      const timestamp = GoogleProtobufTimestamp.Timestamp.create()

      timestamp.seconds = params.expiration.toString()

      return timestamp
    }

    const defaultExpiryYears = params.expiryInSeconds ? 0 : 5
    const dateNow = new Date()
    const expiration = new Date(
      dateNow.getFullYear() + (params.expiryInYears || defaultExpiryYears),
      dateNow.getMonth(),
      dateNow.getDate(),
    )

    const timestamp = GoogleProtobufTimestamp.Timestamp.create()
    const timestampInSeconds = (
      expiration.getTime() / 1000 +
      (params.expiryInSeconds || 0)
    ).toString()

    timestamp.seconds = timestampInSeconds

    return timestamp
  }

  public toBinary(): Uint8Array {
    return CosmosAuthzV1Beta1Tx.MsgGrant.encode(this.toProto()).finish()
  }
}
