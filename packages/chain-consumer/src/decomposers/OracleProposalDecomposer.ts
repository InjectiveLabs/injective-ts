import {
  AuthorizeBandOracleRequestProposal,
  EnableBandIBCProposal,
} from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'

export class OracleProposalDecomposer {
  static EnableBandIBC(content: Uint8Array) {
    return EnableBandIBCProposal.deserializeBinary(content)
  }

  static AuthorizeBandOracleRequest(content: Uint8Array) {
    return AuthorizeBandOracleRequestProposal.deserializeBinary(content)
  }
}
