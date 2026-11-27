import { GeneralException } from '@injectivelabs/exceptions'
import { prepareSignBytes } from './utils.js'
import { objectKeysToEip712Types } from '../tx/eip712/maps.js'
import type snakecaseKeys from 'snakecase-keys'
import type { TypedDataField } from '../tx/eip712/types.js'

type SnakeCaseKeys<T extends Record<string, any> | readonly any[]> =
  snakecaseKeys.SnakeCaseKeys<T>

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
   * The full-field, human-readable object behind toWeb3Gw (proto-JSON keeps zero
   * values) and the EIP712 v1 types (the chain lists every field in the types).
   * Defaults to toAmino(); messages whose toAmino() follows the chain's aminojson
   * sign bytes (Ledger), which omit zero values, override this.
   */
  public toAminoRaw() {
    return this.toAmino()
  }

  /**
   * Returns the types of the message for EIP712
   */
  public toEip712Types(): Map<string, TypedDataField[]> {
    const amino = this.toAminoRaw()

    return objectKeysToEip712Types({
      object: amino.value as Record<string, any>,
      messageType: amino.type,
    })
  }

  /**
   * Returns the values of the message for EIP712: the chain derives the v1 typed
   * data values from its amino-json, so this is toAmino()
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

  /**
   * Whether the chain can sign this message with EIP712 v1 on its own: it cannot type some
   * fields (`math.LegacyDec`, `math.Int`, oneofs). Enforced for the root messages of a
   * transaction by `assertEip712V1Supported`; nested in MsgExec or a proposal a message
   * serializes like any other.
   */
  static readonly eip712V1Supported: boolean = true

  public assertEip712V1Supported(): void {
    if (!(this.constructor as typeof MsgBase).eip712V1Supported) {
      throw new GeneralException(
        new Error(
          `EIP712_v1 is not supported for ${this.constructor.name}. Please use EIP712_v2`,
        ),
      )
    }
  }

  public toDirectSignJSON(): string {
    return JSON.stringify(prepareSignBytes(this.toDirectSign()))
  }
}
