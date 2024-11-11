import { uint8ArrayToString } from '../../../utils/index.js'
import {
  Vote,
  Proposal,
  GrpcVote,
  TallyResult,
  GrpcProposal,
  ProposalDeposit,
  GrpcTallyResult,
  GovModuleStateParams,
  GrpcGovernanceTallyParams,
  GrpcGovernanceVotingParams,
  GrpcGovernanceDepositParams,
} from '../types/gov.js'
import { Pagination } from '../../../types/index.js'
import { grpcPaginationToPagination } from '../../../utils/pagination.js'
import { cosmosSdkDecToBigNumber } from '../../../utils/index.js'
import { CosmosGovV1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcGovTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosGovV1Query.QueryParamsResponse,
  ): GovModuleStateParams {
    const params = response.params

    return {
      depositParams: {
        minDepositList: params?.minDeposit || [],
        maxDepositPeriod: parseInt(
          params?.maxDepositPeriod?.seconds || '0',
          10,
        ),
      },
      votingParams: {
        votingPeriod: parseInt(params?.votingPeriod?.seconds || '0'),
      },
      tallyParams: {
        quorum: uint8ArrayToString(params?.quorum || '0'),
        threshold: uint8ArrayToString(params?.threshold || '0'),
        vetoThreshold: uint8ArrayToString(params?.vetoThreshold || '0'),
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
        minDepositList: depositParams?.minDeposit,
        maxDepositPeriod: parseInt(
          depositParams?.maxDepositPeriod?.seconds || '0',
          10,
        ),
      },
      votingParams: {
        votingPeriod: parseInt(votingParams.votingPeriod?.seconds || '0'),
      },
      tallyParams: {
        quorum: uint8ArrayToString(tallyParams.quorum),
        threshold: uint8ArrayToString(tallyParams.threshold),
        vetoThreshold: uint8ArrayToString(tallyParams.vetoThreshold),
      },
    }
  }

  static proposalResponseToProposal(
    response: CosmosGovV1Query.QueryProposalResponse,
  ): Proposal {
    const proposal = response.proposal!

    return ChainGrpcGovTransformer.grpcProposalToProposal(proposal)
  }

  static proposalsResponseToProposals(
    response: CosmosGovV1Query.QueryProposalsResponse,
  ): {
    proposals: Proposal[]
    pagination: Pagination
  } {
    const proposals = response.proposals.map((p) =>
      ChainGrpcGovTransformer.grpcProposalToProposal(p),
    )
    const pagination = response.pagination

    return {
      proposals: proposals,
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static depositsResponseToDeposits(
    response: CosmosGovV1Query.QueryDepositsResponse,
  ): {
    deposits: ProposalDeposit[]
    pagination: Pagination
  } {
    const pagination = response.pagination
    const deposits = response.deposits.map((deposit) => {
      return {
        depositor: deposit.depositor,
        amounts: deposit.amount.map((coin) => ({
          denom: coin.denom,
          amount: cosmosSdkDecToBigNumber(coin.amount).toFixed(),
        })),
      }
    })

    return {
      deposits: deposits,
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static grpcVoteToVote(vote: GrpcVote): Vote {
    return {
      proposalId: parseInt(vote.proposalId, 10),
      voter: vote.voter,
      metadata: vote.metadata,
      options: vote.options,
    }
  }

  static votesResponseToVotes(response: CosmosGovV1Query.QueryVotesResponse): {
    votes: Vote[]
    pagination: Pagination
  } {
    return {
      votes: response.votes.map(ChainGrpcGovTransformer.grpcVoteToVote),
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }

  static tallyResultResponseToTallyResult(
    response: CosmosGovV1Query.QueryTallyResultResponse,
  ): TallyResult {
    const result = response.tally

    return ChainGrpcGovTransformer.grpcTallyResultToTallyResult(result)
  }

  static grpcTallyResultToTallyResult(
    result: GrpcTallyResult | undefined,
  ): TallyResult {
    return {
      yesCount: result ? result.yesCount : '0',
      abstainCount: result ? result.abstainCount : '0',
      noCount: result ? result.noCount : '0',
      noWithVetoCount: result ? result.noWithVetoCount : '0',
    }
  }

  static grpcProposalToProposal(proposal: GrpcProposal): Proposal {
    const finalTallyResult = proposal.finalTallyResult
    const [message] = proposal.messages!

    return {
      proposalId: parseInt(proposal.id, 10),
      title: proposal.title,
      summary: proposal.summary,
      proposer: proposal.proposer,
      content: {
        type: message.typeUrl,
        value: message.value,
      },
      type: message.typeUrl,
      submitTime: proposal.submitTime
        ? Math.floor(proposal.submitTime!.getTime() / 1000)
        : 0,
      status: proposal.status,
      finalTallyResult:
        ChainGrpcGovTransformer.grpcTallyResultToTallyResult(finalTallyResult),
      depositEndTime: proposal.depositEndTime
        ? Math.floor(proposal.depositEndTime.getTime() / 1000)
        : 0,
      totalDeposits: proposal.totalDeposit.map((coin) => ({
        denom: coin.denom,
        amount: cosmosSdkDecToBigNumber(coin.amount).toFixed(),
      })),
      votingStartTime: proposal.votingStartTime
        ? Math.floor(proposal.votingStartTime.getTime() / 1000)
        : 0,
      votingEndTime: proposal.votingEndTime
        ? Math.floor(proposal.votingEndTime.getTime() / 1000)
        : 0,
    }
  }
}
