import * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import * as CosmosAuthzV1Beta1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/authz_pb.mjs'
import MsgExec from './msgs/MsgExec.js'
import type { Msgs } from './../msgs.js'

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
    CosmosAuthzV1Beta1AuthzPb.GenericAuthorization.create({
      msg: messageTypeUrl.startsWith('/') ? messageTypeUrl : `/${messageTypeUrl}`,
    })

  const authorization = GoogleProtobufAnyPb.Any.create({
    typeUrl: genericAuthorizationType,
    value: CosmosAuthzV1Beta1AuthzPb.GenericAuthorization.toBinary(genericAuthorization),
  })

  return authorization
}
