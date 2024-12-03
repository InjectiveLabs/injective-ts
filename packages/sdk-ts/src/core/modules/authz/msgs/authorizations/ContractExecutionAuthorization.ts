import {
  GoogleProtobufAny,
  CosmwasmWasmV1Authz,
} from '@injectivelabs/core-proto-ts'
import { BaseAuthorization } from './Base.js'

export declare namespace ContractExecutionAuthorization {
  export interface Params {
    contract: string
    limit?: {
      maxCalls: number
    }
    filter?: {
      acceptedMessagesKeys: string[]
    }
  }

  export type Any = GoogleProtobufAny.Any

  export type Proto = CosmwasmWasmV1Authz.ContractExecutionAuthorization

  export type Amino = Object
}

/**
 * @category Contract Exec Arguments
 */
export default class ContractExecutionAuthorization extends BaseAuthorization<
  ContractExecutionAuthorization.Params,
  ContractExecutionAuthorization.Proto,
  ContractExecutionAuthorization.Amino
> {
  static fromJSON(
    params: ContractExecutionAuthorization.Params,
  ): ContractExecutionAuthorization {
    return new ContractExecutionAuthorization(params)
  }

  public toAny(): GoogleProtobufAny.Any {
    const { params } = this

    const authorization =
      CosmwasmWasmV1Authz.ContractExecutionAuthorization.create()
    const grant = CosmwasmWasmV1Authz.ContractGrant.create()

    grant.contract = params.contract

    if (params.limit) {
      const limit = CosmwasmWasmV1Authz.MaxCallsLimit.create()

      limit.remaining = params.limit.maxCalls.toString()

      const any = GoogleProtobufAny.Any.create()
      any.typeUrl = '/cosmwasm.wasm.v1.MaxCallsLimit'
      any.value = CosmwasmWasmV1Authz.MaxCallsLimit.encode(limit).finish()

      grant.limit = any
    }

    if (params.filter) {
      const filter = CosmwasmWasmV1Authz.AcceptedMessageKeysFilter.create()

      filter.keys = params.filter.acceptedMessagesKeys

      const any = GoogleProtobufAny.Any.create()
      any.typeUrl = '/cosmwasm.wasm.v1.AcceptedMessageKeysFilter'
      any.value =
        CosmwasmWasmV1Authz.AcceptedMessageKeysFilter.encode(filter).finish()

      grant.filter = any
    }

    authorization.grants = [grant]

    const any = GoogleProtobufAny.Any.create()
    any.typeUrl = '/cosmwasm.wasm.v1.ContractExecutionAuthorization'
    any.value =
      CosmwasmWasmV1Authz.ContractExecutionAuthorization.encode(
        authorization,
      ).finish()

    return any
  }

  public toProto(): ContractExecutionAuthorization.Proto {
    const authorization =
      CosmwasmWasmV1Authz.ContractExecutionAuthorization.decode(
        this.toAny().value,
      )

    return authorization
  }

  public toAmino(): ContractExecutionAuthorization.Amino {
    const { params } = this

    const grant = {} as Record<string, any>

    grant.contract = params.contract

    if (params.limit) {
      grant.limit = {
        type: 'wasm/MaxCallsLimit',
        remaining: params.limit.maxCalls.toString(),
      }
    }

    if (params.filter) {
      grant.filter = {
        type: 'wasm/AcceptedMessageKeysFilter',
        keys: params.filter.acceptedMessagesKeys,
      }
    }

    return {
      type: 'wasm/ContractExecutionAuthorization',
      grants: [grant],
    }
  }

  public toWeb3(): ContractExecutionAuthorization.Amino {
    const { params } = this

    const grant = {} as Record<string, any>

    grant.contract = params.contract

    if (params.limit) {
      grant.limit = {
        '@type': '/cosmwasm.wasm.v1.MaxCallsLimit',
        remaining: params.limit.maxCalls.toString(),
      }
    }

    if (params.filter) {
      grant.filter = {
        '@type': '/cosmwasm.wasm.v1.AcceptedMessageKeysFilter',
        keys: params.filter.acceptedMessagesKeys,
      }
    }

    return {
      '@type': '/cosmwasm.wasm.v1.ContractExecutionAuthorization',
      grants: [grant],
    }
  }
}
