import {
  GoogleProtobufAny,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { Msgs } from '../../msgs'
import { MsgIncreasePositionMargin, MsgSignData } from '../../exchange'
import { getInjectiveAddress } from './../../../../utils'

export class MsgDecoder {
  static decode(message: GoogleProtobufAny.Any): Msgs {
    const type = message.typeUrl

    switch (true) {
      case type.includes('MsgIncreasePositionMargin'): {
        const msg = InjectiveExchangeV1Beta1Tx.MsgIncreasePositionMargin.decode(
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
        const msg = InjectiveExchangeV1Beta1Tx.MsgSignData.decode(message.value)

        return MsgSignData.fromJSON({
          data: Buffer.from(msg.Data).toString('utf-8'),
          sender: getInjectiveAddress(Buffer.from(msg.Signer).toString('hex')),
        })
      }

      default:
        throw new Error('Unknown message type')
    }
  }
}
