import { AbortError } from '@injectivelabs/utils'
import * as Pb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb'
import { InjectiveRfqPricerRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb.client'
import { IndexerGrpcRfqPricerApi } from './IndexerGrpcRfqPricerApi.js'

describe('IndexerGrpcRfqPricerApi cancellation', () => {
  const api = new IndexerGrpcRfqPricerApi('http://localhost:1')

  it('forwards per-call options', async () => {
    const options = { signal: new AbortController().signal }
    const execute = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(Pb.GetPricingResponse.create())
    await api.fetchPricing('market', options)
    expect(execute.mock.calls[0][2]).toEqual(options)
  })

  it('avoids execution for a pre-aborted signal', async () => {
    const controller = new AbortController()
    controller.abort('stopped')
    const execute = vi.spyOn(api as any, 'executeGrpcCall')
    await expect(
      api.fetchPricing('market', { signal: controller.signal }),
    ).rejects.toMatchObject({ name: 'AbortError', reason: 'stopped' })
    expect(execute).not.toHaveBeenCalled()
  })

  it('does not turn cancellation into missing pricing', async () => {
    const error = new AbortError('stopped')
    vi.spyOn(api as any, 'executeGrpcCall').mockRejectedValue(error)
    await expect(api.fetchPricing('market')).rejects.toBe(error)
  })

  it('aborts a pending generated call through the base consumer', async () => {
    const controller = new AbortController()
    let transportSignal: AbortSignal | undefined
    vi.spyOn(
      InjectiveRfqPricerRPCClient.prototype,
      'getPricing',
    ).mockImplementation((_request, options) => {
      transportSignal = options?.abort
      return new Promise(() => {}) as any
    })
    const result = api.fetchPricing('market', { signal: controller.signal })
    controller.abort('stopped')
    await expect(result).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'stopped',
    })
    expect(transportSignal?.aborted).toBe(true)
  })
})
