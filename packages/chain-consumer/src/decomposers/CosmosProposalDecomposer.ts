import { TextProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import { SoftwareUpgradeProposal } from '@injectivelabs/chain-api/cosmos/upgrade/v1beta1/upgrade_pb'

export class CosmosProposalDecomposer {
  static textProposal(content: Uint8Array) {
    return TextProposal.deserializeBinary(content)
  }

  static SoftwareUpgrade(content: Uint8Array) {
    return SoftwareUpgradeProposal.deserializeBinary(content)
  }
}
