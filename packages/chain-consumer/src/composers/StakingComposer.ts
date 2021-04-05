import { AccountAddress } from '@injectivelabs/ts-types'
import { BigNumberInWei } from '@injectivelabs/utils'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import snakeCaseKeys from 'snakecase-keys'
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'

export class StakingComposer {
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
