import { INJ_DENOM } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import {
  ExecArgDepositTokens,
  ExecArgIncreaseAllowance,
  ExecArgSubmitVaa,
  ExecArgInitiateTransfer,
  MsgExecuteContract,
} from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import { tryNativeToHexString } from '@injectivelabs/wormhole-sdk'
import { WORMHOLE_CHAINS, WORMHOLE_CONTRACT_BY_NETWORK } from './constants'
import { WormholeContractAddresses, TransferMsgArgs } from './types'

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
    signed: string /* in base 64 */
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
      execArgs: ExecArgSubmitVaa.fromJSON({ signed }),
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
    const initiateTransferArgs = {
      ...args,
      payload,
      recipient: recipientAddress,
    }

    if (tokenAddress.startsWith('peggy') || tokenAddress === INJ_DENOM) {
      const depositTokensMsg = ExecArgDepositTokens.fromJSON({})
      const initiateTransferMsg = ExecArgInitiateTransfer.fromJSON({
        ...initiateTransferArgs,
        info: {
          native_token: { denom: tokenAddress },
        },
      })

      return [
        MsgExecuteContract.fromJSON({
          sender: recipient,
          contractAddress: contractAddresses.token_bridge,
          funds: { denom: tokenAddress, amount },
          execArgs: depositTokensMsg,
        }),
        MsgExecuteContract.fromJSON({
          sender: recipient,
          contractAddress: contractAddresses.token_bridge,
          execArgs: initiateTransferMsg,
        }),
      ]
    }

    const increaseAllowanceMsg = ExecArgIncreaseAllowance.fromJSON({
      amount,
      spender: contractAddresses.token_bridge,
      expires: { never: {} },
    })
    const initiateTransferMsg = ExecArgInitiateTransfer.fromJSON({
      ...initiateTransferArgs,
      info: {
        token: { contract_addr: tokenAddress },
      },
    })

    return [
      MsgExecuteContract.fromJSON({
        sender: address,
        contractAddress: contractAddresses.token_bridge,
        execArgs: increaseAllowanceMsg,
      }),
      MsgExecuteContract.fromJSON({
        sender: address,
        contractAddress: contractAddresses.token_bridge,
        execArgs: initiateTransferMsg,
      }),
    ]
  }
}
