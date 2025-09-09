export type GrantAuthorizationType =
  | 'GenericAuthorization'
  | 'ContractExecutionAuthorization'

export const GrantAuthorizationType = {
  GenericAuthorization: 'GenericAuthorization',
  ContractExecutionAuthorization: 'ContractExecutionAuthorization',
} as const
