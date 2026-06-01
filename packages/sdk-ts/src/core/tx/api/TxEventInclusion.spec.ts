import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import { TxClient } from '../utils/classes/TxClient.js'
import {
  subscribeToTendermintTxEvent,
  normalizeTendermintWebSocketEndpoint,
} from './TxEventInclusion.js'

class FakeWebSocket extends EventTarget {
  public readyState = 0
  public readonly sent: string[] = []

  constructor(public readonly url: string) {
    super()
    queueMicrotask(() => {
      this.readyState = 1
      this.dispatchEvent(new Event('open'))
    })
  }

  send(data: string) {
    this.sent.push(data)
    const request = JSON.parse(data)
    queueMicrotask(() => {
      this.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            id: request.id,
            jsonrpc: '2.0',
            result: {},
          }),
        }),
      )
    })
  }

  close() {
    this.readyState = 3
    this.dispatchEvent(new Event('close'))
  }

  emitTx(txHash: string, code = 0) {
    this.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            result: {
              data: {
                events: {
                  'tx.hash': [txHash],
                },
                value: {
                  TxResult: {
                    height: '123',
                    result: {
                      code,
                      log: code === 0 ? '' : 'failed',
                    },
                  },
                },
              },
            },
          },
        }),
      }),
    )
  }
}

const makeTxHash = () => {
  const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
    bodyBytes: new Uint8Array([1]),
    authInfoBytes: new Uint8Array([2]),
    signatures: [new Uint8Array([3])],
  })

  return TxClient.hash(txRaw)
}

describe('Tendermint tx event inclusion', () => {
  it('normalizes Tendermint HTTP endpoints to websocket endpoints', () => {
    expect(normalizeTendermintWebSocketEndpoint('http://localhost:26657')).toBe(
      'ws://localhost:26657/websocket',
    )
    expect(
      normalizeTendermintWebSocketEndpoint('https://rpc.injective.network/'),
    ).toBe('wss://rpc.injective.network/websocket')
    expect(
      normalizeTendermintWebSocketEndpoint(
        'wss://rpc.injective.network/websocket',
      ),
    ).toBe('wss://rpc.injective.network/websocket')
  })

  it('waits for the subscribed tx event', async () => {
    const txHash = makeTxHash()
    let socket: FakeWebSocket | undefined

    const subscription = await subscribeToTendermintTxEvent({
      txHash,
      timeout: 1000,
      endpoint: 'http://localhost:26657',
      webSocketFactory: (endpoint) => {
        socket = new FakeWebSocket(endpoint)
        return socket as unknown as WebSocket
      },
    })

    expect(socket?.url).toBe('ws://localhost:26657/websocket')
    expect(socket?.sent[0]).toContain(`tx.hash='${txHash}'`)

    socket?.emitTx(txHash)

    await expect(subscription.wait()).resolves.toMatchObject({
      txHash,
      height: 123,
      code: 0,
    })
  })

  it('ignores tx events for other hashes', async () => {
    const txHash = makeTxHash()
    let socket: FakeWebSocket | undefined

    const subscription = await subscribeToTendermintTxEvent({
      txHash,
      timeout: 1000,
      endpoint: 'http://localhost:26657',
      webSocketFactory: (endpoint) => {
        socket = new FakeWebSocket(endpoint)
        return socket as unknown as WebSocket
      },
    })

    socket?.emitTx('OTHER_HASH')
    socket?.emitTx(txHash)

    await expect(subscription.wait()).resolves.toMatchObject({ txHash })
  })
})
