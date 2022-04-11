import { BankComposer, IBCComposer } from '@injectivelabs/chain-consumer'
import { BigNumber, BigNumberInWei } from '@injectivelabs/utils'
import { Web3Exception } from '@injectivelabs/exceptions'
import { AccountMetrics } from '../../types'
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
    memo,
    injectiveAddress,
    destination,
  }: {
    amount: string
    address: string
    denom: string
    memo?: string
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
        memo,
        address,
      })
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  async ibcTransfer({
    address,
    amount,
    denom,
    port,
    channelId,
    timestamp,
    block,
    destinationAddress,
    injectiveAddress,
  }: {
    address: string
    port: string
    timestamp: number
    block: any
    channelId: string
    amount: string
    denom: string
    destinationAddress: string
    injectiveAddress: string
  }) {
    const message = IBCComposer.transfer({
      denom,
      port,
      channelId,
      timeout: timestamp,
      height: {
        revisionHeight: new BigNumber(block.header.height).plus(100).toNumber(),
        revisionNumber: new BigNumber(block.header.version.block).toNumber(),
      },
      sender: injectiveAddress,
      receiver: destinationAddress,
      amount,
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
