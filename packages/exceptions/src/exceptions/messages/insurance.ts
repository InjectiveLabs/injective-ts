import { createChainErrorMaps } from './utils.js'
import {
  ChainInsuranceErrorCodes,
  TransactionChainErrorModule,
} from '../types/index.js'

export const insuranceErrors = createChainErrorMaps(
  TransactionChainErrorModule.Insurance,
  [
    {
      code: ChainInsuranceErrorCodes.ErrInsuranceFundAlreadyExists,
      message: 'The insurance fund already exists',
      match: 'insurance fund already exists',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInsuranceFundNotFound,
      message: 'The insurance fund is not found',
      match: 'insurance fund not found',
    },
    {
      code: ChainInsuranceErrorCodes.ErrRedemptionAlreadyExists,
      message: 'The redemption already exists',
      match: 'redemption already exists',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidDepositAmount,
      message: 'The deposit amount is not valid',
      match: 'invalid deposit amount',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidDepositDenom,
      message: 'The deposit denom is not valid',
      match: 'invalid deposit denom',
    },
    {
      code: ChainInsuranceErrorCodes.ErrPayoutTooLarge,
      message: 'The insurance fund payout exceeds the deposits',
      match: 'insurance payout exceeds deposits',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidTicker,
      message: 'The ticker is not valid',
      match: 'invalid ticker',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidQuoteDenom,
      message: 'The quote denom is not valid',
      match: 'invalid quote denom',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidOracle,
      message: 'The oracle is not valid',
      match: 'invalid oracle',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidExpirationTime,
      message: 'The expiration time is not valid',
      match: 'invalid expiration time',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidMarketID,
      message: 'The marketId is not valid',
      match: 'invalid marketID',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidShareDenom,
      message: 'The share denom is not valid',
      match: 'invalid share denom',
    },
    {
      code: ChainInsuranceErrorCodes.ErrConsolidatedPoolExists,
      message: 'The consolidated insurance pool already exists',
      match: 'consolidated insurance pool already exists',
    },
    {
      code: ChainInsuranceErrorCodes.ErrConsolidatedPoolNotFound,
      message: 'The consolidated insurance pool has not been found',
      match: 'consolidated insurance pool not found',
    },
    {
      code: ChainInsuranceErrorCodes.ErrConsolidatedPolicyNotFound,
      message: 'The consolidated insurance policy has not been found',
      match: 'consolidated insurance policy not found',
    },
    {
      code: ChainInsuranceErrorCodes.ErrConsolidatedPoolPaused,
      message: 'The consolidated insurance payout pause is active',
      match: 'consolidated insurance payout pause is active',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInsufficientSharesOut,
      message: 'The shares out are insufficient',
      match: 'insufficient shares out',
    },
    {
      code: ChainInsuranceErrorCodes.ErrConsolidatedPoolDepleted,
      message: 'The consolidated pool has outstanding shares but no balance',
      match: 'consolidated pool has outstanding shares but no balance',
    },
    {
      code: ChainInsuranceErrorCodes.ErrConsolidatedReservationPendingRedemption,
      message:
        'The consolidated reservation growth is blocked by pending redemptions',
      match:
        'consolidated reservation growth is blocked by pending redemptions',
    },
    {
      code: ChainInsuranceErrorCodes.ErrMarketLaunchPending,
      message: 'A market launch proposal is pending',
      match: 'market launch proposal is pending',
    },
  ],
)
