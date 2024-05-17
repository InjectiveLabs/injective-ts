import {
  CosmosAuthzV1Beta1Authz,
  InjectiveExchangeV1Beta1Authz,
} from '@injectivelabs/core-proto-ts'

export type Grant = CosmosAuthzV1Beta1Authz.Grant
export type GrantAuthorization = CosmosAuthzV1Beta1Authz.GrantAuthorization
export type GenericAuthorization = CosmosAuthzV1Beta1Authz.GenericAuthorization

export type CreateSpotLimitOrderAuthz =
  InjectiveExchangeV1Beta1Authz.CreateSpotLimitOrderAuthz
export type CreateSpotMarketOrderAuthz =
  InjectiveExchangeV1Beta1Authz.CreateSpotMarketOrderAuthz
export type BatchCreateSpotLimitOrdersAuthz =
  InjectiveExchangeV1Beta1Authz.BatchCreateSpotLimitOrdersAuthz
export type CancelSpotOrderAuthz =
  InjectiveExchangeV1Beta1Authz.CancelSpotOrderAuthz
export type BatchCancelSpotOrdersAuthz =
  InjectiveExchangeV1Beta1Authz.BatchCancelSpotOrdersAuthz

export type CreateDerivativeLimitOrderAuthz =
  InjectiveExchangeV1Beta1Authz.CreateDerivativeLimitOrderAuthz
export type CreateDerivativeMarketOrderAuthz =
  InjectiveExchangeV1Beta1Authz.CreateDerivativeMarketOrderAuthz
export type BatchCreateDerivativeLimitOrdersAuthz =
  InjectiveExchangeV1Beta1Authz.BatchCreateDerivativeLimitOrdersAuthz
export type CancelDerivativeOrderAuthz =
  InjectiveExchangeV1Beta1Authz.CancelDerivativeOrderAuthz
export type BatchCancelDerivativeOrdersAuthz =
  InjectiveExchangeV1Beta1Authz.BatchCancelDerivativeOrdersAuthz

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
