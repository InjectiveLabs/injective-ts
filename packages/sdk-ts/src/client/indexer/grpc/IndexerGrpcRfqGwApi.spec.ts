import { vi } from 'vitest'
import { IndexerGrpcRfqGwApi } from './IndexerGrpcRfqGwApi.js'

const ENDPOINT = 'https://rfq.gateway.grpc-web.injective.network'
const MARKET_ID =
  '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6'
const CLIENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const AUTOSIGN_ADDRESS = 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49'

describe('IndexerGrpcRfqGwApi', () => {
  test('fetchPrepareAutoSign', async () => {
    const api = new IndexerGrpcRfqGwApi(ENDPOINT)
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        tx: 'mock-tx',
        feePayer: AUTOSIGN_ADDRESS,
        signMode: 1,
        rfqId: 1n,
        pubKeyType: '',
        feePayerSig: 'mock-sig',
        quotesWaitMs: 1000n,
        expiredQuotesCount: 0n,
        autosignAccountNumber: 1n,
        feePayerAccountNumber: 2n,
        autosignAccountSequence: 3n,
        feePayerAccountSequence: 4n,
        feePayerPubKey: undefined,
        quotes: [],
      })

    const response = await api.fetchPrepareAutoSign({
      direction: 'long',
      autosignAccountNumber: 1,
      autosignAccountSequence: 3,
      clientId: CLIENT_ID,
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      autosignPubKey: '0x1234567890abcdef',
      autosignAddress: AUTOSIGN_ADDRESS,
      marketId: MARKET_ID,
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

    executeGrpcCall.mockRestore()
  })

  test('fetchPrepareAutoSign forwards zero-valued numeric fields to the request', async () => {
    // Zero is a legitimate value for a fresh auto-sign account's first tx
    // (account number and sequence both start at 0). The guards in the
    // implementation must not drop it.
    const api = new IndexerGrpcRfqGwApi(ENDPOINT)
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
        expiredQuotesCount: 0n,
        autosignAccountNumber: 0n,
        feePayerAccountNumber: 0n,
        autosignAccountSequence: 0n,
        feePayerAccountSequence: 0n,
        feePayerPubKey: undefined,
        quotes: [],
      })

    await api.fetchPrepareAutoSign({
      direction: 'long',
      autosignAccountNumber: 0,
      autosignAccountSequence: 0,
      feePayerAccountNumber: 0,
      feePayerAccountSequence: 0,
      expiry: 0,
      quotesWaitTimeMs: 0,
      clientId: CLIENT_ID,
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      autosignPubKey: '0x1234567890abcdef',
      autosignAddress: AUTOSIGN_ADDRESS,
      marketId: MARKET_ID,
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
    const api = new IndexerGrpcRfqGwApi(ENDPOINT)
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        tx: 'mock-tx',
        feePayer: AUTOSIGN_ADDRESS,
        signMode: 1,
        rfqId: 1n,
        pubKeyType: '',
        feePayerSig: 'mock-sig',
        quotesWaitMs: 1000n,
        expiredQuotesCount: 0n,
        takerAccountNumber: 1n,
        takerAccountSequence: 2n,
        feePayerAccountNumber: 3n,
        feePayerAccountSequence: 4n,
        feePayerPubKey: undefined,
        quotes: [],
      })

    const response = await api.fetchPrepare({
      direction: 'long',
      takerAccountNumber: 1,
      takerAccountSequence: 2,
      clientId: CLIENT_ID,
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      takerPubKey: '0x1234567890abcdef',
      takerAddress: AUTOSIGN_ADDRESS,
      marketId: MARKET_ID,
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

    executeGrpcCall.mockRestore()
  })

  test('fetchPrepareEip712', async () => {
    const api = new IndexerGrpcRfqGwApi(ENDPOINT)
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        data: 'mock-data',
        feePayer: AUTOSIGN_ADDRESS,
        signMode: 1,
        rfqId: 1n,
        pubKeyType: '',
        feePayerSig: 'mock-sig',
        quotesWaitMs: 1000n,
        expiredQuotesCount: 0n,
        takerAccountNumber: 1n,
        takerAccountSequence: 2n,
        feePayerPubKey: undefined,
        quotes: [],
      })

    const response = await api.fetchPrepareEip712({
      direction: 'long',
      ethChainId: 1,
      eip712Wrapper: 'v2',
      takerAccountNumber: 1,
      takerAccountSequence: 2,
      clientId: CLIENT_ID,
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      takerPubKey: '0x1234567890abcdef',
      takerAddress: AUTOSIGN_ADDRESS,
      marketId: MARKET_ID,
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

    executeGrpcCall.mockRestore()
  })

  test('fetchPrepareEip712AutoSign', async () => {
    const api = new IndexerGrpcRfqGwApi(ENDPOINT)
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        data: 'mock-data',
        feePayer: AUTOSIGN_ADDRESS,
        signMode: 1,
        rfqId: 1n,
        pubKeyType: '',
        feePayerSig: 'mock-sig',
        quotesWaitMs: 1000n,
        expiredQuotesCount: 0n,
        autosignAccountNumber: 1n,
        autosignAccountSequence: 2n,
        feePayerPubKey: undefined,
        quotes: [],
      })

    const response = await api.fetchPrepareEip712AutoSign({
      direction: 'long',
      ethChainId: 1,
      eip712Wrapper: 'v2',
      autosignAccountNumber: 1,
      autosignAccountSequence: 2,
      clientId: CLIENT_ID,
      margin: '1000000000000000000',
      quantity: '1000000000000000000',
      worstPrice: '1000000000000000000',
      autosignPubKey: '0x1234567890abcdef',
      autosignAddress: AUTOSIGN_ADDRESS,
      marketId: MARKET_ID,
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

    executeGrpcCall.mockRestore()
  })
})
