import { vi, test, expect, describe, afterEach } from 'vitest'
import * as InjectiveRfqGwRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb'
import { IndexerGrpcRfqGwApi } from './IndexerGrpcRfqGwApi.js'

const api = new IndexerGrpcRfqGwApi('http://localhost:1')

describe('IndexerGrpcRfqGwApi cancellation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('fetchPrepare preserves noRetry and adds the per-call signal', async () => {
    const options = { signal: new AbortController().signal }
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(InjectiveRfqGwRpcPb.PrepareResponse.create())

    await api.fetchPrepare(
      {
        margin: '1',
        clientId: 'client',
        marketId: '0xmarket',
        quantity: '1',
        direction: 'buy',
        worstPrice: '1',
        takerAddress: 'inj1taker',
        takerPubKey: 'taker-pub-key',
      },
      options,
    )

    expect(executeGrpcCall).toHaveBeenCalledTimes(1)
    expect(executeGrpcCall.mock.calls[0][2]).toEqual({
      noRetry: true,
      signal: options.signal,
    })
  })
})
