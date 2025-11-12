import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs'
import { getInjectiveAddress } from '../../../utils/index.js'
import {
  MsgSignData,
  MsgIncreasePositionMargin,
} from '../../modules/exchange/index.js'
import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import type { Msgs } from '../../modules/msgs.js'

export class MsgDecoder {
  static decode(message: GoogleProtobufAnyPb.Any): Msgs {
    const type = message.typeUrl

    switch (true) {
      case type.includes('MsgIncreasePositionMargin'): {
        const msg =
          InjectiveExchangeV1Beta1TxPb.MsgIncreasePositionMargin.fromBinary(
            message.value,
          )

        return MsgIncreasePositionMargin.fromJSON({
          marketId: msg.marketId,
          injectiveAddress: msg.sender,
          srcSubaccountId: msg.sourceSubaccountId,
          dstSubaccountId: msg.destinationSubaccountId,
          amount: msg.amount,
        })
      }

      case type.includes('MsgSignData'): {
        const msg = InjectiveExchangeV1Beta1TxPb.MsgSignData.fromBinary(
          message.value,
        )

        return MsgSignData.fromJSON({
          data: Buffer.from(msg.data).toString('utf-8'),
          sender: getInjectiveAddress(Buffer.from(msg.signer).toString('hex')),
        })
      }

      default:
        throw new Error('Unknown message type')
    }
  }
}
