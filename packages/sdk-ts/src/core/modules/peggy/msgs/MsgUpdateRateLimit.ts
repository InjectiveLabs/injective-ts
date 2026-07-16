import { toChainFormat } from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectivePeggyV1MsgsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/msgs_pb'
import * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgUpdateRateLimit {
  export interface Params {
    injectiveAddress: string
    tokenAddress: string
    newTokenPriceId: string /** pyth price id */
    newTokenOracleType: InjectiveOracleV1Beta1OraclePb.OracleType
    newRateLimitInUsd: string /** rate limit = notional amount of tokens per window */
    newRateLimitWindow: string /** window = numbers of blocks */
  }

  export type Proto = InjectivePeggyV1MsgsPb.MsgUpdateRateLimit
}

/**
 * @category Messages
 */
export default class MsgUpdateRateLimit extends MsgBase<
  MsgUpdateRateLimit.Params,
  MsgUpdateRateLimit.Proto
> {
  static fromJSON(params: MsgUpdateRateLimit.Params): MsgUpdateRateLimit {
    return new MsgUpdateRateLimit(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectivePeggyV1MsgsPb.MsgUpdateRateLimit.create({
      authority: params.injectiveAddress,
      tokenAddress: params.tokenAddress,
      newTokenPriceId: params.newTokenPriceId,
      newTokenOracleType: params.newTokenOracleType,
      newRateLimitUsd: toChainFormat(params.newRateLimitInUsd).toFixed(),
      newRateLimitWindow: BigInt(params.newRateLimitWindow),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.peggy.v1.MsgUpdateRateLimit',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const message = {
      authority: params.injectiveAddress,
      token_address: params.tokenAddress,
      new_token_price_id: params.newTokenPriceId,
      new_rate_limit_usd: params.newRateLimitInUsd,
      new_rate_limit_window: params.newRateLimitWindow.toString(),
      new_token_oracle_type: params.newTokenOracleType,
    }

    return {
      type: 'peggy/MsgUpdateRateLimit',
      value: message,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgUpdateRateLimit. Please use EIP712_v2',
      ),
    )
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
      new_token_oracle_type:
        InjectiveOracleV1Beta1OraclePb.OracleType[params.newTokenOracleType],
      new_rate_limit_usd: numberToCosmosSdkDecString(params.newRateLimitInUsd),
    }

    return messageAdjusted
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.peggy.v1.MsgUpdateRateLimit',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.peggy.v1.MsgUpdateRateLimit',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePeggyV1MsgsPb.MsgUpdateRateLimit.toBinary(this.toProto())
  }
}
