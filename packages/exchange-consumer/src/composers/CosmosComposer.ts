import { AccountAddress } from '@injectivelabs/ts-types'
import { BigNumberInWei } from '@injectivelabs/utils'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { CosmosTxFee } from '@injectivelabs/exchange-api/injective_exchange_rpc_pb'
import { MsgSendToEth } from '@injectivelabs/chain-api/injective/peggy/v1beta1/msgs_pb'
import snakeCaseKeys from 'snakecase-keys'
import {
  MsgDelegate,
  MsgUndelegate,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'

export class CosmosComposer {
  static sendToEthereum({
    address,
    cosmosAddress,
    amount,
  }: {
    address: AccountAddress
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
  }): Record<string, any> {
    const gasLimit = 200000 // TODO
    const coinAmount = new Coin()
    coinAmount.setDenom('inj')
    coinAmount.setAmount(amount.toString())

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setGas(gasLimit)

    const bridgeFeeAmount = new Coin()
    bridgeFeeAmount.setDenom('inj')
    bridgeFeeAmount.setAmount('0')

    const cosmosMessage = new MsgSendToEth()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setSender(cosmosAddress)
    cosmosMessage.setEthDest(address)
    cosmosMessage.setBridgeFee(bridgeFeeAmount)

    // Hack for now until we generate the models in another way,
    // we must explicitly set msg type and convert key case.
    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/injective.peggy.v1beta1.MsgSendToEth',
    }
  }

  static delegate({
    cosmosAddress,
    validatorAddress,
    amount,
  }: {
    validatorAddress: string
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
  }): Record<string, any> {
    const gasLimit = 200000 // TODO
    const coinAmount = new Coin()
    coinAmount.setDenom('inj')
    coinAmount.setAmount(amount.toString())

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setGas(gasLimit)

    const bridgeFeeAmount = new Coin()
    bridgeFeeAmount.setDenom('inj')
    bridgeFeeAmount.setAmount('0')

    const cosmosMessage = new MsgDelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(cosmosAddress)
    cosmosMessage.setValidatorAddress(validatorAddress)

    // Hack for now until we generate the models in another way,
    // we must explicitly set msg type and convert key case.
    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
    }
  }

  static unBond({
    cosmosAddress,
    validatorAddress,
    amount,
  }: {
    validatorAddress: string
    cosmosAddress: AccountAddress
    amount: BigNumberInWei
  }): Record<string, any> {
    const gasLimit = 200000 // TODO
    const coinAmount = new Coin()
    coinAmount.setDenom('inj')
    coinAmount.setAmount(amount.toString())

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setGas(gasLimit)

    const bridgeFeeAmount = new Coin()
    bridgeFeeAmount.setDenom('inj')
    bridgeFeeAmount.setAmount('0')

    const cosmosMessage = new MsgUndelegate()
    cosmosMessage.setAmount(coinAmount)
    cosmosMessage.setDelegatorAddress(cosmosAddress)
    cosmosMessage.setValidatorAddress(validatorAddress)

    // Hack for now until we generate the models in another way,
    // we must explicitly set msg type and convert key case.
    return {
      ...snakeCaseKeys(cosmosMessage.toObject()),
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
    }
  }
}
