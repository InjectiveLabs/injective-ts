import { MsgTransfer } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/transfer_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

export class IBCProtoComposer {
  static transfer({
    receiver,
    sender,
    channelId,
    port,
    denom,
    amount,
  }: {
    denom: string
    amount: string
    sender: string
    port: string
    receiver: string
    channelId: string
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

    return {
      message,
      type: '/ibc.applications.transfer.v1.MsgTransfer',
    }
  }
}
