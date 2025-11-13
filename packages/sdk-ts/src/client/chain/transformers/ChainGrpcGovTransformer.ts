import { toHumanReadable } from '@injectivelabs/utils'
import { uint8ArrayToString } from '../../../utils/index.js'
import { protobufTimestampToUnixSeconds } from '../../../utils/time.js'
import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type * as CosmosGovV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/query_pb.mjs'
import type { Pagination } from '../../../types/index.js'
import type {
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

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcGovTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosGovV1QueryPb.QueryParamsResponse,
  ): GovModuleStateParams {
    const params = response.params

    return {
      depositParams: {
        minDeposit: params?.minDeposit ?? [],
        expeditedMinDeposit: params?.expeditedMinDeposit ?? [],
        maxDepositPeriod: Number(params?.maxDepositPeriod?.seconds ?? 0n),
      },
      votingParams: {
        votingPeriod: Number(params?.votingPeriod?.seconds ?? 0n),
        expeditedVotingPeriod: Number(
          params?.expeditedVotingPeriod?.seconds ?? 0n,
        ),
      },
      tallyParams: {
        quorum: !params?.quorum
          ? '0'
          : typeof params.quorum === 'string'
          ? params.quorum
          : uint8ArrayToString(params.quorum),
        threshold: !params?.threshold
          ? '0'
          : typeof params.threshold === 'string'
          ? params.threshold
          : uint8ArrayToString(params.threshold),
        vetoThreshold: !params?.vetoThreshold
          ? '0'
          : typeof params.vetoThreshold === 'string'
          ? params.vetoThreshold
          : uint8ArrayToString(params.vetoThreshold),
        expeditedThreshold: !params?.expeditedThreshold
          ? '0'
          : typeof params.expeditedThreshold === 'string'
          ? params.expeditedThreshold
          : uint8ArrayToString(params.expeditedThreshold),
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
        minDeposit: depositParams?.minDeposit,
        expeditedMinDeposit: depositParams?.expeditedMinDeposit,
        maxDepositPeriod: Number(
          depositParams?.maxDepositPeriod?.seconds ?? 0n,
        ),
      },
      votingParams: {
        votingPeriod: Number(votingParams.votingPeriod?.seconds ?? 0n),
        expeditedVotingPeriod: Number(
          votingParams.expeditedVotingPeriod?.seconds ?? 0n,
        ),
      },
      tallyParams: {
        quorum:
          typeof tallyParams.quorum === 'string'
            ? tallyParams.quorum
            : uint8ArrayToString(tallyParams.quorum),
        threshold:
          typeof tallyParams.threshold === 'string'
            ? tallyParams.threshold
            : uint8ArrayToString(tallyParams.threshold),
        vetoThreshold:
          typeof tallyParams.vetoThreshold === 'string'
            ? tallyParams.vetoThreshold
            : uint8ArrayToString(tallyParams.vetoThreshold),
        expeditedThreshold:
          typeof tallyParams.expeditedThreshold === 'string'
            ? tallyParams.expeditedThreshold
            : uint8ArrayToString(tallyParams.expeditedThreshold),
      },
    }
  }

  static proposalResponseToProposal(
    response: CosmosGovV1QueryPb.QueryProposalResponse,
  ): Proposal | undefined {
    if (!response.proposal) {
      return undefined
    }

    return ChainGrpcGovTransformer.grpcProposalToProposal(response.proposal)
  }

  static proposalsResponseToProposals(
    response: CosmosGovV1QueryPb.QueryProposalsResponse,
  ): {
    proposals: Proposal[]
    pagination: Pagination
  } {
    const proposals = response.proposals
      .map((p) => ChainGrpcGovTransformer.grpcProposalToProposal(p))
      .filter((p) => p !== undefined)
    const pagination = response.pagination

    return {
      proposals,
      pagination:
        ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(pagination),
    }
  }

  static depositsResponseToDeposits(
    response: CosmosGovV1QueryPb.QueryDepositsResponse,
  ): {
    deposits: ProposalDeposit[]
    pagination: Pagination
  } {
    const pagination = response.pagination
    const deposits = response.deposits.map((deposit) => {
      return {
        depositor: deposit.depositor,
        amounts: deposit.amount.map(
          (coin: { denom: string; amount: string }) => ({
            denom: coin.denom,
            amount: toHumanReadable(coin.amount).toFixed(),
          }),
        ),
      }
    })

    return {
      deposits,
      pagination:
        ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(pagination),
    }
  }

  static grpcVoteToVote(vote: GrpcVote): Vote {
    return {
      proposalId: Number(vote.proposalId),
      voter: vote.voter,
      metadata: vote.metadata,
      options: vote.options,
    }
  }

  static votesResponseToVotes(
    response: CosmosGovV1QueryPb.QueryVotesResponse,
  ): {
    votes: Vote[]
    pagination: Pagination
  } {
    return {
      votes: response.votes.map(ChainGrpcGovTransformer.grpcVoteToVote),
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static tallyResultResponseToTallyResult(
    response: CosmosGovV1QueryPb.QueryTallyResultResponse,
  ): TallyResult {
    const result = response.tally

    return ChainGrpcGovTransformer.grpcTallyResultToTallyResult(result)
  }

  static grpcTallyResultToTallyResult(
    result: GrpcTallyResult | undefined,
  ): TallyResult {
    return {
      yesCount: result?.yesCount ?? '0',
      abstainCount: result?.abstainCount ?? '0',
      noCount: result?.noCount ?? '0',
      noWithVetoCount: result?.noWithVetoCount ?? '0',
    }
  }

  static grpcProposalToProposal(proposal: GrpcProposal): Proposal | undefined {
    const finalTallyResult = proposal.finalTallyResult
    const [message] = proposal.messages ?? []

    if (!message) {
      return undefined
    }

    return {
      proposalId: Number(proposal.id),
      title: proposal.title,
      summary: proposal.summary,
      proposer: proposal.proposer,
      content: {
        type: message.typeUrl,
        value: message.value,
      },
      type: message.typeUrl,
      submitTime: protobufTimestampToUnixSeconds(proposal.submitTime),
      status: proposal.status,
      expedited: proposal.expedited,
      failedReason: proposal.failedReason,
      finalTallyResult:
        ChainGrpcGovTransformer.grpcTallyResultToTallyResult(finalTallyResult),
      depositEndTime: protobufTimestampToUnixSeconds(proposal.depositEndTime),
      totalDeposits: proposal.totalDeposit.map((coin) => ({
        denom: coin.denom,
        amount: toHumanReadable(coin.amount).toFixed(),
      })),
      votingStartTime: protobufTimestampToUnixSeconds(proposal.votingStartTime),
      votingEndTime: protobufTimestampToUnixSeconds(proposal.votingEndTime),
    }
  }
}
