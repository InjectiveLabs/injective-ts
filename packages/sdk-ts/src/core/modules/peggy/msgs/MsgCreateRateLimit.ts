import { GeneralException } from '@injectivelabs/exceptions'
import { toBigNumber, toChainFormat } from '@injectivelabs/utils'
import * as InjectivePeggyV1MsgsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/msgs_pb'
import * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgCreateRateLimit {
  export interface Params {
    authority: string
    tokenAddress: string
    tokenDecimals: string | number
    absoluteMintLimit?: string | number
    tokenPriceId: string /** pyth price id */
    tokenOracleType: InjectiveOracleV1Beta1OraclePb.OracleType
    rateLimitInUsd:
      | string
      | number /** rate limit = notional amount of tokens per window */
    rateLimitWindow: string | number /** window = numbers of blocks */
  }

  export type Proto = InjectivePeggyV1MsgsPb.MsgCreateRateLimit
}

/**
 * @category Messages
 */
export default class MsgCreateRateLimit extends MsgBase<
  MsgCreateRateLimit.Params,
  MsgCreateRateLimit.Proto
> {
  static fromJSON(params: MsgCreateRateLimit.Params): MsgCreateRateLimit {
    return new MsgCreateRateLimit(params)
  }

  public toProto() {
    const { params } = this
    const message = InjectivePeggyV1MsgsPb.MsgCreateRateLimit.create({
      authority: params.authority,
      tokenAddress: params.tokenAddress,
      tokenDecimals: Number(params.tokenDecimals),
      tokenPriceId: params.tokenPriceId,
      tokenOracleType: params.tokenOracleType,
      rateLimitUsd: toChainFormat(params.rateLimitInUsd).toFixed(),
      absoluteMintLimit: toBigNumber(
        this.params.absoluteMintLimit ?? 0,
      ).toFixed(),
      rateLimitWindow: BigInt(params.rateLimitWindow),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.peggy.v1.MsgCreateRateLimit',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this

    const message = {
      authority: params.authority,
      token_address: params.tokenAddress,
      token_decimals: Number(params.tokenDecimals),
      token_price_id: params.tokenPriceId,
      rate_limit_usd: params.rateLimitInUsd,
      absolute_mint_limit: toBigNumber(
        this.params.absoluteMintLimit ?? 0,
      ).toFixed(),
      rate_limit_window: params.rateLimitWindow.toString(),
      token_oracle_type: params.tokenOracleType,
    }

    return {
      type: 'peggy/MsgCreateRateLimit',
      value: message,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgCreateRateLimit. Please use EIP712_v2',
      ),
    )
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
      token_oracle_type:
        InjectiveOracleV1Beta1OraclePb.OracleType[params.tokenOracleType],
      rate_limit_usd: numberToCosmosSdkDecString(params.rateLimitInUsd),
    }

    return messageAdjusted
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.peggy.v1.MsgCreateRateLimit',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.peggy.v1.MsgCreateRateLimit',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePeggyV1MsgsPb.MsgCreateRateLimit.toBinary(this.toProto())
  }
}
