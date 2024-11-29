import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerRestExplorerApi } from '../rest/index.js'
import { IndexerGrpcExplorerTransformer } from '../transformers/index.js'
import { ExplorerValidator } from '../types/index.js'
import { IndexerGrpcExplorerApi } from './IndexerGrpcExplorerApi.js'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.indexer)

describe('IndexerGrpcExplorerApi', () => {
  let validator: Partial<ExplorerValidator>

  beforeAll(async () => {
    return new Promise<void>(async (resolve) => {
      const validators = await new IndexerRestExplorerApi(
        `${endpoints.indexer}/api/explorer/v1`,
      ).fetchValidators()

      validator = validators[0]

      return resolve()
    })
  })

  test('fetchValidator', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchValidator(
        validator.operatorAddress!,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcExplorerTransformer.validatorResponseToValidator
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchValidator => ' + (e as any).message,
      )
    }
  })

  test('fetchValidatorUptime', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchValidatorUptime(
        validator.consensusAddress!,
      )

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcExplorerTransformer.getValidatorUptimeResponseToValidatorUptime
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchValidatorUptime => ' + (e as any).message,
      )
    }
  })

  test('fetchBlocks', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchBlocks({ limit: 1 })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchBlocks => ' + (e as any).message,
      )
    }
  })

  test('fetchBlock', async () => {
    try {
      const { data } = await indexerGrpcExplorerApi.fetchBlocks({
        limit: 1,
      })
      const [block] = data
      const response = await indexerGrpcExplorerApi.fetchBlock(block.height)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchBlock => ' + (e as any).message,
      )
    }
  })

  test('fetchTxs', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchTxs({ limit: 1 })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcExplorerApi.fetchTxs => ' + (e as any).message)
    }
  })

  test('fetchTxByHash', async () => {
    try {
      const { txs } = await indexerGrpcExplorerApi.fetchAccountTx({
        address: injectiveAddress,
        limit: 1,
      })
      const [tx] = txs
      const response = await indexerGrpcExplorerApi.fetchTxByHash(tx.hash)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcExplorerTransformer.getTxByTxHashResponseToTx
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchTxByHash => ' + (e as any).message,
      )
    }
  })

  test('fetchAccountTx', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchAccountTx({
        address: injectiveAddress,
        limit: 1,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcExplorerTransformer.getAccountTxsResponseToAccountTxs
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchAccountTx => ' + (e as any).message,
      )
    }
  })

  test('fetchIBCTransferTxs', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchIBCTransferTxs({
        limit: 1,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcExplorerTransformer.getIBCTransferTxsResponseToIBCTransferTxs
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchIBCTransferTxs => ' + (e as any).message,
      )
    }
  })

  test('fetchPeggyDepositTxs', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchPeggyDepositTxs({
        limit: 1,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcExplorerTransformer.getPeggyDepositTxsResponseToPeggyDepositTxs
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchPeggyDepositTxs => ' + (e as any).message,
      )
    }
  })

  test('fetchPeggyWithdrawalTxs', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchPeggyWithdrawalTxs({
        limit: 1,
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcExplorerTransformer.getPeggyWithdrawalTxsResponseToPeggyWithdrawalTxs
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchPeggyWithdrawalTxs => ' +
          (e as any).message,
      )
    }
  })

  test('fetchExplorerStats', async () => {
    try {
      const response = await indexerGrpcExplorerApi.fetchExplorerStats()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcExplorerTransformer.getExplorerStatsResponseToExplorerStats
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcExplorerApi.fetchExplorerStats => ' + (e as any).message,
      )
    }
  })
})
