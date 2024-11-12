import {
  InjectivePermissionsV1Beta1Permissions,
  InjectivePermissionsV1Beta1Params,
} from '@injectivelabs/core-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

export type GrpcPermissionsNamespace =
  InjectivePermissionsV1Beta1Permissions.Namespace
export type GrpcPermissionsRole = InjectivePermissionsV1Beta1Permissions.Role
export type GrpcPermissionsRoleIDs =
  InjectivePermissionsV1Beta1Permissions.RoleIDs
export type GrpcPermissionsAddressVoucher =
  InjectivePermissionsV1Beta1Permissions.AddressVoucher
export type GrpcPermissionVoucher =
  InjectivePermissionsV1Beta1Permissions.Voucher
export type GrpcPermissionsParams = InjectivePermissionsV1Beta1Params.Params

export interface Namespace
  extends InjectivePermissionsV1Beta1Permissions.Namespace {
  //
}

export interface PermissionsModuleParams
  extends InjectivePermissionsV1Beta1Params.Params {
  //
}

export interface RoleManager
  extends InjectivePermissionsV1Beta1Permissions.RoleManager {
  //
}

export interface PolicyStatus
  extends InjectivePermissionsV1Beta1Permissions.PolicyStatus {
  //
}

export interface PolicyManagerCapability
  extends InjectivePermissionsV1Beta1Permissions.PolicyManagerCapability {
  //
}

export interface AddressVoucher
  extends InjectivePermissionsV1Beta1Permissions.AddressVoucher {
  //
}

export type Voucher = Coin | undefined
