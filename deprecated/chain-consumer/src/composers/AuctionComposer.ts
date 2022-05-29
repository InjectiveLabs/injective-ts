import { AccountAddress } from '@injectivelabs/ts-types/dist/index'
import { MsgBid } from '@injectivelabs/chain-api/injective/auction/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'
import { ComposerResponse } from '@injectivelabs/ts-types'

export class AuctionComposer {
  static bid({
    amount,
    round,
    denom = 'inj',
    injectiveAddress,
  }: {
    amount: string
    round: number
    denom?: string
    injectiveAddress: AccountAddress
  }): ComposerResponse<MsgBid, MsgBid.AsObject> {
    const coin = new Coin()
    coin.setAmount(amount)
    coin.setDenom(denom)

    const message = new MsgBid()
    message.setBidAmount(coin)
    message.setRound(round)
    message.setSender(injectiveAddress)

    const type = '/injective.auction.v1beta1.MsgBid'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
