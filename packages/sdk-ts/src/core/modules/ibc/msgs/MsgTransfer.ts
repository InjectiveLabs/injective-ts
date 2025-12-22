import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as IbcCoreClientV1ClientPb from '@injectivelabs/core-proto-ts-v2/generated/ibc/core/client/v1/client_pb'
import * as IbcApplicationsTransferV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/ibc/applications/transfer/v1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgTransfer {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    memo?: string
    sender: string
    port: string
    receiver: string
    channelId: string
    timeout?: number
    height?: {
      revisionHeight: number
      revisionNumber: number
    }
  }

  export type Proto = IbcApplicationsTransferV1TxPb.MsgTransfer
}

/**
 * @category Messages
 */
export default class MsgTransfer extends MsgBase<
  MsgTransfer.Params,
  MsgTransfer.Proto
> {
  static fromJSON(params: MsgTransfer.Params): MsgTransfer {
    return new MsgTransfer(params)
  }

  public toProto() {
    const { params } = this

    const token = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = IbcApplicationsTransferV1TxPb.MsgTransfer.create({
      sourcePort: params.port,
      sourceChannel: params.channelId,
      token: token,
      sender: params.sender,
      receiver: params.receiver,
      memo: params.memo || '',
    })

    if (params.height) {
      const timeoutHeight = IbcCoreClientV1ClientPb.Height.create({
        revisionNumber: BigInt(params.height.revisionNumber),
        revisionHeight: BigInt(params.height.revisionHeight),
      })

      message.timeoutHeight = timeoutHeight
    }

    if (params.timeout) {
      message.timeoutTimestamp = BigInt(params.timeout)
    }

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      source_port: proto.sourcePort,
      source_channel: proto.sourceChannel,
      token: proto.token,
      sender: proto.sender,
      receiver: proto.receiver,
      timeout_height: proto.timeoutHeight
        ? {
            revision_number: proto.timeoutHeight.revisionNumber.toString(),
            revision_height: proto.timeoutHeight.revisionHeight.toString(),
          }
        : undefined,
      timeout_timestamp: proto.timeoutTimestamp
        ? proto.timeoutTimestamp.toString()
        : undefined,
      memo: proto.memo || '',
    }

    return {
      type: 'cosmos-sdk/MsgTransfer',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/ibc.applications.transfer.v1.MsgTransfer',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/ibc.applications.transfer.v1.MsgTransfer',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return IbcApplicationsTransferV1TxPb.MsgTransfer.toBinary(this.toProto())
  }
}
