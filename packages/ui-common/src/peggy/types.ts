export interface PeggyTxResponse {
  denom: string
  amount: string
  receiver: string
  sender: string
  txHash: string
  bridgeFee?: string
}
