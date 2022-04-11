import { SubaccountComposer } from '@injectivelabs/subaccount-consumer'
import { Web3Exception } from '@injectivelabs/exceptions'
import { BigNumberInWei } from '@injectivelabs/utils'
import { AccountMetrics } from '../../types'
import { BaseActionService } from '../BaseActionService'

export class SubaccountActionService extends BaseActionService {
  /*
   * Amount should always be in x * 10^(denomDecimals) format
   * where x is a human readable number.
   * Use `denomAmountToChainDenomAmount` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted amount
   * */
  async deposit({
    amount,
    address,
    injectiveAddress,
    denom,
    subaccountId,
  }: {
    amount: string
    denom: string
    subaccountId: string
    address: string
    injectiveAddress: string
  }) {
    const message = SubaccountComposer.deposit({
      subaccountId,
      denom,
      injectiveAddress,
      amount: new BigNumberInWei(amount).toFixed(),
    })

    try {
      return await this.txProvider.broadcast({
        bucket: AccountMetrics.Deposit,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  /*
   * Amount should always be in x * 10^(denomDecimals) format
   * where x is a human readable number.
   * Use `denomAmountToChainDenomAmount` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted amount
   * */
  async withdraw({
    amount,
    address,
    injectiveAddress,
    denom,
    subaccountId,
  }: {
    amount: string
    denom: string
    subaccountId: string
    address: string
    injectiveAddress: string
  }) {
    const message = SubaccountComposer.withdraw({
      subaccountId,
      denom,
      injectiveAddress,
      amount: new BigNumberInWei(amount).toFixed(),
    })

    try {
      return await this.txProvider.broadcast({
        bucket: AccountMetrics.Withdraw,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
