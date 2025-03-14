import { SnakeCaseKeys } from 'snakecase-keys'
import { objectKeysToEip712Types } from '../tx/eip712/maps.js'
import { TypedDataField } from '../tx/eip712/types.js'
import { prepareSignBytes } from './utils.js'

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

  /** @deprecated - use toWeb3Gw instead, renamed for clarity */
  public toWeb3():
    | ObjectRepresentation
    | (SnakeCaseKeys<ProtoRepresentation> & {
        '@type': string
      }) {
    return this.toWeb3Gw()
  }

  public abstract toWeb3Gw():
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
  public toEip712() {
    return this.toAmino()
  }

  /**
   * Returns the values of the message for EIP712_V2
   */
  public toEip712V2() {
    return this.toWeb3Gw()
  }

  public toDirectSignJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toDirectSign()))
  }
}
