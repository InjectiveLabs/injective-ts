import { toBigNumber, toHumanReadable } from '@injectivelabs/utils'
import {
  uint8ArrayToString,
  grpcPagingToPagingV2,
} from '../../../utils/index.js'
import {
  isJsonString,
  bigIntToNumber,
  bigIntToString,
} from '../../../utils/helpers.js'
import type { BigNumber } from '@injectivelabs/utils'
import type * as InjectiveExplorerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb'
import type {
  Block,
  GasFee,
  Message,
  GrpcGasFee,
  Transaction,
  BlockWithTxs,
  IBCTransferTx,
  ExplorerStats,
  PeggyDepositTx,
  ValidatorUptime,
  ExplorerValidator,
  PeggyWithdrawalTx,
  GrpcIBCTransferTx,
  GrpcPeggyDepositTx,
  GrpcValidatorUptime,
  ExplorerTransaction,
  ContractTransaction,
  GrpcPeggyWithdrawalTx,
  BankMsgSendTransaction,
  GrpcBankMsgSendMessage,
  ValidatorSlashingEvent,
  IndexerStreamTransaction,
  GrpcValidatorSlashingEvent,
  ExplorerValidatorDescription,
  GrpcIndexerValidatorDescription,
} from '../types/explorer.js'

const ZERO_IN_BASE = toBigNumber(0)

type ContractTxV2Message = {
  type?: string
  value?: { msg?: unknown }
}

type TransactionV2Message = {
  type: string
  value: unknown
}

const isContractTxV2Message = (
  message: unknown,
): message is ContractTxV2Message =>
  !!message && typeof message === 'object' && 'type' in message

const isTransactionV2Message = (
  message: unknown,
): message is TransactionV2Message =>
  !!message &&
  typeof message === 'object' &&
  typeof (message as { type?: unknown }).type === 'string' &&
  Object.prototype.hasOwnProperty.call(message, 'value')

const getContractTransactionV2Amount = (
  ApiTransaction: InjectiveExplorerRpcPb.TxDetailData,
): BigNumber => {
  const messages = parseStringToObjectLikeNoThrow<unknown>(
    ApiTransaction.messages,
  )
  const [message] = Array.isArray(messages) ? messages : []

  if (
    !isContractTxV2Message(message) ||
    !message.type?.includes('MsgExecuteContract')
  ) {
    return ZERO_IN_BASE
  }

  const msg = message.value?.msg

  if (typeof msg === 'string' && !isJsonString(msg)) {
    return ZERO_IN_BASE
  }

  const msgObj =
    typeof msg === 'string'
      ? parseStringToObjectLikeNoThrow<Record<string, any> | undefined>(
          msg,
          undefined,
        )
      : msg

  if (!msgObj || typeof msgObj !== 'object' || !('transfer' in msgObj)) {
    return ZERO_IN_BASE
  }

  const transfer = msgObj.transfer as { amount?: string }

  return transfer?.amount ? toHumanReadable(transfer.amount) : ZERO_IN_BASE
}

const parseStringToObjectLikeNoThrow = <T = any[]>(
  object: string | Uint8Array<ArrayBufferLike>,
  defaultValue: T = [] as T,
): T => {
  if (!object) {
    return defaultValue
  }

  if (typeof object === 'string') {
    try {
      return JSON.parse(object) as T
    } catch {
      return defaultValue
    }
  }

  try {
    return JSON.parse(uint8ArrayToString(object)) as T
  } catch {
    return defaultValue
  }
}

const transactionV2MessagesToMessagesNoThrow = (messages: any): Message[] => {
  const messagesArray = parseStringToObjectLikeNoThrow(messages)
  const wellFormedMessages = Array.isArray(messagesArray)
    ? messagesArray.filter(isTransactionV2Message)
    : []

  return wellFormedMessages.map(
    (msg) =>
      ({
        type: msg.type,
        message: msg.value,
      }) as Message,
  )
}

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcExplorerTransformer {
  static getTxByTxHashResponseToTx(
    tx: InjectiveExplorerRpcPb.GetTxByTxHashResponse,
  ): Transaction {
    return IndexerGrpcExplorerTransformer.grpcTransactionToTransaction(tx)
  }

  static getAccountTxsResponseToAccountTxs(
    response: InjectiveExplorerRpcPb.GetAccountTxsResponse,
  ) {
    const txs = response.data
    const pagination = response.paging

    return {
      txs: IndexerGrpcExplorerTransformer.grpcTransactionsToTransactionsFromDetail(
        txs,
      ),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static getValidatorUptimeResponseToValidatorUptime(
    response: InjectiveExplorerRpcPb.GetValidatorUptimeResponse,
  ) {
    const data = response.data

    return data.map((field) =>
      IndexerGrpcExplorerTransformer.grpcValidatorUptimeToValidatorUptime(
        field,
      ),
    )
  }

  static getPeggyDepositTxsResponseToPeggyDepositTxs(
    response: InjectiveExplorerRpcPb.GetPeggyDepositTxsResponse,
  ) {
    return response.field.map((field) =>
      IndexerGrpcExplorerTransformer.grpcPeggyDepositTx(field),
    )
  }

  static getPeggyWithdrawalTxsResponseToPeggyWithdrawalTxs(
    response: InjectiveExplorerRpcPb.GetPeggyWithdrawalTxsResponse,
  ) {
    return response.field.map((field) =>
      IndexerGrpcExplorerTransformer.grpcPeggyWithdrawalTx(field),
    )
  }

  static getIBCTransferTxsResponseToIBCTransferTxs(
    response: InjectiveExplorerRpcPb.GetIBCTransferTxsResponse,
  ) {
    return response.field.map((field) =>
      IndexerGrpcExplorerTransformer.grpcIBCTransferTxToIBCTransferTx(field),
    )
  }

  static validatorResponseToValidator(
    validator: InjectiveExplorerRpcPb.GetValidatorResponse,
  ): ExplorerValidator {
    const data = validator.data!

    return {
      id: data.id,
      moniker: data.moniker,
      operatorAddress: data.operatorAddress,
      consensusAddress: data.consensusAddress,
      jailed: data.jailed,
      status: data.status,
      tokens: data.tokens,
      delegatorShares: data.delegatorShares,
      description:
        IndexerGrpcExplorerTransformer.grpcValidatorDescriptionToValidatorDescription(
          data.description!,
        ),
      unbondingHeight: bigIntToNumber(data.unbondingHeight),
      unbondingTime: data.unbondingTime,
      commissionRate: data.commissionRate,
      commissionMaxRate: data.commissionMaxRate,
      commissionMaxChangeRate: data.commissionMaxChangeRate,
      commissionUpdateTime: data.commissionUpdateTime,
      signed: bigIntToNumber(data.signed),
      missed: bigIntToNumber(data.missed),
      proposed: bigIntToNumber(data.proposed),
      uptimePercentage: data.uptimePercentage,
      imageUrl: data.imageUrl,
      timestamp: data.timestamp,
      uptimesList: data.uptimes.map(
        IndexerGrpcExplorerTransformer.grpcValidatorUptimeToValidatorUptime,
      ),
      slashingEventsList: data.slashingEvents.map(
        IndexerGrpcExplorerTransformer.grpcValidatorSlashingEventToValidatorSlashingEvent,
      ),
    }
  }

  static streamTxResponseToTxs(
    response: InjectiveExplorerRpcPb.StreamTxsResponse,
  ): IndexerStreamTransaction {
    return {
      id: response.id,
      hash: response.hash,
      code: response.code,
      messages: response.messages,
      errorLog: response.errorLog,
      codespace: response.codespace,
      blockTimestamp: response.blockTimestamp,
      txNumber: bigIntToNumber(response.txNumber),
      blockNumber: bigIntToNumber(response.blockNumber),
    }
  }

  static grpcGasFeeToGasFee(gasFee: GrpcGasFee): GasFee {
    const amounts = gasFee.amount.map((amount) => ({
      amount: amount.amount,
      denom: amount.denom,
    }))

    return {
      amounts,
      payer: gasFee.payer,
      granter: gasFee.granter,
      gasLimit: bigIntToNumber(gasFee.gasLimit),
    }
  }

  static grpcTransactionToBankMsgSendTransaction(
    tx: InjectiveExplorerRpcPb.GetTxByTxHashResponse,
  ): BankMsgSendTransaction {
    const data = tx.data!

    const [message] = JSON.parse(
      uint8ArrayToString(data.messages) as string,
    ) as GrpcBankMsgSendMessage[]

    return {
      hash: data.hash,
      sender: message.value.from_address,
      receiver: message.value.to_address,
      blockTimestamp: data.blockTimestamp,
      denom: message.value.amount[0].denom,
      amount: message.value.amount[0].amount,
      blockNumber: bigIntToNumber(data.blockNumber),
    }
  }

  static grpcTransactionToTransaction(
    tx: InjectiveExplorerRpcPb.GetTxByTxHashResponse,
  ): Transaction {
    const data = tx.data!

    return {
      id: data.id,
      hash: data.hash,
      code: data.code,
      info: data.info,
      data: data.data,
      txType: data.txType,
      codespace: data.codespace,
      blockTimestamp: data.blockTimestamp,
      gasUsed: bigIntToNumber(data.gasUsed),
      gasWanted: bigIntToNumber(data.gasWanted),
      blockNumber: bigIntToNumber(data.blockNumber),
      gasFee: IndexerGrpcExplorerTransformer.grpcGasFeeToGasFee(data.gasFee!),
      signatures: data.signatures.map((signature) => ({
        pubkey: signature.pubkey,
        address: signature.address,
        sequence: bigIntToNumber(signature.sequence),
        signature: signature.signature,
      })),
      events: data.events.map((event) => ({
        type: event.type,
        attributes: event.attributes,
      })),
      messages: JSON.parse(uint8ArrayToString(data.messages) as string),
    }
  }

  static grpcTransactionsToTransactions(
    txs: Array<InjectiveExplorerRpcPb.GetTxByTxHashResponse>,
  ): Array<Transaction> {
    return txs.map((tx) =>
      IndexerGrpcExplorerTransformer.grpcTransactionToTransaction(tx),
    )
  }

  static grpcTransactionToTransactionFromDetail(
    tx: InjectiveExplorerRpcPb.TxDetailData,
  ): Transaction {
    const messages = JSON.parse(uint8ArrayToString(tx.messages))

    return {
      ...tx,
      gasUsed: bigIntToNumber(tx.gasUsed),
      gasWanted: bigIntToNumber(tx.gasWanted),
      blockNumber: bigIntToNumber(tx.blockNumber),
      signatures: tx.signatures.map((signature) => ({
        pubkey: signature.pubkey,
        address: signature.address,
        signature: signature.signature,
        sequence: bigIntToNumber(signature.sequence),
      })),
      gasFee: tx.gasFee
        ? IndexerGrpcExplorerTransformer.grpcGasFeeToGasFee(tx.gasFee!)
        : {
            gasLimit: 0,
            payer: '',
            granter: '',
            amounts: [],
          },
      events: tx.events.map((event) => ({
        type: event.type,
        attributes: event.attributes,
      })),
      messages,
    }
  }

  static grpcTransactionsToTransactionsFromDetail(
    txs: InjectiveExplorerRpcPb.TxDetailData[],
  ): Array<Transaction> {
    return txs.map(
      IndexerGrpcExplorerTransformer.grpcTransactionToTransactionFromDetail,
    )
  }

  static grpcBlockToBlock(block: InjectiveExplorerRpcPb.BlockInfo): Block {
    return {
      moniker: block.moniker,
      proposer: block.proposer,
      blockHash: block.blockHash,
      timestamp: block.timestamp,
      parentHash: block.parentHash,
      height: bigIntToNumber(block.height),
      numTxs: bigIntToNumber(block.numTxs),
      numPreCommits: bigIntToNumber(block.numPreCommits),
    }
  }

  static grpcBlockToBlockWithTxs(
    block: InjectiveExplorerRpcPb.BlockInfo,
  ): BlockWithTxs {
    return {
      moniker: block.moniker,
      proposer: block.proposer,
      blockHash: block.blockHash,
      timestamp: block.timestamp,
      parentHash: block.parentHash,
      height: bigIntToNumber(block.height),
      numTxs: bigIntToNumber(block.numTxs),
      numPreCommits: bigIntToNumber(block.numPreCommits),
    }
  }

  static grpcBlocksToBlocks(
    blocks: Array<InjectiveExplorerRpcPb.BlockInfo>,
  ): Array<Block> {
    return blocks.map((block) =>
      IndexerGrpcExplorerTransformer.grpcBlockToBlock(block),
    )
  }

  static grpcBlocksToBlocksWithTxs(
    blocks: Array<InjectiveExplorerRpcPb.BlockInfo>,
  ): Array<BlockWithTxs> {
    return blocks.map((block) =>
      IndexerGrpcExplorerTransformer.grpcBlockToBlockWithTxs(block),
    )
  }

  static grpcValidatorDescriptionToValidatorDescription(
    validatorDescription: GrpcIndexerValidatorDescription,
  ): ExplorerValidatorDescription {
    return {
      moniker: validatorDescription.moniker,
      identity: validatorDescription.identity,
      website: validatorDescription.website,
      securityContact: validatorDescription.securityContact,
      details: validatorDescription.details,
    }
  }

  static grpcValidatorUptimeToValidatorUptime(
    validatorUptime: GrpcValidatorUptime,
  ): ValidatorUptime {
    return {
      status: validatorUptime.status,
      blockNumber: bigIntToNumber(validatorUptime.blockNumber),
    }
  }

  static grpcValidatorSlashingEventToValidatorSlashingEvent(
    validatorUptime: GrpcValidatorSlashingEvent,
  ): ValidatorSlashingEvent {
    return {
      reason: validatorUptime.reason,
      jailed: validatorUptime.jailed,
      address: validatorUptime.address,
      power: bigIntToNumber(validatorUptime.power),
      blockTimestamp: validatorUptime.blockTimestamp,
      blockNumber: bigIntToNumber(validatorUptime.blockNumber),
      missedBlocks: bigIntToNumber(validatorUptime.missedBlocks),
    }
  }

  static grpcIBCTransferTxToIBCTransferTx(
    grpcIBCTransferTx: GrpcIBCTransferTx,
  ): IBCTransferTx {
    return {
      denom: grpcIBCTransferTx.denom,
      state: grpcIBCTransferTx.state,
      sender: grpcIBCTransferTx.sender,
      amount: grpcIBCTransferTx.amount,
      dataHex: grpcIBCTransferTx.dataHex,
      receiver: grpcIBCTransferTx.receiver,
      createdAt: grpcIBCTransferTx.createdAt,
      updatedAt: grpcIBCTransferTx.updatedAt,
      sourcePort: grpcIBCTransferTx.sourcePort,
      txHashesList: grpcIBCTransferTx.txHashes,
      sourceChannel: grpcIBCTransferTx.sourceChannel,
      timeoutHeight: grpcIBCTransferTx.timeoutHeight,
      destinationPort: grpcIBCTransferTx.destinationPort,
      destinationChannel: grpcIBCTransferTx.destinationChannel,
      packetSequence: bigIntToNumber(grpcIBCTransferTx.packetSequence),
      timeoutTimestamp: bigIntToNumber(grpcIBCTransferTx.timeoutTimestamp),
    }
  }

  static grpcPeggyDepositTx(
    grpcPeggyDepositTx: GrpcPeggyDepositTx,
  ): PeggyDepositTx {
    return {
      denom: grpcPeggyDepositTx.denom,
      state: grpcPeggyDepositTx.state,
      sender: grpcPeggyDepositTx.sender,
      amount: grpcPeggyDepositTx.amount,
      receiver: grpcPeggyDepositTx.receiver,
      claimType: grpcPeggyDepositTx.claimType,
      createdAt: grpcPeggyDepositTx.createdAt,
      updatedAt: grpcPeggyDepositTx.updatedAt,
      txHashesList: grpcPeggyDepositTx.txHashes,
      eventNonce: bigIntToNumber(grpcPeggyDepositTx.eventNonce),
      eventHeight: bigIntToNumber(grpcPeggyDepositTx.eventHeight),
      orchestratorAddress: grpcPeggyDepositTx.orchestratorAddress,
    }
  }

  static grpcPeggyWithdrawalTx(
    grpcPeggyWithdrawalTx: GrpcPeggyWithdrawalTx,
  ): PeggyWithdrawalTx {
    return {
      denom: grpcPeggyWithdrawalTx.denom,
      state: grpcPeggyWithdrawalTx.state,
      sender: grpcPeggyWithdrawalTx.sender,
      amount: grpcPeggyWithdrawalTx.amount,
      receiver: grpcPeggyWithdrawalTx.receiver,
      bridgeFee: grpcPeggyWithdrawalTx.bridgeFee,
      claimType: grpcPeggyWithdrawalTx.claimType,
      createdAt: grpcPeggyWithdrawalTx.createdAt,
      updatedAt: grpcPeggyWithdrawalTx.updatedAt,
      txHashesList: grpcPeggyWithdrawalTx.txHashes,
      batchNonce: bigIntToNumber(grpcPeggyWithdrawalTx.batchNonce),
      eventNonce: bigIntToNumber(grpcPeggyWithdrawalTx.eventNonce),
      eventHeight: bigIntToNumber(grpcPeggyWithdrawalTx.eventHeight),
      orchestratorAddress: grpcPeggyWithdrawalTx.orchestratorAddress,
      outgoingTxId: bigIntToNumber(grpcPeggyWithdrawalTx.outgoingTxId),
      batchTimeout: bigIntToNumber(grpcPeggyWithdrawalTx.batchTimeout),
    }
  }

  static getExplorerStatsResponseToExplorerStats(
    response: InjectiveExplorerRpcPb.GetStatsResponse,
  ): ExplorerStats {
    return {
      assets: bigIntToString(response.assets),
      txsTotal: bigIntToString(response.txsTotal),
      addresses: bigIntToString(response.addresses),
      injSupply: bigIntToString(response.injSupply),
      txsInPast30Days: bigIntToString(response.txs30D),
      txsInPast24Hours: bigIntToString(response.txs24H),
      txsPerSecondInPast24Hours: bigIntToString(response.txsPs24H),
      blockCountInPast24Hours: bigIntToString(response.blockCount24H),
      txsPerSecondInPast100Blocks: bigIntToString(response.txsPs100B),
    }
  }

  static getTxsV2ResponseToTxs(
    response: InjectiveExplorerRpcPb.GetTxsV2Response,
  ) {
    return {
      data: response.data.map((tx) =>
        IndexerGrpcExplorerTransformer.grpcTxV2ToTransaction(tx),
      ),
      paging: response.paging,
    }
  }

  static grpcTxV2ToTransaction(
    tx: InjectiveExplorerRpcPb.TxData,
  ): ExplorerTransaction {
    const logs = parseStringToObjectLikeNoThrow(tx.logs)
    const txType = parseStringToObjectLikeNoThrow(tx.txMsgTypes)
    const messages = transactionV2MessagesToMessagesNoThrow(tx.messages)

    const signatures = tx.signatures.map((signature) => ({
      address: signature.address,
      pubkey: signature.pubkey,
      signature: signature.signature,
      sequence: (() => {
        try {
          return bigIntToNumber(signature.sequence)
        } catch {
          return 0
        }
      })(),
    }))

    const claimIds = tx.claimIds.map((claimId) => {
      try {
        return bigIntToNumber(claimId)
      } catch {
        return 0
      }
    })

    const blockNumber = bigIntToNumber(tx.blockNumber)

    return {
      logs,
      info: '',
      memo: '',
      claimIds,
      messages,
      id: tx.id,
      signatures,
      blockNumber,
      gasUsed: 0,
      gasWanted: 0,
      hash: tx.hash,
      code: tx.code,
      errorLog: tx.errorLog,
      codespace: tx.codespace,
      blockTimestamp: tx.blockTimestamp,
      txType: Array.isArray(txType) ? txType.join(',') : txType,
      gasFee: { amounts: [], gasLimit: 0, granter: '', payer: '' },
    }
  }

  static getAccountTxsV2ResponseToAccountTxs(
    response: InjectiveExplorerRpcPb.GetAccountTxsV2Response,
  ) {
    return {
      data: response.data.map((tx) =>
        IndexerGrpcExplorerTransformer.grpcAccountTxV2ToTransaction(tx),
      ),
      paging: response.paging,
    }
  }

  static grpcAccountTxV2ToTransaction(
    tx: InjectiveExplorerRpcPb.TxDetailData,
  ): ExplorerTransaction {
    return {
      id: tx.id,
      hash: tx.hash,
      code: tx.code,
      info: tx.info,
      memo: tx.memo,
      txType: tx.txType,
      gasFee: {
        amounts: (tx.gasFee?.amount || []).map((amount) => ({
          amount: amount.amount,
          denom: amount.denom,
        })),
        gasLimit: bigIntToNumber(tx.gasFee?.gasLimit),
        granter: tx.gasFee?.granter ?? '',
        payer: tx.gasFee?.payer ?? '',
      },
      events: tx.events,
      errorLog: tx.errorLog,
      codespace: tx.codespace,
      gasUsed: bigIntToNumber(tx.gasUsed),

      blockTimestamp: tx.blockTimestamp,
      gasWanted: bigIntToNumber(tx.gasWanted),
      blockNumber: bigIntToNumber(tx.blockNumber),
      signatures: tx.signatures.map((signature) => ({
        address: signature.address,
        pubkey: signature.pubkey,
        signature: signature.signature,
        sequence: bigIntToNumber(signature.sequence),
      })),
      messages: transactionV2MessagesToMessagesNoThrow(tx.messages),
      logs: parseStringToObjectLikeNoThrow(tx.logs),
      data: '/' + uint8ArrayToString(tx.data).split('/').pop(),
      claimIds: tx.claimIds.map((claimId) => bigIntToNumber(claimId)),
    }
  }

  static getBlocksV2ResponseToBlocks(
    response: InjectiveExplorerRpcPb.GetBlocksV2Response,
  ) {
    return {
      paging: response.paging,
      data: response.data.map((block) =>
        IndexerGrpcExplorerTransformer.grpcBlockV2ToBlock(block),
      ),
    }
  }

  static grpcBlockV2ToBlock(block: InjectiveExplorerRpcPb.BlockInfo): Block {
    return {
      moniker: block.moniker,
      proposer: block.proposer,
      blockHash: block.blockHash,
      timestamp: block.timestamp,
      parentHash: block.parentHash,
      height: bigIntToNumber(block.height),
      numTxs: bigIntToNumber(block.numTxs),
      numPreCommits: bigIntToNumber(block.numPreCommits),
    }
  }

  static getContractTxsV2ResponseToContractTxs(
    response: InjectiveExplorerRpcPb.GetContractTxsV2Response,
  ) {
    return {
      data: response.data.map((tx) =>
        IndexerGrpcExplorerTransformer.grpcContractTxV2ToTransaction(tx),
      ),
      paging: response.paging,
    }
  }

  static grpcContractTxV2ToTransaction(
    tx: InjectiveExplorerRpcPb.TxDetailData,
  ): ContractTransaction {
    const messages = transactionV2MessagesToMessagesNoThrow(tx.messages)

    return {
      messages,
      code: tx.code,
      memo: tx.memo,
      type: tx.txType,
      txHash: tx.hash,
      error_log: tx.errorLog,
      height: bigIntToNumber(tx.blockNumber),
      tx_number: bigIntToNumber(tx.txNumber),
      time: bigIntToNumber(tx.blockUnixTimestamp),
      amount: getContractTransactionV2Amount(tx),
      logs: parseStringToObjectLikeNoThrow(tx.logs),
      data: '/' + uint8ArrayToString(tx.data).split('/').pop(),
      fee: toHumanReadable(tx.gasFee?.amount[0]?.amount || '0'),
      signatures: tx.signatures.map((signature) => ({
        address: signature.address,
        pubkey: signature.pubkey,
        signature: signature.signature,
        sequence: bigIntToNumber(signature.sequence),
      })),
    }
  }
}
