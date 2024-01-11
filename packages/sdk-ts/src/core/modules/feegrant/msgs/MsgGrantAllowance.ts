import snakecaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'
import {
  CosmosFeegrantV1Beta1Tx,
  CosmosFeegrantV1Beta1Feegrant,
  GoogleProtobufTimestamp,
  GoogleProtobufAny,
} from '@injectivelabs/core-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

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

  export type Proto = CosmosFeegrantV1Beta1Tx.MsgGrantAllowance

  export type Object = Omit<
    CosmosFeegrantV1Beta1Tx.MsgGrantAllowance,
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
    const basicAllowance = CosmosFeegrantV1Beta1Feegrant.BasicAllowance.create()
    basicAllowance.spendLimit = params.allowance.spendLimit
    basicAllowance.expiration = new Date(Number(timestamp.seconds) * 1000)

    const allowance = GoogleProtobufAny.Any.create()
    allowance.typeUrl = basicAllowanceType
    allowance.value = Buffer.from(
      CosmosFeegrantV1Beta1Feegrant.BasicAllowance.encode(
        basicAllowance,
      ).finish(),
    )

    const message = CosmosFeegrantV1Beta1Tx.MsgGrantAllowance.create()
    message.grantee = params.grantee
    message.granter = params.granter
    message.allowance = allowance

    return CosmosFeegrantV1Beta1Tx.MsgGrantAllowance.fromJSON(message)
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
          spendLimit: params.allowance.spendLimit,
          expiration: new Date(Number(timestamp.seconds) * 1000),
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

  public toWeb3() {
    const { params } = this
    const amino = this.toAmino()
    const timestamp = this.getTimestamp()

    const messageWithAllowance = {
      granter: amino.value.granter,
      grantee: amino.value.grantee,
      allowance: {
        '@type': basicAllowanceType,
        spendLimit: params.allowance.spendLimit,
        expiration: new Date(Number(timestamp.seconds) * 1000),
      },
    }

    return {
      '@type': '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
      ...messageWithAllowance,
    }
  }

  private getTimestamp() {
    const { params } = this

    if (params.allowance.expiration) {
      const timestamp = GoogleProtobufTimestamp.Timestamp.create()

      timestamp.seconds = params.allowance.expiration.toString()

      return timestamp
    }

    const defaultExpiryYears = 5
    const dateNow = new Date()
    const expiration = new Date(
      dateNow.getFullYear() + defaultExpiryYears,
      dateNow.getMonth(),
      dateNow.getDate(),
    )

    const timestamp = GoogleProtobufTimestamp.Timestamp.create()
    const timestampInSeconds = (expiration.getTime() / 1000).toString()

    timestamp.seconds = timestampInSeconds

    return timestamp
  }

  public toBinary(): Uint8Array {
    return CosmosFeegrantV1Beta1Tx.MsgGrantAllowance.encode(
      this.toProto(),
    ).finish()
  }
}
