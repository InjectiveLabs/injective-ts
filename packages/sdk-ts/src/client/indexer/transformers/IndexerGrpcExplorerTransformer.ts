import { BigNumberInWei, BigNumberInBase } from '@injectivelabs/utils'
import { isJsonString } from '../../../utils/helpers.js'
import {
  Block,
  GasFee,
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
  GrpcPeggyWithdrawalTx,
  BankMsgSendTransaction,
  GrpcBankMsgSendMessage,
  ValidatorSlashingEvent,
  IndexerStreamTransaction,
  GrpcValidatorSlashingEvent,
  ExplorerValidatorDescription,
  GrpcIndexerValidatorDescription,
  ExplorerTransaction,
  ContractTransaction,
  Message,
} from '../types/explorer.js'
import { grpcPagingToPaging } from '../../../utils/index.js'
import { InjectiveExplorerRpc } from '@injectivelabs/indexer-proto-ts'

const ZERO_IN_BASE = new BigNumberInBase(0)

const getContractTransactionV2Amount = (
  ApiTransaction: InjectiveExplorerRpc.TxDetailData,
): BigNumberInBase => {
  const messages = JSON.parse(
    Buffer.from(ApiTransaction.messages).toString('utf8'),
  )
  const {
    type,
    message: { msg },
  } = messages[0]

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

  return new BigNumberInWei(msgObj.transfer.amount).toBase()
}

const transactionV2MessagesToMessages = (messages: any): Message[] =>
  JSON.parse(Buffer.from(messages).toString('utf8')).map(
    (msg: any) =>
      ({
        type: msg.type,
        message: msg.value,
      } as Message),
  )
/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcExplorerTransformer {
  static getTxByTxHashResponseToTx(
    tx: InjectiveExplorerRpc.GetTxByTxHashResponse,
  ): Transaction {
    return IndexerGrpcExplorerTransformer.grpcTransactionToTransaction(tx)
  }

  static getAccountTxsResponseToAccountTxs(
    response: InjectiveExplorerRpc.GetAccountTxsResponse,
  ) {
    const txs = response.data
    const pagination = response.paging

    return {
      txs: IndexerGrpcExplorerTransformer.grpcTransactionsToTransactionsFromDetail(
        txs,
      ),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static getValidatorUptimeResponseToValidatorUptime(
    response: InjectiveExplorerRpc.GetValidatorUptimeResponse,
  ) {
    const data = response.data

    return data.map((field) =>
      IndexerGrpcExplorerTransformer.grpcValidatorUptimeToValidatorUptime(
        field,
      ),
    )
  }

  static getPeggyDepositTxsResponseToPeggyDepositTxs(
    response: InjectiveExplorerRpc.GetPeggyDepositTxsResponse,
  ) {
    return response.field.map((field) =>
      IndexerGrpcExplorerTransformer.grpcPeggyDepositTx(field),
    )
  }

  static getPeggyWithdrawalTxsResponseToPeggyWithdrawalTxs(
    response: InjectiveExplorerRpc.GetPeggyWithdrawalTxsResponse,
  ) {
    return response.field.map((field) =>
      IndexerGrpcExplorerTransformer.grpcPeggyWithdrawalTx(field),
    )
  }

  static getIBCTransferTxsResponseToIBCTransferTxs(
    response: InjectiveExplorerRpc.GetIBCTransferTxsResponse,
  ) {
    return response.field.map((field) =>
      IndexerGrpcExplorerTransformer.grpcIBCTransferTxToIBCTransferTx(field),
    )
  }

  static validatorResponseToValidator(
    validator: InjectiveExplorerRpc.GetValidatorResponse,
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
      unbondingHeight: parseInt(data.unbondingHeight, 10),
      unbondingTime: data.unbondingTime,
      commissionRate: data.commissionRate,
      commissionMaxRate: data.commissionMaxRate,
      commissionMaxChangeRate: data.commissionMaxChangeRate,
      commissionUpdateTime: data.commissionUpdateTime,
      proposed: parseInt(data.proposed, 10),
      signed: parseInt(data.signed, 10),
      missed: parseInt(data.missed, 10),
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
    response: InjectiveExplorerRpc.StreamTxsResponse,
  ): IndexerStreamTransaction {
    return {
      id: response.id,
      blockNumber: parseInt(response.blockNumber, 10),
      blockTimestamp: response.blockTimestamp,
      hash: response.hash,
      codespace: response.codespace,
      messages: response.messages,
      txNumber: parseInt(response.txNumber, 10),
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
      gasLimit: parseInt(gasFee.gasLimit, 10),
      payer: gasFee.payer,
      granter: gasFee.granter,
    }
  }

  static grpcTransactionToBankMsgSendTransaction(
    tx: InjectiveExplorerRpc.GetTxByTxHashResponse,
  ): BankMsgSendTransaction {
    const data = tx.data!
    const [message] = JSON.parse(
      Buffer.from(data.messages).toString() as string,
    ) as GrpcBankMsgSendMessage[]

    return {
      blockNumber: parseInt(data.blockNumber, 10),
      blockTimestamp: data.blockTimestamp,
      hash: data.hash,
      amount: message.value.amount[0].amount,
      denom: message.value.amount[0].denom,
      sender: message.value.from_address,
      receiver: message.value.to_address,
    }
  }

  static grpcTransactionToTransaction(
    tx: InjectiveExplorerRpc.GetTxByTxHashResponse,
  ): Transaction {
    const data = tx.data!

    return {
      id: data.id,
      blockNumber: parseInt(data.blockNumber, 10),
      blockTimestamp: data.blockTimestamp,
      hash: data.hash,
      code: data.code,
      info: data.info,
      gasWanted: parseInt(data.gasWanted, 10),
      gasUsed: parseInt(data.gasUsed, 10),
      codespace: data.codespace,
      data: data.data,
      gasFee: IndexerGrpcExplorerTransformer.grpcGasFeeToGasFee(data.gasFee!),
      txType: data.txType,
      signatures: data.signatures.map((signature) => ({
        pubkey: signature.pubkey,
        address: signature.address,
        sequence: parseInt(signature.sequence, 10),
        signature: signature.signature,
      })),
      events: data.events.map((event) => ({
        type: event.type,
        attributes: event.attributes,
      })),
      messages: JSON.parse(Buffer.from(data.messages).toString() as string),
    }
  }

  static grpcTransactionsToTransactions(
    txs: Array<InjectiveExplorerRpc.GetTxByTxHashResponse>,
  ): Array<Transaction> {
    return txs.map((tx) =>
      IndexerGrpcExplorerTransformer.grpcTransactionToTransaction(tx),
    )
  }

  static grpcTransactionToTransactionFromDetail(
    tx: InjectiveExplorerRpc.TxDetailData,
  ): Transaction {
    const messages = JSON.parse(Buffer.from(tx.messages).toString('utf8'))

    return {
      ...tx,
      gasWanted: parseInt(tx.gasWanted, 10),
      gasUsed: parseInt(tx.gasUsed, 10),
      blockNumber: parseInt(tx.blockNumber, 10),
      signatures: tx.signatures.map((signature) => ({
        pubkey: signature.pubkey,
        address: signature.address,
        sequence: parseInt(signature.sequence, 10),
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
    txs: InjectiveExplorerRpc.TxDetailData[],
  ): Array<Transaction> {
    return txs.map(
      IndexerGrpcExplorerTransformer.grpcTransactionToTransactionFromDetail,
    )
  }

  static grpcBlockToBlock(block: InjectiveExplorerRpc.BlockInfo): Block {
    return {
      height: parseInt(block.height, 10),
      proposer: block.proposer,
      moniker: block.moniker,
      blockHash: block.blockHash,
      parentHash: block.parentHash,
      numPreCommits: parseInt(block.numPreCommits, 10),
      numTxs: parseInt(block.numTxs, 10),
      timestamp: block.timestamp,
    }
  }

  static grpcBlockToBlockWithTxs(
    block: InjectiveExplorerRpc.BlockInfo,
  ): BlockWithTxs {
    return {
      height: parseInt(block.height, 10),
      proposer: block.proposer,
      moniker: block.moniker,
      blockHash: block.blockHash,
      parentHash: block.parentHash,
      numPreCommits: parseInt(block.numPreCommits, 10),
      numTxs: parseInt(block.numTxs, 10),
      timestamp: block.timestamp,
    }
  }

  static grpcBlocksToBlocks(
    blocks: Array<InjectiveExplorerRpc.BlockInfo>,
  ): Array<Block> {
    return blocks.map((block) =>
      IndexerGrpcExplorerTransformer.grpcBlockToBlock(block),
    )
  }

  static grpcBlocksToBlocksWithTxs(
    blocks: Array<InjectiveExplorerRpc.BlockInfo>,
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
      blockNumber: parseInt(validatorUptime.blockNumber, 10),
      status: validatorUptime.status,
    }
  }

  static grpcValidatorSlashingEventToValidatorSlashingEvent(
    validatorUptime: GrpcValidatorSlashingEvent,
  ): ValidatorSlashingEvent {
    return {
      blockNumber: parseInt(validatorUptime.blockNumber, 10),
      blockTimestamp: validatorUptime.blockTimestamp,
      address: validatorUptime.address,
      power: parseInt(validatorUptime.power, 10),
      reason: validatorUptime.reason,
      jailed: validatorUptime.jailed,
      missedBlocks: parseInt(validatorUptime.missedBlocks, 10),
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
      timeoutTimestamp: parseInt(grpcIBCTransferTx.timeoutTimestamp, 10),
      packetSequence: parseInt(grpcIBCTransferTx.packetSequence, 10),
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
      eventNonce: parseInt(grpcPeggyDepositTx.eventNonce, 10),
      eventHeight: parseInt(grpcPeggyDepositTx.eventHeight, 10),
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
      outgoingTxId: parseInt(grpcPeggyWithdrawalTx.outgoingTxId, 10),
      batchTimeout: parseInt(grpcPeggyWithdrawalTx.batchTimeout, 10),
      batchNonce: parseInt(grpcPeggyWithdrawalTx.batchNonce, 10),
      eventNonce: parseInt(grpcPeggyWithdrawalTx.eventNonce, 10),
      eventHeight: parseInt(grpcPeggyWithdrawalTx.eventHeight, 10),
      orchestratorAddress: grpcPeggyWithdrawalTx.orchestratorAddress,
      state: grpcPeggyWithdrawalTx.state,
      claimType: grpcPeggyWithdrawalTx.claimType,
      txHashesList: grpcPeggyWithdrawalTx.txHashes,
      createdAt: grpcPeggyWithdrawalTx.createdAt,
      updatedAt: grpcPeggyWithdrawalTx.updatedAt,
    }
  }

  static getExplorerStatsResponseToExplorerStats(
    response: InjectiveExplorerRpc.GetStatsResponse,
  ): ExplorerStats {
    return {
      assets: response.assets,
      txsTotal: response.txsTotal,
      addresses: response.addresses,
      injSupply: response.injSupply,
      txsInPast24Hours: response.txs24H,
      txsInPast30Days: response.txs30D,
      blockCountInPast24Hours: response.blockCount24H,
      txsPerSecondInPast24Hours: response.txsPs24H,
      txsPerSecondInPast100Blocks: response.txsPs100B,
    }
  }

  static getTxsV2ResponseToTxs(
    response: InjectiveExplorerRpc.GetTxsV2Response,
  ) {
    return {
      data: response.data.map((tx) =>
        IndexerGrpcExplorerTransformer.grpcTxV2ToTransaction(tx),
      ),
      paging: response.paging,
    }
  }

  static grpcTxV2ToTransaction(
    tx: InjectiveExplorerRpc.TxData,
  ): ExplorerTransaction {
    return {
      id: tx.id,
      logs: JSON.parse(Buffer.from(tx.logs).toString('utf8')),
      code: tx.code,
      hash: tx.hash,
      claimIds: tx.claimIds.map((claimId) => parseInt(claimId, 10)),
      errorLog: tx.errorLog,
      messages: transactionV2MessagesToMessages(tx.messages),
      codespace: tx.codespace,
      txType: JSON.parse(Buffer.from(tx.txMsgTypes).toString('utf8')),
      signatures: tx.signatures.map((signature) => ({
        address: signature.address,
        pubkey: signature.pubkey,
        signature: signature.signature,
        sequence: parseInt(signature.sequence, 10),
      })),
      blockNumber: parseInt(tx.blockNumber),
      blockTimestamp: tx.blockTimestamp,
      gasFee: { amounts: [], gasLimit: 0, granter: '', payer: '' },
      info: '',
      memo: '',
      gasUsed: 0,
      gasWanted: 0,
    }
  }

  static getAccountTxsV2ResponseToAccountTxs(
    response: InjectiveExplorerRpc.GetAccountTxsV2Response,
  ) {
    return {
      data: response.data.map((tx) =>
        IndexerGrpcExplorerTransformer.grpcAccountTxV2ToTransaction(tx),
      ),
      paging: response.paging,
    }
  }

  static grpcAccountTxV2ToTransaction(
    tx: InjectiveExplorerRpc.TxDetailData,
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
        gasLimit: parseInt(tx.gasFee?.gasLimit ?? '0', 10),
        granter: tx.gasFee?.granter ?? '',
        payer: tx.gasFee?.payer ?? '',
      },
      events: tx.events,
      gasUsed: parseInt(tx.gasUsed, 10),
      errorLog: tx.errorLog,
      claimIds: tx.claimIds.map((claimId) => parseInt(claimId, 10)),
      gasWanted: parseInt(tx.gasWanted, 10),
      signatures: tx.signatures.map((signature) => ({
        address: signature.address,
        pubkey: signature.pubkey,
        signature: signature.signature,
        sequence: parseInt(signature.sequence, 10),
      })),
      blockNumber: parseInt(tx.blockNumber, 10),
      blockTimestamp: tx.blockTimestamp,
      data: '/' + Buffer.from(tx.data).toString('utf8').split('/').pop(),
      messages: transactionV2MessagesToMessages(tx.messages),
      logs: JSON.parse(Buffer.from(tx.logs).toString('utf8')),
      codespace: tx.codespace,
    }
  }

  static getBlocksV2ResponseToBlocks(
    response: InjectiveExplorerRpc.GetBlocksV2Response,
  ) {
    return {
      data: response.data.map((block) =>
        IndexerGrpcExplorerTransformer.grpcBlockV2ToBlock(block),
      ),
      paging: response.paging,
    }
  }

  static grpcBlockV2ToBlock(block: InjectiveExplorerRpc.BlockInfo): Block {
    return {
      moniker: block.moniker,
      proposer: block.proposer,
      blockHash: block.blockHash,
      timestamp: block.timestamp,
      parentHash: block.parentHash,
      height: parseInt(block.height, 10),
      numTxs: parseInt(block.numTxs, 10),
      numPreCommits: parseInt(block.numPreCommits, 10),
    }
  }

  static getContractTxsV2ResponseToContractTxs(
    response: InjectiveExplorerRpc.GetContractTxsV2Response,
  ) {
    return {
      data: response.data.map((tx) =>
        IndexerGrpcExplorerTransformer.grpcContractTxV2ToTransaction(tx),
      ),
      paging: response.paging,
    }
  }

  static grpcContractTxV2ToTransaction(
    tx: InjectiveExplorerRpc.TxDetailData,
  ): ContractTransaction {
    const messages = transactionV2MessagesToMessages(tx.messages)

    return {
      code: tx.code,
      memo: tx.memo,
      type: tx.txType,
      signatures: tx.signatures.map((signature) => ({
        address: signature.address,
        pubkey: signature.pubkey,
        signature: signature.signature,
        sequence: parseInt(signature.sequence, 10),
      })),
      data: '/' + Buffer.from(tx.data).toString('utf8').split('/').pop(),
      messages,
      logs: JSON.parse(Buffer.from(tx.logs).toString('utf8')),
      height: parseInt(tx.blockNumber, 10),
      error_log: tx.errorLog,
      txHash: tx.hash,
      tx_number: parseInt(tx.txNumber, 10),
      time: parseInt(tx.blockTimestamp, 10),
      fee: new BigNumberInWei(tx.gasFee?.amount[0]?.amount || '0').toBase(),
      amount: getContractTransactionV2Amount(tx),
    }
  }
}
