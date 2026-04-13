import MsgVote from './msgs/MsgVote.js'
import MsgGovDeposit from './msgs/MsgDeposit.js'
import MsgSubmitTextProposal from './msgs/MsgSubmitTextProposal.js'
import MsgSubmitGenericProposal from './msgs/MsgSubmitGenericProposal.js'
import MsgSubmitProposalSpotMarketLaunch from './msgs/MsgSubmitProposalSpotMarketLaunch.js'
import MsgGrantProviderPrivilegeProposal from './msgs/MsgGrantProviderPrivilegeProposal.js'
import MsgSubmitProposalPerpetualMarketLaunch from './msgs/MsgSubmitProposalPerpetualMarketLaunch.js'
import MsgSubmitProposalSpotMarketParamUpdate from './msgs/MsgSubmitProposalSpotMarketParamUpdate.js'
import MsgSubmitProposalPerpetualMarketLaunchV2 from './msgs/MsgSubmitProposalPerpetualMarketLaunchV2.js'
import MsgSubmitProposalExpiryFuturesMarketLaunch from './msgs/MsgSubmitProposalExpiryFuturesMarketLaunch.js'

export type MsgSubmitProposal =
  | MsgSubmitTextProposal
  | MsgSubmitGenericProposal
  | MsgSubmitProposalSpotMarketLaunch
  | MsgSubmitProposalPerpetualMarketLaunch
  | MsgSubmitProposalSpotMarketParamUpdate
  | MsgSubmitProposalPerpetualMarketLaunchV2
  | MsgSubmitProposalExpiryFuturesMarketLaunch
  | MsgGrantProviderPrivilegeProposal

export {
  MsgSubmitTextProposal,
  MsgSubmitGenericProposal,
  MsgSubmitProposalSpotMarketLaunch,
  MsgSubmitProposalPerpetualMarketLaunch,
  MsgSubmitProposalSpotMarketParamUpdate,
  MsgSubmitProposalPerpetualMarketLaunchV2,
  MsgSubmitProposalExpiryFuturesMarketLaunch,
  MsgGrantProviderPrivilegeProposal,
}

export * from './ProposalContentDecomposer.js'

export { MsgVote, MsgGovDeposit }
