import { MsgTransferEncodeObject } from '@cosmjs/stargate'
import { MsgTransfer as BaseMsgTransferCosmjs } from 'cosmjs-types/ibc/applications/transfer/v1/tx'

export declare namespace MsgTransferCosmjs {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
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

  export type Proto = BaseMsgTransferCosmjs
}

/**
 * @category Messages
 *
 * @deprecated use MsgTransfer with SIGN_DIRECT and a Cosmos wallet
 */
export default class MsgTransferCosmjs {
  params: MsgTransferCosmjs.Params

  constructor(params: MsgTransferCosmjs.Params) {
    this.params = params
  }

  static fromJSON(params: MsgTransferCosmjs.Params): MsgTransferCosmjs {
    return new MsgTransferCosmjs(params)
  }

  public toProto() {
    throw new Error('Method not implemented.')
  }

  public toData() {
    throw new Error('Method not implemented.')
  }

  public toAmino() {
    const { params } = this

    const transferMsg: MsgTransferEncodeObject = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: BaseMsgTransferCosmjs.fromPartial({
        sourcePort: params.port,
        sourceChannel: params.channelId,
        sender: params.sender,
        receiver: params.receiver,
        token: params.amount,
        timeoutHeight: params.height
          ? {
              revisionHeight: BigInt(params.height.revisionHeight),
              revisionNumber: BigInt(params.height.revisionNumber),
            }
          : undefined,
        timeoutTimestamp: params.timeout ? BigInt(params.timeout) : undefined,
      }),
    }

    return transferMsg
  }

  public toWeb3() {
    throw new Error('Method not implemented.')
  }

  public toDirectSign() {
    throw new Error('Method not implemented.')
  }
}
