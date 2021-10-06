import { AccountAddress } from '@injectivelabs/ts-types'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'

export class StakingProtoComposer {
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
  }) {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const message = new MsgDelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(injectiveAddress)
    message.setValidatorAddress(validatorAddress)

    return {
      message,
      type: '/cosmos.staking.v1beta1.MsgDelegate',
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
  }) {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const message = new MsgBeginRedelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(injectiveAddress)
    message.setValidatorDstAddress(destinationValidatorAddress)
    message.setValidatorSrcAddress(sourceValidatorAddress)

    return {
      message,
      type: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
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
  }) {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const message = new MsgUndelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(injectiveAddress)
    message.setValidatorAddress(validatorAddress)

    return {
      message,
      type: '/cosmos.staking.v1beta1.MsgUndelegate',
    }
  }
}
