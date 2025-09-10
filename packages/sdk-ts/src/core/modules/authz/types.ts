export const GrantAuthorizationType = {
  GenericAuthorization: 'GenericAuthorization',
  ContractExecutionAuthorization: 'ContractExecutionAuthorization',
} as const

export type GrantAuthorizationType = typeof GrantAuthorizationType[keyof typeof GrantAuthorizationType]
