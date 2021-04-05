import { AccountAddress } from '@injectivelabs/ts-types'
import snakeCaseKeys from 'snakecase-keys'
import { MsgWithdrawDelegatorReward } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/tx_pb'

export class DistributionComposer {
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
}
