import {
  QueryParamsResponse as QueryGovernanceParamsResponse,
  QueryProposalsResponse,
  QueryProposalResponse,
  QueryDepositsResponse,
  QueryTallyResultResponse,
  QueryVotesResponse,
} from '@injectivelabs/chain-api/cosmos/gov/v1beta1/query_pb'
import { uint8ArrayToString } from '../../../utils'
import {
  GovModuleStateParams,
  Proposal,
  GrpcProposal,
  ProposalDeposit,
  Vote,
  TallyResult,
  GrpcTallyResult,
  GrpcGovernanceDepositParams,
  GrpcGovernanceVotingParams,
  GrpcGovernanceTallyParams,
} from '../types/gov'
import { Pagination } from '../../../types/index'
import { grpcPaginationToPagination } from '../../../utils/pagination'
import { cosmosSdkDecToBigNumber } from '../../../utils'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcGovTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryGovernanceParamsResponse,
  ): GovModuleStateParams {
    const depositParams = response.getDepositParams()!
    const votingParams = response.getVotingParams()!
    const tallyParams = response.getTallyParams()!

    return {
      depositParams: {
        minDepositList: depositParams
          ?.getMinDepositList()
          .map((m) => m.toObject()),
        maxDepositPeriod:
          depositParams?.getMaxDepositPeriod()?.getSeconds() || 0,
      },
      votingParams: {
        votingPeriod: votingParams.getVotingPeriod()?.getSeconds() || 0,
      },
      tallyParams: {
        quorum: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.getQuorum()) as string,
        ).toFixed(),
        threshold: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.getThreshold()) as string,
        ).toFixed(),
        vetoThreshold: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.getVetoThreshold()) as string,
        ).toFixed(),
      },
    }
  }

  static moduleParamsResponseToModuleParamsByType({
    depositParams,
    votingParams,
    tallyParams,
  }: {
    depositParams: GrpcGovernanceDepositParams
    votingParams: GrpcGovernanceVotingParams
    tallyParams: GrpcGovernanceTallyParams
  }): GovModuleStateParams {
    return {
      depositParams: {
        minDepositList: depositParams
          ?.getMinDepositList()
          .map((m) => m.toObject()),
        maxDepositPeriod:
          depositParams?.getMaxDepositPeriod()?.getSeconds() || 0,
      },
      votingParams: {
        votingPeriod: votingParams.getVotingPeriod()?.getSeconds() || 0,
      },
      tallyParams: {
        quorum: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.getQuorum()) as string,
        ).toFixed(),
        threshold: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.getThreshold()) as string,
        ).toFixed(),
        vetoThreshold: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.getVetoThreshold()) as string,
        ).toFixed(),
      },
    }
  }

  static proposalResponseToProposal(response: QueryProposalResponse): Proposal {
    const proposal = response.getProposal()!

    return ChainGrpcGovTransformer.grpcProposalToProposal(proposal)
  }

  static proposalsResponseToProposals(response: QueryProposalsResponse): {
    proposals: Proposal[]
    pagination: Pagination
  } {
    const proposals = response
      .getProposalsList()
      .map((p) => ChainGrpcGovTransformer.grpcProposalToProposal(p))
    const pagination = response.getPagination()

    return {
      proposals: proposals,
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static depositsResponseToDeposits(response: QueryDepositsResponse): {
    deposits: ProposalDeposit[]
    pagination: Pagination
  } {
    const pagination = response.getPagination()
    const deposits = response.getDepositsList().map((deposit) => {
      return {
        depositor: deposit.getDepositor(),
        amounts: deposit.getAmountList().map((coin) => ({
          denom: coin.getDenom(),
          amount: cosmosSdkDecToBigNumber(coin.getAmount()).toFixed(),
        })),
      }
    })

    return {
      deposits: deposits,
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static votesResponseToVotes(response: QueryVotesResponse): {
    votes: Vote[]
    pagination: Pagination
  } {
    const pagination = response.getPagination()
    const votes = response.getVotesList().map((v) => {
      return {
        proposalId: v.getProposalId(),
        voter: v.getVoter(),
        option: v.getOption(),
      }
    })

    return {
      votes: votes,
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static tallyResultResponseToTallyResult(
    response: QueryTallyResultResponse,
  ): TallyResult {
    const result = response.getTally()

    return ChainGrpcGovTransformer.grpcTallyResultToTallyResult(result)
  }

  static grpcTallyResultToTallyResult(
    result: GrpcTallyResult | undefined,
  ): TallyResult {
    return {
      yes: result ? result.getYes() : '0',
      abstain: result ? result.getAbstain() : '0',
      no: result ? result.getNo() : '0',
      noWithVeto: result ? result.getNoWithVeto() : '0',
    }
  }

  static grpcProposalToProposal(proposal: GrpcProposal): Proposal {
    const finalTallyResult = proposal.getFinalTallyResult()
    const content = proposal.getContent()!

    return {
      proposalId: proposal.getProposalId(),
      content: {
        type: content.getTypeName(),
        value: content.getValue(),
      },
      type: content.getTypeName(),
      submitTime: proposal.getSubmitTime()!.getSeconds(),
      status: proposal.getStatus(),
      finalTallyResult:
        ChainGrpcGovTransformer.grpcTallyResultToTallyResult(finalTallyResult),
      depositEndTime: proposal.getDepositEndTime()!.getSeconds(),
      totalDeposits: proposal.getTotalDepositList().map((coin) => ({
        denom: coin.getDenom(),
        amount: cosmosSdkDecToBigNumber(coin.getAmount()).toFixed(),
      })),
      votingStartTime: proposal.getVotingStartTime()!.getSeconds(),
      votingEndTime: proposal.getVotingEndTime()!.getSeconds(),
    }
  }
}
