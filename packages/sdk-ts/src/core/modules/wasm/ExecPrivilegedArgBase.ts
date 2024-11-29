import { prepareSignBytes } from '../utils.js'

export type ExecDataRepresentation<Data> = {
  origin: string
  name: string
  args: Data
}

export type ExecDataRepresentationWithInjectiveExec<Data> = {
  injective_exec: {
    origin: string
    name: string
    args: Data
  }
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

export const dataToExecDataWithInjectiveExec = <T>(
  data: T,
  execParams: {
    origin: string
    name: string
  },
): ExecDataRepresentationWithInjectiveExec<T> => {
  return {
    injective_exec: {
      origin: execParams.origin,
      name: execParams.name,
      args: data,
    },
  }
}

/** Executing Messages with injective_exec */
export abstract class ExecPrivilegedArgBase<Params, DataRepresentation> {
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

export abstract class MsgExecPrivilegedArgBase<Params, DataRepresentation> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toData(): DataRepresentation

  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()))
  }
}
