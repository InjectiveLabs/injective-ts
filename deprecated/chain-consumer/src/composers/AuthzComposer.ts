import {
  MsgGrant,
  MsgRevoke,
} from '@injectivelabs/chain-api/cosmos/authz/v1beta1/tx_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'
import { ComposerResponse, Web3GatewayMessage } from '@injectivelabs/ts-types'
import {
  GenericAuthorization,
  Grant,
} from '@injectivelabs/chain-api/cosmos/authz/v1beta1/authz_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'

export class AuthzComposer {
  static grant({
    grantee,
    granter,
    messageType,
    expiryInYears = 5,
  }: {
    messageType: string
    grantee: string
    granter: string
    expiryInYears?: number
  }): ComposerResponse<MsgGrant, MsgGrant.AsObject> {
    const dateNow = new Date()
    const expiration = new Date(
      dateNow.getFullYear() + expiryInYears,
      dateNow.getMonth(),
      dateNow.getDate(),
    )
    const timestamp = new Timestamp()
    timestamp.setSeconds(expiration.getTime() / 1000)

    const genericAuthorization = new GenericAuthorization()
    genericAuthorization.setMsg(messageType)

    const genericAuthorizationType =
      '/cosmos.authz.v1beta1.GenericAuthorization'
    const authorization = new Any()
    authorization.setTypeUrl(genericAuthorizationType)
    authorization.setValue(genericAuthorization.getMsg())

    const grant = new Grant()
    grant.setExpiration(timestamp)
    grant.setAuthorization(authorization)

    const message = new MsgGrant()
    message.setGrantee(grantee)
    message.setGranter(granter)
    message.setGrant(grant)

    const type = '/cosmos.authz.v1beta1.MsgGrant'

    const web3GatewayMessage = getWeb3GatewayMessage(message.toObject(), type)
    const web3GatewayMessageWithAuthorizationType = {
      ...web3GatewayMessage,
      grant: {
        ...web3GatewayMessage.grant,
        authorization: {
          msg: web3GatewayMessage.grant?.authorization?.value,
          '@type': genericAuthorizationType,
        },
        expiration: timestamp.toDate(),
      },
    } as unknown as Web3GatewayMessage<MsgGrant.AsObject>

    return {
      web3GatewayMessage: web3GatewayMessageWithAuthorizationType,
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static revoke({
    grantee,
    granter,
    messageType,
  }: {
    messageType: string
    grantee: string
    granter: string
  }): ComposerResponse<MsgRevoke, MsgRevoke.AsObject> {
    const message = new MsgRevoke()
    message.setGrantee(grantee)
    message.setGranter(granter)
    message.setMsgTypeUrl(messageType)

    const type = '/cosmos.authz.v1beta1.MsgRevoke'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
