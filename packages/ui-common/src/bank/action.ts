import { BankComposer } from '@injectivelabs/chain-consumer'
import { BigNumberInWei } from '@injectivelabs/utils'
import { Web3Exception } from '@injectivelabs/exceptions'
import { AccountMetrics } from '../types'
import { BaseActionService } from '../BaseActionService'

export class BankActionService extends BaseActionService {
  /**
   * Amount should always be in x * 10^(denomDecimals) format
   * where x is a human readable number.
   * Use `denomAmountToChainDenomAmount` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted amount
   * */
  async transfer({
    address,
    denom,
    amount,
    injectiveAddress,
    destination,
  }: {
    amount: string
    address: string
    denom: string
    destination: string
    injectiveAddress: string
  }) {
    const message = BankComposer.send({
      denom,
      amount: new BigNumberInWei(amount).toFixed(),
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: destination,
    })

    try {
      return await this.txProvider.broadcast({
        bucket: AccountMetrics.Send,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
