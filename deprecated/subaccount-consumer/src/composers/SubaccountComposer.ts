import {
  MsgDeposit,
  MsgWithdraw,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'
import { ComposerResponse } from '@injectivelabs/ts-types'

export class SubaccountComposer {
  static deposit({
    subaccountId,
    injectiveAddress,
    amount,
    denom,
  }: {
    subaccountId: string
    amount: string
    injectiveAddress: string
    denom: string
  }): ComposerResponse<MsgDeposit, MsgDeposit.AsObject> {
    const amountCoin = new Coin()
    amountCoin.setAmount(amount)
    amountCoin.setDenom(denom)

    const message = new MsgDeposit()
    message.setSender(injectiveAddress)
    message.setSubaccountId(subaccountId)
    message.setAmount(amountCoin)

    const type = '/injective.exchange.v1beta1.MsgDeposit'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static withdraw({
    subaccountId,
    amount,
    injectiveAddress,
    denom,
  }: {
    subaccountId: string
    amount: string
    injectiveAddress: string
    denom: string
  }): ComposerResponse<MsgDeposit, MsgDeposit.AsObject> {
    const amountCoin = new Coin()
    amountCoin.setAmount(amount)
    amountCoin.setDenom(denom)

    const message = new MsgWithdraw()
    message.setSender(injectiveAddress)
    message.setSubaccountId(subaccountId)
    message.setAmount(amountCoin)

    const type = '/injective.exchange.v1beta1.MsgWithdraw'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
