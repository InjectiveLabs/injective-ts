import { Web3Exception } from '@injectivelabs/exceptions'
import { BigNumberInWei } from '@injectivelabs/utils'
import { PeggyComposer } from '@injectivelabs/chain-consumer'
import { BIG_NUMBER_ROUND_DOWN_MODE } from '../../constants'
import { AccountMetrics } from '../../types'
import { BaseActionService } from '../BaseActionService'

export class PeggyActionService extends BaseActionService {
  /**
   * Amount should always be in x * 10^(denomDecimals) format
   * where x is a human readable number.
   * Use `denomAmountToChainDenomAmount` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted amount
   *
   * Bridge Fee should always be in x * 10^(denomDecimals) format
   * where x is a human readable number.
   * Use `denomAmountToChainDenomAmount` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted bridge fee
   * */
  async withdraw({
    address,
    amount,
    denom,
    destinationAddress,
    bridgeFee,
    injectiveAddress,
  }: {
    address: string
    amount: string // BigNumberInWei
    denom: string
    destinationAddress: string
    bridgeFee: string // BigNumberInWei
    injectiveAddress: string
  }) {
    const bridgeFeeToFixed = new BigNumberInWei(bridgeFee).toFixed(
      0,
      BIG_NUMBER_ROUND_DOWN_MODE,
    )
    const message = PeggyComposer.withdraw({
      denom,
      amount: new BigNumberInWei(amount)
        .minus(bridgeFeeToFixed)
        .toFixed(0, BIG_NUMBER_ROUND_DOWN_MODE),
      bridgeFeeAmount: bridgeFeeToFixed,
      bridgeFeeDenom: denom,
      address: destinationAddress,
      injectiveAddress,
    })

    try {
      const txHash = await this.txProvider.broadcast({
        bucket: AccountMetrics.Send,
        message,
        address,
      })

      return {
        amount,
        denom,
        txHash,
        bridgeFee: bridgeFeeToFixed,
        receiver: address,
        sender: injectiveAddress,
      }
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
