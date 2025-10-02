import type { BigNumber } from '@injectivelabs/utils'
import type { InjectiveReferralRpc } from '@injectivelabs/indexer-proto-ts'

export interface ReferralDetails {
  referrerCode: string
  referrerAddress: string
  totalCommission: BigNumber
  totalTradingVolume: BigNumber
  invitees: InjectiveReferralRpc.ReferralInvitee[]
}
