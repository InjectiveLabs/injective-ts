import { AccountAddress } from '@injectivelabs/ts-types'
import snakeCaseKeys from 'snakecase-keys'
import {
  MsgRequestRedemption,
  MsgUnderwrite,
} from '@injectivelabs/chain-api/injective/insurance/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

export class InsuranceComposer {
  static underwrite({
    marketId,
    amount,
    denom,
    address,
  }: {
    marketId: string
    denom: string
    amount: string
    address: AccountAddress
  }) {
    const deposit = new Coin()
    deposit.setAmount(amount)
    deposit.setDenom(denom)

    const message = new MsgUnderwrite()
    message.setDeposit(deposit)
    message.setMarketId(marketId)
    message.setSender(address)

    return {
      ...snakeCaseKeys(message.toObject()),
      '@type': '/injective.insurance.v1beta1.MsgUnderwrite',
    }
  }

  static requestRedemption({
    marketId,
    amount,
    denom,
    address,
  }: {
    marketId: string
    denom: string
    amount: string
    address: AccountAddress
  }) {
    const amountToRedeem = new Coin()
    amountToRedeem.setAmount(amount)
    amountToRedeem.setDenom(denom)

    const message = new MsgRequestRedemption()
    message.setAmount(amountToRedeem)
    message.setMarketId(marketId)
    message.setSender(address)

    return {
      ...snakeCaseKeys(message.toObject()),
      '@type': '/injective.insurance.v1beta1.MsgRequestRedemption',
    }
  }
}
