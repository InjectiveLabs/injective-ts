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
Upgrade related Injective wallet packages together as well to avoid separate
exception-class versions breaking cross-package `instanceof` checks.

### Migration for existing cancellation callers

Existing cancellation entry points now use the shared `AbortError`, even when no
new per-call options are supplied:

- `fetchTxPoll({ abortSignal })` previously rejected with
  `Error('Transaction inclusion polling was cancelled')`. It now rejects with
  `AbortError('The operation was aborted')`; use `isAbortError`, not message matching.
- HTTP constructor signals, `setConfig({ signal })`, and Axios cancel tokens now
  produce `AbortError` rather than Axios `CanceledError` or an HTTP 400 exception.
  `axios.isCancel(error)` is false for this SDK error; use `isAbortError(error)`.
- gRPC constructor `{ abort: signal }` cancellation also uses the shared error
  rather than a gRPC request exception.
- HTTP constructor, configured, and per-call signals compose: any can cancel a
  request. A later config signal no longer overrides the constructor signal.

Pagination helpers also accept request options directly as their third argument:
`fetchAllWithPagination(args, fetchPage, { signal })`. Existing calls passing an
accumulator array third continue to work. Cancellation is checked between pages
as well as inside each page request.
Without request options, page callbacks still receive only the page arguments,
including callbacks with unrelated optional/default parameters. Pass an options
object to opt into forwarding `RequestOptions` as the callback's second argument.

### Custom HTTP retries

The **options-object** form of `HttpRestClient.retry` passes a request configuration
to its callback. Forward it into each HTTP call to keep cancellation scoped to that
operation, including after an `await` inside the callback:

```ts
await httpClient.retry((requestConfig) => httpClient.get('/path', {}, requestConfig), { signal: controller.signal })

// Opt in explicitly even when no per-call signal is needed.
await httpClient.retry((requestConfig) => httpClient.get('/path', {}, requestConfig), {})
```

In this form, the operation's cancellation constraints are captured when retrying
starts. Later `setConfig` updates still apply to headers, authentication, adapters
and other non-cancellation settings, but cannot attach an unrelated signal to that
operation.

Legacy `retry(fn)` and positional `retry(fn, retries, delay, options?)` calls still
invoke `fn()` with **zero arguments**, preserving optional/default parameters.
Their cancellation interrupts the retry promise and backoff, but the callback is
responsible for forwarding cancellation to its own network work. Use the explicit
options-object form for a pinned request configuration; when forwarding optional
options, pass `options ?? {}`.

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

Legacy methods return `LegacyStreamSubscription`, assignable to the previous
`Subscription` type, with `closed`, optional `cancelled`, and optional `onCancel`.
Its `add()`/`remove()` methods are compatibility no-ops (previously these methods
were absent and calling them threw). They do not compose RxJS teardowns; use
`unsubscribe()` to cancel the stream explicitly.

Legacy status callbacks retain `{ code: 2, details, metadata: originalError }`.
V2 transport errors retain numeric codes and map string codes, including protobuf-ts
status names, to `UNKNOWN` (`2`) as before. A callback or transport error shaped
like an `AbortError` is not by itself a user stop: only the stream's own cancellation
state suppresses error reporting.

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

A remote numeric gRPC `CANCELLED` (`1`) now reports `StreamError` and retries when
retrying is enabled; it previously reported `UserStopped`. String `CANCELLED`
remains `UNKNOWN` and retryable. Owned-signal abort, unsubscribe, and manager
`stop()`/`destroy()` remain local stops without retries.

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
are rejected rather than replacing its owner. Duplicate calls during connection
setup now wait for the shared socket to open.

Cancelling a pending connection now settles it instead of leaving it pending:
`disconnect()` or signal abort rejects with `AbortError`, and `destroy()` rejects
with `Error('Transport has been destroyed')`. The public readiness promise is
internally handled so an ignored `connect()` is safe during cleanup. Awaiting or
chaining that promise still observes rejection and must handle it. A resolved
promise means the connection opened, not that cleanup completed.

Connection-attempt failures now emit their specific disconnect reason, such as
`ConnectionTimeout`, instead of being collapsed to `ConnectionFailed`.

## Transaction observation

Transaction fetching, polling and inclusion waiting support cancellation. Existing
`fetchTxPoll({ txHash, abortSignal })` callers remain supported. Cancellation stops
the active requests, delays, event subscriptions and any fallback polling. Closing
an inclusion waiter cancels unresolved observation, including a pending `wait()`.
`close()` itself returns normally; pending `wait()` promises reject with the shared
`AbortError`. Previously polling could reject with the old cancellation message,
while event-only waits could remain pending after close.

REST observation also honors the signals configured on `httpClient` (constructor
and `setConfig`) throughout polling backoff, event preparation and inclusion
waiting. These compose with per-operation signals and preserve the first abort
reason. Prepared waiters retain their client cancellation scope until abort,
`close()` or wait settlement, including cancellation before `wait()` is called.

Event-inclusion fallback and dual event/poll observation use their owned lifecycle
signal to distinguish cancellation from a dependency failure. An unrelated
abort-shaped error from a WebSocket factory, subscription or fetch does not skip
configured fallback or cancel a viable sibling branch. Actual lifecycle aborts
and explicit waiter `close()` still stop all observation immediately.

Read-only transaction simulation also accepts final request options. Concrete gRPC
clients support `fetchTx(hash, options)`; REST clients keep query parameters second
and accept options third. When using the common `TxConcreteApi` interface, use
`fetchTx(hash, undefined, options)` for either implementation.

Per-poll request deadlines are separate from caller cancellation: an expired
attempt can be followed by another poll while the overall inclusion timeout has
not expired. Cancelling observation cannot reverse a broadcast transaction, and
must not be interpreted as evidence that the transaction failed on-chain.

The signal passed to `broadcast` controls preparation and inclusion observation,
not an in-flight broadcast mutation. If it is already aborted or aborts during
inclusion-waiter preparation (for example the event WebSocket handshake), no
broadcast is sent and the call rejects with plain `AbortError`.
Cancellation is checked again immediately before submission, including when it
occurs just after calling `broadcast()` with the default polling strategy.

After a successful broadcast response, cancelled observation rejects with
`TxObservationAbortError`, preserving both the abort `reason` and `txHash` so
callers can resume checking that transaction rather than submitting it again.
If the observation signal aborts while the mutation is in flight, the mutation
still completes; a successful response supplies the hash for this recovery error.

This observation-only guarantee applies to the per-operation inclusion/request
signals. Legacy client-wide transport cancellation (gRPC constructor `abort`, or
HTTP constructor/config `signal`) still applies to the broadcast request itself.
If it interrupts an in-flight submission before a successful response is received,
the outcome is unknown and the plain cancellation error may not contain `txHash`.
For that case, save `TxClient.hash(txRaw)` before sending and query that hash to
recover the outcome rather than assuming the transaction was never submitted.

Wallet `MsgBroadcaster` entry points preserve cancellation without emitting
`TransactionFail`. They emit `TransactionCancelled` (`transaction-cancelled`)
exactly once, passing the original cancellation error as the event argument.
Event-driven UIs should handle this terminal event to clear pending state. It
means the local operation stopped, not that the transaction was cancelled on-chain;
`TransactionBroadcastEnd` continues to indicate completed inclusion observation.
The event is available from both the root and lightweight wallet-base entry points.

Wallet inclusion waits and `CosmosWalletStrategy` retain the
known broadcast hash in `TxObservationAbortError`. Cancellation before a provider
returns a successful broadcast hash remains a plain cancellation error. Provider
abort errors from `enable` and `sendTx` pass through the Cosmos wallet adapters
unchanged, including native abort errors.

Custom broadcasters can use `observeTx(txHash, () => waitForInclusion())` from
`@injectivelabs/sdk-ts/core/tx` after successful submission. It adds the known hash
to cancellation and preserves an existing `TxObservationAbortError`. Put any
post-submission callbacks inside the observation callback as well. Preparation and
the submit call must run before this helper, so a transaction that was never
submitted cannot acquire a recovery hash.
