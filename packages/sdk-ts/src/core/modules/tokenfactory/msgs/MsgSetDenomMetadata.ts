import * as CosmosBankV1Beta1BankPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/bank_pb.mjs'
import * as InjectiveTokenFactoryV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgSetDenomMetadata {
  export interface Params {
    sender: string
    metadata: CosmosBankV1Beta1BankPb.Metadata
    adminBurnDisabled?: boolean
  }

  export type Proto = InjectiveTokenFactoryV1Beta1TxPb.MsgSetDenomMetadata
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

    const metadata = CosmosBankV1Beta1BankPb.Metadata.create({
      description: params.metadata.description,
      denomUnits: params.metadata.denomUnits.map((value) => {
        const denomUnit = CosmosBankV1Beta1BankPb.DenomUnit.create({
          denom: value.denom,
          exponent: value.exponent,
          aliases: value.aliases,
        })

        return denomUnit
      }),
      base: params.metadata.base,
      display: params.metadata.display,
      name: params.metadata.name,
      symbol: params.metadata.symbol,
      uri: params.metadata.uri,
      uriHash: params.metadata.uriHash,
      decimals: params.metadata.decimals,
    })

    const message = InjectiveTokenFactoryV1Beta1TxPb.MsgSetDenomMetadata.create(
      {
        sender: params.sender,
        metadata: metadata,
        ...(params.adminBurnDisabled !== undefined && {
          adminBurnDisabled:
            InjectiveTokenFactoryV1Beta1TxPb.MsgSetDenomMetadata_AdminBurnDisabled.create(
              {
                shouldDisable: params.adminBurnDisabled,
              },
            ),
        }),
      },
    )

    return message
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
      sender: proto.sender,
      metadata: {
        description: proto.metadata.description,
        denom_units: proto.metadata.denomUnits,
        base: proto.metadata.base,
        display: proto.metadata.display,
        name: proto.metadata.name,
        symbol: proto.metadata.symbol,
        uri: proto.metadata.uri,
        uri_hash: proto.metadata.uriHash,
        decimals: proto.metadata.decimals,
      },
      ...(proto.adminBurnDisabled && {
        admin_burn_disabled: {
          should_disable: proto.adminBurnDisabled.shouldDisable,
        },
      }),
    }

    return {
      type: 'injective/tokenfactory/set-denom-metadata',
      value: message,
    }
  }

  public toWeb3Gw() {
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
    return InjectiveTokenFactoryV1Beta1TxPb.MsgSetDenomMetadata.toBinary(
      this.toProto(),
    )
  }
}
