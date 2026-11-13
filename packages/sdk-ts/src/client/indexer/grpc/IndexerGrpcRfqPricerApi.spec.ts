import { RpcError } from '@protobuf-ts/runtime-rpc'
import * as Pb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb'
import { InjectiveRfqPricerRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb.client'
import { IndexerGrpcRfqPricerApi } from './IndexerGrpcRfqPricerApi.js'

describe('IndexerGrpcRfqPricerApi', () => {
  const api = new IndexerGrpcRfqPricerApi('http://localhost:1')

  it('sends the market and transforms the response', async () => {
    const execute = vi.spyOn(api as any, 'executeGrpcCall').mockResolvedValue(
      Pb.GetPricingResponse.create({
        marketId: 'market',
        ts: 123n,
        markPrice: '99.00',
        tiers: [{ notionalUsd: 237n, bid: '', ask: '100', ageMs: 2n }],
      }),
    )

    await expect(api.fetchPricing('market')).resolves.toEqual({
      marketId: 'market',
      timestamp: 123,
      markPrice: '99.00',
      tiers: [{ notionalUsd: 237, bid: '', ask: '100', ageMs: 2 }],
    })
    expect(execute.mock.calls[0][0]).toMatchObject({ marketId: 'market' })
  })

  it('returns undefined for NOT_FOUND through the real base consumer', async () => {
    const getPricing = vi
      .spyOn(InjectiveRfqPricerRPCClient.prototype, 'getPricing')
      .mockImplementation(() => {
        throw new RpcError('no snapshot', 'NOT_FOUND')
      })

    await expect(api.fetchPricing('market')).resolves.toBeUndefined()
    expect(getPricing).toHaveBeenCalledOnce()
    expect(getPricing.mock.calls[0][0]).toMatchObject({ marketId: 'market' })
  })

  it('propagates other translated failures with the pricer module', async () => {
    vi.spyOn(
      InjectiveRfqPricerRPCClient.prototype,
      'getPricing',
    ).mockImplementation(() => {
      throw new RpcError('invalid market', 'INVALID_ARGUMENT')
    })

    await expect(api.fetchPricing('market')).rejects.toMatchObject({
      name: 'GrpcUnaryRequestException',
      message: 'invalid market',
      contextModule: 'indexer-rfq-pricer',
    })
  })
})
