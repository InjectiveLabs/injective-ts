import { SnakeCaseKeys } from 'snakecase-keys'
import {
  mapValuesToProperValueType,
  objectKeysToEip712Types,
} from '../tx/eip712/maps'
import { TypedDataField } from '../tx/eip712/types'
import { prepareSignBytes } from './utils'

/**
 * @category Messages
 */
export abstract class MsgBase<
  Params,
  ProtoRepresentation extends Object,
  ObjectRepresentation extends Record<string, unknown> = {},
> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toProto(): ProtoRepresentation

  public abstract toData(): ProtoRepresentation & {
    '@type': string
  }

  public abstract toDirectSign(): {
    type: string
    message: ProtoRepresentation
  }

  public abstract toAmino(): {
    type: string
    value: ObjectRepresentation | SnakeCaseKeys<ProtoRepresentation>
  }

  public abstract toBinary(): Uint8Array

  public abstract toWeb3():
    | ObjectRepresentation
    | (SnakeCaseKeys<ProtoRepresentation> & {
        '@type': string
      })

  public toJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toData()))
  }

  /**
   * Returns the types of the message for EIP712
   */
  public toEip712Types(): Map<string, TypedDataField[]> {
    const amino = this.toAmino()

    return objectKeysToEip712Types({
      object: amino.value as Record<string, any>,
      messageType: amino.type,
    })
  }

  /**
   * Returns the values of the message for EIP712
   */
  public toEip712(): {
    type: string
    value: Record<string, unknown /** TODO */>
  } {
    const amino = this.toAmino()
    const { type, value } = amino

    return {
      type,
      value: mapValuesToProperValueType(value, type),
    }
  }

  public toDirectSignJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toDirectSign()))
  }
}
