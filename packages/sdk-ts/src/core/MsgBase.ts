import { prepareSignBytes } from './utils'

export abstract class MsgBase<
  Params,
  DataRepresentation,
  ProtoRepresentation,
  Web3Representation,
  AminoRepresentation,
> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toAmino(): AminoRepresentation

  public abstract toData(): DataRepresentation

  public abstract toProto(): ProtoRepresentation

  public abstract toWeb3(): Web3Representation

  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()))
  }

  public toAminoJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toAmino()))
  }
}
