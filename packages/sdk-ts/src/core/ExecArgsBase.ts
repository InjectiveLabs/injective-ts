import { prepareSignBytes } from './utils'

export abstract class ExecArgsBase<Params, DataRepresentation> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toData(): DataRepresentation

  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()))
  }
}
