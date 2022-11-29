import { INJ_DENOM } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import { MsgExecuteContract, binaryToBase64 } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import { tryNativeToHexString } from '@certusone/wormhole-sdk'
import { WORMHOLE_CHAINS, WORMHOLE_CONTRACT_BY_NETWORK } from './constants'
import { WormholeContractAddresses, TransferMsgArgs } from './types'
import { createTransferContractMsgExec } from './utils'

export class WormholeClient {
  public network: Network

  public wormholeRpcUrl?: string

  constructor({
    network,
    wormholeRpcUrl,
  }: {
    network: Network
    solanaHostUrl?: string
    wormholeRpcUrl?: string
  }) {
    this.network = network
    this.wormholeRpcUrl = wormholeRpcUrl
  }

  async getRedeemOnInjectiveMsg({
    address,
    signed,
  }: {
    address: string
    signed: Uint8Array | string
  }) {
    const { network } = this
    const contractAddresses = (
      WORMHOLE_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeContractAddresses
      }
    )[network] as WormholeContractAddresses

    if (!contractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} not found`),
      )
    }

    return MsgExecuteContract.fromJSON({
      contractAddress: contractAddresses.token_bridge,
      sender: address,
      msg: {
        data: binaryToBase64(signed),
      },
      action: 'submit_vaa',
    })
  }

  async getFromInjectiveTransferMsg(
    args: TransferMsgArgs & { address: string; tokenAddress: string },
  ) {
    const { network } = this
    const { amount, recipient, address, tokenAddress, payload } = args

    if (!address) {
      throw new GeneralException(new Error(`Please provide address`))
    }

    if (!tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    const contractAddresses = (
      WORMHOLE_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeContractAddresses
      }
    )[network] as WormholeContractAddresses

    if (!contractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} not found`),
      )
    }

    const recipientAddress = tryNativeToHexString(
      args.recipient,
      WORMHOLE_CHAINS.injective,
    )
    const action = payload
      ? 'initiate_transfer_with_payload'
      : 'initiate_transfer'

    if (tokenAddress.startsWith('peggy') || tokenAddress === INJ_DENOM) {
      return [
        MsgExecuteContract.fromJSON({
          sender: recipient,
          action: 'deposit_tokens',
          contractAddress: contractAddresses.token_bridge,
          funds: { denom: tokenAddress, amount },
          msg: {},
        }),
        MsgExecuteContract.fromJSON({
          action,
          sender: recipient,
          contractAddress: contractAddresses.token_bridge,
          msg: createTransferContractMsgExec(
            { ...args, recipient: recipientAddress },
            {
              native_token: { denom: tokenAddress },
            },
          ),
        }),
      ]
    }

    return [
      MsgExecuteContract.fromJSON({
        sender: address,
        contractAddress: contractAddresses.token_bridge,
        msg: {
          amount,
          spender: contractAddresses.token_bridge,
          expires: {
            never: {},
          },
        },
        action: 'increase_allowance',
      }),
      MsgExecuteContract.fromJSON({
        action,
        sender: address,
        contractAddress: contractAddresses.token_bridge,
        msg: createTransferContractMsgExec(
          { ...args, recipient: recipientAddress },
          {
            token: { contract_addr: tokenAddress },
          },
        ),
      }),
    ]
  }
}
