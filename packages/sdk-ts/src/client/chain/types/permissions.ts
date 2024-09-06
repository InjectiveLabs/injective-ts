import {
    InjectivePermissionsV1Beta1Permissions,
    InjectivePermissionsV1Beta1Params
  } from '@injectivelabs/core-proto-ts'

import { Coin } from '@injectivelabs/ts-types'

  export interface Namespace {
    denom: string
    wasmHook: string
    mintsPaused: boolean
    sendsPaused: boolean
    burnsPaused: boolean
    rolePermissions: Role[]
    addressRoles: AddressRoles[]

  }

  export interface PermissionsModuleParams {
    wasmHookQueryMaxGas: string
  }


  export interface AddressRoles {
    address: string
    roles: string[]
  }


  export interface Role {
    role: string
    permissions: number
  }


  export interface RoleIDs {
    roleIds: number[]
  }

  export interface Voucher {
    coins: Coin[]
  }

  export interface AddressVoucher {
    address: string
    voucher?: Voucher
  }

  export type GrpcPermissionsNamespace = InjectivePermissionsV1Beta1Permissions.Namespace
  export type GrpcPermissionsAddressRoles = InjectivePermissionsV1Beta1Permissions.AddressRoles
  export type GrpcPermissionsRole = InjectivePermissionsV1Beta1Permissions.Role
  export type GrpcPermissionsRoleIDs = InjectivePermissionsV1Beta1Permissions.RoleIDs
  export type GrpcPermissionsAddressVoucher = InjectivePermissionsV1Beta1Permissions.AddressVoucher
  export type GrpcPermissionVoucher = InjectivePermissionsV1Beta1Permissions.Voucher
  export type GrpcPermissionsParams = InjectivePermissionsV1Beta1Params.Params
