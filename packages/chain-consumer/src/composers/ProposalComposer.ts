import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { AccountAddress } from '@injectivelabs/ts-types'
import { TextProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import snakeCaseKeys from 'snakecase-keys'
import { DepositProposalParams } from '../types'

export class ProposalComposer {
  static textProposal({
    title,
    description,
    deposit,
    proposer,
  }: {
    title: string
    description: string
    proposer: AccountAddress
    deposit: DepositProposalParams
  }) {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount)

    const content = new TextProposal()
    content.setTitle(title)
    content.setDescription(description)

    return {
      proposer,
      content: {
        '@type': '/cosmos.gov.v1beta1.TextProposal',
        ...snakeCaseKeys(content.toObject()),
      },
      initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
    }
  }
}
