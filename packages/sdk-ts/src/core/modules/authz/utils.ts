import MsgExec from './msgs/MsgExec'
import { Msgs } from './../msgs'

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
