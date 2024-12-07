import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcGovApi } from './ChainGrpcGovApi.js'
// import { mockFactory } from '@injectivelabs/utils/test-utils'
import { ChainGrpcGovTransformer } from '../transformers/index.js'
import { CosmosGovV1Gov } from '@injectivelabs/core-proto-ts'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcGovApi = new ChainGrpcGovApi(endpoints.grpc)
const proposalId = 1

describe('ChainGrpcGovApi', () => {
  test('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcGovApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcGovTransformer.moduleParamsResponseToModuleParamsByType
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcGovApi.fetchModuleParams => ' + (e as any).message,
      )
    }
  })

  test('fetchProposals', async () => {
    try {
      const response = await chainGrpcGovApi.fetchProposals({
        status: CosmosGovV1Gov.ProposalStatus.PROPOSAL_STATUS_PASSED,
      })

      if (response.proposals.length === 0) {
        console.warn('fetchProposals.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcGovTransformer.proposalsResponseToProposals
          >
        >(response),
      )
    } catch (e) {
      console.error('chainGrpcGovApi.fetchProposals => ' + (e as any).message)
    }
  })

  test('fetchProposal', async () => {
    try {
      const response = await chainGrpcGovApi.fetchProposal(proposalId)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcGovTransformer.proposalResponseToProposal>
        >(response),
      )
    } catch (e) {
      console.error('chainGrpcGovApi.fetchProposal => ' + (e as any).message)
    }
  })

  test('fetchProposalDeposits', async () => {
    try {
      const response = await chainGrpcGovApi.fetchProposalDeposits({
        proposalId,
      })

      if (response.deposits.length === 0) {
        console.warn('fetchProposalDeposits.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcGovTransformer.depositsResponseToDeposits>
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcGovApi.fetchProposalDeposits => ' + (e as any).message,
      )
    }
  })

  test('fetchProposalVotes', async () => {
    try {
      const response = await chainGrpcGovApi.fetchProposalVotes({
        proposalId,
      })

      if (response.votes.length === 0) {
        console.warn('fetchProposalVotes.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcGovTransformer.votesResponseToVotes>
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcGovApi.fetchProposalVotes => ' + (e as any).message,
      )
    }
  })

  test('fetchProposalTally', async () => {
    try {
      const response = await chainGrpcGovApi.fetchProposalTally(proposalId)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcGovTransformer.tallyResultResponseToTallyResult
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'chainGrpcGovApi.fetchProposalTally => ' + (e as any).message,
      )
    }
  })
})
