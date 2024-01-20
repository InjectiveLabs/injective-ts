import { TxResponse, MsgExecuteContractCompat } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import { tryNativeToUint8Array } from '@certusone/wormhole-sdk'
import { transferFromInjectiveUsingIbc } from '../injective'
import { TransferMsgArgs, WormholeClient, WormholeSource } from '../types'
import { getAssociatedChain, getAssociatedChainRecipient } from '../utils'
import { InjectiveWormholeClient } from '../clients/InjectiveWormholeClient'
import { isMainnet } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'
import { WORMHOLE_WORMCHAIN_IBC_TRANSLATOR_BY_NETWORK } from '../constants'

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

    const messages = await transferFromInjectiveUsingIbc(
      isMainnet(network) ? ChainId.Mainnet : ChainId.Testnet,
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
}
