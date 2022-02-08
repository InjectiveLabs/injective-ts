import { convertTimestampToMilliseconds } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import {
  UiBridgeTransaction,
  BridgeTransactionState,
  BridgingNetwork,
  MintScanExplorerUrl,
} from './types'

const sameTxHash = (txHashOne: string, txHashTwo: string) =>
  txHashOne.replace('0x', '').toLowerCase() ===
  txHashTwo.replace('0x', '').toLowerCase()

export const getCachedIBCTransactionState = (
  transaction: UiBridgeTransaction,
): BridgeTransactionState => {
  if (
    transaction.timeoutTimestamp &&
    transaction.state === BridgeTransactionState.Submitted
  ) {
    const now = Date.now()
    const bufferTime = 60 * 1000 // hardcode to 1 minute
    const timeoutTimestampWithBuffer =
      convertTimestampToMilliseconds(
        parseInt(transaction.timeoutTimestamp, 10),
      ) + bufferTime

    if (now >= timeoutTimestampWithBuffer) {
      return BridgeTransactionState.Failed
    }

    return BridgeTransactionState.Submitted
  }

  return transaction.state as BridgeTransactionState
}

export const findEthereumTransactionByNonce = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.nonce &&
  comparingTransaction.nonce &&
  transaction.nonce === comparingTransaction.nonce

export const findEthereumTransactionByTxHash = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.txHash &&
  comparingTransaction.txHash &&
  sameTxHash(transaction.txHash, comparingTransaction.txHash)

export const findEthereumTransactionByTxHashes = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.txHashes &&
  transaction.txHashes.find((hash: string) =>
    sameTxHash(hash, comparingTransaction.txHash),
  ) !== undefined

export const findIBCTransactionByTimeoutTimestamp = (
  transaction: UiBridgeTransaction,
  comparingTransaction: UiBridgeTransaction,
) =>
  transaction.sender === comparingTransaction.sender &&
  transaction.receiver === comparingTransaction.receiver &&
  transaction.timeoutTimestamp &&
  comparingTransaction.timeoutTimestamp &&
  transaction.timeoutTimestamp.toString() ===
    comparingTransaction.timeoutTimestamp.toString()

export const ibcTxNotPartOfInjectiveIbcTxs =
  (injectiveIbcTransactions: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    injectiveIbcTransactions.find((injectiveIbcTransaction) =>
      findIBCTransactionByTimeoutTimestamp(
        injectiveIbcTransaction,
        transaction,
      ),
    ) === undefined

export const txNotPartOfPeggoDeposit =
  (peggoDepositTxs: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    peggoDepositTxs.find((peggoDepositTx) =>
      findEthereumTransactionByTxHash(peggoDepositTx, transaction),
    ) === undefined

export const txNotPartOfInjectivePeggyTxs =
  (injectivePeggyTransactions: UiBridgeTransaction[]) =>
  (transaction: UiBridgeTransaction) =>
    injectivePeggyTransactions.find(
      (injectiveTransaction) =>
        findEthereumTransactionByNonce(injectiveTransaction, transaction) ||
        findEthereumTransactionByTxHashes(injectiveTransaction, transaction),
    ) === undefined

export const getExplorerUrl = (network: Network): string => {
  switch (network) {
    case Network.Devnet:
      return 'https://devnet.explorer.injective.dev'
    case Network.Mainnet:
      return 'https://explorer.injective.network'
    case Network.Public:
      return 'https://explorer.injective.network'
    case Network.Local:
      return 'https://devnet.explorer.injective.dev'
    case Network.Testnet:
      return 'https://testnet.explorer.injective.dev'
    default:
      return 'https://explorer.injective.network'
  }
}

export const getCosmosExplorerUrl = (
  bridgingNetwork: BridgingNetwork = BridgingNetwork.CosmosHub,
  network: Network,
): string => {
  const mintScanNetworkUrl = MintScanExplorerUrl[bridgingNetwork]

  switch (network) {
    case Network.Devnet:
      return `https://dev.mintscan.io/${mintScanNetworkUrl}-testnet`
    case Network.Mainnet:
      return `https://www.mintscan.io/${mintScanNetworkUrl}`
    case Network.Public:
      return `https://www.mintscan.io/${mintScanNetworkUrl}`
    case Network.Local:
      return `https://dev.mintscan.io/${mintScanNetworkUrl}-testnet`
    case Network.Testnet:
      return `https://testnet.mintscan.io/${mintScanNetworkUrl}-testnet`
    default:
      return `https://www.mintscan.io/${mintScanNetworkUrl}`
  }
}

export const getEthereumExplorerUrl = (network: Network): string => {
  switch (network) {
    case Network.Devnet:
      return 'https://kovan.etherscan.io'
    case Network.Mainnet:
      return 'https://etherscan.io'
    case Network.Public:
      return 'https://etherscan.io'
    case Network.Local:
      return 'https://kovan.etherscan.io'
    case Network.Testnet:
      return 'https://kovan.etherscan.io'
    default:
      return 'https://etherscan.io'
  }
}

export const getTerraExplorerUrl = (network: Network): string => {
  switch (network) {
    case Network.Devnet:
      return 'https://finder.terra.money/localterra'
    case Network.Mainnet:
      return 'https://finder.terra.money/mainnet'
    case Network.Public:
      return 'https://finder.terra.money/mainnet'
    case Network.Local:
      return 'https://finder.terra.money/localterra'
    case Network.Testnet:
      return 'https://finder.terra.money/testnet/'
    default:
      return 'https://finder.terra.money/mainnet'
  }
}
