export interface SendTransactionOptions {
  tx: {
    from: string
    to: string
    gas: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string | null
    data: any
  }
  address: string
}
