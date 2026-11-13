import { AbortError } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import { vi, test, expect, describe, afterEach } from 'vitest'
import { NeptuneService } from './service.js'

const asset = { native_token: { denom: 'inj' } }

const createService = () => new NeptuneService(Network.MainnetSentry)

describe('NeptuneService cancellation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('fetchPrices forwards options to the Wasm query', async () => {
    const options = { signal: new AbortController().signal }
    const service = createService()
    const fetchSmartContractState = vi
      .spyOn((service as any).client, 'fetchSmartContractState')
      .mockResolvedValue({
        data: new TextEncoder().encode(JSON.stringify([])),
      })

    const prices = await service.fetchPrices([asset], options)

    expect(prices).toEqual([])
    expect(fetchSmartContractState).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      options,
    )
  })

  test('local cancellation is not wrapped in a general fetch failure', async () => {
    const abortError = new AbortError('neptune caller abort')
    const service = createService()
    vi.spyOn(
      (service as any).client,
      'fetchSmartContractState',
    ).mockRejectedValue(abortError)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(service.fetchPrices([asset])).rejects.toBe(abortError)
    expect(consoleError).not.toHaveBeenCalled()
  })

  test('getLendingRates rethrows local cancellation instead of a general failure', async () => {
    const abortError = new AbortError('lending rates aborted')
    const service = createService()
    vi.spyOn(
      (service as any).client,
      'fetchSmartContractState',
    ).mockRejectedValue(abortError)

    await expect(service.getLendingRates({ limit: 10 })).rejects.toBe(
      abortError,
    )
  })

  test('fetchRedemptionRatio forwards options through its nested price query', async () => {
    const options = { signal: new AbortController().signal }
    const cw20Asset = {
      token: { contract_addr: 'inj1cw20' },
    }
    const nativeAsset = { native_token: { denom: 'inj' } }
    const service = createService()
    const fetchPrices = vi.spyOn(service, 'fetchPrices').mockResolvedValue([
      { assetInfo: cw20Asset, price: '2' },
      { assetInfo: nativeAsset, price: '1' },
    ])

    await expect(
      service.fetchRedemptionRatio({ cw20Asset, nativeAsset }, options),
    ).resolves.toBe(2)
    expect(fetchPrices).toHaveBeenCalledWith([cw20Asset, nativeAsset], options)
  })

  test('getLendingRateByDenom forwards options to every nested page query', async () => {
    const options = { signal: new AbortController().signal }
    const service = createService()
    const getLendingRates = vi
      .spyOn(service, 'getLendingRates')
      .mockResolvedValue([
        {
          assetInfo: { native_token: { denom: 'inj' } },
          lendingRate: '0.05',
        },
      ])

    await expect(
      service.getLendingRateByDenom({ denom: 'inj' }, options),
    ).resolves.toBe('0.05')
    expect(getLendingRates).toHaveBeenCalledWith(
      {
        limit: 10,
        startAfter: undefined,
        contractAddress: expect.any(String),
      },
      options,
    )
  })

  test('pre-aborted price queries do not reach the network', async () => {
    const controller = new AbortController()
    controller.abort('caller stopped neptune query')
    const service = createService()
    const fetchSmartContractState = vi.spyOn(
      (service as any).client,
      'fetchSmartContractState',
    )

    await expect(
      service.fetchPrices([asset], { signal: controller.signal }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'caller stopped neptune query',
    })
    expect(fetchSmartContractState).not.toHaveBeenCalled()
  })
})
