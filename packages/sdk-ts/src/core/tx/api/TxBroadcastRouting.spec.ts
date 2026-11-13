import { vi, it, expect, describe, afterEach } from 'vitest'
import * as TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import * as ServicePb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/service_pb'
import { TxGrpcApi } from './TxGrpcApi.js'
import { TxObservationAbortError } from './TxObservationAbortError.js'

const queryEndpoint = 'https://query.example.test'
const broadcastEndpoint = 'https://broadcast.example.test'
const txHash = 'A'.repeat(64)
const txRaw = () => TxPb.TxRaw.create({ signatures: [new Uint8Array([1])] })

function reply(message: Uint8Array) {
  const trailers = new TextEncoder().encode('grpc-status: 0\r\n')
  const body = new Uint8Array(10 + message.length + trailers.length)
  const lengths = new DataView(body.buffer)
  lengths.setUint32(1, message.length)
  body.set(message, 5)
  body[5 + message.length] = 128
  lengths.setUint32(6 + message.length, trailers.length)
  body.set(trailers, 10 + message.length)
  return new Response(body, {
    headers: { 'content-type': 'application/grpc-web+proto' },
  })
}

function createFetch(code = 0) {
  return vi.fn<typeof fetch>(async (input) => {
    const url = String(input)
    if (url.endsWith('/Simulate')) {
      return reply(
        ServicePb.SimulateResponse.toBinary(
          ServicePb.SimulateResponse.create({
            gasInfo: { gasWanted: 100n, gasUsed: 50n },
          }),
        ),
      )
    }
    const response = {
      txhash: txHash,
      code,
      codespace: 'sdk',
      rawLog: code ? 'rejected' : '',
      height: 1n,
    }
    return url.endsWith('/BroadcastTx')
      ? reply(
          ServicePb.BroadcastTxResponse.toBinary(
            ServicePb.BroadcastTxResponse.create({ txResponse: response }),
          ),
        )
      : reply(
          ServicePb.GetTxResponse.toBinary(
            ServicePb.GetTxResponse.create({ txResponse: response }),
          ),
        )
  })
}

afterEach(() => vi.restoreAllMocks())

describe('TxGrpcApi submission endpoint', () => {
  it.each([undefined, '', broadcastEndpoint])(
    'routes only submission with override %s',
    async (override) => {
      const fetch = createFetch()
      const api = new TxGrpcApi(queryEndpoint, {
        fetch,
        format: 'binary',
        fetchInit: { credentials: 'include' },
      })
      api.setMetadata({ 'x-api-key': 'first-key' })
      const events: string[] = []
      const fetchTx = api.fetchTx.bind(api)
      vi.spyOn(api, 'fetchTx').mockImplementation(async (...args) => {
        events.push('confirmation')
        return fetchTx(...args)
      })

      await api.simulate(txRaw())
      await api.broadcast(txRaw(), {
        broadcastEndpoint: override,
        onBroadcast: () => events.push('submitted'),
      })

      expect(fetch.mock.calls.slice(0, 2).map(([url]) => String(url))).toEqual([
        `${queryEndpoint}/cosmos.tx.v1beta1.Service/Simulate`,
        `${override || queryEndpoint}/cosmos.tx.v1beta1.Service/BroadcastTx`,
      ])
      expect(events[0]).toBe('submitted')
      expect(events.slice(1)).toContain('confirmation')
      expect(
        fetch.mock.calls
          .slice(2)
          .every(
            ([url]) =>
              String(url) ===
              `${queryEndpoint}/cosmos.tx.v1beta1.Service/GetTx`,
          ),
      ).toBe(true)
      for (const [, options] of fetch.mock.calls) {
        expect(new Headers(options?.headers).get('x-api-key')).toBe('first-key')
        expect(options?.credentials).toBe('include')
      }

      const submissionIndex = fetch.mock.calls.length
      api.setMetadata({ 'x-api-key': 'updated-key' })
      await api.broadcast(txRaw(), { broadcastEndpoint: override })
      expect(
        new Headers(fetch.mock.calls[submissionIndex][1]?.headers).get(
          'x-api-key',
        ),
      ).toBe('updated-key')
    },
  )

  it('keeps constructor metadata when using the override', async () => {
    const fetch = createFetch()
    const api = new TxGrpcApi(queryEndpoint, {
      fetch,
      format: 'binary',
      meta: { 'x-api-key': 'constructor-key' },
    })
    await api.broadcast(txRaw(), { broadcastEndpoint })
    expect(new Headers(fetch.mock.calls[0][1]?.headers).get('x-api-key')).toBe(
      'constructor-key',
    )
  })

  it('propagates chain rejection without confirming or falling back', async () => {
    const fetch = createFetch(32)
    const api = new TxGrpcApi(queryEndpoint, { fetch, format: 'binary' })
    const onBroadcast = vi.fn()
    await expect(
      api.broadcast(txRaw(), { broadcastEndpoint, onBroadcast }),
    ).rejects.toMatchObject({ contextCode: 32 })
    expect(fetch).toHaveBeenCalledOnce()
    expect(onBroadcast).not.toHaveBeenCalled()
  })

  it('does not fall back to the query endpoint after transport failure', async () => {
    const fetch = createFetch().mockRejectedValue(
      new Error('submission unavailable'),
    )
    const api = new TxGrpcApi(queryEndpoint, { fetch, format: 'binary' })
    await expect(
      api.broadcast(txRaw(), { broadcastEndpoint }),
    ).rejects.toThrow()
    expect(fetch).toHaveBeenCalledOnce()
    expect(String(fetch.mock.calls[0][0])).toContain(broadcastEndpoint)
  })

  it('does not submit when observation is cancelled during preparation', async () => {
    const fetch = createFetch()
    const controller = new AbortController()
    const api = new TxGrpcApi(queryEndpoint, { fetch, format: 'binary' })
    const pending = api.broadcast(txRaw(), {
      broadcastEndpoint,
      signal: controller.signal,
    })
    controller.abort('cancelled before submission')
    await expect(pending).rejects.toMatchObject({ code: 'ERR_CANCELED' })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('retains the submitted hash when confirmation is cancelled', async () => {
    const fetch = createFetch()
    const controller = new AbortController()
    const api = new TxGrpcApi(queryEndpoint, { fetch, format: 'binary' })
    const error = await api
      .broadcast(txRaw(), {
        broadcastEndpoint,
        signal: controller.signal,
        onBroadcast: () => controller.abort('stop confirmation'),
      })
      .catch((error: unknown) => error)
    expect(error).toBeInstanceOf(TxObservationAbortError)
    expect(error).toMatchObject({ txHash, reason: 'stop confirmation' })
    expect(fetch).toHaveBeenCalledOnce()
  })
})
