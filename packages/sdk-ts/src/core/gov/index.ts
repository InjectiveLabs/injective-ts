export { default as MsgVote } from './msgs/MsgVote'
export { default as MsgGovDeposit } from './msgs/MsgDeposit'
import { default as MsgSubmitProposalExpiryFuturesMarketLaunch } from './msgs/MsgSubmitProposalExpiryFuturesMarketLaunch'
import { default as MsgSubmitProposalPerpetualMarketLaunch } from './msgs/MsgSubmitProposalPerpetualMarketLaunch'
import { default as MsgSubmitProposalSpotMarketLaunch } from './msgs/MsgSubmitProposalSpotMarketLaunch'
import { default as MsgSubmitProposalSpotMarketParamUpdate } from './msgs/MsgSubmitProposalSpotMarketParamUpdate'
import { default as MsgSubmitTextProposal } from './msgs/MsgSubmitTextProposal'

export type MsgSubmitProposal =
  | MsgSubmitProposalExpiryFuturesMarketLaunch
  | MsgSubmitProposalPerpetualMarketLaunch
  | MsgSubmitProposalSpotMarketLaunch
  | MsgSubmitProposalSpotMarketParamUpdate
  | MsgSubmitTextProposal

export {
  MsgSubmitProposalExpiryFuturesMarketLaunch,
  MsgSubmitProposalPerpetualMarketLaunch,
  MsgSubmitProposalSpotMarketLaunch,
  MsgSubmitProposalSpotMarketParamUpdate,
  MsgSubmitTextProposal,
}

export * from './ProposalContentDecomposer'
