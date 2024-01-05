import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import { InjectiveTokenFactoryV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { CosmosBankV1Beta1Bank } from '@injectivelabs/core-proto-ts'

export declare namespace MsgSetDenomMetadata {
  export interface Params {
    sender: string
    metadata: CosmosBankV1Beta1Bank.Metadata
  }

  export type Proto = InjectiveTokenFactoryV1Beta1Tx.MsgSetDenomMetadata
}

/**
 * @category Messages
 */
export default class MsgSetDenomMetadata extends MsgBase<
  MsgSetDenomMetadata.Params,
  MsgSetDenomMetadata.Proto
> {
  static fromJSON(params: MsgSetDenomMetadata.Params): MsgSetDenomMetadata {
    return new MsgSetDenomMetadata(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveTokenFactoryV1Beta1Tx.MsgSetDenomMetadata.create()
    message.sender = params.sender
    message.metadata = params.metadata

    return InjectiveTokenFactoryV1Beta1Tx.MsgSetDenomMetadata.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgSetDenomMetadata',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'injective/tokenfactory/set-denom-metadata',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgSetDenomMetadata',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgSetDenomMetadata',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1Tx.MsgSetDenomMetadata.encode(
      this.toProto(),
    ).finish()
  }
}
