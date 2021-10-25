import snakeCaseKeys from 'snakecase-keys'
import { MsgTransfer } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/transfer_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

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

    if (timeout) {
      message.setTimeoutTimestamp(timeout)
    }

    const messageObject = {
      ...snakeCaseKeys(message.toObject()),
      timeout_height: {
        revision_number: height ? height.versionHeight : 1,
        revision_height: height ? height.versionNumber : 0,
      },
    }

    return {
      ...messageObject,
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
    }
  }
}
