import * as InjectivePermissionsV1Beta1PermissionsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/permissions_pb.mjs'
import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectivePermissionsV1Beta1ParamsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/params_pb.mjs'

export interface PermissionParams {
  wasmHookQueryMaxGas: string
}

export interface PermissionRole {
  name: string
  roleId: number
  permissions: number
}

export interface PermissionActorRoles {
  actor: string
  roles: string[]
}

export interface PermissionRoleManager {
  manager: string
  roles: string[]
}

export interface PermissionPolicyStatus {
  action: InjectivePermissionsV1Beta1PermissionsPb.Action
  isDisabled: boolean
  isSealed: boolean
}

export interface PermissionPolicyManagerCapability {
  manager: string
  action: InjectivePermissionsV1Beta1PermissionsPb.Action
  canDisable: boolean
  canSeal: boolean
}

export interface PermissionRoleActors {
  role: string
  actors: string[]
}

export interface PermissionRoleIDs {
  roleIds: number[]
}

export interface PermissionAddressVoucher {
  address: string
  voucher?: Coin
}

export interface PermissionNamespace {
  denom: string
  contractHook: string
  rolePermissions: PermissionRole[]
  actorRoles: PermissionActorRoles[]
  roleManagers: PermissionRoleManager[]
  policyStatuses: PermissionPolicyStatus[]
  policyManagerCapabilities: PermissionPolicyManagerCapability[]
}

export interface PermissionsModuleParams {
  wasmHookQueryMaxGas: string
}

export interface PermissionAddressRoles {
  address: string
  roles: string[]
}

export interface PermissionRoleIDs {
  roleIds: number[]
}

export interface PermissionVoucher {
  coins: Coin[]
}

export interface PermissionAddressVoucher {
  address: string
  voucher?: Coin
}

export interface PermissionGenesisState {
  params?: PermissionParams
  namespaces: PermissionNamespace[]
  vouchers: PermissionAddressVoucher[]
}

export type GrpcPermissionNamespace =
  InjectivePermissionsV1Beta1PermissionsPb.Namespace
export type GrpcPermissionRoleIDs =
  InjectivePermissionsV1Beta1PermissionsPb.RoleIDs
export type GrpcPermissionsNamespace =
  InjectivePermissionsV1Beta1PermissionsPb.Namespace
export type GrpcPermissionRoleActors =
  InjectivePermissionsV1Beta1PermissionsPb.RoleActors
export type GrpcPermissionActorRoles =
  InjectivePermissionsV1Beta1PermissionsPb.ActorRoles
export type GrpcPermissionRoleManager =
  InjectivePermissionsV1Beta1PermissionsPb.RoleManager
export type GrpcPermissionPolicyStatus =
  InjectivePermissionsV1Beta1PermissionsPb.PolicyStatus
export type GrpcPermissionAddressVoucher =
  InjectivePermissionsV1Beta1PermissionsPb.AddressVoucher
export type GrpcPermissionPolicyStatusManagerCapability =
  InjectivePermissionsV1Beta1PermissionsPb.PolicyManagerCapability
export type GrpcPermissionsParams = InjectivePermissionsV1Beta1ParamsPb.Params
export type GrpcPermissionRole = InjectivePermissionsV1Beta1PermissionsPb.Role

export const PermissionActionMap =
  InjectivePermissionsV1Beta1PermissionsPb.Action
