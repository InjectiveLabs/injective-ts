import { TxResponse, MsgExecuteContractCompat } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import { cosmos, tryNativeToUint8Array } from '@certusone/wormhole-sdk'
import {
  getTransferDetailsUint8Array,
  transferFromInjective,
  transferFromInjectiveUsingIbc,
} from '../injective'
import { TransferMsgArgs, WormholeClient, WormholeSource } from '../types'
import {
  getAssociatedChain,
  getAssociatedChainRecipient,
  getContractAddresses,
} from '../utils'
import { InjectiveWormholeClient } from '../clients/InjectiveWormholeClient'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK,
} from '../constants'
import { zeroPad } from 'ethers/lib/utils'

export class InjectiveWormholeGatewayClient
  extends InjectiveWormholeClient
  implements WormholeClient<TxResponse, MsgExecuteContractCompat>
{
  async transfer(
    args: TransferMsgArgs & {
      // The destination chain where we transfer to
      destination?: WormholeSource
      // The channel id of the IBC connection
      channelId?: string
    },
  ) {
    const { network, wormholeRpcUrl, wormholeRestUrl, provider } = this
    const {
      amount,
      signer,
      recipient: recipientArg,
      destination = WormholeSource.Solana,
    } = args

    const associatedChain = getAssociatedChain(destination)
    const recipient = getAssociatedChainRecipient(recipientArg, destination)

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
    }

    if (!recipient) {
      throw new GeneralException(
        new Error(`Please provide the associatedChain provider`),
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

    const destinationLatestBlock = {
      header: {
        height: 9_999_999_999_999,
        version: {
          block: 11,
        },
      },
    }

    // TODO: add testnet support
    const messages = await transferFromInjectiveUsingIbc(
      args.channelId || 'channel-183',
      signer,
      WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK(network),
      args.tokenAddress,
      amount,
      Buffer.from(tryNativeToUint8Array(recipient, associatedChain)).toString(
        'base64',
      ),
      destinationLatestBlock,
    )

    const txResponse = (await provider.msgBroadcaster.broadcast({
      msgs: messages,
      injectiveAddress: signer,
    })) as TxResponse

    if (!txResponse) {
      throw new GeneralException(new Error('Transaction can not be found!'))
    }

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
