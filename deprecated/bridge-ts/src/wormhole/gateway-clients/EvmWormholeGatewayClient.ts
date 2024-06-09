import { GeneralException } from '@injectivelabs/exceptions'
import {
  cosmos,
  approveEth,
  transferFromEth,
  transferFromEthNative,
} from '@injectivelabs/wormhole-sdk'
import { BigNumber } from '@injectivelabs/utils'
import { ethers } from 'ethers'
import { zeroPad } from 'ethers/lib/utils'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK,
} from '../constants'
import { WormholeClient, TransferMsgArgs } from '../types'
import { getContractAddresses } from '../utils'
import {
  EvmWormholeClient,
  isNativeTokenAddress,
} from '../clients/EvmWormholeClient'
import { getTransferDetailsUint8Array } from '../injective'

export class EvmWormholeGatewayClient
  extends EvmWormholeClient
  implements
    WormholeClient<
      ethers.ContractReceipt & { txHash: string },
      ethers.providers.TransactionReceipt
    >
{
  async transfer(args: TransferMsgArgs) {
    return args.tokenAddress && !isNativeTokenAddress(args.tokenAddress)
      ? this.transferToken(args)
      : this.transferNative(args)
  }

  protected async transferToken(args: TransferMsgArgs) {
    const { network, wormholeRpcUrl, wormholeRestUrl, wormholeSource } = this
    const { amount, recipient, tokenAddress } = args

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
    }

    if (!tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    const signer = await this.getProviderAndChainIdCheck()
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const allowance = await this.getTokenAllowance({
      address: await signer.getAddress(),
      tokenAddress,
    })

    if (new BigNumber(allowance).lt(amount)) {
      await approveEth(
        associatedChainContractAddresses.token_bridge,
        tokenAddress,
        signer,
        new BigNumber(2).pow(256).minus(1).toFixed(),
      )
    }

    const transferReceipt = await transferFromEth(
      associatedChainContractAddresses.token_bridge,
      signer,
      tokenAddress,
      amount,
      WORMHOLE_CHAINS.wormchain,
      zeroPad(
        cosmos.canonicalAddress(
          WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK(network),
        ),
        32,
      ),
      undefined,
      undefined,
      getTransferDetailsUint8Array(recipient),
    )

    if (!transferReceipt) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return {
      txHash: transferReceipt.transactionHash,
      ...transferReceipt,
    } as ethers.ContractReceipt & {
      txHash: string
    }
  }

  protected async transferNative(args: TransferMsgArgs) {
    const { network, wormholeRpcUrl, wormholeRestUrl, wormholeSource } = this
    const { amount, recipient } = args

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    const signer = await this.getProviderAndChainIdCheck()

    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const transferReceipt = await transferFromEthNative(
      associatedChainContractAddresses.token_bridge,
      signer,
      amount,
      WORMHOLE_CHAINS.wormchain,
      zeroPad(
        cosmos.canonicalAddress(
          WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK(network),
        ),
        32,
      ),
      undefined,
      undefined,
      getTransferDetailsUint8Array(recipient),
    )

    if (!transferReceipt) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return {
      txHash: transferReceipt.transactionHash,
      ...transferReceipt,
    } as ethers.ContractReceipt & {
      txHash: string
    }
  }
}
