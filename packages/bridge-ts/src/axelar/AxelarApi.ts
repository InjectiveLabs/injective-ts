import {
  AxelarAssetTransfer,
  AxelarGateway,
  CosmosChain,
  Environment,
  EvmChain,
} from '@axelar-network/axelarjs-sdk'
import { providers, Contract } from 'ethers'
import { BigNumberInWei } from '@injectivelabs/utils'
import {
  ErrorType,
  MetamaskException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { MOONBEAM_MAINNET_CHAIN_ID } from './constants'
import { erc20Abi } from './erc20Abi'

export class AxelarClient {
  private axelarJsSDK: AxelarAssetTransfer

  private axelarGatewayAddress: string

  constructor({
    environment,
    gatewayAddress,
  }: {
    environment: Environment
    gatewayAddress: string
  }) {
    this.axelarJsSDK = new AxelarAssetTransfer({
      environment,
      auth: 'metamask',
    })
    this.axelarGatewayAddress = gatewayAddress
  }

  public async getDepositAddress({
    sourceChain,
    destinationChain,
    address,
    asset,
  }: {
    sourceChain: string
    destinationChain: string
    address: string
    asset: string
  }): Promise<string> {
    return this.axelarJsSDK.getDepositAddress(
      sourceChain,
      destinationChain,
      address,
      asset,
    )
  }

  public async sendTokens(args: {
    destinationChain: EvmChain | CosmosChain
    destinationAddress: string
    symbol: string
    amount: string
  }) {
    const { axelarGateway, signer } = await this.getAxelarGateway()

    const transaction = await axelarGateway.createSendTokenTx(args)
    const response = await transaction.send(signer)

    return response
  }

  public async approveAllowance(address: string) {
    const { axelarGateway, signer } = await this.getAxelarGateway()
    const transaction = await axelarGateway.createApproveTx({
      tokenAddress: address,
    })

    return transaction.send(signer)
  }

  public async transferTokens({
    receiver,
    amount,
    contractAddress,
  }: {
    receiver: string
    amount: string
    contractAddress: string
  }): Promise<any> {
    await this.validateNetwork()
    const { signer } = await this.getAxelarGateway()
    const contract = new Contract(contractAddress, erc20Abi, signer)

    const feeData = await signer.getFeeData()
    const tx = await contract.transfer(receiver, amount, {
      maxFeePerGas: feeData.gasPrice || feeData.maxFeePerGas,
      maxPriorityFeePerGas:
        feeData.maxPriorityFeePerGas || '0x77359400' /* 2 Gwei in HEX */,
    })

    return tx.wait()
  }

  public async getBalance(address: string, contractAddress: string) {
    const { provider } = await this.getAxelarGateway()
    const contract = new Contract(contractAddress, erc20Abi, provider)
    const balance = (await contract.balanceOf(address)) as BigNumberInWei

    return new BigNumberInWei(balance.toNumber()).toString()
  }

  public async getTokenAddress(symbol: string) {
    const { axelarGateway } = await this.getAxelarGateway()

    return axelarGateway.getTokenAddress(symbol)
  }

  private async getAxelarGateway() {
    const { axelarGatewayAddress } = this
    const provider = (window as any).ethereum

    if (!provider) {
      throw new MetamaskException(
        new Error('Please install Metamask extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
        },
      )
    }

    await this.validateNetwork()

    const web3Provider = new providers.Web3Provider(provider, 'any')

    const signer = web3Provider.getSigner()

    return {
      axelarGateway: new AxelarGateway(axelarGatewayAddress, web3Provider),
      provider: web3Provider,
      signer,
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async validateNetwork() {
    const provider = (window as any).ethereum

    if (!provider) {
      throw new MetamaskException(
        new Error('Please install Metamask extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
        },
      )
    }

    const web3Provider = new providers.Web3Provider(provider, 'any')

    const network = await web3Provider.getNetwork()

    if (network.chainId !== MOONBEAM_MAINNET_CHAIN_ID) {
      throw new MetamaskException(
        new Error('Please switch to the Moonbeam network in Metamask'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
        },
      )
    }
  }
}
