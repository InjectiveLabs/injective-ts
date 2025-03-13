import MsgVote from './msgs/MsgVote.js'
import MsgGovDeposit from './msgs/MsgDeposit.js'
import MsgSubmitTextProposal from './msgs/MsgSubmitTextProposal.js'
import MsgSubmitGenericProposal from './msgs/MsgSubmitGenericProposal.js'
import MsgSubmitProposalSpotMarketLaunch from './msgs/MsgSubmitProposalSpotMarketLaunch.js'
import MsgSubmitProposalPerpetualMarketLaunch from './msgs/MsgSubmitProposalPerpetualMarketLaunch.js'
import MsgSubmitProposalSpotMarketParamUpdate from './msgs/MsgSubmitProposalSpotMarketParamUpdate.js'
import MsgSubmitProposalExpiryFuturesMarketLaunch from './msgs/MsgSubmitProposalExpiryFuturesMarketLaunch.js'

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

export * from './ProposalContentDecomposer.js'

export { MsgVote, MsgGovDeposit }
