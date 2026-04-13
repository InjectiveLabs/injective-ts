import type { BigNumber } from '@injectivelabs/utils'
import type * as InjectiveReferralRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_referral_rpc_pb'

export interface ReferralDetails {
  referrerCode: string
  referrerAddress: string
  totalCommission: BigNumber
  totalTradingVolume: BigNumber
  invitees: InjectiveReferralRpcPb.ReferralInvitee[]
}
