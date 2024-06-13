import { GeneralException } from '@injectivelabs/exceptions'
import {
  cosmos,
  transferNativeSol,
  transferFromSolana,
} from '@injectivelabs/wormhole-sdk'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import {
  PublicKey,
  Connection,
  Transaction,
  TransactionResponse,
} from '@solana/web3.js'
import { zeroPad } from 'ethers/lib/utils'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK,
} from '../constants'
import { TransferMsgArgs, WormholeClient } from '../types'
import { getContractAddresses } from '../utils'
import { SolanaWormholeClient } from '../clients/SolanaWormholeClient'
import { getTransferDetailsUint8Array } from '../injective'

export class SolanaWormholeGatewayClient
  extends SolanaWormholeClient
  implements WormholeClient<TransactionResponse, Transaction>
{
  async transfer(args: TransferMsgArgs) {
    return args.tokenAddress
      ? this.transferToken(args)
      : this.transferNative(args)
  }

  protected async transferToken(args: TransferMsgArgs) {
    const { network, solanaHostUrl, wormholeRestUrl, wormholeRpcUrl } = this
    const { amount, recipient, signer } = args

    const provider = await this.getProvider()
    const pubKey = provider.publicKey || new PublicKey(signer || '')

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
    }
    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (pubKey.toBuffer().length === 0) {
      throw new GeneralException(new Error(`Please provide signerPubKey`))
    }

    const { associatedChainContractAddresses } = getContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')
    const fromAddress = (
      await getAssociatedTokenAddress(new PublicKey(args.tokenAddress), pubKey)
    ).toString()

    const transaction = await transferFromSolana(
      connection,
      associatedChainContractAddresses.core,
      associatedChainContractAddresses.token_bridge,
      pubKey,
      fromAddress,
      args.tokenAddress,
      BigInt(amount),
      zeroPad(
        cosmos.canonicalAddress(
          WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK(network),
        ),
        32,
      ),
      WORMHOLE_CHAINS.wormchain,
      undefined,
      undefined,
      undefined,
      undefined,
      getTransferDetailsUint8Array(recipient),
    )

    const txResponse = await this.signSendAndConfirmTransaction(transaction)

    return txResponse as TransactionResponse & {
      txHash: string
    }
  }

  protected async transferNative(args: TransferMsgArgs) {
    const { network, solanaHostUrl, wormholeRestUrl, wormholeRpcUrl } = this
    const { amount, recipient, signer } = args

    const provider = await this.getProvider()
    const pubKey = provider.publicKey || new PublicKey(signer || '')

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (pubKey.toBuffer().length === 0) {
      throw new GeneralException(new Error(`Please provide signerPubKey`))
    }

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
    }
    const { associatedChainContractAddresses } = getContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')
    const transaction = await transferNativeSol(
      connection,
      associatedChainContractAddresses.core,
      associatedChainContractAddresses.token_bridge,
      pubKey,
      BigInt(amount),
      zeroPad(
        cosmos.canonicalAddress(
          WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK(network),
        ),
        32,
      ),
      WORMHOLE_CHAINS.wormchain,
      undefined,
      getTransferDetailsUint8Array(recipient),
    )

    const txResponse = await this.signSendAndConfirmTransaction(transaction)

    return txResponse as TransactionResponse & {
      txHash: string
    }
  }
}
