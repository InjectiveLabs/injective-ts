import {
  MsgDeposit,
  MsgWithdraw,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

export class SubaccountComposer {
  static async deposit({
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

    const content = new MsgDeposit()
    content.setSender(injectiveAddress)
    content.setSubaccountId(subaccountId)
    content.setAmount(amountCoin)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgDeposit',
    }
  }

  static async withdraw({
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

    const content = new MsgWithdraw()
    content.setSender(injectiveAddress)
    content.setSubaccountId(subaccountId)
    content.setAmount(amountCoin)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgWithdraw',
    }
  }
}
