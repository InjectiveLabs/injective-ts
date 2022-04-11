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
  PeggyTxResponse,
} from '../../types'
import {
  IBCTransferTx,
  PeggyDepositTx,
  PeggyWithdrawalTx,
  BridgeTransactionState,
  BridgingNetwork,
  UiBridgeTransaction,
} from './types'
import { UserDeposit } from './gql/types'
import {
  getExplorerUrl,
  getCosmosExplorerUrl,
  getEthereumExplorerUrl,
  getTerraExplorerUrl,
} from './utils'
import { getInjectiveAddress } from '../../utils'
import { FailedStates } from './data'

export const getNetworkFromSender = (sender: string): BridgingNetwork => {
  if (sender.startsWith('juno')) {
    return BridgingNetwork.Juno
  }

  if (sender.startsWith('terra')) {
    return BridgingNetwork.Terra
  }

  if (sender.startsWith('osmo')) {
    return BridgingNetwork.Osmosis
  }

  if (sender.startsWith('chihuahua')) {
    return BridgingNetwork.Chihuahua
  }

  if (sender.startsWith('axelar')) {
    return BridgingNetwork.Axelar
  }

  return BridgingNetwork.CosmosHub
}

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
      : `${getExplorerUrl(network)}/transaction/${transaction.txHash}`,
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
  explorerLink: `${getExplorerUrl(network)}/transaction/${transaction.txHash}`,
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
      ? `${getExplorerUrl(network)}/transaction/${txHash}`
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
      ? `${getExplorerUrl(network)}/transaction/${txHash}`
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
      ? `${getExplorerUrl(network)}/transaction/${txHash}`
      : '',
    timestamp: Date.parse(transaction.createdAt),
    state: transaction.state as BridgeTransactionState,
    blockHeight: transaction.eventHeight,
    nonce: transaction.eventNonce,
  }
}

export class BridgeTransformer {
  private network: Network

  constructor(network: Network) {
    this.network = network
  }

  static getNetworkFromSender = getNetworkFromSender

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
