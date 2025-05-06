export interface NewBlockEvent {
  type: 'tendermint/event/NewBlock'
  value: {
    block: {
      header: {
        height: string
        time: string
        chain_id: string
      }
      data: {
        txs: {
          tx: {
            body: {
              messages: {
                type: string
              }[]
            }
          }
        }[]
      }
    }
  }
}

export interface NewTxEvent {
  type: 'tendermint/event/Tx'
  value: {
    TxResult: {
      height: string
      result: {
        data: string
        events: Array<{
          attributes: Array<{
            index: boolean
            key: string
            value: string
          }>
          type: 'tx' | 'message'
        }>
        gas_used: string
        gas_wanted: string
        log: string
      }
      tx: string
    }
  }
}

export type CometBFTEvent =
  | NewBlockEvent
  | NewTxEvent
  | { type: string; value: unknown }

export type MessageHandlerArgs = {
  result?: { data?: CometBFTEvent }
}
export type MessageHandler = (msg: MessageHandlerArgs) => void
