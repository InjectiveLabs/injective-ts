import {
  MsgGrant,
  MsgRevoke,
} from '@injectivelabs/chain-api/cosmos/authz/v1beta1/tx_pb'
import { getWeb3GatewayMessage, SECONDS_IN_A_DAY } from '@injectivelabs/utils'
import { ComposerResponse, Web3GatewayMessage } from '@injectivelabs/ts-types'
import { Grant } from '@injectivelabs/chain-api/cosmos/authz/v1beta1/authz_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'

const SECONDS_IN_A_YEAR = SECONDS_IN_A_DAY.times(365).toNumber()

export class AuthzComposer {
  static grant({
    grantee,
    granter,
    messageType,
    expiryInSeconds = SECONDS_IN_A_YEAR,
  }: {
    messageType: string
    grantee: string
    granter: string
    expiryInSeconds?: number
  }): ComposerResponse<MsgGrant, MsgGrant.AsObject> {
    const now = Math.round(new Date().getTime() / 1000)
    const timestamp = new Timestamp()
    timestamp.setSeconds(now + expiryInSeconds)

    const authorization = new Any()
    authorization.setTypeUrl(messageType)

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
          ...web3GatewayMessage.grant?.authorization,
          '@type': messageType,
        },
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
