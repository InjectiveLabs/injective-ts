import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'

export declare namespace MsgUnderwriteConsolidatedInsurancePool {
  export interface Params {
    injectiveAddress: string
    /** the quote deposit, shares are minted immediately */
    amount: {
      denom: string
      amount: string
    }
    /** slippage guard, the tx fails if fewer shares would be minted (chain-format integer string) */
    minSharesOut: string
  }

  export type Proto =
    InjectiveInsuranceV1Beta1TxPb.MsgUnderwriteConsolidatedInsurancePool
}

/**
 * @category Messages
 */
export default class MsgUnderwriteConsolidatedInsurancePool extends MsgBase<
  MsgUnderwriteConsolidatedInsurancePool.Params,
  MsgUnderwriteConsolidatedInsurancePool.Proto
> {
  static fromJSON(
    params: MsgUnderwriteConsolidatedInsurancePool.Params,
  ): MsgUnderwriteConsolidatedInsurancePool {
    return new MsgUnderwriteConsolidatedInsurancePool(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveInsuranceV1Beta1TxPb.MsgUnderwriteConsolidatedInsurancePool.create(
      {
        sender: params.injectiveAddress,
        deposit: CosmosBaseV1Beta1CoinPb.Coin.create({
          denom: params.amount.denom,
          amount: params.amount.amount,
        }),
        minSharesOut: params.minSharesOut,
      },
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type':
        '/injective.insurance.v1beta1.MsgUnderwriteConsolidatedInsurancePool',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveInsuranceV1Beta1TxPb.MsgUnderwriteConsolidatedInsurancePool,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgUnderwriteConsolidatedInsurancePool',
      value: {
        sender: proto.sender,
        deposit: proto.deposit,
        min_shares_out: proto.minSharesOut,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAminoRaw()

    return {
      '@type':
        '/injective.insurance.v1beta1.MsgUnderwriteConsolidatedInsurancePool',
      ...value,
    }
  }

  /** the chain cannot type `math.Int` fields for EIP712 v1 */
  public toEip712(): never {
    return this.eip712V1Unsupported('MsgUnderwriteConsolidatedInsurancePool')
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgUnderwriteConsolidatedInsurancePool',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveInsuranceV1Beta1TxPb.MsgUnderwriteConsolidatedInsurancePool.toBinary(
      this.toProto(),
    )
  }
}
