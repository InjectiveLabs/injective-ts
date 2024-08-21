import MsgVote from './msgs/MsgVote'
import MsgGovDeposit from './msgs/MsgDeposit'
import MsgSubmitTextProposal from './msgs/MsgSubmitTextProposal'
import MsgSubmitGenericProposal from './msgs/MsgSubmitGenericProposal'
import MsgSubmitProposalSpotMarketLaunch from './msgs/MsgSubmitProposalSpotMarketLaunch'
import MsgSubmitProposalPerpetualMarketLaunch from './msgs/MsgSubmitProposalPerpetualMarketLaunch'
import MsgSubmitProposalSpotMarketParamUpdate from './msgs/MsgSubmitProposalSpotMarketParamUpdate'
import MsgSubmitProposalExpiryFuturesMarketLaunch from './msgs/MsgSubmitProposalExpiryFuturesMarketLaunch'

export type MsgSubmitProposal =
  | MsgSubmitTextProposal
  | MsgSubmitGenericProposal
  | MsgSubmitProposalSpotMarketLaunch
  | MsgSubmitProposalPerpetualMarketLaunch
  | MsgSubmitProposalSpotMarketParamUpdate
  | MsgSubmitProposalExpiryFuturesMarketLaunch

export {
  MsgSubmitTextProposal,
  MsgSubmitGenericProposal,
  MsgSubmitProposalSpotMarketLaunch,
  MsgSubmitProposalPerpetualMarketLaunch,
  MsgSubmitProposalSpotMarketParamUpdate,
  MsgSubmitProposalExpiryFuturesMarketLaunch,
}

export * from './ProposalContentDecomposer'

export { MsgVote, MsgGovDeposit }
