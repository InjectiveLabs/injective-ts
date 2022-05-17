import { prepareSignBytes } from './utils'

export abstract class MsgBase<
  Params,
  DataRepresentation,
  ProtoRepresentation,
  Web3Representation,
  DirectSignRepresentation,
> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toDirectSign(): DirectSignRepresentation

  public abstract toData(): DataRepresentation

  public abstract toProto(): ProtoRepresentation

  public abstract toWeb3(): Web3Representation

  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()))
  }

  public toDirectSignJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toDirectSign()))
  }
}
