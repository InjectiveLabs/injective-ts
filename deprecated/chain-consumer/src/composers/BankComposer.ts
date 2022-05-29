import { AccountAddress, ComposerResponse } from '@injectivelabs/ts-types'
import snakeCaseKeys from 'snakecase-keys'
import { MsgSend } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'

export class BankComposer {
  static send({
    amount,
    denom,
    srcInjectiveAddress,
    dstInjectiveAddress,
  }: {
    denom: string
    amount: string
    srcInjectiveAddress: AccountAddress
    dstInjectiveAddress: AccountAddress
  }): ComposerResponse<MsgSend, MsgSend.AsObject> {
    const amountToSend = new Coin()
    amountToSend.setAmount(amount)
    amountToSend.setDenom(denom)

    const type = '/cosmos.bank.v1beta1.MsgSend'

    const message = new MsgSend()
    message.setFromAddress(srcInjectiveAddress)
    message.setToAddress(dstInjectiveAddress)
    message.setAmountList([amountToSend])

    const messageObj = {
      ...snakeCaseKeys(message.toObject()),
      amount: [{ ...snakeCaseKeys(amountToSend.toObject()) }],
    }

    // @ts-ignore
    delete messageObj.amount_list

    return {
      web3GatewayMessage: getWeb3GatewayMessage(
        messageObj as unknown as MsgSend.AsObject,
        type,
      ),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
