import { fromUtf8 } from '../../../utils/utf8.js'

export type ExecDataRepresentation<Data> = {
  [key: string]: Data
}

export const dataToExecData = <T>(
  action: string,
  data: T,
): ExecDataRepresentation<T> => {
  return { [action]: data }
}

export abstract class ExecArgBase<Params, DataRepresentation> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toData(): DataRepresentation

  public abstract toExecData(): ExecDataRepresentation<DataRepresentation>

  public toJSON(): Uint8Array {
    return fromUtf8(JSON.stringify(this.params))
  }

  public toExecJSON(): Uint8Array {
    return fromUtf8(JSON.stringify(this.toExecData()))
  }
}
