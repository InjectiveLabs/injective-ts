import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import * as CosmwasmWasmV1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/authz_pb.mjs'
import { BaseAuthorization } from './Base.js'
import type { Coin } from '@injectivelabs/ts-types'

export declare namespace ContractExecutionAuthorization {
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

  export type Any = GoogleProtobufAnyPbPb.Any

  export type Proto = CosmwasmWasmV1AuthzPb.ContractExecutionAuthorization

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

  public toAny(): GoogleProtobufAnyPbPb.Any {
    const { params } = this

    let limit: GoogleProtobufAnyPbPb.Any | undefined

    if (params.limit) {
      if (params.limit.maxCalls && params.limit.amounts) {
        const limitObj = CosmwasmWasmV1AuthzPb.CombinedLimit.create({
          callsRemaining: BigInt(params.limit.maxCalls),
          amounts: params.limit.amounts,
        })

        limit = GoogleProtobufAnyPbPb.Any.create({
          typeUrl: '/cosmwasm.wasm.v1.CombinedLimit',
          value: CosmwasmWasmV1AuthzPb.CombinedLimit.toBinary(limitObj),
        })
      } else if (params.limit.maxCalls) {
        const limitObj = CosmwasmWasmV1AuthzPb.MaxCallsLimit.create({
          remaining: BigInt(params.limit.maxCalls),
        })

        limit = GoogleProtobufAnyPbPb.Any.create({
          typeUrl: '/cosmwasm.wasm.v1.MaxCallsLimit',
          value: CosmwasmWasmV1AuthzPb.MaxCallsLimit.toBinary(limitObj),
        })
      } else if (params.limit.amounts) {
        const limitObj = CosmwasmWasmV1AuthzPb.MaxFundsLimit.create({
          amounts: params.limit.amounts,
        })

        limit = GoogleProtobufAnyPbPb.Any.create({
          typeUrl: '/cosmwasm.wasm.v1.MaxFundsLimit',
          value: CosmwasmWasmV1AuthzPb.MaxFundsLimit.toBinary(limitObj),
        })
      }
    }

    let filter: GoogleProtobufAnyPbPb.Any

    if (params.filter) {
      const filterObj = CosmwasmWasmV1AuthzPb.AcceptedMessageKeysFilter.create({
        keys: params.filter.acceptedMessagesKeys,
      })

      filter = GoogleProtobufAnyPbPb.Any.create({
        typeUrl: '/cosmwasm.wasm.v1.AcceptedMessageKeysFilter',
        value:
          CosmwasmWasmV1AuthzPb.AcceptedMessageKeysFilter.toBinary(filterObj),
      })
    } else {
      const filterObj = CosmwasmWasmV1AuthzPb.AllowAllMessagesFilter.create()

      filter = GoogleProtobufAnyPbPb.Any.create({
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
      CosmwasmWasmV1AuthzPb.ContractExecutionAuthorization.create({
        grants: [grant],
      })

    return GoogleProtobufAnyPbPb.Any.create({
      typeUrl: '/cosmwasm.wasm.v1.ContractExecutionAuthorization',
      value:
        CosmwasmWasmV1AuthzPb.ContractExecutionAuthorization.toBinary(
          authorization,
        ),
    })
  }

  public toProto(): ContractExecutionAuthorization.Proto {
    const authorization =
      CosmwasmWasmV1AuthzPb.ContractExecutionAuthorization.fromBinary(
        this.toAny().value,
      )

    return authorization
  }

  public toAmino(): ContractExecutionAuthorization.Amino {
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
      type: 'wasm/ContractExecutionAuthorization',
      grants: [grant],
    }
  }

  public toWeb3(): ContractExecutionAuthorization.Amino {
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
      '@type': '/cosmwasm.wasm.v1.ContractExecutionAuthorization',
      grants: [grant],
    }
  }
}
