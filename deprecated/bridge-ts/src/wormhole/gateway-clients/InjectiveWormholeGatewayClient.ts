import { TxResponse, MsgExecuteContractCompat } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import { cosmos } from '@injectivelabs/wormhole-sdk'
import {
  getTransferDetailsUint8Array,
  transferFromInjective,
  transferFromInjectiveUsingIbc,
} from '../injective'
import { TransferMsgArgs, WormholeClient, WormholeSource } from '../types'
import {
  getAssociatedChain,
  getContractAddresses,
  getAssociatedChainSigner,
  getAssociatedChainRecipientIbc,
} from '../utils'
import { InjectiveWormholeClient } from '../clients/InjectiveWormholeClient'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK,
} from '../constants'
import { zeroPad } from 'ethers/lib/utils'
import { cosmwasm } from '@wormhole-foundation/sdk/cosmwasm'
import { evm } from '@wormhole-foundation/sdk/evm'
import { solana } from '@wormhole-foundation/sdk/solana'
import { Wormhole, GatewayTransfer } from '@wormhole-foundation/sdk'
import { Provider } from '../clients'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

export class InjectiveWormholeGatewayClient
  extends InjectiveWormholeClient
  implements WormholeClient<TxResponse, MsgExecuteContractCompat>
{
  async transfer(
    args: TransferMsgArgs & {
      destination?: WormholeSource
      channelId?: string
      destinationSigner?: string
      destinationProvider?: Provider | PhantomWalletAdapter
      destinationRpc?: string
      wormchainRpc?: string
    },
  ) {
    const { network, wormholeRpcUrl, wormholeRestUrl, provider } = this
    const {
      amount,
      signer,
      recipient,
      wormchainRpc,
      destinationRpc,
      destinationSigner,
      destinationProvider,
      destination = WormholeSource.Solana,
    } = args

    if (!destinationProvider) {
      throw new GeneralException(
        new Error(`Please provide destinationProvider`),
      )
    }

    if (!wormchainRpc) {
      throw new GeneralException(new Error(`Please provide wormchainRpc`))
    }

    if (!destinationRpc) {
      throw new GeneralException(new Error(`Please provide destinationRpc`))
    }

    if (!destinationSigner) {
      throw new GeneralException(new Error(`Please provide destinationSigner`))
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    const whConfig = {
      chains: {
        Wormchain: {
          rpc: wormchainRpc,
        },
        ...(destination === WormholeSource.Solana && {
          Solana: {
            rpc: args.destinationRpc,
          },
        }),
      },
    }
    const wh = new Wormhole(
      'Mainnet',
      [evm.Platform, solana.Platform, cosmwasm.Platform],
      whConfig,
    )
    const injective = wh.getChain('Injective')

    const associatedRecipient = getAssociatedChainRecipientIbc(recipient)
    const associatedChain = getAssociatedChain(destination)
    const associatedChainSigner = await getAssociatedChainSigner({
      source: destination,
      provider: destinationProvider,
      address: destinationSigner,
      rpc: destinationRpc,
    })

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
    }

    if (!provider) {
      throw new GeneralException(
        new Error(`Please provide Injective wallet provider`),
      )
    }

    if (!signer) {
      throw new GeneralException(new Error(`Please provide signer`))
    }

    const associatedChainBlock = {
      header: {
        height: 9_999_999_999_999,
        version: {
          block: 11,
        },
      },
    }

    const messages = await transferFromInjectiveUsingIbc(
      args.channelId || 'channel-183',
      associatedChain,
      signer,
      WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK(network),
      args.tokenAddress,
      amount,
      Buffer.from(associatedRecipient).toString('base64'),
      associatedChainBlock,
    )

    const txResponse = (await provider.msgBroadcaster.broadcast({
      msgs: messages,
      injectiveAddress: signer,
    })) as TxResponse

    if (!txResponse) {
      throw new GeneralException(new Error('Transaction can not be found!'))
    }

    const result = await GatewayTransfer.from(
      wh,
      {
        chain: injective.chain,
        txid: txResponse.txHash,
      },
      600_000,
    )

    await result.fetchAttestation(600_000)
    await result.completeTransfer(associatedChainSigner)

    return txResponse
  }

  /**
   * Used to migrate existing
   * tokens from Injective to
   * Wormhole Gateway thought IBC
   */
  async migrate(
    args: TransferMsgArgs & {
      /**
       * Additional messages that we run before the bridge, an example
       * could be redeeming from the token factory to CW20
       */
      additionalMsgs?: MsgExecuteContractCompat[]
      /**
       * The destination chain where we transfer to
       */
      destination?: WormholeSource
    },
  ) {
    const { network, wormholeRpcUrl, wormholeRestUrl, provider } = this
    const {
      amount,
      signer,
      additionalMsgs = [],
      destination = WormholeSource.Wormchain,
    } = args

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
    }

    if (!provider) {
      throw new GeneralException(
        new Error(`Please provide Injective wallet provider`),
      )
    }

    if (!signer) {
      throw new GeneralException(new Error(`Please provide signer`))
    }

    const { injectiveContractAddresses } = getContractAddresses(
      network,
      destination,
    )

    const messages = await transferFromInjective(
      signer,
      injectiveContractAddresses.token_bridge,
      args.tokenAddress,
      amount,
      WORMHOLE_CHAINS.wormchain,
      zeroPad(
        cosmos.canonicalAddress(
          WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK(network),
        ),
        32,
      ),
      '0',
      getTransferDetailsUint8Array(signer),
    )

    const txResponse = (await provider.msgBroadcaster.broadcast({
      msgs: [...additionalMsgs, ...messages],
      injectiveAddress: signer,
    })) as TxResponse

    if (!txResponse) {
      throw new GeneralException(new Error('Transaction can not be found!'))
    }

    return txResponse
  }
}
