import type {
  InjectivePermissionsV1Beta1Params,
  InjectivePermissionsV1Beta1Permissions,
} from '@injectivelabs/core-proto-ts'
import { InjectivePermissionsV1Beta1Permissions as PermissionProto } from '@injectivelabs/core-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

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
  action: PermissionProto.Action
  isDisabled: boolean
  isSealed: boolean
}

export interface PermissionPolicyManagerCapability {
  manager: string
  action: PermissionProto.Action
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
  InjectivePermissionsV1Beta1Permissions.Namespace
export type GrpcPermissionRoleIDs =
  InjectivePermissionsV1Beta1Permissions.RoleIDs
export type GrpcPermissionsNamespace =
  InjectivePermissionsV1Beta1Permissions.Namespace
export type GrpcPermissionRoleActors =
  InjectivePermissionsV1Beta1Permissions.RoleActors
export type GrpcPermissionActorRoles =
  InjectivePermissionsV1Beta1Permissions.ActorRoles
export type GrpcPermissionRoleManager =
  InjectivePermissionsV1Beta1Permissions.RoleManager
export type GrpcPermissionPolicyStatus =
  InjectivePermissionsV1Beta1Permissions.PolicyStatus
export type GrpcPermissionAddressVoucher =
  InjectivePermissionsV1Beta1Permissions.AddressVoucher
export type GrpcPermissionPolicyStatusManagerCapability =
  InjectivePermissionsV1Beta1Permissions.PolicyManagerCapability
export type GrpcPermissionsParams = InjectivePermissionsV1Beta1Params.Params
export type GrpcPermissionRole = InjectivePermissionsV1Beta1Permissions.Role

export const PermissionActionMap = PermissionProto.Action
