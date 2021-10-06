import { AccountAddress } from '@injectivelabs/ts-types'
import { MsgSend } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

export class BankProtoComposer {
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
  }) {
    const amountToSend = new Coin()
    amountToSend.setAmount(amount)
    amountToSend.setDenom(denom)

    const message = new MsgSend()
    message.setFromAddress(srcInjectiveAddress)
    message.setToAddress(dstInjectiveAddress)

    return { message, type: '/cosmos.bank.v1beta1.MsgSend' }
  }
}
