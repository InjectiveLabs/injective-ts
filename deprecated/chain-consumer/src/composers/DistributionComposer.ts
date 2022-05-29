import { AccountAddress, ComposerResponse } from '@injectivelabs/ts-types'
import { MsgWithdrawDelegatorReward } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/tx_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'

export class DistributionComposer {
  static withdrawDelegatorReward({
    delegatorAddress,
    validatorAddress,
  }: {
    validatorAddress: string
    delegatorAddress: AccountAddress
  }): ComposerResponse<
    MsgWithdrawDelegatorReward,
    MsgWithdrawDelegatorReward.AsObject
  > {
    const message = new MsgWithdrawDelegatorReward()
    message.setDelegatorAddress(delegatorAddress)
    message.setValidatorAddress(validatorAddress)

    const type = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
