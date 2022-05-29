import {
  MsgDeposit,
  MsgWithdraw,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

export class SubaccountProtoComposer {
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
  }) {
    const amountCoin = new Coin()
    amountCoin.setAmount(amount)
    amountCoin.setDenom(denom)

    const message = new MsgDeposit()
    message.setSender(injectiveAddress)
    message.setSubaccountId(subaccountId)
    message.setAmount(amountCoin)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgDeposit',
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
  }) {
    const amountCoin = new Coin()
    amountCoin.setAmount(amount)
    amountCoin.setDenom(denom)

    const message = new MsgWithdraw()
    message.setSender(injectiveAddress)
    message.setSubaccountId(subaccountId)
    message.setAmount(amountCoin)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgWithdraw',
    }
  }
}
