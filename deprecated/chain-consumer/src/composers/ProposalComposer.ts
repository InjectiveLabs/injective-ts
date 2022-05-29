import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import {
  AccountAddress,
  ComposerResponse,
  Web3GatewayMessage,
} from '@injectivelabs/ts-types'
import { TextProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import snakeCaseKeys from 'snakecase-keys'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { MsgSubmitProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'
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
  }): ComposerResponse<MsgSubmitProposal, MsgSubmitProposal.AsObject> {
    const depositParams = new Coin()
    depositParams.setDenom(deposit.denom)
    depositParams.setAmount(deposit.amount)

    const content = new TextProposal()
    content.setTitle(title)
    content.setDescription(description)

    const proposalType = '/cosmos.gov.v1beta1.TextProposal'
    const type = '/cosmos.gov.v1beta1.MsgSubmitProposal'

    const contentAny = new Any()
    contentAny.setValue(content.serializeBinary())
    contentAny.setTypeUrl(proposalType)

    const message = new MsgSubmitProposal()
    message.setContent(contentAny)
    message.setProposer(proposer)
    message.setInitialDepositList([depositParams])

    const web3GatewayMessage = getWeb3GatewayMessage(
      {
        proposer,
        content: {
          ...content.toObject(),
        },
        initial_deposit: [{ ...snakeCaseKeys(depositParams.toObject()) }],
      },
      type,
    )
    const web3GatewayMessageWithProposalType = {
      ...web3GatewayMessage,
      content: {
        ...web3GatewayMessage.content,
        '@type': proposalType,
      },
    } as unknown as Web3GatewayMessage<MsgSubmitProposal.AsObject>

    return {
      web3GatewayMessage: web3GatewayMessageWithProposalType,
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
