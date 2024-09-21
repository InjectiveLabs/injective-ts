import {
  BigNumberInBase,
  convertTimestampToMilliseconds,
} from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import {
  CosmosTxResponse,
  KeplrWalletEvents,
  KeplrWalletResponse,
  TerraWalletResponse,
  KeplrWalletSendPacketAttribute,
} from '../../types/cosmos'
import {
  IBCTransferTx,
  PeggyDepositTx,
  BridgingNetwork,
  PeggyTxResponse,
  PeggyWithdrawalTx,
  MoonbeamTxResponse,
  WormholeTxResponse,
  UiBridgeTransaction,
  BridgeTransactionState,
} from './../../types/bridge'
import { UserDeposit } from '@injectivelabs/sdk-ts'
import {
  FailedStates,
  getExplorerUrl,
  getTerraExplorerUrl,
  getCosmosExplorerUrl,
  getSolanaExplorerUrl,
  getNetworkFromAddress,
  getEthereumExplorerUrl,
  getArbitrumExplorerUrl,
  getBridgeTransactionType,
  getPolygonExplorerUrl,
  CosmosNetworks,
} from './../../utils/bridge'
import {
  txNotPartOfPeggoDeposit,
  getCachedIBCTransactionState,
  txNotPartOfInjectivePeggyTxs,
  ibcTxNotPartOfInjectiveIbcTxs,
  findEthereumTransactionByNonce,
  findEthereumTransactionByTxHash,
  findEthereumTransactionByTxHashes,
  findIBCTransactionByTimeoutTimestamp,
} from './../utils/bridge'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts'

export const convertCosmosWalletToUiBridgeTransaction = async ({
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

  const bridgingNetwork = getNetworkFromAddress(sender)

  const txPath = bridgingNetwork === BridgingNetwork.Andromeda ? 'tx' : 'txs'

  return {
    amount,
    denom,
    receiver,
    sender,
    type: getBridgeTransactionType(bridgingNetwork, BridgingNetwork.Injective),
    timestamp: Date.now(),
    txHash: transaction.transactionHash,
    explorerLink: `${getCosmosExplorerUrl(
      bridgingNetwork,
      network,
    )}/${txPath}/${transaction.transactionHash}`,
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
    type: isDeposit
      ? getBridgeTransactionType(
          BridgingNetwork.Ethereum,
          BridgingNetwork.Injective,
        )
      : getBridgeTransactionType(
          BridgingNetwork.Injective,
          BridgingNetwork.Ethereum,
        ),
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
}): Promise<UiBridgeTransaction> => {
  const bridgingNetwork = getNetworkFromAddress(transaction.receiver)

  return {
    type: getBridgeTransactionType(BridgingNetwork.Injective, bridgingNetwork),
    denom: transaction.denom,
    amount: transaction.amount,
    receiver: transaction.receiver,
    sender: transaction.sender,
    txHash: transaction.txHash,
    explorerLink: `${getExplorerUrl(network)}/transaction/${
      transaction.txHash
    }/`,
    timeoutTimestamp: transaction.timeoutTimestamp,
    timestamp: Date.now(),
    state: BridgeTransactionState.Submitted,
  }
}

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
    type: getBridgeTransactionType(
      BridgingNetwork.Ethereum,
      BridgingNetwork.Injective,
    ),
    amount: transaction.amount,
    blockHeight: transaction.blockHeight,
    denom: `peggy${transaction.tokenContract}`,
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
    denom,
    sender,
    receiver,
    timeoutTimestamp,
    type: getBridgeTransactionType(
      BridgingNetwork.Terra,
      BridgingNetwork.Injective,
    ),
    amount: amount.toString(),
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
    ? (transaction.denom.split('/').slice(2).join('/') as string)
    : transaction.denom
  const destinationBridgingNetwork = getNetworkFromAddress(transaction.receiver)
  const originBridgingNetwork = getNetworkFromAddress(transaction.sender)

  return {
    denom,
    type: getBridgeTransactionType(
      originBridgingNetwork,
      destinationBridgingNetwork,
    ),
    amount: transaction.amount,
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
    type: getBridgeTransactionType(
      BridgingNetwork.Ethereum,
      BridgingNetwork.Injective,
    ),
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
    type: getBridgeTransactionType(
      BridgingNetwork.Injective,
      BridgingNetwork.Ethereum,
    ),
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

export const convertMoonbeamToUiBridgeTransaction = async (
  transaction: MoonbeamTxResponse,
): Promise<UiBridgeTransaction> => {
  return {
    type: getBridgeTransactionType(
      BridgingNetwork.Moonbeam,
      BridgingNetwork.Injective,
    ),
    denom: transaction.denom,
    amount: transaction.amount,
    receiver: transaction.receiver,
    sender: transaction.sender,
    txHash: transaction.txHash,
    explorerLink: transaction.explorerLink || '',
    timestamp: new BigNumberInBase(
      Math.floor(new BigNumberInBase(Date.now()).div(1000).toNumber()),
    )
      .times(1000)
      .toNumber(),
    state: BridgeTransactionState.Confirming,
  }
}

export const convertWormholeToUiBridgeTransaction = async ({
  transaction,
  network,
}: {
  transaction: WormholeTxResponse
  network: Network
}): Promise<UiBridgeTransaction> => {
  const isArbitrumTransfer =
    transaction.source === BridgingNetwork.Arbitrum ||
    transaction.destination === BridgingNetwork.Arbitrum
  const isEthereumWhTransfer =
    transaction.source === BridgingNetwork.EthereumWh ||
    transaction.destination === BridgingNetwork.EthereumWh
  const isSolanaTransfer =
    transaction.source === BridgingNetwork.Solana ||
    transaction.destination === BridgingNetwork.Solana
  const isPolygonTransfer =
    transaction.source === BridgingNetwork.Polygon ||
    transaction.destination === BridgingNetwork.Polygon
  const isEthereumDeposit = transaction.source === BridgingNetwork.EthereumWh
  const isSolanaDeposit = transaction.source === BridgingNetwork.Solana
  const isArbitrumDeposit = transaction.source === BridgingNetwork.Arbitrum
  const isPolygonDeposit = transaction.source === BridgingNetwork.Polygon

  const solanaWhExplorerLink = isSolanaDeposit
    ? `${getSolanaExplorerUrl(network)}/tx/${transaction.txHash}`
    : `${getExplorerUrl(network)}/transaction/${transaction.txHash}/`

  const ethereumWhExplorerLink = isEthereumDeposit
    ? `${getEthereumExplorerUrl(network)}/tx/${transaction.txHash}`
    : `${getExplorerUrl(network)}/transaction/${transaction.txHash}/`

  const arbitrumExplorerLink = isArbitrumDeposit
    ? `${getArbitrumExplorerUrl(network)}/tx/${transaction.txHash}`
    : `${getExplorerUrl(network)}/transaction/${transaction.txHash}/`

  const polygonExplorerLink = isPolygonDeposit
    ? `${getPolygonExplorerUrl(network)}/tx/${transaction.txHash}`
    : `${getExplorerUrl(network)}/transaction/${transaction.txHash}/`

  const getWhExplorerLink = () => {
    if (isSolanaTransfer) {
      return solanaWhExplorerLink
    }

    if (isArbitrumTransfer) {
      return arbitrumExplorerLink
    }

    if (isPolygonTransfer) {
      return polygonExplorerLink
    }

    if (isEthereumWhTransfer) {
      return ethereumWhExplorerLink
    }

    return transaction.explorerLink || ''
  }

  const explorerLink = getWhExplorerLink()

  return {
    type: getBridgeTransactionType(transaction.source, transaction.destination),
    denom: transaction.denom,
    amount: transaction.amount,
    receiver: transaction.receiver,
    sender: transaction.sender,
    txHash: transaction.txHash,
    explorerLink,
    timestamp: new BigNumberInBase(
      Math.floor(new BigNumberInBase(Date.now()).div(1000).toNumber()),
    )
      .times(1000)
      .toNumber(),
    state: BridgeTransactionState.Confirming,
  }
}

/**
 * @deprecated - way to abstract for usage
 */
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
      const [origin, destination] = transaction.type.split('-') as [
        BridgingNetwork,
        BridgingNetwork,
      ]
      const isIBCTransaction =
        CosmosNetworks.includes(origin) || CosmosNetworks.includes(destination)

      if (!isIBCTransaction) {
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

export class UiBridgeTransformer {
  private network: Network

  constructor(network: Network) {
    this.network = network
  }

  static getNetworkFromAddress = getNetworkFromAddress

  static mergeAllTransactions = ({
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

  /**
   * We use this method to update the
   * current transaction state based on
   * the transactions fetched from the API
   */
  static getLatestSelectedTransaction = ({
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
        findEthereumTransactionByTxHashes(
          transaction,
          newSelectedTransaction,
        ) ||
        findIBCTransactionByTimeoutTimestamp(
          transaction,
          newSelectedTransaction,
        ),
    )

    return selectedTransactionExistInTransactions || newSelectedTransaction
  }

  /**
   * BE returns 2 in progress transaction
   **/
  static removeDuplicatedTransactionByTxHash = (
    ibcTransferBridgeTransactions: UiBridgeTransaction[],
  ) => {
    const filteredList = ibcTransferBridgeTransactions.reduce(
      (
        list: Record<string, UiBridgeTransaction>,
        transaction: UiBridgeTransaction,
      ) => {
        if (!transaction.txHashes || transaction.txHashes.length === 0) {
          return list
        }

        const initialTxHash = transaction.txHashes[0]

        if (!list[initialTxHash]) {
          list[initialTxHash] = transaction
        } else if (
          [
            BridgeTransactionState.Completed,
            BridgeTransactionState.Failed,
          ].includes(transaction.state)
        ) {
          list[initialTxHash] = transaction
        }

        return Object.assign({}, list)
      },
      {} as Record<string, UiBridgeTransaction>,
    )

    return Object.values(filteredList)
  }

  /**
   * remove stuck in progress transactions
   **/
  static removeDuplicatedInProgressIbxTransfers = (
    ibcTransferBridgeTransactions: UiBridgeTransaction[],
  ): UiBridgeTransaction[] => {
    const transactions =
      UiBridgeTransformer.removeDuplicatedTransactionByTxHash(
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

  async convertCosmosWalletToUiBridgeTransaction(
    transaction: KeplrWalletResponse,
  ) {
    return convertCosmosWalletToUiBridgeTransaction({
      transaction,
      network: this.network,
    })
  }

  async convertMoonbeamToUiBridgeTransaction(transaction: MoonbeamTxResponse) {
    return convertMoonbeamToUiBridgeTransaction(transaction)
  }

  async convertWormholeToUiBridgeTransaction(transaction: WormholeTxResponse) {
    return convertWormholeToUiBridgeTransaction({
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
