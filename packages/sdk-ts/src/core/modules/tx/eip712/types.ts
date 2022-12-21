export interface TypedDataField {
  name: string
  type: string
}

export type Eip712ConvertTxArgs = {
  accountNumber: string
  sequence: string
  timeoutHeight: string
  chainId: string
  memo?: string
}

export type Eip712ConvertFeeArgs = {
  amount?: {
    amount: string
    denom: string
  }[]
  gas?: string
  feePayer?: string
}

export interface TypedDataField {
  name: string
  type: string
}

export type MapOfTypedDataField = Map<string, TypedDataField[]>
