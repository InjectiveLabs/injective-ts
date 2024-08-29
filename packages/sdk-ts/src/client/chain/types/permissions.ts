import {
    InjectivePermissionsV1Beta1Exchange,
  } from '@injectivelabs/core-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

  export interface PermissionsModuleNamespace {
    denom: string
    wasmHook: string
    mintsPaused: boolean
    sendsPaused: boolean
    burnsPaused: boolean
    rolePermissions: Role[]
    addressRoles: AddressRoles[]

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
    voucher: Voucher | undefined
  }

  export type GrpcPermissionsNamespace = InjectivePermissionsV1Beta1Exchange.Namespace
  export type GrpcPermissionsAddressRoles = InjectivePermissionsV1Beta1Exchange.AddressRoles
  export type GrpcPermissionsRole = InjectivePermissionsV1Beta1Exchange.Role
  export type GrpcPermissionsRoleIDs = InjectivePermissionsV1Beta1Exchange.RoleIDs
  export type GrpcPermissionsAddressVoucher = InjectivePermissionsV1Beta1Exchange.AddressVoucher
  export type GrpcPermissionVoucher = InjectivePermissionsV1Beta1Exchange.Voucher
