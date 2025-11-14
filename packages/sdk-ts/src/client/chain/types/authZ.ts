import type * as CosmosAuthzV1Beta1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/authz_pb'
import type * as InjectiveExchangeV1Beta1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/authz_pb'

export type Grant = CosmosAuthzV1Beta1AuthzPb.Grant
export type GrantAuthorization = CosmosAuthzV1Beta1AuthzPb.GrantAuthorization
export type GenericAuthorization =
  CosmosAuthzV1Beta1AuthzPb.GenericAuthorization

export type CreateSpotLimitOrderAuthz =
  InjectiveExchangeV1Beta1AuthzPb.CreateSpotLimitOrderAuthz
export type CreateSpotMarketOrderAuthz =
  InjectiveExchangeV1Beta1AuthzPb.CreateSpotMarketOrderAuthz
export type BatchCreateSpotLimitOrdersAuthz =
  InjectiveExchangeV1Beta1AuthzPb.BatchCreateSpotLimitOrdersAuthz
export type CancelSpotOrderAuthz =
  InjectiveExchangeV1Beta1AuthzPb.CancelSpotOrderAuthz
export type BatchCancelSpotOrdersAuthz =
  InjectiveExchangeV1Beta1AuthzPb.BatchCancelSpotOrdersAuthz

export type CreateDerivativeLimitOrderAuthz =
  InjectiveExchangeV1Beta1AuthzPb.CreateDerivativeLimitOrderAuthz
export type CreateDerivativeMarketOrderAuthz =
  InjectiveExchangeV1Beta1AuthzPb.CreateDerivativeMarketOrderAuthz
export type BatchCreateDerivativeLimitOrdersAuthz =
  InjectiveExchangeV1Beta1AuthzPb.BatchCreateDerivativeLimitOrdersAuthz
export type CancelDerivativeOrderAuthz =
  InjectiveExchangeV1Beta1AuthzPb.CancelDerivativeOrderAuthz
export type BatchCancelDerivativeOrdersAuthz =
  InjectiveExchangeV1Beta1AuthzPb.BatchCancelDerivativeOrdersAuthz

export interface GrantWithDecodedAuthorization
  extends Omit<Grant, 'authorization'> {
  authorization:
    | GenericAuthorization
    | undefined /** Todo: add more authorizations */
  authorizationType: string
}

export interface GrantAuthorizationWithDecodedAuthorization
  extends Omit<GrantAuthorization, 'authorization'> {
  authorization:
    | GenericAuthorization
    | undefined /** Todo: add more authorizations */
  authorizationType: string
}
