import { TextProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'

export class CosmosProposalDecomposer {
  static textProposal(content: Uint8Array) {
    return TextProposal.deserializeBinary(content)
  }
}
