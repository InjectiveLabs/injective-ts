import { prepareSignBytes } from './utils'

export abstract class MsgBase<
  Params,
  DataRepresentation,
  ProtoRepresentation,
  AminoRepresentation,
  DirectSignRepresentation,
> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toDirectSign(): DirectSignRepresentation

  public abstract toData(): DataRepresentation

  public abstract toProto(): ProtoRepresentation

  public abstract toAmino(): AminoRepresentation

  /**
   * @deprecated use toAmino instead
   * @returns AminoRepresentation
   */
  public toWeb3(): AminoRepresentation {
    return this.toAmino()
  }

  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()))
  }

  public toDirectSignJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toDirectSign()))
  }
}
