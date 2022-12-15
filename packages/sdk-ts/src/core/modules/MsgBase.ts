import snakecaseKeys from 'snakecase-keys'
import {
  mapValuesToProperValueType,
  objectKeysToEip712Types,
  TypedDataField,
} from '../eip712'
import { hardcodedEip712Types } from '../eip712/eip712types'
import { prepareSignBytes } from './utils'

/**
 * @category Messages
 */
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

  public abstract toWeb3(): Omit<AminoRepresentation, 'type'> & {
    '@type': string
  }

  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()))
  }

  public toEip712Types(): Map<string, TypedDataField[]> {
    const amino = this.toAmino() as { type: string }

    if (hardcodedEip712Types[amino.type]) {
      return hardcodedEip712Types[amino.type]
    }

    return objectKeysToEip712Types(amino as Record<string, any>)
  }

  public toEip712(): {
    type: string
    value: Omit<AminoRepresentation, 'type'>
  } {
    const amino = this.toAmino()
    const { type, ...rest } = amino as { type: string } & Record<string, any>
    const value = snakecaseKeys(rest) as Omit<AminoRepresentation, 'type'>

    return {
      type,
      value: mapValuesToProperValueType(value, type),
    }
  }

  public toDirectSignJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toDirectSign()))
  }
}
