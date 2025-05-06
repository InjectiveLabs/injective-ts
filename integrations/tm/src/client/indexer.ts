import { WebSocketClient } from './ws.js'
import { handleNewBlock } from './handlers/blocks.js'
import { handleNewTx } from './handlers/txs.js'
import { NewBlockEvent, NewTxEvent, type MessageHandlerArgs } from '../types.js'
import { logger } from '../logger.js'

export class CometBFTIndexer {
  private ws: WebSocketClient

  constructor(endpoints: string[]) {
    this.ws = new WebSocketClient(endpoints, this.onMessage.bind(this))
  }

  public subscribe() {
    const subs = [{ query: "tm.event='NewBlock'" }, { query: "tm.event='Tx'" }]

    for (const sub of subs) {
      this.ws.send({
        jsonrpc: '2.0',
        method: 'subscribe',
        id: Math.floor(Math.random() * 1_000_000),
        params: sub,
      })
    }
  }

  private async onMessage(msg: MessageHandlerArgs) {
    const data = msg?.result?.data

    if (!data) {
      logger.debug('📦 Message data doesnt exist or is undefined:', msg)

      return
    }

    if (!data.type) {
      logger.debug('📦 Message type doesnt exist or is undefined:', msg)

      return
    }

    switch (data.type) {
      case 'tendermint/event/NewBlock':
        await handleNewBlock(data.value as NewBlockEvent['value'])
        break
      case 'tendermint/event/Tx':
        await handleNewTx(data.value as NewTxEvent['value'])
        break
      default:
        logger.warn('📦 Unhandled message type:', data.type)
    }
  }
}
