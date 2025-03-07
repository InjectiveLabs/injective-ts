import { BigNumberInBase } from '@injectivelabs/utils'
import { InjectiveReferralRpc } from '@injectivelabs/indexer-proto-ts'

export interface ReferralDetails {
  referrerCode: string
  referrerAddress: string
  totalCommission: BigNumberInBase
  totalTradingVolume: BigNumberInBase
  invitees: InjectiveReferralRpc.ReferralInvitee[]
}
