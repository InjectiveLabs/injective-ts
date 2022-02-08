import { BankComposer } from '@injectivelabs/chain-consumer'
import { BigNumberInWei } from '@injectivelabs/utils'
import { Web3Exception } from '@injectivelabs/exceptions'
import { TxProvider } from '../providers/TxProvider'
import { AccountMetrics, ServiceActionOptions } from '../types'

export class BankActionService {
  private txProvider: TxProvider

  constructor({ options }: { options: ServiceActionOptions }) {
    this.txProvider = new TxProvider(options)
  }

  async transfer({
    address,
    denom,
    amount,
    injectiveAddress,
    destination,
  }: {
    amount: string // BigNumberInWei
    address: string
    denom: string
    destination: string
    injectiveAddress: string
  }) {
    const { txProvider } = this
    const message = BankComposer.send({
      denom,
      amount: new BigNumberInWei(amount).toFixed(),
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: destination,
    })

    try {
      return await txProvider.broadcast({
        bucket: AccountMetrics.Send,
        message,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
