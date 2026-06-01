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
}: SubscribeToTendermintTxEventArgs): Promise<TendermintTxEventSubscription> {
  const normalizedTxHash = normalizeTendermintTxHash(txHash)
  const websocketEndpoint = normalizeTendermintWebSocketEndpoint(endpoint)
  const socket = createTendermintSocket(websocketEndpoint, webSocketFactory)
  const query = `tm.event='Tx' AND tx.hash='${normalizedTxHash}'`
  const requestId = `tx-event-${Date.now()}-${Math.random()}`

  return new Promise((resolve, reject) => {
    let ready = false
    let waitSettled = false
    let closedIntentionally = false
    let timeoutId: ReturnType<typeof setTimeout>

    let waitResolve: (response: TxClientBroadcastResponse) => void
    let waitReject: (error: Error) => void

    const waitPromise = new Promise<TxClientBroadcastResponse>(
      (resolveWait, rejectWait) => {
        waitResolve = resolveWait
        waitReject = rejectWait
      },
    )

    const resolveSubscription = () => {
      if (ready) {
        return
      }

      ready = true
      resolve({
        close: cleanup,
        wait: () => waitPromise,
      })
    }

    const cleanup = () => {
      closedIntentionally = true
      clearTimeout(timeoutId)
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('message', onMessage)
      socket.removeEventListener('error', onError)
      socket.removeEventListener('close', onClose)

      if (socket.readyState === 1 || socket.readyState === 0) {
        socket.close()
      }
    }

    const rejectWait = (error: Error) => {
      if (waitSettled) {
        return
      }

      waitSettled = true
      waitReject(error)
      cleanup()
    }

    timeoutId = setTimeout(() => {
      const error = new Error(
        `Timed out waiting for Tendermint tx event after ${timeout}ms`,
      )

      if (ready) {
        rejectWait(error)
        return
      }

      cleanup()
      reject(error)
    }, timeout)

    const resolveWait = (response: TxClientBroadcastResponse) => {
      if (waitSettled) {
        return
      }

      waitSettled = true
      waitResolve(response)
      cleanup()
    }

    const rejectForMessageError = (error: Error) => {
      if (ready) {
        rejectWait(error)
        return
      }

      cleanup()
      reject(error)
    }

    const onOpen = () => {
      socket.send(
        JSON.stringify({
          id: requestId,
          jsonrpc: '2.0',
          method: 'subscribe',
          params: { query },
        }),
      )
    }

    const onMessage = (event: MessageEvent) => {
      void readMessageEventData(event)
        .then((messageData) => {
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
            rejectForMessageError(
              new Error(
                `Tendermint subscribe failed: ${JSON.stringify(message.error)}`,
              ),
            )
            return
          }

          resolveSubscription()
        })
        .catch((error: unknown) => {
          rejectForMessageError(
            error instanceof Error
              ? error
              : new Error(
                  `Invalid Tendermint WebSocket JSON: ${String(error)}`,
                ),
          )
        })
    }

    const onError = () => {
      const error = new Error('Tendermint WebSocket error')

      if (ready) {
        rejectWait(error)
        return
      }

      cleanup()
      reject(error)
    }

    const onClose = () => {
      if (closedIntentionally) {
        return
      }

      const error = new Error('Tendermint WebSocket closed')

      if (ready) {
        rejectWait(error)
        return
      }

      cleanup()
      reject(error)
    }

    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('error', onError)
    socket.addEventListener('close', onClose)
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
