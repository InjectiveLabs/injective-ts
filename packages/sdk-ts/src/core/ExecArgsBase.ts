import { prepareSignBytes } from './utils'

export type ExecDataRepresentation<Data> = {
  origin: string
  name: string
  args: Data
}

export const dataToExecData = <T>(
  data: T,
  execParams: {
    origin: string
    name: string
  },
): ExecDataRepresentation<T> => {
  return {
    origin: execParams.origin,
    name: execParams.name,
    args: data,
  }
}

export abstract class ExecArgsBase<Params, DataRepresentation> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toData(): DataRepresentation

  public abstract toExecData(): ExecDataRepresentation<DataRepresentation>

  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()))
  }

  public toExecJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toExecData()))
  }
}
