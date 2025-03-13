import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'
import { ChainId } from '@injectivelabs/ts-types'
import { binaryToBase64 } from './../../../../utils/utf8.js'

export declare namespace ExecArgInitiateTransfer {
  export interface Params {
    amount: string
    recipient: string
    recipientChainId: ChainId | number | string
    info: Record<string, any>
    relayerFee?: string
    payload?: Uint8Array | null
  }

  export interface Data {
    nonce: number
    asset: {
      amount: string
      info: Record<string, any>
    }
    recipient_chain: ChainId | number | string
    recipient: string
    fee: string
    payload?: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgInitiateTransfer extends ExecArgBase<
  ExecArgInitiateTransfer.Params,
  ExecArgInitiateTransfer.Data
> {
  static fromJSON(
    params: ExecArgInitiateTransfer.Params,
  ): ExecArgInitiateTransfer {
    return new ExecArgInitiateTransfer(params)
  }

  toData(): ExecArgInitiateTransfer.Data {
    const { params } = this

    return {
      nonce: Math.round(Math.random() * 100000),
      asset: {
        amount: params.amount,
        info: params.info,
      },
      recipient_chain: params.recipientChainId,
      recipient: binaryToBase64(params.recipient),
      fee: params.relayerFee || '0',
      ...(params.payload && { payload: binaryToBase64(params.payload) }),
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgInitiateTransfer.Data> {
    const data = this.toData()

    const action = data.payload
      ? 'initiate_transfer_with_payload'
      : 'initiate_transfer'

    return dataToExecData(action, this.toData())
  }
}
