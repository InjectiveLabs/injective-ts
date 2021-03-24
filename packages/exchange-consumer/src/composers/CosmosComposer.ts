import { AccountAddress } from '@injectivelabs/ts-types'
import { BigNumberInWei } from '@injectivelabs/utils'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgSendToEth } from '@injectivelabs/chain-api/injective/peggy/v1/msgs_pb'
import snakeCaseKeys from 'snakecase-keys'
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { MsgWithdrawDelegatorReward } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/tx_pb'
import {
  DEFAULT_BRIDGE_FEE_AMOUNT,
  DEFAULT_BRIDGE_FEE_DENOM,
} from '../constants'

export class CosmosComposer {
  static withdraw({
    address,
    cosmosAddress,
    amount,
    denom,
    bridgeFeeDenom = DEFAULT_BRIDGE_FEE_DENOM,
    bridgeFeeAmount = DEFAULT_BRIDGE_FEE_AMOUNT,
  }: {
    denom: string
    address: AccountAddress
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
    bridgeFeeDenom?: string
    bridgeFeeAmount?: string
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount.toFixed())

    const bridgeFee = new Coin()
    bridgeFee.setDenom(bridgeFeeDenom)
    bridgeFee.setAmount(bridgeFeeAmount)

    const cosmosMessage = new MsgSendToEth()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setSender(cosmosAddress)
    cosmosMessage.setEthDest(address)
    cosmosMessage.setBridgeFee(bridgeFee)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/injective.peggy.v1.MsgSendToEth',
    }
  }

  static delegate({
    cosmosAddress,
    validatorAddress,
    amount,
    denom,
  }: {
    denom: string
    validatorAddress: string
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount.toFixed())

    const cosmosMessage = new MsgDelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(cosmosAddress)
    cosmosMessage.setValidatorAddress(validatorAddress)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
    }
  }

  static reDelegate({
    cosmosAddress,
    sourceValidatorAddress,
    destinationValidatorAddress,
    amount,
    denom,
  }: {
    denom: string
    sourceValidatorAddress: string
    destinationValidatorAddress: string
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount.toFixed())

    const cosmosMessage = new MsgBeginRedelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(cosmosAddress)
    cosmosMessage.setValidatorDstAddress(destinationValidatorAddress)
    cosmosMessage.setValidatorSrcAddress(sourceValidatorAddress)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    }
  }

  static withdrawDelegatorReward({
    delegatorAddress,
    validatorAddress,
  }: {
    validatorAddress: string
    delegatorAddress: AccountAddress
  }): Record<string, any> {
    const cosmosMessage = new MsgWithdrawDelegatorReward()
    cosmosMessage.setDelegatorAddress(delegatorAddress)
    cosmosMessage.setValidatorAddress(validatorAddress)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    }
  }

  static unbond({
    cosmosAddress,
    validatorAddress,
    amount,
    denom,
  }: {
    denom: string
    validatorAddress: string
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount.toFixed())

    const cosmosMessage = new MsgUndelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(cosmosAddress)
    cosmosMessage.setValidatorAddress(validatorAddress)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
    }
  }
}
