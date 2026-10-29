import { AbortError } from '@injectivelabs/utils'
import { vi, test, expect, describe, afterEach } from 'vitest'
import { IndexerGrpcOracleApi } from './IndexerGrpcOracleApi.js'

const api = new IndexerGrpcOracleApi('http://localhost:1')

const oraclePriceRequest = {
  baseSymbol: 'INJ',
  quoteSymbol: 'USDT',
  oracleType: 'pricefeed',
}

describe('IndexerGrpcOracleApi cancellation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('NoThrow fallbacks rethrow local cancellation instead of returning a price', async () => {
    const abortError = new AbortError('rate limited by caller')
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockRejectedValue(abortError)

    await expect(api.fetchOraclePriceNoThrow(oraclePriceRequest)).rejects.toBe(
      abortError,
    )
    expect(executeGrpcCall).toHaveBeenCalledTimes(1)
  })

  test('NoThrow fallbacks still handle the original not-found response', async () => {
    vi.spyOn(api as any, 'executeGrpcCall').mockRejectedValue(
      new Error('object not found'),
    )

    await expect(
      api.fetchOraclePriceNoThrow(oraclePriceRequest),
    ).resolves.toEqual({ price: '0' })
  })

  test('pre-aborted NoThrow queries do not reach the network', async () => {
    const controller = new AbortController()
    controller.abort('caller stopped before starting')
    const executeGrpcCall = vi.spyOn(api as any, 'executeGrpcCall')

    await expect(
      api.fetchOraclePriceNoThrow(oraclePriceRequest, {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'caller stopped before starting',
    })
    expect(executeGrpcCall).not.toHaveBeenCalled()
  })
})
