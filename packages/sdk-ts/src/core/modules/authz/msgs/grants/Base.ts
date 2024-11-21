import { GoogleProtobufAny } from '@injectivelabs/core-proto-ts'

export abstract class BaseAuthorization<Params, DataRepresentation> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toAny(): GoogleProtobufAny.Any

  public abstract toAmino(): DataRepresentation

  public abstract toWeb3(): DataRepresentation
}
