import {
  GoogleProtobufAny,
  CosmosAuthzV1Beta1Authz,
} from '@injectivelabs/core-proto-ts'
import { BaseAuthorization } from './Base.js'
import { GeneralException } from '@injectivelabs/exceptions'
import { getGenericAuthorizationFromMessageType } from '../../utils.js'
import { GrantAuthorizationType } from '../../types.js'

export declare namespace GenericAuthorization {
  export interface Params {
    messageTypeUrl?: string
    authorization?: GoogleProtobufAny.Any
  }

  export type Any = GoogleProtobufAny.Any

  export type Amino = Object
}

/**
 * @category Contract Exec Arguments
 */
export default class GenericAuthorization extends BaseAuthorization<
  GenericAuthorization.Params,
  GenericAuthorization.Amino
> {
  static fromJSON(params: GenericAuthorization.Params): GenericAuthorization {
    return new GenericAuthorization(params)
  }

  public toAmino(): GenericAuthorization.Amino {
    const { params } = this

    const authorization =
      params.authorization ||
      getGenericAuthorizationFromMessageType(params.messageTypeUrl as string)

    if (
      !authorization.typeUrl.includes(
        GrantAuthorizationType.GenericAuthorization,
      )
    ) {
      throw new GeneralException(
        new Error('Currently, only GenericAuthorization type is supported'),
      )
    }

    const genericAuthorization =
      CosmosAuthzV1Beta1Authz.GenericAuthorization.decode(authorization.value)

    return {
      type: 'cosmos-sdk/GenericAuthorization',
      value: { msg: genericAuthorization.msg },
    }
  }

  public toWeb3(): GenericAuthorization.Amino {
    const { params } = this

    const authorization =
      params.authorization ||
      getGenericAuthorizationFromMessageType(params.messageTypeUrl as string)

    if (
      !authorization.typeUrl.includes(
        GrantAuthorizationType.GenericAuthorization,
      )
    ) {
      throw new GeneralException(
        new Error('Currently, only GenericAuthorization type is supported'),
      )
    }

    const genericAuthorization =
      CosmosAuthzV1Beta1Authz.GenericAuthorization.decode(authorization.value)

    return {
      '@type': '/cosmos.authz.v1beta1.GenericAuthorization',
      msg: genericAuthorization.msg,
    }
  }

  public toAny(): GoogleProtobufAny.Any {
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
