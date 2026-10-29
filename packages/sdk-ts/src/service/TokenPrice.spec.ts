import { Network } from '@injectivelabs/networks'
import { vi, test, expect, describe, afterEach } from 'vitest'
import { AbortError, HttpRestClient } from '@injectivelabs/utils'
import { TokenPrice } from './TokenPrice.js'
import type { AxiosRequestConfig } from 'axios'
import type { RequestOptions } from '@injectivelabs/utils'

describe('TokenPrice cancellation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('fetchUsdTokensPriceMap forwards options to get and retry', async () => {
    const options = { signal: new AbortController().signal }
    const get = vi.spyOn(HttpRestClient.prototype, 'get').mockResolvedValue({
      data: {
        inj: {
          denom: 'inj',
          coingecko_id: 'injective-protocol',
          price: { price: 20, metadata: {} },
        },
      },
    })
    const retry = vi
      .spyOn(HttpRestClient.prototype, 'retry')
      .mockImplementation((async (
        callback: (config: AxiosRequestConfig) => Promise<unknown>,
        requestOptions?: RequestOptions,
      ) => callback({ signal: requestOptions?.signal })) as any)

    const tokenPrice = new TokenPrice(Network.Mainnet)
    const prices = await tokenPrice.fetchUsdTokensPriceMap(options)

    expect(get).toHaveBeenCalledWith(
      `denoms?withPrice=true`,
      {},
      {
        signal: options.signal,
      },
    )
    expect(retry).toHaveBeenCalledTimes(1)
    expect(retry.mock.calls[0][1]).toEqual({ signal: options.signal })
    expect(prices).toEqual({ 'injective-protocol': 20 })
  })

  test('a pre-aborted signal rejects before retry, preserving the reason', async () => {
    const controller = new AbortController()
    const reason = new Error('stop price lookup')
    controller.abort(reason)
    const retry = vi.spyOn(HttpRestClient.prototype, 'retry')
    const get = vi.spyOn(HttpRestClient.prototype, 'get')

    const tokenPrice = new TokenPrice(Network.Mainnet)

    await expect(
      tokenPrice.fetchUsdTokensPriceMap({ signal: controller.signal }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      code: 'ERR_CANCELED',
      reason,
    })
    expect(retry).not.toHaveBeenCalled()
    expect(get).not.toHaveBeenCalled()
  })

  test('AbortError failures are not converted to an empty price map', async () => {
    const abortError = new AbortError('upstream aborted')
    vi.spyOn(HttpRestClient.prototype, 'retry').mockRejectedValue(abortError)

    const tokenPrice = new TokenPrice(Network.Mainnet)

    await expect(tokenPrice.fetchUsdTokensPriceMap()).rejects.toBe(abortError)
  })
})
