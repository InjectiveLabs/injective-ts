export interface RFQPricingTier {
  notionalUsd: number
  bid: string
  ask: string
  ageMs: number
}

export interface RFQPricing {
  marketId: string
  timestamp: number
  markPrice: string
  tiers: RFQPricingTier[]
}
