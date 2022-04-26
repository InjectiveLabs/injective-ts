import { MsgGrant as BaseMsgGrant } from '@injectivelabs/chain-api/cosmos/authz/v1beta1/tx_pb'
import {
  GenericAuthorization,
  Grant,
} from '@injectivelabs/chain-api/cosmos/authz/v1beta1/authz_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgGrant {
  export interface Params {
    messageType: string
    grantee: string
    granter: string
    expiryInYears?: number
  }

  export interface Amino {
    type: '/cosmos.authz.v1beta1.MsgGrant'
    message: BaseMsgGrant
  }

  export interface Data extends BaseMsgGrant.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgGrant'
  }

  export interface Web3 extends BaseMsgGrant.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgGrant'
  }

  export type Proto = BaseMsgGrant
}

export default class MsgGrant extends MsgBase<
  MsgGrant.Params,
  MsgGrant.Data,
  MsgGrant.Proto,
  MsgGrant.Web3,
  MsgGrant.Amino
> {
  static fromJSON(params: MsgGrant.Params): MsgGrant {
    return new MsgGrant(params)
  }

  toProto(): MsgGrant.Proto {
    const { params } = this

    const timestamp = this.getTimestamp()
    const genericAuthorization = new GenericAuthorization()
    genericAuthorization.setMsg(params.messageType)

    const genericAuthorizationType =
      '/cosmos.authz.v1beta1.GenericAuthorization'
    const authorization = new Any()
    authorization.setTypeUrl(genericAuthorizationType)
    authorization.setValue(genericAuthorization.getMsg())

    const grant = new Grant()
    grant.setExpiration(timestamp)
    grant.setAuthorization(authorization)

    const message = new BaseMsgGrant()
    message.setGrantee(params.grantee)
    message.setGranter(params.granter)
    message.setGrant(grant)

    return message
  }

  toData(): MsgGrant.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgGrant.Web3 {
    const proto = this.toProto()
    const timestamp = this.getTimestamp()
    const message = proto.toObject()
    const genericAuthorizationType =
      '/cosmos.authz.v1beta1.GenericAuthorization'
    const messageWithAuthorizationType = {
      ...message,
      grant: {
        ...message.grant,
        authorization: {
          msg: message.grant?.authorization?.value,
          '@type': genericAuthorizationType,
        },
        expiration: timestamp.toDate(),
      },
    }

    return {
      '@type': '/cosmos.authz.v1beta1.MsgGrant',
      ...messageWithAuthorizationType,
    } as unknown as MsgGrant.Web3
  }

  toAmino(): MsgGrant.Amino {
    const proto = this.toProto()

    return {
      type: '/cosmos.authz.v1beta1.MsgGrant',
      message: proto,
    }
  }

  private getTimestamp() {
    const { params } = this
    const defaultExpiryYears = 5
    const dateNow = new Date()
    const expiration = new Date(
      dateNow.getFullYear() + (params.expiryInYears || defaultExpiryYears),
      dateNow.getMonth(),
      dateNow.getDate(),
    )
    const timestamp = new Timestamp()
    timestamp.setSeconds(expiration.getTime() / 1000)

    return timestamp
  }
}
