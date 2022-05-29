import { AccountAddress, ComposerResponse } from '@injectivelabs/ts-types'
import snakeCaseKeys from 'snakecase-keys'
import {
  MsgVote,
  MsgDeposit,
} from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { VoteOptionMap } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'

export class GovernanceComposer {
  static vote({
    proposalId,
    vote,
    voter,
  }: {
    proposalId: number
    vote: VoteOptionMap[keyof VoteOptionMap]
    voter: AccountAddress
  }): ComposerResponse<MsgVote, MsgVote.AsObject> {
    const message = new MsgVote()
    message.setOption(vote)
    message.setProposalId(proposalId)
    message.setVoter(voter)

    const type = '/cosmos.gov.v1beta1.MsgVote'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static deposit({
    proposalId,
    amount,
    denom,
    depositor,
  }: {
    proposalId: number
    denom: string
    amount: string
    depositor: AccountAddress
  }): ComposerResponse<MsgDeposit, MsgDeposit.AsObject> {
    const deposit = new Coin()
    deposit.setAmount(amount)
    deposit.setDenom(denom)

    const message = new MsgDeposit()
    message.setDepositor(depositor)
    message.setProposalId(proposalId)

    const type = '/cosmos.gov.v1beta1.MsgDeposit'

    const messageObj = {
      ...snakeCaseKeys(message.toObject()),
      amount: [{ ...snakeCaseKeys(deposit.toObject()) }],
    } as MsgDeposit.AsObject

    // @ts-ignore
    delete messageObj.amount_list

    return {
      web3GatewayMessage: getWeb3GatewayMessage(messageObj, type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
