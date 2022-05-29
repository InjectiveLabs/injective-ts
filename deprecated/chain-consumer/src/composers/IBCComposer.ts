import { MsgTransfer } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { Height } from '@injectivelabs/chain-api/ibc/core/client/v1/client_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'
import { ComposerResponse } from '@injectivelabs/ts-types'

export class IBCComposer {
  static transfer({
    receiver,
    sender,
    channelId,
    port,
    denom,
    amount,
    timeout,
    height,
  }: {
    denom: string
    amount: string
    sender: string
    port: string
    receiver: string
    channelId: string
    timeout?: number
    height?: {
      revisionHeight: number
      revisionNumber: number
    }
  }): ComposerResponse<MsgTransfer, MsgTransfer.AsObject> {
    const timeoutHeight = new Height()
    const token = new Coin()
    token.setDenom(denom)
    token.setAmount(amount)

    const message = new MsgTransfer()
    message.setReceiver(receiver)
    message.setSender(sender)
    message.setSourceChannel(channelId)
    message.setSourcePort(port)
    message.setToken(token)

    if (height) {
      timeoutHeight.setRevisionHeight(height.revisionHeight)
      timeoutHeight.setRevisionNumber(height.revisionNumber)
    } else {
      timeoutHeight.setRevisionHeight(0)
      timeoutHeight.setRevisionNumber(1)
    }

    message.setTimeoutHeight(timeoutHeight)

    if (timeout) {
      message.setTimeoutTimestamp(timeout)
    }

    const type = '/ibc.applications.transfer.v1.MsgTransfer'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: { message, type },
    }
  }
}
