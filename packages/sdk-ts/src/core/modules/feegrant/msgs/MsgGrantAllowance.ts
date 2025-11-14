import snakecaseKeys from 'snakecase-keys'
import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as GoogleProtobufTimestampPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/timestamp_pb'
import * as CosmosFeegrantV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/feegrant/v1beta1/tx_pb'
import * as CosmosFeegrantV1Beta1FeegrantPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/feegrant/v1beta1/feegrant_pb'
import { MsgBase } from '../../MsgBase.js'
import type { Coin } from '@injectivelabs/ts-types'

const basicAllowanceType = '/cosmos.feegrant.v1beta1.BasicAllowance'
export declare namespace MsgGrantAllowance {
  export interface Params {
    granter: string
    grantee: string
    allowance: {
      spendLimit: Coin[]
      expiration: number | undefined
    }
  }

  export type Proto = CosmosFeegrantV1Beta1TxPb.MsgGrantAllowance

  export type Object = Omit<
    CosmosFeegrantV1Beta1TxPb.MsgGrantAllowance,
    'allowance'
  > & {
    allowance: any
  }
}

/**
 * @category Messages
 */
export default class MsgGrantAllowance extends MsgBase<
  MsgGrantAllowance.Params,
  MsgGrantAllowance.Proto
> {
  static fromJSON(params: MsgGrantAllowance.Params): MsgGrantAllowance {
    return new MsgGrantAllowance(params)
  }

  public toProto() {
    const { params } = this

    const timestamp = this.getTimestamp()
    const basicAllowance =
      CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance.create({
        spendLimit: params.allowance.spendLimit.map(({ denom, amount }) => {
          return CosmosBaseV1Beta1CoinPb.Coin.create({
            denom,
            amount,
          })
        }),
        expiration: {
          seconds: timestamp.seconds,
          nanos: timestamp.nanos,
        },
      })

    const allowance = GoogleProtobufAnyPbPb.Any.create({
      typeUrl: basicAllowanceType,
      value:
        CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance.toBinary(basicAllowance),
    })

    const message = CosmosFeegrantV1Beta1TxPb.MsgGrantAllowance.create({
      granter: params.granter,
      grantee: params.grantee,
      allowance,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this

    const proto = this.toProto()
    const timestamp = this.getTimestamp()
    const message = proto

    const messageWithAllowance = snakecaseKeys({
      ...message,
      allowance: {
        type: 'cosmos-sdk/BasicAllowance',
        value: {
          spendLimit: params.allowance.spendLimit.map(({ denom, amount }) => ({
            denom,
            amount,
          })),
          expiration: new Date(Number(timestamp.seconds) * 1000)
            .toISOString()
            .replace('.000Z', 'Z'),
        },
      },
    })

    return {
      type: 'cosmos-sdk/MsgGrantAllowance',
      value: messageWithAllowance as unknown as MsgGrantAllowance.Object,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
      message: proto,
    }
  }

  public toWeb3Gw() {
    const { params } = this
    const amino = this.toAmino()
    const timestamp = this.getTimestamp()

    const messageWithAllowance = {
      granter: amino.value.granter,
      grantee: amino.value.grantee,
      allowance: {
        '@type': basicAllowanceType,
        spendLimit: params.allowance.spendLimit.map(({ denom, amount }) => ({
          denom,
          amount,
        })),
        expiration: new Date(Number(timestamp.seconds) * 1000)
          .toISOString()
          .replace('.000Z', 'Z'),
      },
    }

    return {
      '@type': '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
      ...messageWithAllowance,
    }
  }

  public toEip712V2() {
    const web3Gw = this.toWeb3Gw()

    const messageAdjustedForEip712V2 = {
      ...web3Gw,
      allowance: {
        '@type': web3Gw.allowance['@type'],
        spend_limit: web3Gw.allowance.spendLimit,
        expiration: web3Gw.allowance.expiration,
      },
    }

    return messageAdjustedForEip712V2
  }

  private getTimestamp() {
    const { params } = this

    if (params.allowance.expiration) {
      const timestamp = GoogleProtobufTimestampPb.Timestamp.create({
        seconds: BigInt(params.allowance.expiration),
      })

      return timestamp
    }

    const defaultExpiryYears = 5
    const dateNow = new Date()
    const expiration = new Date(
      dateNow.getFullYear() + defaultExpiryYears,
      dateNow.getMonth(),
      dateNow.getDate(),
    )

    const timestamp = GoogleProtobufTimestampPb.Timestamp.create({
      seconds: BigInt(Math.floor(expiration.getTime() / 1000)),
    })

    return timestamp
  }

  public toBinary(): Uint8Array {
    return CosmosFeegrantV1Beta1TxPb.MsgGrantAllowance.toBinary(this.toProto())
  }
}
