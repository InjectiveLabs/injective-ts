import { AccountAddress } from '@injectivelabs/ts-types'
import { MsgWithdrawDelegatorReward } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/tx_pb'

export class DistributionProtoComposer {
  static withdrawDelegatorReward({
    delegatorAddress,
    validatorAddress,
  }: {
    validatorAddress: string
    delegatorAddress: AccountAddress
  }) {
    const message = new MsgWithdrawDelegatorReward()
    message.setDelegatorAddress(delegatorAddress)
    message.setValidatorAddress(validatorAddress)

    return {
      message,
      type: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    }
  }
}
