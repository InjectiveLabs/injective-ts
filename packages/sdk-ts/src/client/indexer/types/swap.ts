export interface Route {
  steps: string[]
  sourceDenom: string
  targetDenom: string
}

export interface Fee {
  amount: string
  denom: string
}

export interface ExecutionQuantity {
  fees: Fee[]
  targetQuantity: string
}
