import { toBigNumber, toHumanReadable } from '@injectivelabs/utils'
import { isJsonString } from '../../../utils/helpers.js'
import {
  uint8ArrayToString,
  grpcPagingToPagingV2,
} from '../../../utils/index.js'
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

const getContractTransactionV2Amount = (
  ApiTransaction: InjectiveExplorerRpcPb.TxDetailData,
): BigNumber => {
  const messages = JSON.parse(uint8ArrayToString(ApiTransaction.messages))

  const { type, value } = messages[0]

  const { msg } = value

  if (!type.includes('MsgExecuteContract')) {
    return ZERO_IN_BASE
  }

  if (typeof msg === 'string' && !isJsonString(msg)) {
    return ZERO_IN_BASE
  }

  const msgObj = typeof msg === 'string' ? JSON.parse(msg) : msg

  if (!msgObj.transfer) {
    return ZERO_IN_BASE
  }

  return toHumanReadable(msgObj.transfer.amount)
}

const parseStringToObjectLikeNoThrow = (
  object: string | Uint8Array<ArrayBufferLike>,
  defaultValue: any[] = [],
): any[] => {
  if (!object) {
    return defaultValue
  }

  if (typeof object === 'string') {
    try {
      return JSON.parse(object)
    } catch {
      return defaultValue
    }
  }

  try {
    return JSON.parse(uint8ArrayToString(object))
  } catch {
    return defaultValue
  }
}

const transactionV2MessagesToMessagesNoThrow = (messages: any): Message[] => {
  const messagesArray = parseStringToObjectLikeNoThrow(messages)
  const nonNullMessages = messagesArray.filter((msg) => !!msg)

  return nonNullMessages.map(
    (msg: any) =>
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
      unbondingHeight:
        typeof data.unbondingHeight === 'bigint'
          ? Number(data.unbondingHeight)
          : parseInt(data.unbondingHeight, 10),
      unbondingTime: data.unbondingTime,
      commissionRate: data.commissionRate,
      commissionMaxRate: data.commissionMaxRate,
      commissionMaxChangeRate: data.commissionMaxChangeRate,
      commissionUpdateTime: data.commissionUpdateTime,
      proposed:
        typeof data.proposed === 'bigint'
          ? Number(data.proposed)
          : parseInt(data.proposed, 10),
      signed:
        typeof data.signed === 'bigint'
          ? Number(data.signed)
          : parseInt(data.signed, 10),
      missed:
        typeof data.missed === 'bigint'
          ? Number(data.missed)
          : parseInt(data.missed, 10),
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
      blockNumber:
        typeof response.blockNumber === 'bigint'
          ? Number(response.blockNumber)
          : parseInt(response.blockNumber, 10),
      blockTimestamp: response.blockTimestamp,
      hash: response.hash,
      codespace: response.codespace,
      messages: response.messages,
      txNumber:
        typeof response.txNumber === 'bigint'
          ? Number(response.txNumber)
          : parseInt(response.txNumber, 10),
      errorLog: response.errorLog,
      code: response.code,
    }
  }

  static grpcGasFeeToGasFee(gasFee: GrpcGasFee): GasFee {
    const amounts = gasFee.amount.map((amount) => ({
      amount: amount.amount,
      denom: amount.denom,
    }))

    return {
      amounts,
      gasLimit:
        typeof gasFee.gasLimit === 'bigint'
          ? Number(gasFee.gasLimit)
          : parseInt(gasFee.gasLimit, 10),
      payer: gasFee.payer,
      granter: gasFee.granter,
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
      blockNumber:
        typeof data.blockNumber === 'bigint'
          ? Number(data.blockNumber)
          : parseInt(data.blockNumber, 10),
      blockTimestamp: data.blockTimestamp,
      hash: data.hash,
      amount: message.value.amount[0].amount,
      denom: message.value.amount[0].denom,
      sender: message.value.from_address,
      receiver: message.value.to_address,
    }
  }

  static grpcTransactionToTransaction(
    tx: InjectiveExplorerRpcPb.GetTxByTxHashResponse,
  ): Transaction {
    const data = tx.data!

    return {
      id: data.id,
      blockNumber:
        typeof data.blockNumber === 'bigint'
          ? Number(data.blockNumber)
          : parseInt(data.blockNumber, 10),
      blockTimestamp: data.blockTimestamp,
      hash: data.hash,
      code: data.code,
      info: data.info,
      gasWanted:
        typeof data.gasWanted === 'bigint'
          ? Number(data.gasWanted)
          : parseInt(data.gasWanted, 10),
      gasUsed:
        typeof data.gasUsed === 'bigint'
          ? Number(data.gasUsed)
          : parseInt(data.gasUsed, 10),
      codespace: data.codespace,
      data: data.data,
      gasFee: IndexerGrpcExplorerTransformer.grpcGasFeeToGasFee(data.gasFee!),
      txType: data.txType,
      signatures: data.signatures.map((signature) => ({
        pubkey: signature.pubkey,
        address: signature.address,
        sequence:
          typeof signature.sequence === 'bigint'
            ? Number(signature.sequence)
            : parseInt(signature.sequence, 10),
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
      gasWanted:
        typeof tx.gasWanted === 'bigint'
          ? Number(tx.gasWanted)
          : parseInt(tx.gasWanted, 10),
      gasUsed:
        typeof tx.gasUsed === 'bigint'
          ? Number(tx.gasUsed)
          : parseInt(tx.gasUsed, 10),
      blockNumber:
        typeof tx.blockNumber === 'bigint'
          ? Number(tx.blockNumber)
          : parseInt(tx.blockNumber, 10),
      signatures: tx.signatures.map((signature) => ({
        pubkey: signature.pubkey,
        address: signature.address,
        sequence:
          typeof signature.sequence === 'bigint'
            ? Number(signature.sequence)
            : parseInt(signature.sequence, 10),
        signature: signature.signature,
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
      height:
        typeof block.height === 'bigint'
          ? Number(block.height)
          : parseInt(block.height, 10),
      proposer: block.proposer,
      moniker: block.moniker,
      blockHash: block.blockHash,
      parentHash: block.parentHash,
      numPreCommits:
        typeof block.numPreCommits === 'bigint'
          ? Number(block.numPreCommits)
          : parseInt(block.numPreCommits, 10),
      numTxs:
        typeof block.numTxs === 'bigint'
          ? Number(block.numTxs)
          : parseInt(block.numTxs, 10),
      timestamp: block.timestamp,
    }
  }

  static grpcBlockToBlockWithTxs(
    block: InjectiveExplorerRpcPb.BlockInfo,
  ): BlockWithTxs {
    return {
      height:
        typeof block.height === 'bigint'
          ? Number(block.height)
          : parseInt(block.height, 10),
      proposer: block.proposer,
      moniker: block.moniker,
      blockHash: block.blockHash,
      parentHash: block.parentHash,
      numPreCommits:
        typeof block.numPreCommits === 'bigint'
          ? Number(block.numPreCommits)
          : parseInt(block.numPreCommits, 10),
      numTxs:
        typeof block.numTxs === 'bigint'
          ? Number(block.numTxs)
          : parseInt(block.numTxs, 10),
      timestamp: block.timestamp,
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
      blockNumber:
        typeof validatorUptime.blockNumber === 'bigint'
          ? Number(validatorUptime.blockNumber)
          : parseInt(validatorUptime.blockNumber, 10),
      status: validatorUptime.status,
    }
  }

  static grpcValidatorSlashingEventToValidatorSlashingEvent(
    validatorUptime: GrpcValidatorSlashingEvent,
  ): ValidatorSlashingEvent {
    return {
      blockNumber:
        typeof validatorUptime.blockNumber === 'bigint'
          ? Number(validatorUptime.blockNumber)
          : parseInt(validatorUptime.blockNumber, 10),
      blockTimestamp: validatorUptime.blockTimestamp,
      address: validatorUptime.address,
      power:
        typeof validatorUptime.power === 'bigint'
          ? Number(validatorUptime.power)
          : parseInt(validatorUptime.power, 10),
      reason: validatorUptime.reason,
      jailed: validatorUptime.jailed,
      missedBlocks:
        typeof validatorUptime.missedBlocks === 'bigint'
          ? Number(validatorUptime.missedBlocks)
          : parseInt(validatorUptime.missedBlocks, 10),
    }
  }

  static grpcIBCTransferTxToIBCTransferTx(
    grpcIBCTransferTx: GrpcIBCTransferTx,
  ): IBCTransferTx {
    return {
      sender: grpcIBCTransferTx.sender,
      receiver: grpcIBCTransferTx.receiver,
      sourcePort: grpcIBCTransferTx.sourcePort,
      sourceChannel: grpcIBCTransferTx.sourceChannel,
      destinationPort: grpcIBCTransferTx.destinationPort,
      destinationChannel: grpcIBCTransferTx.destinationChannel,
      amount: grpcIBCTransferTx.amount,
      denom: grpcIBCTransferTx.denom,
      timeoutHeight: grpcIBCTransferTx.timeoutHeight,
      timeoutTimestamp:
        typeof grpcIBCTransferTx.timeoutTimestamp === 'bigint'
          ? Number(grpcIBCTransferTx.timeoutTimestamp)
          : parseInt(grpcIBCTransferTx.timeoutTimestamp, 10),
      packetSequence:
        typeof grpcIBCTransferTx.packetSequence === 'bigint'
          ? Number(grpcIBCTransferTx.packetSequence)
          : parseInt(grpcIBCTransferTx.packetSequence, 10),
      dataHex: grpcIBCTransferTx.dataHex,
      state: grpcIBCTransferTx.state,
      txHashesList: grpcIBCTransferTx.txHashes,
      createdAt: grpcIBCTransferTx.createdAt,
      updatedAt: grpcIBCTransferTx.updatedAt,
    }
  }

  static grpcPeggyDepositTx(
    grpcPeggyDepositTx: GrpcPeggyDepositTx,
  ): PeggyDepositTx {
    return {
      sender: grpcPeggyDepositTx.sender,
      receiver: grpcPeggyDepositTx.receiver,
      eventNonce:
        typeof grpcPeggyDepositTx.eventNonce === 'bigint'
          ? Number(grpcPeggyDepositTx.eventNonce)
          : parseInt(grpcPeggyDepositTx.eventNonce, 10),
      eventHeight:
        typeof grpcPeggyDepositTx.eventHeight === 'bigint'
          ? Number(grpcPeggyDepositTx.eventHeight)
          : parseInt(grpcPeggyDepositTx.eventHeight, 10),
      amount: grpcPeggyDepositTx.amount,
      denom: grpcPeggyDepositTx.denom,
      orchestratorAddress: grpcPeggyDepositTx.orchestratorAddress,
      state: grpcPeggyDepositTx.state,
      claimType: grpcPeggyDepositTx.claimType,
      txHashesList: grpcPeggyDepositTx.txHashes,
      createdAt: grpcPeggyDepositTx.createdAt,
      updatedAt: grpcPeggyDepositTx.updatedAt,
    }
  }

  static grpcPeggyWithdrawalTx(
    grpcPeggyWithdrawalTx: GrpcPeggyWithdrawalTx,
  ): PeggyWithdrawalTx {
    return {
      sender: grpcPeggyWithdrawalTx.sender,
      receiver: grpcPeggyWithdrawalTx.receiver,
      amount: grpcPeggyWithdrawalTx.amount,
      denom: grpcPeggyWithdrawalTx.denom,
      bridgeFee: grpcPeggyWithdrawalTx.bridgeFee,
      outgoingTxId:
        typeof grpcPeggyWithdrawalTx.outgoingTxId === 'bigint'
          ? Number(grpcPeggyWithdrawalTx.outgoingTxId)
          : parseInt(grpcPeggyWithdrawalTx.outgoingTxId, 10),
      batchTimeout:
        typeof grpcPeggyWithdrawalTx.batchTimeout === 'bigint'
          ? Number(grpcPeggyWithdrawalTx.batchTimeout)
          : parseInt(grpcPeggyWithdrawalTx.batchTimeout, 10),
      batchNonce:
        typeof grpcPeggyWithdrawalTx.batchNonce === 'bigint'
          ? Number(grpcPeggyWithdrawalTx.batchNonce)
          : parseInt(grpcPeggyWithdrawalTx.batchNonce, 10),
      eventNonce:
        typeof grpcPeggyWithdrawalTx.eventNonce === 'bigint'
          ? Number(grpcPeggyWithdrawalTx.eventNonce)
          : parseInt(grpcPeggyWithdrawalTx.eventNonce, 10),
      eventHeight:
        typeof grpcPeggyWithdrawalTx.eventHeight === 'bigint'
          ? Number(grpcPeggyWithdrawalTx.eventHeight)
          : parseInt(grpcPeggyWithdrawalTx.eventHeight, 10),
      orchestratorAddress: grpcPeggyWithdrawalTx.orchestratorAddress,
      state: grpcPeggyWithdrawalTx.state,
      claimType: grpcPeggyWithdrawalTx.claimType,
      txHashesList: grpcPeggyWithdrawalTx.txHashes,
      createdAt: grpcPeggyWithdrawalTx.createdAt,
      updatedAt: grpcPeggyWithdrawalTx.updatedAt,
    }
  }

  static getExplorerStatsResponseToExplorerStats(
    response: InjectiveExplorerRpcPb.GetStatsResponse,
  ): ExplorerStats {
    return {
      assets:
        typeof response.assets === 'bigint'
          ? response.assets.toString()
          : response.assets,
      txsTotal:
        typeof response.txsTotal === 'bigint'
          ? response.txsTotal.toString()
          : response.txsTotal,
      addresses:
        typeof response.addresses === 'bigint'
          ? response.addresses.toString()
          : response.addresses,
      injSupply:
        typeof response.injSupply === 'bigint'
          ? response.injSupply.toString()
          : response.injSupply,
      txsInPast24Hours:
        typeof response.txs24H === 'bigint'
          ? response.txs24H.toString()
          : response.txs24H,
      txsInPast30Days:
        typeof response.txs30D === 'bigint'
          ? response.txs30D.toString()
          : response.txs30D,
      blockCountInPast24Hours:
        typeof response.blockCount24H === 'bigint'
          ? response.blockCount24H.toString()
          : response.blockCount24H,
      txsPerSecondInPast24Hours:
        typeof response.txsPs24H === 'bigint'
          ? response.txsPs24H.toString()
          : response.txsPs24H,
      txsPerSecondInPast100Blocks:
        typeof response.txsPs100B === 'bigint'
          ? response.txsPs100B.toString()
          : response.txsPs100B,
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
          return typeof signature.sequence === 'bigint'
            ? Number(signature.sequence)
            : parseInt(signature.sequence, 10)
        } catch {
          return 0
        }
      })(),
    }))

    const claimIds = tx.claimIds.map((claimId) => {
      try {
        return typeof claimId === 'bigint'
          ? Number(claimId)
          : parseInt(claimId, 10)
      } catch {
        return 0
      }
    })

    const blockNumber =
      typeof tx.blockNumber === 'bigint'
        ? Number(tx.blockNumber)
        : parseInt(tx.blockNumber)

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
        gasLimit:
          typeof tx.gasFee?.gasLimit === 'bigint'
            ? Number(tx.gasFee?.gasLimit)
            : parseInt(tx.gasFee?.gasLimit ?? '0', 10),
        granter: tx.gasFee?.granter ?? '',
        payer: tx.gasFee?.payer ?? '',
      },
      events: tx.events,
      errorLog: tx.errorLog,
      codespace: tx.codespace,
      gasUsed:
        typeof tx.gasUsed === 'bigint'
          ? Number(tx.gasUsed)
          : parseInt(tx.gasUsed, 10),
      blockTimestamp: tx.blockTimestamp,
      gasWanted:
        typeof tx.gasWanted === 'bigint'
          ? Number(tx.gasWanted)
          : parseInt(tx.gasWanted, 10),
      blockNumber:
        typeof tx.blockNumber === 'bigint'
          ? Number(tx.blockNumber)
          : parseInt(tx.blockNumber, 10),
      signatures: tx.signatures.map((signature) => ({
        address: signature.address,
        pubkey: signature.pubkey,
        signature: signature.signature,
        sequence:
          typeof signature.sequence === 'bigint'
            ? Number(signature.sequence)
            : parseInt(signature.sequence, 10),
      })),
      messages: transactionV2MessagesToMessagesNoThrow(tx.messages),
      logs: parseStringToObjectLikeNoThrow(tx.logs),
      data: '/' + uint8ArrayToString(tx.data).split('/').pop(),
      claimIds: tx.claimIds.map((claimId) =>
        typeof claimId === 'bigint' ? Number(claimId) : parseInt(claimId, 10),
      ),
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
      height:
        typeof block.height === 'bigint'
          ? Number(block.height)
          : parseInt(block.height, 10),
      numTxs:
        typeof block.numTxs === 'bigint'
          ? Number(block.numTxs)
          : parseInt(block.numTxs, 10),
      numPreCommits:
        typeof block.numPreCommits === 'bigint'
          ? Number(block.numPreCommits)
          : parseInt(block.numPreCommits, 10),
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
      height:
        typeof tx.blockNumber === 'bigint'
          ? Number(tx.blockNumber)
          : parseInt(tx.blockNumber, 10),
      tx_number:
        typeof tx.txNumber === 'bigint'
          ? Number(tx.txNumber)
          : parseInt(tx.txNumber, 10),
      time:
        typeof tx.blockUnixTimestamp === 'bigint'
          ? Number(tx.blockUnixTimestamp)
          : parseInt(tx.blockUnixTimestamp, 10),
      amount: getContractTransactionV2Amount(tx),
      logs: JSON.parse(uint8ArrayToString(tx.logs)),
      data: '/' + uint8ArrayToString(tx.data).split('/').pop(),
      fee: toHumanReadable(tx.gasFee?.amount[0]?.amount || '0'),
      signatures: tx.signatures.map((signature) => ({
        address: signature.address,
        pubkey: signature.pubkey,
        signature: signature.signature,
        sequence:
          typeof signature.sequence === 'bigint'
            ? Number(signature.sequence)
            : parseInt(signature.sequence, 10),
      })),
    }
  }
}
