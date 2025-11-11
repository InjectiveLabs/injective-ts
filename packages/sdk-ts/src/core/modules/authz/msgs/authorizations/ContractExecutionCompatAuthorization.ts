import * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import * as CosmwasmWasmV1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/authz_pb.mjs'
import * as InjectiveWasmxV1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/injective/wasmx/v1/authz_pb.mjs'
import { BaseAuthorization } from './Base.js'
import type { Coin } from '@injectivelabs/ts-types'

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

  export type Any = GoogleProtobufAnyPb.Any

  export type Proto =
    InjectiveWasmxV1AuthzPb.ContractExecutionCompatAuthorization

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

  public toAny(): GoogleProtobufAnyPb.Any {
    const { params } = this

    let limit: GoogleProtobufAnyPb.Any | undefined

    if (params.limit) {
      if (params.limit.maxCalls && params.limit.amounts) {
        const limitObj = CosmwasmWasmV1AuthzPb.CombinedLimit.create({
          callsRemaining: BigInt(params.limit.maxCalls),
          amounts: params.limit.amounts,
        })

        limit = GoogleProtobufAnyPb.Any.create({
          typeUrl: '/cosmwasm.wasm.v1.CombinedLimit',
          value: CosmwasmWasmV1AuthzPb.CombinedLimit.toBinary(limitObj),
        })
      } else if (params.limit.maxCalls) {
        const limitObj = CosmwasmWasmV1AuthzPb.MaxCallsLimit.create({
          remaining: BigInt(params.limit.maxCalls),
        })

        limit = GoogleProtobufAnyPb.Any.create({
          typeUrl: '/cosmwasm.wasm.v1.MaxCallsLimit',
          value: CosmwasmWasmV1AuthzPb.MaxCallsLimit.toBinary(limitObj),
        })
      } else if (params.limit.amounts) {
        const limitObj = CosmwasmWasmV1AuthzPb.MaxFundsLimit.create({
          amounts: params.limit.amounts,
        })

        limit = GoogleProtobufAnyPb.Any.create({
          typeUrl: '/cosmwasm.wasm.v1.MaxFundsLimit',
          value: CosmwasmWasmV1AuthzPb.MaxFundsLimit.toBinary(limitObj),
        })
      }
    }

    let filter: GoogleProtobufAnyPb.Any

    if (params.filter) {
      const filterObj = CosmwasmWasmV1AuthzPb.AcceptedMessageKeysFilter.create({
        keys: params.filter.acceptedMessagesKeys,
      })

      filter = GoogleProtobufAnyPb.Any.create({
        typeUrl: '/cosmwasm.wasm.v1.AcceptedMessageKeysFilter',
        value:
          CosmwasmWasmV1AuthzPb.AcceptedMessageKeysFilter.toBinary(filterObj),
      })
    } else {
      const filterObj = CosmwasmWasmV1AuthzPb.AllowAllMessagesFilter.create()

      filter = GoogleProtobufAnyPb.Any.create({
        typeUrl: '/cosmwasm.wasm.v1.AllowAllMessagesFilter',
        value: CosmwasmWasmV1AuthzPb.AllowAllMessagesFilter.toBinary(filterObj),
      })
    }

    const grant = CosmwasmWasmV1AuthzPb.ContractGrant.create({
      contract: params.contract,
      limit: limit,
      filter: filter,
    })

    const authorization =
      InjectiveWasmxV1AuthzPb.ContractExecutionCompatAuthorization.create({
        grants: [grant],
      })

    return GoogleProtobufAnyPb.Any.create({
      typeUrl: '/injective.wasmx.v1.ContractExecutionCompatAuthorization',
      value:
        InjectiveWasmxV1AuthzPb.ContractExecutionCompatAuthorization.toBinary(
          authorization,
        ),
    })
  }

  public toProto(): ContractExecutionCompatAuthorization.Proto {
    const authorization =
      InjectiveWasmxV1AuthzPb.ContractExecutionCompatAuthorization.fromBinary(
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
