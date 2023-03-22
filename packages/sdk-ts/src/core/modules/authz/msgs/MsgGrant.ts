import { MsgGrant as BaseMsgGrant } from '@injectivelabs/chain-api/cosmos/authz/v1beta1/tx_pb'
import {
  GenericAuthorization,
  Grant,
} from '@injectivelabs/chain-api/cosmos/authz/v1beta1/authz_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

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

  export type Object = BaseMsgGrant.AsObject
}

/**
 * @category Messages
 */
export default class MsgGrant extends MsgBase<
  MsgGrant.Params,
  MsgGrant.Proto,
  MsgGrant.Object
> {
  static fromJSON(params: MsgGrant.Params): MsgGrant {
    return new MsgGrant(params)
  }

  public toProto() {
    const { params } = this

    const timestamp = this.getTimestamp()
    const genericAuthorization = new GenericAuthorization()
    genericAuthorization.setMsg(params.messageType)

    const authorization = new Any()
    authorization.setTypeUrl(genericAuthorizationType)
    authorization.setValue(
      Buffer.from(genericAuthorization.serializeBinary()).toString('base64'),
    )

    const grant = new Grant()
    grant.setExpiration(timestamp)
    grant.setAuthorization(authorization)

    const message = new BaseMsgGrant()
    message.setGrantee(params.grantee)
    message.setGranter(params.granter)
    message.setGrant(grant)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const { params } = this

    const proto = this.toProto()
    const timestamp = this.getTimestamp()
    const message = proto.toObject()

    const messageWithAuthorizationType = snakecaseKeys({
      ...message,
      grant: {
        ...message.grant,
        authorization: {
          'type': 'cosmos-sdk/GenericAuthorization',
          value: { msg: params.messageType },
        },
        expiration: timestamp.toDate(),
      },
    })

    return {
      type: 'cosmos-sdk/MsgGrant',
      value:
        messageWithAuthorizationType as unknown as SnakeCaseKeys<MsgGrant.Object>,
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
      const timestamp = new Timestamp()

      timestamp.setSeconds(params.expiration)

      return timestamp
    }

    const defaultExpiryYears = params.expiryInSeconds ? 0 : 5
    const dateNow = new Date()
    const expiration = new Date(
      dateNow.getFullYear() + (params.expiryInYears || defaultExpiryYears),
      dateNow.getMonth(),
      dateNow.getDate(),
    )

    const timestamp = new Timestamp()
    timestamp.setSeconds(
      expiration.getTime() / 1000 + (params.expiryInSeconds || 0),
    )

    return timestamp
  }
}
