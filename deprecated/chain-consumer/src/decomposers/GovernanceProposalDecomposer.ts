import { ParameterChangeProposal } from '@injectivelabs/chain-api/cosmos/params/v1beta1/params_pb'

export class GovernanceProposalDecomposer {
  static parametersChange(content: Uint8Array) {
    return ParameterChangeProposal.deserializeBinary(content)
  }
}
