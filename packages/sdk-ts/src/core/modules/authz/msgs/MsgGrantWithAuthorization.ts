import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosAuthzV1Beta1Tx,
  CosmosAuthzV1Beta1Authz,
  GoogleProtobufTimestamp,
} from '@injectivelabs/core-proto-ts'
import { BaseAuthorization } from './authorizations/Base.js'

export declare namespace MsgGrantWithAuthorization {
  export interface Params {
    authorization: BaseAuthorization<unknown, unknown, unknown>
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
    const grant = CosmosAuthzV1Beta1Authz.Grant.create()

    grant.authorization = params.authorization.toAny()
    grant.expiration = new Date(Number(timestamp.seconds) * 1000)

    const message = CosmosAuthzV1Beta1Tx.MsgGrant.create()

    message.granter = params.granter
    message.grantee = params.grantee
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
        authorization: params.authorization.toAmino(),
        expiration: new Date(Number(timestamp.seconds) * 1000),
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
        expiration:
          new Date(Number(timestamp.seconds) * 1000).toJSON().slice(0, -5) +
          'Z',
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
