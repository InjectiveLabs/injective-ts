import { SubaccountComposer } from '@injectivelabs/subaccount-consumer'
import { Web3Exception } from '@injectivelabs/exceptions'
import { AccountMetrics } from '../types'
import { BaseActionService } from '../BaseActionService'

export class SubaccountActionService extends BaseActionService {
  async deposit({
    amount,
    address,
    injectiveAddress,
    denom,
    subaccountId,
  }: {
    amount: string // BigNumberInWei
    denom: string
    subaccountId: string
    address: string
    injectiveAddress: string
  }) {
    const message = SubaccountComposer.deposit({
      subaccountId,
      denom,
      injectiveAddress,
      amount,
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

  async withdraw({
    amount,
    address,
    injectiveAddress,
    denom,
    subaccountId,
  }: {
    amount: string // BigNumberInWei
    denom: string
    subaccountId: string
    address: string
    injectiveAddress: string
  }) {
    const message = SubaccountComposer.withdraw({
      subaccountId,
      denom,
      injectiveAddress,
      amount,
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
