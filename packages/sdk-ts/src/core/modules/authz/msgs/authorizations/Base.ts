import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'

export abstract class BaseAuthorization<Params, Proto, DataRepresentation> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toAny(): GoogleProtobufAnyPb.Any

  public abstract toAmino(): DataRepresentation

  public abstract toWeb3(): DataRepresentation

  public abstract toProto(): Proto
}
