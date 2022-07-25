import {
  BigNumberInBase,
  convertTimestampToMilliseconds,
} from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import {
  CosmosTxResponse,
  KeplrWalletEvents,
  KeplrWalletResponse,
  KeplrWalletSendPacketAttribute,
  TerraWalletResponse,
} from '../../types/cosmos'
import {
  IBCTransferTx,
  PeggyDepositTx,
  PeggyWithdrawalTx,
  BridgeTransactionState,
  PeggyTxResponse,
  UiBridgeTransaction,
} from './../../types/bridge'
import { UserDeposit } from '@injectivelabs/sdk-ts/dist/client'
import {
  getExplorerUrl,
  getCosmosExplorerUrl,
  getEthereumExplorerUrl,
  getTerraExplorerUrl,
  FailedStates,
  findEthereumTransactionByNonce,
  findEthereumTransactionByTxHash,
  findEthereumTransactionByTxHashes,
  findIBCTransactionByTimeoutTimestamp,
  txNotPartOfInjectivePeggyTxs,
  getCachedIBCTransactionState,
  ibcTxNotPartOfInjectiveIbcTxs,
  txNotPartOfPeggoDeposit,
  getNetworkFromSender,
} from './../../utils/bridge'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts'
import { UiBridgeTransactionWithToken } from '../../types'

export const convertKeplrToUiBridgeTransaction = async ({
  transaction,
  network,
}: {
  transaction: KeplrWalletResponse
  network: Network
}): Promise<UiBridgeTransaction | undefined> => {
  const [events] = JSON.parse(transaction.rawLog) as [KeplrWalletEvents]
  const sendPacketEvent = events.events.find(
    ({ type }: any) => type === 'send_packet',
  )

  if (!sendPacketEvent || !sendPacketEvent.attributes) {
    return undefined
  }

  const packetTimeoutTimestamp = sendPacketEvent.attributes.find(
    ({ key }: any) => key === 'packet_timeout_timestamp',
  )

  const packetData = sendPacketEvent.attributes.find(
    ({ key }: any) => key === 'packet_data',
  )

  if (!packetData || !packetTimeoutTimestamp || !packetTimeoutTimestamp.value) {
    return undefined
  }

  const { amount, denom, receiver, sender } = JSON.parse(
    packetData.value,
  ) as KeplrWalletSendPacketAttribute

  const bridgingNetwork = getNetworkFromSender(sender)

  return {
    amount,
    denom,
    receiver,
    sender,
    timestamp: Date.now(),
    txHash: transaction.transactionHash,
    explorerLink: `${getCosmosExplorerUrl(bridgingNetwork, network)}/txs/${
      transaction.transactionHash
    }`,
    state: BridgeTransactionState.Submitted,
    timeoutTimestamp: packetTimeoutTimestamp.value,
  }
}

export const convertPeggyToUiBridgeTransaction = async ({
  transaction,
  network,
  blockHeight,
}: {
  transaction: PeggyTxResponse
  network: Network
  blockHeight?: number
}): Promise<UiBridgeTransaction> => {
  const isDeposit = transaction.sender.startsWith('0x')

  return {
    blockHeight,
    bridgeFee: transaction.bridgeFee,
    denom: transaction.denom,
    amount: transaction.amount,
    receiver: transaction.receiver,
    sender: transaction.sender,
    txHash: transaction.txHash,
    explorerLink: isDeposit
      ? `${getEthereumExplorerUrl(network)}/tx/${transaction.txHash}`
      : `${getExplorerUrl(network)}/transaction/${transaction.txHash}/`,
    timestamp: Date.now(),
    state: BridgeTransactionState.Submitted,
  }
}

export const convertInjectiveIBCToUiBridgeTransaction = async ({
  transaction,
  network,
}: {
  transaction: CosmosTxResponse
  network: Network
}): Promise<UiBridgeTransaction> => ({
  denom: transaction.denom,
  amount: transaction.amount,
  receiver: transaction.receiver,
  sender: transaction.sender,
  txHash: transaction.txHash,
  explorerLink: `${getExplorerUrl(network)}/transaction/${transaction.txHash}/`,
  timeoutTimestamp: transaction.timeoutTimestamp,
  timestamp: Date.now(),
  state: BridgeTransactionState.Submitted,
})

export const convertPeggoToUiBridgeTransaction = async ({
  transaction,
  network,
}: {
  transaction: UserDeposit
  network: Network
}): Promise<UiBridgeTransaction> => {
  const txHash = transaction.id.slice(0, 66)
  const receiver = transaction.destination.replace(
    '0x000000000000000000000000',
    '0x',
  )

  return {
    txHash,
    amount: transaction.amount,
    blockHeight: transaction.blockHeight,
    denom: transaction.tokenContract,
    nonce: transaction.eventNonce,
    explorerLink: `${getEthereumExplorerUrl(network)}/tx/${txHash}`,
    receiver: getInjectiveAddress(receiver),
    sender: transaction.sender,
    timestamp: convertTimestampToMilliseconds(transaction.timestamp),
    state: BridgeTransactionState.EthereumConfirming,
  }
}

export const convertTerraToUiBridgeTransaction = async ({
  transaction,
  network,
}: {
  transaction: TerraWalletResponse
  network: Network
}) => {
  const {
    receiver,
    sender,
    timeout_timestamp: timeoutTimestamp,
    token: { amount, denom },
  } = transaction.msgs[0]

  return {
    amount: amount.toString(),
    denom,
    receiver,
    sender,
    timeoutTimestamp,
    timestamp: Date.now(),
    state: BridgeTransactionState.Submitted,
    txHash: transaction.result.txhash,
    explorerLink: `${getTerraExplorerUrl(network)}/tx/${
      transaction.result.txhash
    }`,
  }
}

export const convertIBCTransferTxToUiBridgeTransaction = async ({
  transaction,
  network,
}: {
  transaction: IBCTransferTx
  network: Network
}): Promise<UiBridgeTransaction> => {
  const txHash = transaction.txHashesList[0]
  const denom = transaction.denom.includes('transfer/channel')
    ? (transaction.denom.split('/').pop() as string)
    : transaction.denom

  return {
    amount: transaction.amount,
    denom,
    receiver: transaction.receiver,
    sender: transaction.sender,
    txHash: txHash || '',
    txHashes: transaction.txHashesList,
    explorerLink: txHash
      ? `${getExplorerUrl(network)}/transaction/${txHash}/`
      : '',
    timestamp: Date.parse(transaction.createdAt),
    state: transaction.state as BridgeTransactionState,
    timeoutTimestamp: transaction.timeoutTimestamp.toString(),
  }
}

export const convertPeggyDepositTxToUiBridgeTransaction = async ({
  transaction,
  network,
}: {
  transaction: PeggyDepositTx
  network: Network
}): Promise<UiBridgeTransaction> => {
  const isFailedOrCancelled = FailedStates.includes(
    transaction.state as BridgeTransactionState,
  )

  const txHash = isFailedOrCancelled
    ? transaction.txHashesList.pop()
    : transaction.txHashesList[0]

  return {
    amount: transaction.amount,
    denom: transaction.denom,
    receiver: transaction.receiver,
    sender: transaction.sender,
    txHash: txHash || '',
    txHashes: transaction.txHashesList,
    explorerLink: txHash
      ? `${getExplorerUrl(network)}/transaction/${txHash}/`
      : '',
    timestamp: Date.parse(transaction.createdAt),
    state: transaction.state as BridgeTransactionState,
    blockHeight: transaction.eventHeight,
    nonce: transaction.eventNonce,
  }
}

export const convertPeggyWithdrawalTxToUiBridgeTransaction = async ({
  transaction,
  network,
}: {
  transaction: PeggyWithdrawalTx
  network: Network
}): Promise<UiBridgeTransaction> => {
  const isFailedOrCancelled = FailedStates.includes(
    transaction.state as BridgeTransactionState,
  )

  const txHash = isFailedOrCancelled
    ? transaction.txHashesList.pop()
    : transaction.txHashesList[0]

  const amountIncludingBridgeFee = new BigNumberInBase(transaction.amount)
    .plus(new BigNumberInBase(transaction.bridgeFee))
    .toString()

  return {
    amount: amountIncludingBridgeFee,
    bridgeFee: transaction.bridgeFee,
    denom: transaction.denom,
    receiver: transaction.receiver,
    sender: transaction.sender,
    txHash: txHash || '',
    txHashes: transaction.txHashesList,
    explorerLink: txHash
      ? `${getExplorerUrl(network)}/transaction/${txHash}/`
      : '',
    timestamp: Date.parse(transaction.createdAt),
    state: transaction.state as BridgeTransactionState,
    blockHeight: transaction.eventHeight,
    nonce: transaction.eventNonce,
  }
}

export const computeLatestTransactions = ({
  latestTransactions = [],
  peggoUserDeposits = [],
  ibcTransferBridgeTransactions = [],
  peggyDepositBridgeTransactions = [],
  peggyWithdrawalBridgeTransactions = [],
}: {
  latestTransactions?: UiBridgeTransaction[]
  peggoUserDeposits?: UiBridgeTransaction[]
  ibcTransferBridgeTransactions?: UiBridgeTransaction[]
  peggyDepositBridgeTransactions?: UiBridgeTransaction[]
  peggyWithdrawalBridgeTransactions?: UiBridgeTransaction[]
}): UiBridgeTransaction[] =>
  latestTransactions
    .map((transaction: UiBridgeTransaction) => {
      const isEthereumTx =
        transaction.sender.startsWith('0x') ||
        transaction.receiver.startsWith('0x')

      if (isEthereumTx) {
        return transaction
      }

      return {
        ...transaction,
        state: getCachedIBCTransactionState(transaction),
      }
    })
    .filter(ibcTxNotPartOfInjectiveIbcTxs(ibcTransferBridgeTransactions))
    .filter(txNotPartOfPeggoDeposit(peggoUserDeposits))
    .filter(
      txNotPartOfInjectivePeggyTxs([
        ...peggyDepositBridgeTransactions,
        ...peggyWithdrawalBridgeTransactions,
      ]),
    )

export const mergeAllTransactions = ({
  latestTransactions = [],
  peggoUserDeposits = [],
  ibcTransferBridgeTransactions = [],
  peggyDepositBridgeTransactions = [],
  peggyWithdrawalBridgeTransactions = [],
}: {
  latestTransactions?: UiBridgeTransaction[]
  peggoUserDeposits?: UiBridgeTransaction[]
  ibcTransferBridgeTransactions?: UiBridgeTransaction[]
  peggyDepositBridgeTransactions?: UiBridgeTransaction[]
  peggyWithdrawalBridgeTransactions?: UiBridgeTransaction[]
}): UiBridgeTransaction[] => {
  const filteredPeggoUserDeposits = peggoUserDeposits.filter(
    txNotPartOfInjectivePeggyTxs(peggyDepositBridgeTransactions),
  )

  return [
    ...latestTransactions,
    ...filteredPeggoUserDeposits,
    ...ibcTransferBridgeTransactions,
    ...peggyDepositBridgeTransactions,
    ...peggyWithdrawalBridgeTransactions,
  ]
}

export const getLatestSelectedTransaction = ({
  selectedTransaction,
  peggoUserDeposits,
  transactions,
}: {
  selectedTransaction: UiBridgeTransaction
  peggoUserDeposits: UiBridgeTransaction[]
  transactions: UiBridgeTransaction[]
}): UiBridgeTransaction => {
  if (!selectedTransaction.receiver || !selectedTransaction.sender) {
    return selectedTransaction
  }

  const newSelectedTransaction =
    peggoUserDeposits.find((peggoTransaction) =>
      findEthereumTransactionByTxHash(peggoTransaction, selectedTransaction),
    ) || selectedTransaction

  const selectedTransactionExistInTransactions = transactions.find(
    (transaction: UiBridgeTransaction) =>
      findEthereumTransactionByNonce(transaction, newSelectedTransaction) ||
      findEthereumTransactionByTxHashes(transaction, newSelectedTransaction) ||
      findIBCTransactionByTimeoutTimestamp(transaction, newSelectedTransaction),
  )

  return selectedTransactionExistInTransactions || newSelectedTransaction
}

/**
 * BE returns 2 in progress transaction
 **/
export const removeDuplicatedTransactionByTxHash = (
  ibcTransferBridgeTransactions: UiBridgeTransactionWithToken[],
) => {
  const filteredList = ibcTransferBridgeTransactions.reduce(
    (
      list: Record<string, UiBridgeTransactionWithToken>,
      transaction: UiBridgeTransactionWithToken,
    ) => {
      if (!transaction.txHashes || transaction.txHashes.length === 0) {
        return list
      }

      const initialTxHash = transaction.txHashes[0]

      if (!list[initialTxHash]) {
        list[initialTxHash] = transaction
      } else if (transaction.state === BridgeTransactionState.Completed) {
        list[initialTxHash] = transaction
      }

      return Object.assign({}, list)
    },
    {} as Record<string, UiBridgeTransactionWithToken>,
  )

  return Object.values(filteredList)
}

/**
 * remove stuck in progress transactions
 **/
export const removeDuplicatedInProgressIbxTransfers = (
  ibcTransferBridgeTransactions: UiBridgeTransactionWithToken[],
): UiBridgeTransactionWithToken[] => {
  const transactions = removeDuplicatedTransactionByTxHash(
    ibcTransferBridgeTransactions,
  )

  return transactions.filter(({ txHashes, state }) => {
    if (state !== BridgeTransactionState.Submitted) {
      return true
    }

    const [txHash] = txHashes as string[]

    return (
      transactions.find(
        (transaction) =>
          transaction.state !== BridgeTransactionState.Submitted &&
          transaction.txHashes?.includes(txHash),
      ) === undefined
    )
  })
}

export class UiBridgeTransformer {
  private network: Network

  constructor(network: Network) {
    this.network = network
  }

  static getNetworkFromSender = getNetworkFromSender

  static computeLatestTransactions = computeLatestTransactions

  static mergeAllTransactions = mergeAllTransactions

  static getLatestSelectedTransaction = getLatestSelectedTransaction

  static removeDuplicatedTransactionByTxHash =
    removeDuplicatedTransactionByTxHash

  static removeDuplicatedInProgressIbxTransfers =
    removeDuplicatedInProgressIbxTransfers

  async convertKeplrToUiBridgeTransaction(transaction: KeplrWalletResponse) {
    return convertKeplrToUiBridgeTransaction({
      transaction,
      network: this.network,
    })
  }

  async convertPeggyToUiBridgeTransaction(
    transaction: PeggyTxResponse,
    blockHeight?: number,
  ) {
    return convertPeggyToUiBridgeTransaction({
      transaction,
      blockHeight,
      network: this.network,
    })
  }

  async convertInjectiveIBCToUiBridgeTransaction(
    transaction: CosmosTxResponse,
  ) {
    return convertInjectiveIBCToUiBridgeTransaction({
      transaction,
      network: this.network,
    })
  }

  async convertPeggoToUiBridgeTransaction(transaction: UserDeposit) {
    return convertPeggoToUiBridgeTransaction({
      transaction,
      network: this.network,
    })
  }

  async convertTerraToUiBridgeTransaction(transaction: TerraWalletResponse) {
    return convertTerraToUiBridgeTransaction({
      transaction,
      network: this.network,
    })
  }

  async convertIBCTransferTxToUiBridgeTransaction(transaction: IBCTransferTx) {
    return convertIBCTransferTxToUiBridgeTransaction({
      transaction,
      network: this.network,
    })
  }

  async convertPeggyDepositTxToUiBridgeTransaction(
    transaction: PeggyDepositTx,
  ) {
    return convertPeggyDepositTxToUiBridgeTransaction({
      transaction,
      network: this.network,
    })
  }

  async convertPeggyWithdrawalTxToUiBridgeTransaction(
    transaction: PeggyWithdrawalTx,
  ) {
    return convertPeggyWithdrawalTxToUiBridgeTransaction({
      transaction,
      network: this.network,
    })
  }
}
