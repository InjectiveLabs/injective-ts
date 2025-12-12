import { fromUtf8 } from '../../../utils/encoding.js'
import { safeBigIntStringify } from '../../../utils/helpers.js'

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
    return fromUtf8(safeBigIntStringify(this.params))
  }

  public toExecJSON(): Uint8Array {
    return fromUtf8(safeBigIntStringify(this.toExecData()))
  }
}
