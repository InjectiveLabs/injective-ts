import { AccountAddress } from '@injectivelabs/ts-types'
import {
  DEFAULT_BRIDGE_FEE_AMOUNT,
  DEFAULT_BRIDGE_FEE_DENOM,
} from '@injectivelabs/utils'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgSendToEth } from '@injectivelabs/chain-api/injective/peggy/v1/msgs_pb'
import snakeCaseKeys from 'snakecase-keys'

export class PeggyComposer {
  static withdraw({
    address,
    injectiveAddress,
    amount,
    denom,
    bridgeFeeDenom = DEFAULT_BRIDGE_FEE_DENOM,
    bridgeFeeAmount = DEFAULT_BRIDGE_FEE_AMOUNT,
  }: {
    denom: string
    address: AccountAddress
    injectiveAddress: AccountAddress
    amount: string
    bridgeFeeDenom?: string
    bridgeFeeAmount?: string
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const bridgeFee = new Coin()
    bridgeFee.setDenom(bridgeFeeDenom)
    bridgeFee.setAmount(bridgeFeeAmount)

    const cosmosMessage = new MsgSendToEth()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setSender(injectiveAddress)
    cosmosMessage.setEthDest(address)
    cosmosMessage.setBridgeFee(bridgeFee)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/injective.peggy.v1.MsgSendToEth',
    }
  }
}
