import {
  GrantBandOraclePrivilegeProposal,
  RevokeBandOraclePrivilegeProposal,
  GrantPriceFeederPrivilegeProposal,
  RevokePriceFeederPrivilegeProposal,
} from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'

export class OracleProposalDecomposer {
  static grantBandOraclePrivilegeProposal(content: Uint8Array) {
    return GrantBandOraclePrivilegeProposal.deserializeBinary(content)
  }

  static removeBandOraclePrivilegeProposal(content: Uint8Array) {
    return RevokeBandOraclePrivilegeProposal.deserializeBinary(content)
  }

  static grantPriceFeederPrivilegeProposal(content: Uint8Array) {
    return GrantPriceFeederPrivilegeProposal.deserializeBinary(content)
  }

  static removePriceFeederPrivilegeProposal(content: Uint8Array) {
    return RevokePriceFeederPrivilegeProposal.deserializeBinary(content)
  }
}
