import {
  AxelarAssetTransfer,
  AxelarGateway,
  CosmosChain,
  Environment,
  EvmChain,
} from '@axelar-network/axelarjs-sdk'
import { providers, Contract } from 'ethers'
import { erc20Abi } from './erc20'

export class AxelarAPI {
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

    const response = await transaction.send(signer)

    return response
  }

  public async getBalance(address: string, contractAddress: string) {
    const { provider } = await this.getAxelarGateway()
    const contract = new Contract(contractAddress, erc20Abi, provider)

    return contract.balanceOf(address)
  }

  public async getTokenAddress(symbol: string) {
    const { axelarGateway } = await this.getAxelarGateway()

    return axelarGateway.getTokenAddress(symbol)
  }

  private async getAxelarGateway() {
    const { axelarGatewayAddress } = this
    const provider = (window as any).ethereum

    if (!provider) {
      throw new Error('Please install Metamask extension')
    }

    const web3Provider = new providers.Web3Provider(provider, 'any')
    const signer = web3Provider.getSigner()

    return {
      axelarGateway: new AxelarGateway(axelarGatewayAddress, web3Provider),
      provider: web3Provider,
      signer,
    }
  }
}
