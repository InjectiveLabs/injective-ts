import { AccountAddress } from '@injectivelabs/ts-types'
import { BigNumberInWei } from '@injectivelabs/utils'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { CosmosTxFee } from '@injectivelabs/exchange-api/injective_exchange_rpc_pb'
import { MsgSendToEth } from '@injectivelabs/chain-api/injective/peggy/v1/msgs_pb'
import snakeCaseKeys from 'snakecase-keys'
import {
  MsgDelegate,
  MsgUndelegate,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import {
  DEFAULT_BRIDGE_FEE_AMOUNT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_GAS_LIMIT,
} from '../constants'

export class CosmosComposer {
  static withdraw({
    address,
    cosmosAddress,
    amount,
    denom,
    bridgeFeeDenom = DEFAULT_BRIDGE_FEE_DENOM,
    bridgeFeeAmount = DEFAULT_BRIDGE_FEE_AMOUNT,
    gasLimit = DEFAULT_GAS_LIMIT,
  }: {
    denom: string
    address: AccountAddress
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
    bridgeFeeDenom?: string
    bridgeFeeAmount?: string
    gasLimit?: number
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount.toString())

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setGas(gasLimit)

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
      '@type': '/injective.peggy.v1beta1.MsgSendToEth',
    }
  }

  static delegate({
    cosmosAddress,
    validatorAddress,
    amount,
    denom,
    gasLimit = DEFAULT_GAS_LIMIT,
  }: {
    denom: string
    validatorAddress: string
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
    gasLimit?: number
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount.toString())

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setGas(gasLimit)

    const cosmosMessage = new MsgDelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(cosmosAddress)
    cosmosMessage.setValidatorAddress(validatorAddress)

    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
    }
  }

  static unbond({
    cosmosAddress,
    validatorAddress,
    amount,
    denom,
    gasLimit = DEFAULT_GAS_LIMIT,
  }: {
    denom: string
    validatorAddress: string
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
    gasLimit?: number
  }): Record<string, any> {
    const coinAmount = new Coin()
    coinAmount.setDenom(denom)
    coinAmount.setAmount(amount.toString())

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setGas(gasLimit)

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
