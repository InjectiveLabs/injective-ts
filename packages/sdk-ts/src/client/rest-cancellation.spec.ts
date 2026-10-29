import { AxiosError } from 'axios'
import { it, vi, expect, describe, afterEach } from 'vitest'
import { AbortError, isAbortError } from '@injectivelabs/utils'
import { ChainRestAuthApi } from './chain/rest/ChainRestAuthApi.js'
import { ChainRestBankApi } from './chain/rest/ChainRestBankApi.js'
import { ChainRestWasmApi } from './chain/rest/ChainRestWasmApi.js'
import { ChainRestTendermintApi } from './chain/rest/ChainRestTendermintApi.js'
import { IndexerRestExplorerApi } from './indexer/rest/IndexerRestExplorerApi.js'
import { IndexerRestSpotChronosApi } from './indexer/rest/IndexerRestSpotChronosApi.js'
import { IndexerRestMarketChronosApi } from './indexer/rest/IndexerRestMarketChronosApi.js'
import { IndexerRestLeaderboardChronosApi } from './indexer/rest/IndexerRestLeaderboardChronosApi.js'
import { IndexerRestDerivativesChronosApi } from './indexer/rest/IndexerRestDerivativesChronosApi.js'
import type { AxiosAdapter, AxiosResponse } from 'axios'
import type { RequestOptions } from '@injectivelabs/utils'

const endpoint = 'https://example.invalid'

afterEach(() => {
  vi.useRealTimers()
})

describe('REST query cancellation', () => {
  it('normalizes AbortSignal.timeout to the shared local cancellation error', async () => {
    const signal = AbortSignal.timeout(10)
    const adapter = vi.fn<AxiosAdapter>(() => new Promise(() => {}))
    const api = new ChainRestBankApi(endpoint)
    api.setConfig({ adapter })

    await expect(
      api.fetchBalances('inj1test', undefined, { signal }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      code: 'ERR_CANCELED',
      reason: expect.objectContaining({ name: 'TimeoutError' }),
    })
    expect(adapter).toHaveBeenCalledOnce()
  })

  const auth = new ChainRestAuthApi(endpoint)
  const bank = new ChainRestBankApi(endpoint)
  const wasm = new ChainRestWasmApi(endpoint)
  const tendermint = new ChainRestTendermintApi(endpoint)
  const explorer = new IndexerRestExplorerApi(endpoint)
  const spot = new IndexerRestSpotChronosApi(endpoint)
  const derivatives = new IndexerRestDerivativesChronosApi(endpoint)
  const markets = new IndexerRestMarketChronosApi(endpoint)
  const leaderboard = new IndexerRestLeaderboardChronosApi(endpoint)

  const queries: [string, (options: RequestOptions) => Promise<unknown>][] = [
    ['account', (options) => auth.fetchAccount('inj1test', undefined, options)],
    [
      'cosmos account',
      (options) => auth.fetchCosmosAccount('cosmos1test', undefined, options),
    ],
    [
      'balances',
      (options) => bank.fetchBalances('inj1test', undefined, options),
    ],
    [
      'balance',
      (options) => bank.fetchBalance('inj1test', 'inj', undefined, options),
    ],
    [
      'denom owners',
      (options) => bank.fetchDenomOwners('inj', undefined, options),
    ],
    [
      'contract state',
      (options) =>
        wasm.fetchSmartContractState('inj1test', 'e30=', undefined, options),
    ],
    [
      'latest block',
      (options) => tendermint.fetchLatestBlock(undefined, options),
    ],
    ['block', (options) => tendermint.fetchBlock(1, undefined, options)],
    ['node info', (options) => tendermint.fetchNodeInfo(undefined, options)],
    ['explorer block', (options) => explorer.fetchBlock('1', options)],
    ['explorer blocks', (options) => explorer.fetchBlocks(undefined, options)],
    [
      'explorer blocks with transactions',
      (options) => explorer.fetchBlocksWithTx(undefined, options),
    ],
    [
      'transactions',
      (options) => explorer.fetchTransactions(undefined, options),
    ],
    [
      'account transactions',
      (options) =>
        explorer.fetchAccountTransactions({ account: 'inj1test' }, options),
    ],
    [
      'transaction',
      (options) => explorer.fetchTransaction('hash', false, options),
    ],
    ['validators', (options) => explorer.fetchValidators(options)],
    [
      'validator uptime',
      (options) => explorer.fetchValidatorUptime('address', options),
    ],
    ['contract', (options) => explorer.fetchContract('inj1test', options)],
    ['contracts', (options) => explorer.fetchContracts(undefined, options)],
    [
      'contract transactions',
      (options) =>
        explorer.fetchContractTransactions(
          { contractAddress: 'inj1test' },
          options,
        ),
    ],
    [
      'contract transaction messages',
      (options) =>
        explorer.fetchContractTransactionsWithMessages(
          { contractAddress: 'inj1test' },
          options,
        ),
    ],
    ['wasm code', (options) => explorer.fetchWasmCode(1, options)],
    ['wasm codes', (options) => explorer.fetchWasmCodes(undefined, options)],
    [
      'CW20 balances',
      (options) => explorer.fetchCW20Balances('inj1test', options),
    ],
    [
      'CW20 balances fallback',
      (options) => explorer.fetchCW20BalancesNoThrow('inj1test', options),
    ],
    ['bank transfers', (options) => explorer.fetchBankTransfers({}, options)],
    ['spot summary', (options) => spot.fetchMarketSummary('market', options)],
    ['spot summaries', (options) => spot.fetchMarketsSummary(options)],
    [
      'derivative summary',
      (options) => derivatives.fetchMarketSummary('market', options),
    ],
    [
      'derivative summaries',
      (options) => derivatives.fetchMarketsSummary(options),
    ],
    [
      'markets history',
      (options) =>
        markets.fetchMarketsHistory(
          { marketIds: ['market'], resolution: '1', countback: 1 },
          options,
        ),
    ],
    ['leaderboard', (options) => leaderboard.fetchLeaderboard('24h', options)],
  ]

  it.each(queries)(
    '%s starts no request with an already-aborted signal',
    async (_name, query) => {
      const controller = new AbortController()
      const reason = { message: '404 does not exist 500' }
      controller.abort(reason)

      await expect(query({ signal: controller.signal })).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason,
      })
    },
  )

  it('preserves cancellation through an empty-result fallback and aborts an idle request', async () => {
    const controller = new AbortController()
    let transportSignal: AbortSignal | undefined
    const adapter = vi.fn<AxiosAdapter>((config) => {
      transportSignal = config.signal as AbortSignal

      return new Promise(() => {})
    })
    const api = new IndexerRestExplorerApi(endpoint)
    api.setConfig({ adapter })

    const pending = api.fetchCW20BalancesNoThrow('inj1test', {
      signal: controller.signal,
    })
    const rejection = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
      reason: '404 does not exist 500',
    })
    await vi.waitFor(() => expect(adapter).toHaveBeenCalledOnce())
    controller.abort('404 does not exist 500')

    await rejection
    expect(transportSignal?.aborted).toBe(true)
    expect(adapter).toHaveBeenCalledOnce()
  })

  it('isolates concurrent requests on a shared client', async () => {
    const controller = new AbortController()
    const pendingResponses = new Map<string, () => void>()
    const signals = new Map<string, AbortSignal | undefined>()
    const adapter: AxiosAdapter = (config) => {
      signals.set(config.url!, config.signal as AbortSignal | undefined)

      return new Promise((resolve) => {
        pendingResponses.set(config.url!, () =>
          resolve({
            data: { balances: [{ denom: 'inj', amount: '10' }] },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          }),
        )
      })
    }
    const api = new ChainRestBankApi(endpoint)
    api.setConfig({ adapter })

    const cancelled = api.fetchBalances('cancelled', undefined, {
      signal: controller.signal,
    })
    const rejection = expect(cancelled).rejects.toBeInstanceOf(AbortError)
    const successful = api.fetchBalances('successful')
    await vi.waitFor(() => expect(pendingResponses.size).toBe(2))
    controller.abort()
    pendingResponses.get('cosmos/bank/v1beta1/balances/successful')!()

    await rejection
    await expect(successful).resolves.toEqual({
      balances: [{ denom: 'inj', amount: '10' }],
    })
    expect(signals.get('cosmos/bank/v1beta1/balances/cancelled')?.aborted).toBe(
      true,
    )
    expect(
      signals.get('cosmos/bank/v1beta1/balances/successful')?.aborted,
    ).not.toBe(true)
  })

  it('cancels retry backoff without another request', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const adapter = vi.fn<AxiosAdapter>(() =>
      Promise.reject(new Error('network unavailable')),
    )
    const api = new ChainRestBankApi(endpoint)
    api.setConfig({ adapter })

    const pending = api.fetchBalances('inj1test', undefined, {
      signal: controller.signal,
    })
    const rejection = expect(pending).rejects.toSatisfy(isAbortError)
    await vi.advanceTimersByTimeAsync(0)
    expect(adapter).toHaveBeenCalledOnce()
    controller.abort()

    await rejection
    await vi.runAllTimersAsync()
    expect(adapter).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })

  // These methods previously took no arguments. Untyped JS callers may still
  // pass one, which must never become a retry count.
  it.each([
    ['spot markets summary', 'fetchMarketsSummary', 'spot'],
    ['derivatives markets summary', 'fetchMarketsSummary', 'derivatives'],
    ['explorer validators', 'fetchValidators', 'explorer'],
  ] as const)(
    'bounds retries for %s when given a non-options argument',
    async (_name, method, client) => {
      vi.useFakeTimers()

      for (const junk of ['inj1test', 5, () => undefined]) {
        const adapter = vi.fn<AxiosAdapter>(() =>
          Promise.reject(new Error('network unavailable')),
        )
        const api =
          client === 'explorer'
            ? new IndexerRestExplorerApi(endpoint, { adapter })
            : client === 'spot'
              ? new IndexerRestSpotChronosApi(endpoint, { adapter })
              : new IndexerRestDerivativesChronosApi(endpoint, { adapter })

        const pending = (api as any)[method](junk)
        const rejection = expect(pending).rejects.toBeDefined()

        await vi.runAllTimersAsync()
        await rejection
        expect(adapter).toHaveBeenCalledTimes(3)
      }
    },
  )

  it('keeps the optional query dictionary separate from request options', async () => {
    const controller = new AbortController()
    const adapter = vi.fn<AxiosAdapter>(
      async (config): Promise<AxiosResponse> => ({
        data: { balances: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }),
    )
    const api = new ChainRestBankApi(endpoint)
    api.setConfig({ adapter })
    await api.fetchBalances(
      'inj1test',
      { 'pagination.limit': 12 },
      {
        signal: controller.signal,
      },
    )

    expect(adapter.mock.calls[0][0].params).toEqual({ 'pagination.limit': 12 })
    expect(adapter.mock.calls[0][0].signal?.aborted).toBe(false)
  })

  it('honors a client configuration signal during retry backoff', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const adapter = vi.fn<AxiosAdapter>(() =>
      Promise.reject(new Error('network unavailable')),
    )
    const api = new ChainRestBankApi(endpoint)
    api.setConfig({ adapter, signal: controller.signal })
    let settled = false
    const pending = api.fetchBalances('inj1test').catch((error: unknown) => {
      settled = true

      return error
    })
    await vi.advanceTimersByTimeAsync(0)
    controller.abort('client stopped')
    await vi.advanceTimersByTimeAsync(0)
    const settledDuringBackoff = settled
    await vi.runAllTimersAsync()

    expect(await pending).toMatchObject({
      name: 'AbortError',
      reason: 'client stopped',
    })
    expect(settledDuringBackoff).toBe(true)
    expect(adapter).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each([true, false])(
    'does not retarget an existing retry when shared client configuration changes (initial signal: %s)',
    async (hasInitialSignal) => {
      vi.useFakeTimers()
      const originalController = new AbortController()
      const laterController = new AbortController()
      const adapter = vi.fn<AxiosAdapter>()
      adapter.mockRejectedValueOnce(new Error('temporary failure'))
      adapter.mockImplementation(async (config) => ({
        data: { balances: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }))
      const api = new ChainRestBankApi(endpoint)
      api.setConfig({
        adapter,
        signal: hasInitialSignal ? originalController.signal : undefined,
      })
      const pending = api.fetchBalances('inj1test').then(
        (value) => ({ value }),
        (error: unknown) => ({ error }),
      )
      await vi.advanceTimersByTimeAsync(0)
      api.setConfig({ adapter, signal: laterController.signal })
      laterController.abort('unrelated client configuration')
      await vi.runAllTimersAsync()

      expect(await pending).toEqual({ value: { balances: [] } })
      expect(originalController.signal.aborted).toBe(false)
      expect(adapter).toHaveBeenCalledTimes(2)
    },
  )

  it.each([404, 500])(
    'preserves the existing CW20 empty-result fallback for HTTP %s',
    async (status) => {
      vi.useFakeTimers()
      const adapter = vi.fn<AxiosAdapter>((config) =>
        Promise.reject(
          new AxiosError(
            `HTTP ${status}`,
            AxiosError.ERR_BAD_RESPONSE,
            config,
            undefined,
            {
              data: `HTTP ${status}`,
              status,
              statusText: 'failure',
              headers: {},
              config,
            },
          ),
        ),
      )
      const api = new IndexerRestExplorerApi(endpoint, { adapter })
      const pending = api.fetchCW20BalancesNoThrow('inj1test')
      const result = expect(pending).resolves.toEqual([])

      await vi.runAllTimersAsync()
      await result
      expect(adapter).toHaveBeenCalledTimes(3)
    },
  )

  it('composes Explorer constructor and per-call cancellation signals', async () => {
    const clientController = new AbortController()
    const requestController = new AbortController()
    let transportSignal: AbortSignal | undefined
    const adapter = vi.fn<AxiosAdapter>((config) => {
      transportSignal = config.signal as AbortSignal

      return new Promise(() => {})
    })
    const api = new IndexerRestExplorerApi(endpoint, {
      adapter,
      signal: clientController.signal,
    })
    const pending = api.fetchCW20BalancesNoThrow('inj1test', {
      signal: requestController.signal,
    })
    const result = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'explorer client stopped',
    })
    await vi.waitFor(() => expect(adapter).toHaveBeenCalledOnce())
    clientController.abort('explorer client stopped')

    await result
    expect(transportSignal?.aborted).toBe(true)
    expect(requestController.signal.aborted).toBe(false)
  })
})
