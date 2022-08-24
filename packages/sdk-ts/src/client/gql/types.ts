/**
 * @hidden
 */
export interface UserDeposit {
  id: string
  tokenContract: string
  sender: string
  destination: string
  amount: string
  eventNonce: number
  timestamp: number
  blockHeight: number
}

/**
 * @hidden
 */
export interface UserDepositResponse {
  deposits: UserDeposit[]
}
