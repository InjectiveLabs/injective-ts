import { Coin } from '@injectivelabs/ts-types'
import {
  GoogleProtobufAny,
  CosmwasmWasmV1Authz,
  InjectiveWasmxV1Beta1Authz,
} from '@injectivelabs/core-proto-ts'
import { BaseAuthorization } from './Base.js'

export declare namespace ContractExecutionCompatAuthorization {
  export interface Params {
    contract: string
    limit?: {
      maxCalls?: number
      amounts?: Coin[]
    }
    filter?: {
      acceptedMessagesKeys: string[]
    }
  }

  export type Any = GoogleProtobufAny.Any

  export type Proto =
    InjectiveWasmxV1Beta1Authz.ContractExecutionCompatAuthorization

  export type Amino = Object
}

/**
 * @category Contract Exec Arguments
 */
export default class ContractExecutionCompatAuthorization extends BaseAuthorization<
  ContractExecutionCompatAuthorization.Params,
  ContractExecutionCompatAuthorization.Proto,
  ContractExecutionCompatAuthorization.Amino
> {
  static fromJSON(
    params: ContractExecutionCompatAuthorization.Params,
  ): ContractExecutionCompatAuthorization {
    return new ContractExecutionCompatAuthorization(params)
  }

  public toAny(): GoogleProtobufAny.Any {
    const { params } = this

    const authorization =
      InjectiveWasmxV1Beta1Authz.ContractExecutionCompatAuthorization.create()
    const grant = CosmwasmWasmV1Authz.ContractGrant.create()

    grant.contract = params.contract

    if (params.limit) {
      if (params.limit.maxCalls && params.limit.amounts) {
        const limit = CosmwasmWasmV1Authz.CombinedLimit.create()

        limit.callsRemaining = params.limit.maxCalls.toString()
        limit.amounts = params.limit.amounts

        const any = GoogleProtobufAny.Any.create()
        any.typeUrl = '/cosmwasm.wasm.v1.CombinedLimit'
        any.value = CosmwasmWasmV1Authz.CombinedLimit.encode(limit).finish()

        grant.limit = any
      } else if (params.limit.maxCalls) {
        const limit = CosmwasmWasmV1Authz.MaxCallsLimit.create()

        limit.remaining = params.limit.maxCalls.toString()

        const any = GoogleProtobufAny.Any.create()
        any.typeUrl = '/cosmwasm.wasm.v1.MaxCallsLimit'
        any.value = CosmwasmWasmV1Authz.MaxCallsLimit.encode(limit).finish()

        grant.limit = any
      } else if (params.limit.amounts) {
        const limit = CosmwasmWasmV1Authz.MaxFundsLimit.create()

        limit.amounts = params.limit.amounts

        const any = GoogleProtobufAny.Any.create()
        any.typeUrl = '/cosmwasm.wasm.v1.MaxFundsLimit'
        any.value = CosmwasmWasmV1Authz.MaxFundsLimit.encode(limit).finish()

        grant.limit = any
      }
    }

    if (params.filter) {
      const filter = CosmwasmWasmV1Authz.AcceptedMessageKeysFilter.create()

      filter.keys = params.filter.acceptedMessagesKeys

      const any = GoogleProtobufAny.Any.create()
      any.typeUrl = '/cosmwasm.wasm.v1.AcceptedMessageKeysFilter'
      any.value =
        CosmwasmWasmV1Authz.AcceptedMessageKeysFilter.encode(filter).finish()

      grant.filter = any
    } else {
      const filter = CosmwasmWasmV1Authz.AllowAllMessagesFilter.create()

      const any = GoogleProtobufAny.Any.create()
      any.typeUrl = '/cosmwasm.wasm.v1.AcceptedMessageKeysFilter'
      any.value =
        CosmwasmWasmV1Authz.AllowAllMessagesFilter.encode(filter).finish()

      grant.filter = any
    }

    authorization.grants = [grant]

    const any = GoogleProtobufAny.Any.create()
    any.typeUrl = '/injective.wasmx.v1.ContractExecutionCompatAuthorization'
    any.value =
      InjectiveWasmxV1Beta1Authz.ContractExecutionCompatAuthorization.encode(
        authorization,
      ).finish()

    return any
  }

  public toProto(): ContractExecutionCompatAuthorization.Proto {
    const authorization =
      InjectiveWasmxV1Beta1Authz.ContractExecutionCompatAuthorization.decode(
        this.toAny().value,
      )

    return authorization
  }

  public toAmino(): ContractExecutionCompatAuthorization.Amino {
    const { params } = this

    const grant = {} as Record<string, any>

    grant.contract = params.contract

    if (params.limit) {
      if (params.limit.maxCalls && params.limit.amounts) {
        grant.limit = {
          type: 'wasm/CombinedLimit',
          calls_remaining: params.limit.maxCalls.toString(),
          amounts: params.limit.amounts,
        }
      } else if (params.limit.maxCalls) {
        grant.limit = {
          type: 'wasm/MaxCallsLimit',
          remaining: params.limit.maxCalls.toString(),
        }
      } else if (params.limit.amounts) {
        grant.limit = {
          type: 'wasm/MaxFundsLimit',
          amounts: params.limit.amounts,
        }
      }
    }

    if (params.filter) {
      grant.filter = {
        type: 'wasm/AcceptedMessageKeysFilter',
        keys: params.filter.acceptedMessagesKeys,
      }
    } else {
      grant.filter = {
        type: 'wasm/AllowAllMessagesFilter',
      }
    }

    return {
      type: 'wasmx/ContractExecutionCompatAuthorization',
      grants: [grant],
    }
  }

  public toWeb3(): ContractExecutionCompatAuthorization.Amino {
    const { params } = this

    const grant = {} as Record<string, any>

    grant.contract = params.contract

    if (params.limit) {
      if (params.limit.maxCalls && params.limit.amounts) {
        grant.limit = {
          '@type': '/cosmwasm.wasm.v1.CombinedLimit',
          calls_remaining: params.limit.maxCalls.toString(),
          amounts: params.limit.amounts,
        }
      } else if (params.limit.maxCalls) {
        grant.limit = {
          '@type': '/cosmwasm.wasm.v1.MaxCallsLimit',
          remaining: params.limit.maxCalls.toString(),
        }
      } else if (params.limit.amounts) {
        grant.limit = {
          '@type': '/cosmwasm.wasm.v1.MaxFundsLimit',
          amounts: params.limit.amounts,
        }
      }
    }

    if (params.filter) {
      grant.filter = {
        '@type': '/cosmwasm.wasm.v1.AcceptedMessageKeysFilter',
        keys: params.filter.acceptedMessagesKeys,
      }
    } else {
      grant.filter = {
        '@type': '/cosmwasm.wasm.v1.AllowAllMessagesFilter',
      }
    }

    return {
      '@type': '/injective.wasmx.v1.ContractExecutionCompatAuthorization',
      grants: [grant],
    }
  }
}
