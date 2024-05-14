import MsgExec from './msgs/MsgExec'
import { Msgs } from './../msgs'
import {
  GoogleProtobufAny,
  CosmosAuthzV1Beta1Authz,
} from '@injectivelabs/core-proto-ts'

export const msgsOrMsgExecMsgs = (
  msgs: Msgs | Msgs[],
  grantee?: string,
): Msgs[] => {
  const actualMsgs = Array.isArray(msgs) ? msgs : [msgs]

  if (!grantee) {
    return actualMsgs
  }

  return actualMsgs.map((msg) => MsgExec.fromJSON({ grantee, msgs: msg }))
}

export const getGenericAuthorizationFromMessageType = (
  messageTypeUrl: string,
) => {
  const genericAuthorizationType = '/cosmos.authz.v1beta1.GenericAuthorization'

  const genericAuthorization =
    CosmosAuthzV1Beta1Authz.GenericAuthorization.create()
  genericAuthorization.msg = messageTypeUrl

  const authorization = GoogleProtobufAny.Any.create()
  authorization.typeUrl = genericAuthorizationType
  authorization.value = Buffer.from(
    CosmosAuthzV1Beta1Authz.GenericAuthorization.encode(
      genericAuthorization,
    ).finish(),
  )

  return authorization
}
