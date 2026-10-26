import { createServer } from 'node:http'
import { isAbortError } from '@injectivelabs/utils'
import { it, vi, expect, describe, afterEach } from 'vitest'
import { GrpcUnaryRequestException } from '@injectivelabs/exceptions'
import { ChainRestBankApi } from './chain/rest/ChainRestBankApi.js'
import { IndexerGrpcSpotApi } from './indexer/grpc/IndexerGrpcSpotApi.js'
import { IndexerGrpcSpotStream } from './indexer/grpc_stream/stream/IndexerGrpcSpotStream.js'
import { IndexerGrpcSpotStreamV2 } from './indexer/grpc_stream/streamV2/IndexerGrpcSpotStreamV2.js'
import type { AddressInfo } from 'node:net'
import type { StreamError } from '../types/stream.js'

const cleanup: (() => Promise<void>)[] = []

afterEach(async () => {
  await Promise.all(cleanup.splice(0).map((close) => close()))
})

/** Uses the real protobuf-ts fetch transport against an idle local HTTP server. */
async function createIdleGrpcEndpoint(remoteCancellation = false) {
  let requests = 0
  let closedResponses = 0
  const server = createServer((request, response) => {
    requests++
    request.resume()
    response.writeHead(200, { 'content-type': 'application/grpc-web+proto' })
    response.flushHeaders()
    response.on('close', () => closedResponses++)
    if (remoteCancellation) {
      const trailers = Buffer.from(
        'grpc-status: 1\r\ngrpc-message: remote cancellation\r\n',
      )
      const frame = Buffer.alloc(5 + trailers.length)
      frame[0] = 0x80
      frame.writeUInt32BE(trailers.length, 1)
      trailers.copy(frame, 5)
      response.end(frame)
    }
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  cleanup.push(async () => {
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  })

  return {
    endpoint: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    requests: () => requests,
    closedResponses: () => closedResponses,
  }
}

async function createRetryingRestEndpoint() {
  let requests = 0
  let closedResponses = 0
  const server = createServer((request, response) => {
    requests++
    request.resume()
    response.on('close', () => closedResponses++)
    if (requests === 1) {
      response.writeHead(503, { 'content-type': 'application/json' })
      response.end(JSON.stringify({ message: 'temporarily unavailable' }))
    } else {
      response.writeHead(200, { 'content-type': 'application/json' })
      response.flushHeaders()
    }
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  cleanup.push(async () => {
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  })

  return {
    endpoint: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    requests: () => requests,
    closedResponses: () => closedResponses,
  }
}

describe('cancellation reaches the network transports', () => {
  it('does not classify a remote CANCELLED status as caller cancellation', async () => {
    const server = await createIdleGrpcEndpoint(true)
    const api = new IndexerGrpcSpotApi(server.endpoint)
    const error = await api.fetchMarkets().catch((error: unknown) => error)

    expect(error).toBeInstanceOf(GrpcUnaryRequestException)
    expect(isAbortError(error)).toBe(false)
    expect(server.requests()).toBe(1)
  })

  it('reports a remote stream cancellation as a gRPC error, not a local stop', async () => {
    const server = await createIdleGrpcEndpoint(true)
    const stream = new IndexerGrpcSpotStreamV2(server.endpoint)
    const callback = vi.fn()
    const subscription = stream.streamOrders({ callback })
    const failure = new Promise<StreamError>((resolve) =>
      subscription.on('error', resolve),
    )

    await expect(failure).resolves.toMatchObject({
      code: 1,
      details: 'remote cancellation',
    })
    expect(callback).not.toHaveBeenCalled()
    subscription.unsubscribe()
  })

  it('aborts a query whose server never sends a response message', async () => {
    const server = await createIdleGrpcEndpoint()
    const controller = new AbortController()
    const api = new IndexerGrpcSpotApi(server.endpoint)
    const pending = api.fetchMarkets(undefined, { signal: controller.signal })
    const rejection = expect(pending).rejects.toSatisfy(isAbortError)
    await vi.waitFor(() => expect(server.requests()).toBe(1))

    controller.abort({ component: 'markets' })

    await rejection
    await vi.waitFor(() => expect(server.closedResponses()).toBe(1))
    expect(server.requests()).toBe(1)
  })

  it('composes constructor and per-query signals without aborting caller controllers', async () => {
    const server = await createIdleGrpcEndpoint()
    const clientController = new AbortController()
    const queryController = new AbortController()
    const api = new IndexerGrpcSpotApi(server.endpoint, {
      abort: clientController.signal,
    })
    const pending = api.fetchMarkets(undefined, {
      signal: queryController.signal,
    })
    const rejection = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'client stopped',
    })
    await vi.waitFor(() => expect(server.requests()).toBe(1))

    clientController.abort('client stopped')

    await rejection
    await vi.waitFor(() => expect(server.closedResponses()).toBe(1))
    expect(queryController.signal.aborted).toBe(false)
  })

  it('aborts a REST query through the actual Axios HTTP adapter', async () => {
    const server = await createIdleGrpcEndpoint()
    const controller = new AbortController()
    const api = new ChainRestBankApi(server.endpoint)
    const pending = api.fetchBalances('inj1test', undefined, {
      signal: controller.signal,
    })
    const rejection = expect(pending).rejects.toSatisfy(isAbortError)
    await vi.waitFor(() => expect(server.requests()).toBe(1))

    controller.abort()

    await rejection
    await vi.waitFor(() => expect(server.closedResponses()).toBe(1))
    expect(server.requests()).toBe(1)
  })

  it('does not retry a real HTTP failure after cancellation during backoff', async () => {
    const server = await createRetryingRestEndpoint()
    const controller = new AbortController()
    const api = new ChainRestBankApi(server.endpoint)
    const pending = api.fetchBalances('inj1test', undefined, {
      signal: controller.signal,
    })
    const rejection = expect(pending).rejects.toSatisfy(isAbortError)
    await vi.waitFor(() => expect(server.closedResponses()).toBe(1))

    controller.abort()

    await rejection
    await new Promise((resolve) => setTimeout(resolve, 1100))
    expect(server.requests()).toBe(1)
  })

  it('keeps the original HTTP configuration signal across retries and closes the retry request', async () => {
    const server = await createRetryingRestEndpoint()
    const original = new AbortController()
    const later = new AbortController()
    const api = new ChainRestBankApi(server.endpoint)
    api.setConfig({ signal: original.signal })
    const pending = api.fetchBalances('inj1test')
    const rejection = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'original operation stopped',
    })
    await vi.waitFor(() => expect(server.closedResponses()).toBe(1))
    api.setConfig({ signal: later.signal })
    later.abort('unrelated configuration')
    await vi.waitFor(() => expect(server.requests()).toBe(2), { timeout: 3000 })

    original.abort('original operation stopped')

    await rejection
    await vi.waitFor(() => expect(server.closedResponses()).toBe(2))
    expect(server.requests()).toBe(2)
  })

  it('external abort closes an idle V2 stream without error or completion', async () => {
    const server = await createIdleGrpcEndpoint()
    const controller = new AbortController()
    const callback = vi.fn()
    const onError = vi.fn()
    const onComplete = vi.fn()
    const stream = new IndexerGrpcSpotStreamV2(server.endpoint)
    const subscription = stream.streamOrders({
      callback,
      signal: controller.signal,
    })
    subscription.on('error', onError)
    subscription.on('complete', onComplete)
    await vi.waitFor(() => expect(server.requests()).toBe(1))

    controller.abort()

    await vi.waitFor(() => expect(server.closedResponses()).toBe(1))
    expect(callback).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
    subscription.unsubscribe()
  })

  it('unsubscribe closes an idle legacy stream immediately', async () => {
    const server = await createIdleGrpcEndpoint()
    const callback = vi.fn()
    const onStatusCallback = vi.fn()
    const onEndCallback = vi.fn()
    const stream = new IndexerGrpcSpotStream(server.endpoint)
    const subscription = stream.streamOrders({
      callback,
      onStatusCallback,
      onEndCallback,
    })
    await vi.waitFor(() => expect(server.requests()).toBe(1))

    subscription.unsubscribe()

    await vi.waitFor(() => expect(server.closedResponses()).toBe(1))
    expect(callback).not.toHaveBeenCalled()
    expect(onStatusCallback).not.toHaveBeenCalled()
    expect(onEndCallback).not.toHaveBeenCalled()
  })

  it('external abort closes an idle legacy stream without status or end callbacks', async () => {
    const server = await createIdleGrpcEndpoint()
    const controller = new AbortController()
    const callback = vi.fn()
    const onStatusCallback = vi.fn()
    const onEndCallback = vi.fn()
    const stream = new IndexerGrpcSpotStream(server.endpoint)
    const subscription = stream.streamOrders({
      callback,
      onStatusCallback,
      onEndCallback,
      signal: controller.signal,
    })
    await vi.waitFor(() => expect(server.requests()).toBe(1))

    controller.abort()

    await vi.waitFor(() => expect(server.closedResponses()).toBe(1))
    expect(callback).not.toHaveBeenCalled()
    expect(onStatusCallback).not.toHaveBeenCalled()
    expect(onEndCallback).not.toHaveBeenCalled()
    subscription.unsubscribe()
  })

  it('pre-aborted query and stream signals never reach the server', async () => {
    const server = await createIdleGrpcEndpoint()
    const controller = new AbortController()
    controller.abort()
    const api = new IndexerGrpcSpotApi(server.endpoint)
    const stream = new IndexerGrpcSpotStreamV2(server.endpoint)

    await expect(
      api.fetchMarkets(undefined, { signal: controller.signal }),
    ).rejects.toSatisfy(isAbortError)
    const subscription = stream.streamOrders({
      callback: vi.fn(),
      signal: controller.signal,
    })
    subscription.unsubscribe()
    const legacy = new IndexerGrpcSpotStream(server.endpoint)
    legacy
      .streamOrders({ callback: vi.fn(), signal: controller.signal })
      .unsubscribe()

    expect(server.requests()).toBe(0)
  })
})
