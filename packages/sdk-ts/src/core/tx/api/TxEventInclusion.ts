import { throwIfAborted, createAbortError } from '@injectivelabs/utils'
import { closeWebSocketSafely } from '../../../utils/websocket.js'
import type {
  TxEventWebSocketFactory,
  TxClientBroadcastResponse,
} from '../types/tx.js'
import type {
  TendermintTxEventSubscription,
  SubscribeToTendermintTxEventArgs,
} from './types.js'

export function normalizeTendermintWebSocketEndpoint(endpoint: string): string {
  let normalized = endpoint

  if (normalized.startsWith('http://')) {
    normalized = `ws://${normalized.slice('http://'.length)}`
  } else if (normalized.startsWith('https://')) {
    normalized = `wss://${normalized.slice('https://'.length)}`
  }

  return normalized.endsWith('/websocket')
    ? normalized
    : `${normalized.replace(/\/$/, '')}/websocket`
}

export async function subscribeToTendermintTxEvent({
  txHash,
  timeout,
  endpoint,
  webSocketFactory,
  signal,
}: SubscribeToTendermintTxEventArgs): Promise<TendermintTxEventSubscription> {
  throwIfAborted(signal)

  const normalizedTxHash = normalizeTendermintTxHash(txHash)
  const websocketEndpoint = normalizeTendermintWebSocketEndpoint(endpoint)
  const socket = createTendermintSocket(websocketEndpoint, webSocketFactory)
  const query = `tm.event='Tx' AND tx.hash='${normalizedTxHash}'`
  const requestId = `tx-event-${Date.now()}-${Math.random()}`

  return new Promise((resolve, reject) => {
    let ready = false
    let waitSettled = false
    let closed = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    let waitResolve: (response: TxClientBroadcastResponse) => void
    let waitReject: (error: Error) => void

    const waitPromise = new Promise<TxClientBroadcastResponse>(
      (resolveWait, rejectWait) => {
        waitResolve = resolveWait
        waitReject = rejectWait
      },
    )

    // A subscription may be closed by a winning observation before anyone
    // consumes `wait()`. Keep the internal rejection observed while still
    // returning the original promise to callers.
    waitPromise.then(
      () => undefined,
      () => undefined,
    )

    const removeAbortListener = () => {
      signal?.removeEventListener('abort', onAbort)
    }

    const cleanup = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }

      removeAbortListener()
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('message', onMessage)
      socket.removeEventListener('error', onError)
      socket.removeEventListener('close', onClose)

      closeWebSocketSafely(socket)
    }

    /**
     * Settles the wait promise once and releases the socket/timer/listeners.
     * Later `wait()` calls reuse the same already-settled promise.
     */
    const settleWait = (settle: () => void): boolean => {
      if (waitSettled) {
        return false
      }

      waitSettled = true
      closed = true
      cleanup()
      settle()

      return true
    }

    const close = () => {
      if (closed && waitSettled) {
        return
      }

      closed = true
      cleanup()

      if (!waitSettled) {
        waitSettled = true
        waitReject(createAbortError(signal))
      }

      if (!ready) {
        ready = true
        reject(createAbortError(signal))
      }
    }

    const onAbort = () => {
      close()
    }

    const resolveSubscription = () => {
      if (ready || closed) {
        return
      }

      ready = true
      resolve({
        close,
        wait: () => waitPromise,
      })
    }

    const rejectWait = (error: Error) => {
      settleWait(() => waitReject(error))
    }

    const rejectSubscription = (error: Error) => {
      closed = true
      cleanup()

      if (!waitSettled) {
        waitSettled = true
        waitReject(error)
      }

      if (!ready) {
        ready = true
        reject(error)
      }
    }

    timeoutId = setTimeout(() => {
      const error = new Error(
        `Timed out waiting for Tendermint tx event after ${timeout}ms`,
      )

      if (ready) {
        rejectWait(error)
        return
      }

      rejectSubscription(error)
    }, timeout)

    const resolveWait = (response: TxClientBroadcastResponse) => {
      settleWait(() => waitResolve(response))
    }

    const onOpen = () => {
      if (closed) {
        return
      }

      try {
        socket.send(
          JSON.stringify({
            id: requestId,
            jsonrpc: '2.0',
            method: 'subscribe',
            params: { query },
          }),
        )
      } catch (error: unknown) {
        rejectSubscription(
          error instanceof Error
            ? error
            : new Error(`Tendermint subscribe failed: ${String(error)}`),
        )
      }
    }

    const onMessage = (event: MessageEvent) => {
      void readMessageEventData(event)
        .then((messageData) => {
          if (closed || waitSettled) {
            return
          }

          const message = JSON.parse(messageData)
          const eventResponse = parseTxEventResponse(message, normalizedTxHash)

          if (eventResponse) {
            resolveSubscription()
            resolveWait(eventResponse)
            return
          }

          if (message.id !== requestId) {
            return
          }

          if (message.error) {
            const error = new Error(
              `Tendermint subscribe failed: ${JSON.stringify(message.error)}`,
            )

            if (ready) {
              rejectWait(error)
              return
            }

            rejectSubscription(error)
            return
          }

          resolveSubscription()
        })
        .catch((error: unknown) => {
          if (closed || waitSettled) {
            return
          }

          const messageError =
            error instanceof Error
              ? error
              : new Error(`Invalid Tendermint WebSocket JSON: ${String(error)}`)

          if (ready) {
            rejectWait(messageError)
            return
          }

          rejectSubscription(messageError)
        })
    }

    const onError = () => {
      if (closed) {
        return
      }

      const error = new Error('Tendermint WebSocket error')

      if (ready) {
        rejectWait(error)
        return
      }

      rejectSubscription(error)
    }

    const onClose = () => {
      if (closed) {
        return
      }

      const error = new Error('Tendermint WebSocket closed')

      if (ready) {
        rejectWait(error)
        return
      }

      rejectSubscription(error)
    }

    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('error', onError)
    socket.addEventListener('close', onClose)

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true })

      // Guard against a signal aborting between the initial check and listener
      // setup.
      if (signal.aborted) {
        onAbort()
      }
    }
  })
}

function normalizeTendermintTxHash(txHash: string): string {
  if (!/^[0-9a-fA-F]{64}$/.test(txHash)) {
    throw new Error('Invalid Tendermint tx hash')
  }

  return txHash.toUpperCase()
}

function createTendermintSocket(
  endpoint: string,
  webSocketFactory?: TxEventWebSocketFactory,
) {
  if (webSocketFactory) {
    return webSocketFactory(endpoint)
  }

  if (!globalThis.WebSocket) {
    throw new Error('WebSocket is not available in this environment')
  }

  return new globalThis.WebSocket(endpoint)
}

async function readMessageEventData(event: MessageEvent): Promise<string> {
  const { data } = event

  if (typeof data === 'string') {
    return data
  }

  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return data.text()
  }

  if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data)
  }

  if (ArrayBuffer.isView(data)) {
    return new TextDecoder().decode(data)
  }

  return String(data)
}

function parseTxEventResponse(
  message: any,
  txHash: string,
): TxClientBroadcastResponse | undefined {
  const data = message?.params?.result?.data ?? message?.result?.data
  const eventTxHashes = readTxEventHashes(data)

  if (
    eventTxHashes.length > 0 &&
    !eventTxHashes.some(
      (eventTxHash) => eventTxHash.toUpperCase() === txHash.toUpperCase(),
    )
  ) {
    return undefined
  }

  const value = data?.value ?? data
  const txResult = value?.TxResult ?? value?.tx_result ?? value
  const result = txResult?.result ?? txResult?.Result

  if (!txResult || !result) {
    return undefined
  }

  return {
    txHash,
    logs: [],
    timestamp: '',
    data: result.data || '',
    info: result.info || '',
    events: result.events || [],
    code: Number(result.code || 0),
    codespace: result.codespace || '',
    rawLog: result.log || result.raw_log || '',
    height: Number(txResult.height || value?.height || 0),
    gasUsed: Number(result.gas_used || result.gasUsed || 0),
    gasWanted: Number(result.gas_wanted || result.gasWanted || 0),
  }
}

function readTxEventHashes(data: any): string[] {
  const txHashEvent = data?.events?.['tx.hash'] ?? data?.events?.tx_hash

  if (Array.isArray(txHashEvent)) {
    return txHashEvent.map(String)
  }

  if (txHashEvent) {
    return [String(txHashEvent)]
  }

  return []
}
