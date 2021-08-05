import { AccountAddress } from '@injectivelabs/ts-types'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import snakeCaseKeys from 'snakecase-keys'
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'

export class StakingComposer {
  static delegate({
    injectiveAddress,
    validatorAddress,
    amount,
    denom,
  }: {
    denom: string
    validatorAddress: string
    injectiveAddress: AccountAddress
    amount: string
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const cosmosMessage = new MsgDelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(injectiveAddress)
    cosmosMessage.setValidatorAddress(validatorAddress)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
    }
  }

  static reDelegate({
    injectiveAddress,
    sourceValidatorAddress,
    destinationValidatorAddress,
    amount,
    denom,
  }: {
    denom: string
    sourceValidatorAddress: string
    destinationValidatorAddress: string
    injectiveAddress: AccountAddress
    amount: string
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const cosmosMessage = new MsgBeginRedelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(injectiveAddress)
    cosmosMessage.setValidatorDstAddress(destinationValidatorAddress)
    cosmosMessage.setValidatorSrcAddress(sourceValidatorAddress)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    }
  }

  static unbond({
    injectiveAddress,
    validatorAddress,
    amount,
    denom,
  }: {
    denom: string
    validatorAddress: string
    injectiveAddress: AccountAddress
    amount: string
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const cosmosMessage = new MsgUndelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(injectiveAddress)
    cosmosMessage.setValidatorAddress(validatorAddress)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
    }
  }
}
