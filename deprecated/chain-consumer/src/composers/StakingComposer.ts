import { AccountAddress, ComposerResponse } from '@injectivelabs/ts-types'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'

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
  }): ComposerResponse<MsgDelegate, MsgDelegate.AsObject> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const message = new MsgDelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(injectiveAddress)
    message.setValidatorAddress(validatorAddress)

    const type = '/cosmos.staking.v1beta1.MsgDelegate'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
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
  }): ComposerResponse<MsgBeginRedelegate, MsgBeginRedelegate.AsObject> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const message = new MsgBeginRedelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(injectiveAddress)
    message.setValidatorDstAddress(destinationValidatorAddress)
    message.setValidatorSrcAddress(sourceValidatorAddress)

    const type = '/cosmos.staking.v1beta1.MsgBeginRedelegate'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
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
  }): ComposerResponse<MsgUndelegate, MsgUndelegate.AsObject> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount)

    const message = new MsgUndelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(injectiveAddress)
    message.setValidatorAddress(validatorAddress)

    const type = '/cosmos.staking.v1beta1.MsgUndelegate'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
