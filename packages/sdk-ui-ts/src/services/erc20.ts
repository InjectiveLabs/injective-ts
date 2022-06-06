import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { Network } from '@injectivelabs/networks'
import { EthereumChainId, TransactionOptions } from '@injectivelabs/ts-types'
import {
  Erc20Contract,
  getContractAddressesForNetworkOrThrow,
  PeggyContract,
} from '@injectivelabs/contracts'
import {
  GAS_LIMIT_MULTIPLIER,
  INJ_DENOM,
  TX_DEFAULTS_GAS,
  ZERO_IN_BASE,
} from '../constants'
import { BigNumberInWei, DEFAULT_GAS_PRICE } from '@injectivelabs/utils'
import { getAddressFromInjectiveAddress } from '@injectivelabs/sdk-ts/dist/utils'
import { Token, TokenWithBalance } from '../types'

export const getTransactionOptions = (
  transactionOptions: Partial<TransactionOptions>,
): TransactionOptions => ({
  from: transactionOptions.from,
  gas: transactionOptions.gas ? transactionOptions.gas : TX_DEFAULTS_GAS,
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : DEFAULT_GAS_PRICE.toString(),
})

export const peggyDenomToContractAddress = (
  denom: string,
  injectiveContractAddress: string,
): string => {
  const denomLowerCased = denom.toLowerCase()
  const contractAddress = denomLowerCased.replace('peggy', '')

  return denomLowerCased === INJ_DENOM
    ? injectiveContractAddress
    : contractAddress
}

export const getSetTokenAllowanceTx = async ({
  address,
  amount,
  rpc,
  network,
  ethereumChainId,
  gasPrice,
  tokenAddress,
}: {
  address: string
  rpc: string
  network: Network
  ethereumChainId: EthereumChainId
  amount: string
  gasPrice: string
  tokenAddress: string
}) => {
  const web3 = createAlchemyWeb3(rpc)
  const erc20Contract = new Erc20Contract({
    ethereumChainId,
    web3: web3 as any,
    address: tokenAddress,
  })
  const contractAddresses = getContractAddressesForNetworkOrThrow(network)
  const setAllowanceOfContractFunction = erc20Contract.setAllowanceOf({
    amount,
    contractAddress: contractAddresses.peggy,
    transactionOptions: getTransactionOptions({
      gasPrice: ZERO_IN_BASE.toFixed(),
      from: address,
    }),
  })

  const data = setAllowanceOfContractFunction.getABIEncodedTransactionData()
  const gas = new BigNumberInWei(
    await setAllowanceOfContractFunction.estimateGasAsync(),
  )

  return {
    from: address,
    to: tokenAddress,
    gas: new BigNumberInWei(gas.times(GAS_LIMIT_MULTIPLIER).toFixed(0))
      .toNumber()
      .toString(16),
    maxFeePerGas: new BigNumberInWei(gasPrice).toNumber().toString(16),
    maxPriorityFeePerGas: null,
    data,
  }
}

export const getPeggyTransferTx = async ({
  address,
  amount,
  network,
  ethereumChainId,
  denom,
  rpc,
  destinationAddress,
  gasPrice,
}: {
  network: Network
  ethereumChainId: EthereumChainId
  address: string
  rpc: string
  amount: string // BigNumberInWi
  denom: string
  destinationAddress: string
  gasPrice: string // BigNumberInWei
}) => {
  const web3 = createAlchemyWeb3(rpc)
  const contractAddresses = getContractAddressesForNetworkOrThrow(network)
  const contractAddress = peggyDenomToContractAddress(
    denom,
    contractAddresses.injective,
  )
  const peggyContractAddress = contractAddresses.peggy
  const contract = new PeggyContract({
    address: peggyContractAddress,
    ethereumChainId: ethereumChainId,
    web3: web3 as any,
  })
  const formattedDestinationAddress =
    getAddressFromInjectiveAddress(destinationAddress)

  const depositForContractFunction = contract.sendToCosmos({
    contractAddress,
    amount: new BigNumberInWei(amount).toFixed(),
    address: `0x${'0'.repeat(24)}${formattedDestinationAddress.slice(2)}`,
    transactionOptions: getTransactionOptions({
      gasPrice: ZERO_IN_BASE.toFixed(),
      from: address,
    }),
  })

  const data = depositForContractFunction.getABIEncodedTransactionData()
  const gas = new BigNumberInWei(
    await depositForContractFunction.estimateGasAsync(),
  )

  return {
    from: address,
    to: peggyContractAddress,
    gas: new BigNumberInWei(gas.times(GAS_LIMIT_MULTIPLIER).toFixed(0))
      .toNumber()
      .toString(16),
    maxFeePerGas: new BigNumberInWei(gasPrice).toNumber().toString(16),
    maxPriorityFeePerGas: null,
    data,
  }
}

export const fetchTokenBalanceAndAllowance = async ({
  address,
  token,
  network,
  rpc,
}: {
  address: string
  token: Token
  network: Network
  rpc: string
}): Promise<TokenWithBalance> => {
  if (token.denom.startsWith('ibc/')) {
    return {
      ...token,
      balance: new BigNumberInWei(0).toFixed(),
      allowance: new BigNumberInWei(0).toFixed(),
    }
  }

  try {
    const web3 = createAlchemyWeb3(rpc)
    const tokenBalances = await web3.alchemy.getTokenBalances(address, [
      token.address,
    ])
    const tokenBalance = tokenBalances.tokenBalances
      .filter((tokenBalance) => tokenBalance.tokenBalance)
      .find(
        (tokenBalance) =>
          (
            tokenBalance as unknown as { contractAddress: string }
          ).contractAddress.toLowerCase() === token.address.toLowerCase(),
      )
    const balance = tokenBalance ? tokenBalance.tokenBalance || 0 : 0

    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
    const allowance = await web3.alchemy.getTokenAllowance({
      owner: address,
      spender: contractAddresses.peggy,
      contract: token.address,
    })

    return {
      ...token,
      balance: new BigNumberInWei(balance || 0).toFixed(),
      allowance: new BigNumberInWei(allowance || 0).toFixed(),
    }
  } catch (e) {
    return {
      ...token,
      balance: new BigNumberInWei(0).toFixed(),
      allowance: new BigNumberInWei(0).toFixed(),
    }
  }
}
