import { Token } from '../services/token/types'

export interface TokenAndPrice extends Token {
  usdPrice: number
}

export interface CosmosChannel {
  aChainId: string
  bChainId: string
  aToBChannelId: string
  aToBClientId: string
  bToAClientId: string
  bToAChannelId: string
  port: string
}

export interface CosmosTxResponse {
  denom: string
  amount: string
  receiver: string
  sender: string
  txHash: string
  timeoutTimestamp: string
}

export interface IbcMsgTransfer {
  token: {
    denom: string
    amount: string
  }
  // eslint-disable-next-line camelcase
  timeout_timestamp: string
}

export interface KeplrWalletAttribute {
  key: string
  value: string
}

export interface KeplrWalletSendPacketAttribute {
  amount: string
  denom: string
  receiver: string
  sender: string
}

export interface KeplrWalletEvent {
  type: string
  attributes: KeplrWalletAttribute[]
}

export interface KeplrWalletEvents {
  events: KeplrWalletEvent[]
}

export interface KeplrWalletResponse {
  code: number
  height: number
  rawLog: string
  transactionHash: string
}

export interface TerraWalletMsg {
  receiver: string
  sender: string
  // eslint-disable-next-line camelcase
  timeout_timestamp: string
  token: {
    amount: any
    denom: string
  }
}
export interface TerraWalletResponse {
  msgs: TerraWalletMsg[]
  result: {
    // eslint-disable-next-line camelcase
    raw_log: string
    txhash: string
  }
  success: boolean
}
