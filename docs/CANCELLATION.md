# Cancelling queries and streams

Pass a caller-owned `AbortSignal` to stop network work. Cancellation does not undo
an already-submitted transaction or any other server-side side effect.

## Queries

gRPC and REST query methods accept an optional **last** `RequestOptions` argument.
All existing positional arguments keep their meaning, including optional query
dictionaries and pagination. Use `undefined` placeholders to skip them:

```ts
import { IndexerGrpcSpotApi, ChainRestBankApi, isAbortError } from '@injectivelabs/sdk-ts'

const controller = new AbortController()
const spot = new IndexerGrpcSpotApi(indexerEndpoint)
const bank = new ChainRestBankApi(restEndpoint)

const pending = Promise.all([spot.fetchMarkets(undefined, { signal: controller.signal }), bank.fetchBalances(address, undefined, { signal: controller.signal })])

controller.abort('screen closed')

try {
  await pending
} catch (error) {
  if (!isAbortError(error)) throw error
  // Expected cancellation. SDK AbortError.reason preserves the caller's reason.
}
```

An already-aborted signal starts no request. Aborting interrupts an active
request or retry delay, and no further retry is started. Independent calls using
the same API instance remain independent unless they intentionally share a signal.

Existing gRPC constructor options `{ abort: signal }` remain supported as a
client-wide cancellation constraint. Either that signal or a per-call signal can
cancel a request. Create a fresh client to replace an aborted constructor signal.

`AbortError` and `isAbortError` are available from the SDK root and its `utils`
subpath, and from `@injectivelabs/utils`. `RequestOptions` is available from the SDK
root/types subpath and `@injectivelabs/utils`. Cancellation preserves its original
reason even if it is not an `Error`. A remote gRPC cancellation or a deadline
failure is not automatically considered a caller-requested cancellation.

Every local cancellation uses `code: 'ERR_CANCELED'`, including custom abort
reasons and `AbortSignal.timeout()`. This deliberately differs from remote gRPC
status `CANCELLED`; prefer `isAbortError` when handling local cancellation.
Publish and upgrade `@injectivelabs/sdk-ts` and `@injectivelabs/utils` together
in the same release, since the SDK depends on the utils cancellation helpers.

Pagination helpers also accept request options directly as their third argument:
`fetchAllWithPagination(args, fetchPage, { signal })`. Existing calls passing an
accumulator array third continue to work. Cancellation is checked between pages
as well as inside each page request.

### Custom HTTP retries

When using `HttpRestClient.retry` directly, forward the callback's request
configuration into each HTTP call. This keeps cancellation scoped to that
operation, including after an `await` inside the callback:

```ts
await httpClient.retry((requestConfig) => httpClient.get('/path', {}, requestConfig), { signal: controller.signal })
```

The operation's cancellation constraints are captured when retrying starts. Later
`setConfig` updates still apply to headers, authentication, adapters and other
non-cancellation settings, but cannot attach an unrelated signal to that operation.

Legacy zero-argument callbacks still work. If they ignore the provided request
configuration, cancelling the retry interrupts its promise and backoff, but the
callback is responsible for forwarding cancellation to its own network work.

## gRPC streams

Legacy and V2 stream methods accept `signal` in their existing parameter object:

```ts
const subscription = spotStream.streamOrders({
  marketId,
  callback: handleOrders,
  signal: controller.signal,
})

subscription.unsubscribe() // Also cancels the transport; safe to call repeatedly.
```

External abort and unsubscribe stop the transport and subsequent callbacks. They
do not invoke the existing error/completion handlers. An already-aborted signal
returns an inactive subscription without starting a network stream. The deprecated
legacy helper overload accepting an already-created stream cannot attach transport
cancellation retroactively; SDK stream methods use the factory-based overload.

## Managed streams

Give `StreamManagerV2` a lifecycle signal when cancellation should also disable
automatic retries:

```ts
import { StreamEvent, StreamManagerV2 } from '@injectivelabs/sdk-ts'
import type { SpotOrdersStreamCallbackV2 } from '@injectivelabs/sdk-ts'

const manager = new StreamManagerV2<Parameters<SpotOrdersStreamCallbackV2>[0]>({
  id: 'orders',
  signal: controller.signal,
  streamFactory: () =>
    spotStream.streamOrders({
      marketId,
      callback: (data) => manager.emit(StreamEvent.Data, data),
    }),
  onData: handleOrders,
})

manager.start()
controller.abort() // Stops the subscription and pending retries.
```

Manual `stop()` remains restartable while the lifecycle signal is live. An aborted
lifecycle signal cannot be reset; create a new manager with a fresh signal.
`destroy()` permanently releases a manager. Independent cancellation of SDK V2
subscriptions is also observed by the manager and does not trigger a retry.

The legacy `StreamManager.cancelAll()` attempts every teardown even if one fails.
A single failure is rethrown unchanged; multiple failures are available through
`StreamManagerCleanupError.errors` after all teardowns have been attempted.

## RFQ WebSockets

Pass a signal to maker/taker stream `connect({ signal })`. It applies to the
explicit connection lifecycle, including automatic reconnect attempts:

```ts
await takerStream.connect({ signal: controller.signal })
controller.abort() // Closes the socket, stops heartbeats and disables reconnects.
```

Existing `disconnect()` and `destroy()` remain available. After disconnecting, an
explicit connect with a fresh signal starts a new lifecycle. Duplicate connects
without a signal or with the same signal share the connection; conflicting signals
are rejected rather than replacing its owner. Attach rejection handling to a
pending connection promise before aborting it.

## Transaction observation

Transaction fetching, polling and inclusion waiting support cancellation. Existing
`fetchTxPoll({ txHash, abortSignal })` callers remain supported. Cancellation stops
the active requests, delays, event subscriptions and any fallback polling. Closing
an inclusion waiter cancels unresolved observation, including a pending `wait()`.

Read-only transaction simulation also accepts final request options. Concrete gRPC
clients support `fetchTx(hash, options)`; REST clients keep query parameters second
and accept options third. When using the common `TxConcreteApi` interface, use
`fetchTx(hash, undefined, options)` for either implementation.

Per-poll request deadlines are separate from caller cancellation: an expired
attempt can be followed by another poll while the overall inclusion timeout has
not expired. Cancelling observation cannot reverse a broadcast transaction, and
must not be interpreted as evidence that the transaction failed on-chain.

The signal passed to `broadcast` only controls inclusion observation, not the
broadcast mutation. If observation is cancelled, `TxObservationAbortError`
preserves both the abort `reason` and `txHash`, so callers can resume checking
that transaction rather than submitting it again.
