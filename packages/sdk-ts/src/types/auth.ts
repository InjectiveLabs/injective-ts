export interface AccountDetails {
  address: string
  pubKey: {
    type: string
    key: string
  }
  accountNumber: number
  sequence: number
}
