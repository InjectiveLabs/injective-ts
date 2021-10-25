import { MsgTransfer } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/transfer_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { Height } from '@injectivelabs/chain-api/ibc/core/client/v1/client_pb'

export class IBCProtoComposer {
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
      versionHeight: number
      versionNumber: number
    }
  }) {
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
      const timeoutHeight = new Height()
      timeoutHeight.setVersionHeight(height.versionHeight)
      timeoutHeight.setVersionNumber(height.versionNumber)

      message.setTimeoutHeight(timeoutHeight)
    }

    if (timeout) {
      message.setTimeoutTimestamp(timeout)
    }

    return {
      message,
      type: '/ibc.applications.transfer.v1.MsgTransfer',
    }
  }
}
