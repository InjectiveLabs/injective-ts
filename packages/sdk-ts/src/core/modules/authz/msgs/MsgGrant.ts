import { MsgGrant as BaseMsgGrant } from '@injectivelabs/core-proto-ts/cosmos/authz/v1beta1/tx'
import {
  GenericAuthorization,
  Grant,
} from '@injectivelabs/core-proto-ts/cosmos/authz/v1beta1/authz'
import { Timestamp } from '@injectivelabs/core-proto-ts/google/protobuf/timestamp'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

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

  export type Proto = BaseMsgGrant

  export type Object = Omit<BaseMsgGrant, 'msgs'> & {
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
    const genericAuthorization = GenericAuthorization.create()
    genericAuthorization.msg = params.messageType

    const authorization = Any.create()
    authorization.typeUrl = genericAuthorizationType
    authorization.value = Buffer.from(
      GenericAuthorization.encode(genericAuthorization).finish(),
    )

    const grant = Grant.create()
    grant.expiration = new Date(timestamp.seconds)
    grant.authorization = authorization

    const message = BaseMsgGrant.create()
    message.grantee = params.grantee
    message.granter = params.granter
    message.grant = grant

    return BaseMsgGrant.fromJSON(message)
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
          msg: params.messageType,
          '@type': genericAuthorizationType,
        },
        expiration: timestamp.seconds,
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
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...value,
    }
  }

  private getTimestamp() {
    const { params } = this

    if (params.expiration) {
      const timestamp = Timestamp.create()

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

    const timestamp = Timestamp.create()
    const timestampInSeconds = (
      expiration.getTime() / 1000 +
      (params.expiryInSeconds || 0)
    ).toString()

    timestamp.seconds = timestampInSeconds

    return timestamp
  }

  public toBinary(): Uint8Array {
    return BaseMsgGrant.encode(this.toProto()).finish()
  }
}
