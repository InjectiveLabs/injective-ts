import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import { getInjectiveAddress } from '../../../utils/index.js'
import { toUtf8, uint8ArrayToHex } from '../../../utils/encoding.js'
import {
  MsgSignData,
  MsgIncreasePositionMargin,
} from '../../modules/exchange/index.js'
import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
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
          data: toUtf8(msg.data),
          sender: getInjectiveAddress(uint8ArrayToHex(msg.signer)),
        })
      }

      default:
        throw new Error('Unknown message type')
    }
  }
}
