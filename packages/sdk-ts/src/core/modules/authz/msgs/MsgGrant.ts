import { MsgGrant as BaseMsgGrant } from '@injectivelabs/chain-api/cosmos/authz/v1beta1/tx_pb'
import {
  GenericAuthorization,
  Grant,
} from '@injectivelabs/chain-api/cosmos/authz/v1beta1/authz_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { MsgBase } from '../../MsgBase'

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

  export interface DirectSign {
    type: '/cosmos.authz.v1beta1.MsgGrant'
    message: BaseMsgGrant
  }

  export interface Data extends BaseMsgGrant.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgGrant'
  }

  export interface Amino extends BaseMsgGrant.AsObject {
    type: 'cosmos-sdk/MsgGrant'
  }

  export interface Web3 extends BaseMsgGrant.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgGrant'
  }

  export type Proto = BaseMsgGrant
}

/**
 * @category Messages
 */
export default class MsgGrant extends MsgBase<
  MsgGrant.Params,
  MsgGrant.Data,
  MsgGrant.Proto,
  MsgGrant.Amino,
  MsgGrant.DirectSign
> {
  static fromJSON(params: MsgGrant.Params): MsgGrant {
    return new MsgGrant(params)
  }

  public toProto(): MsgGrant.Proto {
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

  public toData(): MsgGrant.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgGrant.Amino {
    const { params } = this

    const proto = this.toProto()
    const timestamp = this.getTimestamp()
    const message = proto.toObject()

    const messageWithAuthorizationType = {
      ...message,
      grant: {
        ...message.grant,
        authorization: {
          msg: params.messageType,
          '@type': genericAuthorizationType,
        },
        expiration: timestamp.toDate(),
      },
    }

    return {
      type: 'cosmos-sdk/MsgGrant',
      ...messageWithAuthorizationType,
    } as unknown as MsgGrant.Amino
  }

  public toDirectSign(): MsgGrant.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.authz.v1beta1.MsgGrant',
      message: proto,
    }
  }

  public toWeb3(): MsgGrant.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...rest,
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
