import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmosAuthzV1Beta1AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/authz_pb.mjs'
import { BaseAuthorization } from './Base.js'
import { getGenericAuthorizationFromMessageType } from '../../utils.js'
import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'

export declare namespace GenericAuthorization {
  export interface Params {
    messageTypeUrl?: string
    authorization?: GoogleProtobufAnyPb.Any
  }

  export type Any = GoogleProtobufAnyPb.Any

  export type Proto = CosmosAuthzV1Beta1AuthzPb.GenericAuthorization

  export type Amino = Object
}

/**
 * @category Contract Exec Arguments
 */
export default class GenericAuthorization extends BaseAuthorization<
  GenericAuthorization.Params,
  GenericAuthorization.Proto,
  GenericAuthorization.Amino
> {
  static fromJSON(params: GenericAuthorization.Params): GenericAuthorization {
    return new GenericAuthorization(params)
  }

  public toProto(): GenericAuthorization.Proto {
    const genericAuthorization =
      CosmosAuthzV1Beta1AuthzPb.GenericAuthorization.fromBinary(
        this.toAny().value,
      )

    return genericAuthorization
  }

  public toAmino(): GenericAuthorization.Amino {
    const genericAuthorization =
      CosmosAuthzV1Beta1AuthzPb.GenericAuthorization.fromBinary(
        this.toAny().value,
      )

    return {
      type: 'cosmos-sdk/GenericAuthorization',
      value: { msg: genericAuthorization.msg },
    }
  }

  public toWeb3(): GenericAuthorization.Amino {
    const genericAuthorization =
      CosmosAuthzV1Beta1AuthzPb.GenericAuthorization.fromBinary(
        this.toAny().value,
      )

    return {
      '@type': '/cosmos.authz.v1beta1.GenericAuthorization',
      msg: genericAuthorization.msg,
    }
  }

  public toAny(): GoogleProtobufAnyPb.Any {
    const { params } = this

    if (!params.authorization && !params.messageTypeUrl) {
      throw new GeneralException(
        new Error('Either authorization or messageType must be provided'),
      )
    }

    return (
      params.authorization ||
      getGenericAuthorizationFromMessageType(params.messageTypeUrl as string)
    )
  }
}
