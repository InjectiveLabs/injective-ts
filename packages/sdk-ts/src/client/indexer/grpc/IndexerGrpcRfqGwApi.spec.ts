import { vi } from 'vitest'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcRfqGwApi } from './IndexerGrpcRfqGwApi.js'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcRfqGwApi = new IndexerGrpcRfqGwApi(endpoints.indexer)

describe('IndexerGrpcRfqGwApi', () => {
  test('fetchPrepareAutoSign', async () => {
    const response = await indexerGrpcRfqGwApi.fetchPrepareAutoSign({
      direction: 'LONG',
      autosignAccountNumber: 0,
      clientId: 'test-client-id',
      autosignAccountSequence: 0,
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      autosignPubKey: '0x1234567890abcdef',
      autosignAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      marketId:
        '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      tx: expect.any(String),
      feePayer: expect.any(String),
      feePayerSig: expect.any(String),
      rfqId: expect.any(Number),
      quotesWaitMs: expect.any(Number),
      autosignAccountNumber: expect.any(Number),
      feePayerAccountNumber: expect.any(Number),
      autosignAccountSequence: expect.any(Number),
      feePayerAccountSequence: expect.any(Number),
      quotes: expect.any(Array),
    })
  })

  test('fetchPrepareAutoSign forwards zero-valued numeric fields to the request', async () => {
    // Zero is a legitimate value for a fresh auto-sign account's first tx
    // (account number and sequence both start at 0). The guards in the
    // implementation must not drop it.
    const api = new IndexerGrpcRfqGwApi(endpoints.indexer)
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        tx: '',
        feePayer: '',
        signMode: 0,
        rfqId: 0n,
        pubKeyType: '',
        feePayerSig: '',
        quotesWaitMs: 0n,
        autosignAccountNumber: 0n,
        feePayerAccountNumber: 0n,
        autosignAccountSequence: 0n,
        feePayerAccountSequence: 0n,
        quotes: [],
      })

    await api.fetchPrepareAutoSign({
      direction: 'LONG',
      autosignAccountNumber: 0,
      autosignAccountSequence: 0,
      feePayerAccountNumber: 0,
      feePayerAccountSequence: 0,
      expiry: 0,
      quotesWaitTimeMs: 0,
      clientId: 'test-client-id',
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      autosignPubKey: '0x1234567890abcdef',
      autosignAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      marketId:
        '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
    })

    const [requestMessage] = executeGrpcCall.mock.calls[0]
    const request = (requestMessage as { request: Record<string, unknown> })
      .request

    expect(request.autosignAccountNumber).toBe(0n)
    expect(request.autosignAccountSequence).toBe(0n)
    expect(request.feePayerAccountNumber).toBe(0n)
    expect(request.feePayerAccountSequence).toBe(0n)
    expect(request.expiry).toBe(0n)
    expect(request.quotesWaitTimeMs).toBe(0n)

    executeGrpcCall.mockRestore()
  })

  test('fetchPrepare', async () => {
    const response = await indexerGrpcRfqGwApi.fetchPrepare({
      direction: 'LONG',
      takerAccountNumber: 0,
      takerAccountSequence: 0,
      clientId: 'test-client-id',
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      takerPubKey: '0x1234567890abcdef',
      takerAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      marketId:
        '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      tx: expect.any(String),
      feePayer: expect.any(String),
      feePayerSig: expect.any(String),
      rfqId: expect.any(Number),
      quotesWaitMs: expect.any(Number),
      takerAccountNumber: expect.any(Number),
      takerAccountSequence: expect.any(Number),
      feePayerAccountNumber: expect.any(Number),
      feePayerAccountSequence: expect.any(Number),
      quotes: expect.any(Array),
    })
  })

  test('fetchPrepareEip712', async () => {
    const response = await indexerGrpcRfqGwApi.fetchPrepareEip712({
      direction: 'LONG',
      ethChainId: 1,
      eip712Wrapper: 'v2',
      takerAccountNumber: 0,
      takerAccountSequence: 0,
      clientId: 'test-client-id',
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      takerPubKey: '0x1234567890abcdef',
      takerAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      marketId:
        '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      data: expect.any(String),
      feePayer: expect.any(String),
      feePayerSig: expect.any(String),
      rfqId: expect.any(Number),
      quotesWaitMs: expect.any(Number),
      takerAccountNumber: expect.any(Number),
      takerAccountSequence: expect.any(Number),
      quotes: expect.any(Array),
    })
  })

  test('fetchPrepareEip712AutoSign', async () => {
    const response = await indexerGrpcRfqGwApi.fetchPrepareEip712AutoSign({
      direction: 'LONG',
      ethChainId: 1,
      eip712Wrapper: 'v2',
      autosignAccountNumber: 0,
      autosignAccountSequence: 0,
      clientId: 'test-client-id',
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      autosignPubKey: '0x1234567890abcdef',
      autosignAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
      marketId:
        '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6',
    })

    expect(response).toBeDefined()
    expect(response).toMatchObject({
      data: expect.any(String),
      feePayer: expect.any(String),
      feePayerSig: expect.any(String),
      rfqId: expect.any(Number),
      quotesWaitMs: expect.any(Number),
      autosignAccountNumber: expect.any(Number),
      autosignAccountSequence: expect.any(Number),
      quotes: expect.any(Array),
    })
  })
})
