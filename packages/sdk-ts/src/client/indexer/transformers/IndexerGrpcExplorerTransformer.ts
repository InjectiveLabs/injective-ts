import {
  BlockInfo,
  GetTxByTxHashResponse as TxData,
  StreamTxsResponse,
} from '@injectivelabs/indexer-api/injective_explorer_rpc_pb'
import {
  BankMsgSendTransaction,
  Block,
  BlockWithTxs,
  GasFee,
  GrpcBankMsgSendMessage,
  GrpcGasFee,
  GrpcIndexerValidatorDescription,
  GrpcValidatorSlashingEvent,
  GrpcValidatorUptime,
  Transaction,
  ExplorerValidator,
  ExplorerValidatorDescription,
  ValidatorSlashingEvent,
  ValidatorUptime,
  IBCTransferTx,
  PeggyDepositTx,
  PeggyWithdrawalTx,
  GrpcIBCTransferTx,
  GrpcPeggyDepositTx,
  GrpcPeggyWithdrawalTx,
  IndexerStreamTransaction,
} from '../types/explorer'
import {
  GetTxByTxHashResponse,
  GetAccountTxsResponse,
  GetValidatorResponse,
  GetValidatorUptimeResponse,
  GetPeggyDepositTxsResponse,
  GetPeggyWithdrawalTxsResponse,
  GetIBCTransferTxsResponse,
} from '@injectivelabs/indexer-api/injective_explorer_rpc_pb'
import { grpcPagingToPaging } from '../../../utils'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcExplorerTransformer {
  static getTxByTxHashResponseToTx(tx: GetTxByTxHashResponse): Transaction {
    return IndexerGrpcExplorerTransformer.grpcTransactionToTransaction(tx)
  }

  static getAccountTxsResponseToAccountTxs(response: GetAccountTxsResponse) {
    const txs = response.getDataList()
    const pagination = response.getPaging()

    return {
      txs: IndexerGrpcExplorerTransformer.grpcTransactionsToTransactions(txs),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static getValidatorUptimeResponseToValidatorUptime(
    response: GetValidatorUptimeResponse,
  ) {
    return response
      .getFieldList()
      .map((field) =>
        IndexerGrpcExplorerTransformer.grpcValidatorUptimeToValidatorUptime(
          field,
        ),
      )
  }

  static getPeggyDepositTxsResponseToPeggyDepositTxs(
    response: GetPeggyDepositTxsResponse,
  ) {
    return response
      .getFieldList()
      .map((field) => IndexerGrpcExplorerTransformer.grpcPeggyDepositTx(field))
  }

  static getPeggyWithdrawalTxsResponseToPeggyWithdrawalTxs(
    response: GetPeggyWithdrawalTxsResponse,
  ) {
    return response
      .getFieldList()
      .map((field) =>
        IndexerGrpcExplorerTransformer.grpcPeggyWithdrawalTx(field),
      )
  }

  static getIBCTransferTxsResponseToIBCTransferTxs(
    response: GetIBCTransferTxsResponse,
  ) {
    return response
      .getFieldList()
      .map((field) =>
        IndexerGrpcExplorerTransformer.grpcIBCTransferTxToIBCTransferTx(field),
      )
  }

  static validatorResponseToValidator(
    validator: GetValidatorResponse,
  ): ExplorerValidator {
    return {
      id: validator.getId(),
      moniker: validator.getMoniker(),
      operatorAddress: validator.getOperatorAddress(),
      consensusAddress: validator.getConsensusAddress(),
      jailed: validator.getJailed(),
      status: validator.getStatus(),
      tokens: validator.getTokens(),
      delegatorShares: validator.getDelegatorShares(),
      description:
        IndexerGrpcExplorerTransformer.grpcValidatorDescriptionToValidatorDescription(
          validator.getDescription()!,
        ),
      unbondingHeight: validator.getUnbondingHeight(),
      unbondingTime: validator.getUnbondingTime(),
      commissionRate: validator.getCommissionRate(),
      commissionMaxRate: validator.getCommissionMaxRate(),
      commissionMaxChangeRate: validator.getCommissionMaxChangeRate(),
      commissionUpdateTime: validator.getCommissionUpdateTime(),
      proposed: validator.getProposed(),
      signed: validator.getSigned(),
      missed: validator.getMissed(),
      uptimePercentage: validator.getUptimePercentage(),
      timestamp: validator.getTimestamp(),
      uptimesList: validator
        .getUptimesList()
        .map(
          IndexerGrpcExplorerTransformer.grpcValidatorUptimeToValidatorUptime,
        ),
      slashingEventsList: validator
        .getSlashingEventsList()
        .map(
          IndexerGrpcExplorerTransformer.grpcValidatorSlashingEventToValidatorSlashingEvent,
        ),
    }
  }

  static streamTxResponseToTxs(
    response: StreamTxsResponse,
  ): IndexerStreamTransaction {
    return {
      id: response.getId(),
      blockNumber: response.getBlockNumber(),
      blockTimestamp: response.getBlockTimestamp(),
      hash: response.getHash(),
      codespace: response.getCodespace(),
      messages: response.getMessages(),
      txNumber: response.getTxNumber(),
      errorLog: response.getErrorLog(),
      code: response.getCode(),
    }
  }

  static grpcGasFeeToGasFee(gasFee: GrpcGasFee): GasFee {
    const amounts = gasFee.getAmountList().map((amount) => ({
      amount: amount.getAmount(),
      denom: amount.getDenom(),
    }))

    return {
      amounts,
      gasLimit: gasFee.getGasLimit(),
      payer: gasFee.getPayer(),
      granter: gasFee.getGranter(),
    }
  }

  static grpcTransactionToBankMsgSendTransaction(
    tx: TxData,
  ): BankMsgSendTransaction {
    const [message] = JSON.parse(tx.getMessages()) as GrpcBankMsgSendMessage[]

    return {
      blockNumber: tx.getBlockNumber(),
      blockTimestamp: tx.getBlockTimestamp(),
      hash: tx.getHash(),
      amount: message.value.amount[0].amount,
      denom: message.value.amount[0].denom,
      sender: message.value.from_address,
      receiver: message.value.to_address,
    }
  }

  static grpcTransactionToTransaction(tx: TxData): Transaction {
    return {
      id: tx.getId(),
      blockNumber: tx.getBlockNumber(),
      blockTimestamp: tx.getBlockTimestamp(),
      hash: tx.getHash(),
      code: tx.getCode(),
      info: tx.getInfo(),
      gasWanted: tx.getGasWanted(),
      gasUsed: tx.getGasUsed(),
      codespace: tx.getCodespace(),
      data: tx.getData(),
      gasFee: IndexerGrpcExplorerTransformer.grpcGasFeeToGasFee(
        tx.getGasFee()!,
      ),
      txType: tx.getTxType(),
      signatures: tx.getSignaturesList().map((signature) => ({
        pubkey: signature.getPubkey(),
        address: signature.getAddress(),
        sequence: signature.getSequence(),
        signature: signature.getSignature(),
      })),
      events: tx.getEventsList().map((event) => ({
        type: event.getType(),
        attributes: event
          .getAttributesMap()
          .toObject()
          .reduce(
            (
              attributes: Record<string, string>,
              attribute: [string, string],
            ) => ({ ...attributes, [attribute[0]]: attribute[1] }),
            {},
          ),
      })),
      messages: JSON.parse(tx.getMessages()),
    }
  }

  static grpcTransactionsToTransactions(
    txs: Array<TxData>,
  ): Array<Transaction> {
    return txs.map((tx) =>
      IndexerGrpcExplorerTransformer.grpcTransactionToTransaction(tx),
    )
  }

  static grpcBlockToBlock(block: BlockInfo): Block {
    return {
      height: block.getHeight(),
      proposer: block.getProposer(),
      moniker: block.getMoniker(),
      blockHash: block.getBlockHash(),
      parentHash: block.getParentHash(),
      numPreCommits: block.getNumPreCommits(),
      numTxs: block.getNumTxs(),
      timestamp: block.getTimestamp(),
    }
  }

  static grpcBlockToBlockWithTxs(block: BlockInfo): BlockWithTxs {
    return {
      height: block.getHeight(),
      proposer: block.getProposer(),
      moniker: block.getMoniker(),
      blockHash: block.getBlockHash(),
      parentHash: block.getParentHash(),
      numPreCommits: block.getNumPreCommits(),
      numTxs: block.getNumTxs(),
      timestamp: block.getTimestamp(),
    }
  }

  static grpcBlocksToBlocks(blocks: Array<BlockInfo>): Array<Block> {
    return blocks.map((block) =>
      IndexerGrpcExplorerTransformer.grpcBlockToBlock(block),
    )
  }

  static grpcBlocksToBlocksWithTxs(
    blocks: Array<BlockInfo>,
  ): Array<BlockWithTxs> {
    return blocks.map((block) =>
      IndexerGrpcExplorerTransformer.grpcBlockToBlockWithTxs(block),
    )
  }

  static grpcValidatorDescriptionToValidatorDescription(
    validatorDescription: GrpcIndexerValidatorDescription,
  ): ExplorerValidatorDescription {
    return {
      moniker: validatorDescription.getMoniker(),
      identity: validatorDescription.getIdentity(),
      website: validatorDescription.getWebsite(),
      securityContact: validatorDescription.getSecurityContact(),
      details: validatorDescription.getDetails(),
    }
  }

  static grpcValidatorUptimeToValidatorUptime(
    validatorUptime: GrpcValidatorUptime,
  ): ValidatorUptime {
    return {
      blockNumber: validatorUptime.getBlockNumber(),
      status: validatorUptime.getStatus(),
    }
  }

  static grpcValidatorSlashingEventToValidatorSlashingEvent(
    validatorUptime: GrpcValidatorSlashingEvent,
  ): ValidatorSlashingEvent {
    return {
      blockNumber: validatorUptime.getBlockNumber(),
      blockTimestamp: validatorUptime.getBlockTimestamp(),
      address: validatorUptime.getAddress(),
      power: validatorUptime.getPower(),
      reason: validatorUptime.getReason(),
      jailed: validatorUptime.getJailed(),
      missedBlocks: validatorUptime.getMissedBlocks(),
    }
  }

  static grpcIBCTransferTxToIBCTransferTx(
    grpcIBCTransferTx: GrpcIBCTransferTx,
  ): IBCTransferTx {
    return {
      sender: grpcIBCTransferTx.getSender(),
      receiver: grpcIBCTransferTx.getReceiver(),
      sourcePort: grpcIBCTransferTx.getSourcePort(),
      sourceChannel: grpcIBCTransferTx.getSourceChannel(),
      destinationPort: grpcIBCTransferTx.getDestinationPort(),
      destinationChannel: grpcIBCTransferTx.getDestinationChannel(),
      amount: grpcIBCTransferTx.getAmount(),
      denom: grpcIBCTransferTx.getDenom(),
      timeoutHeight: grpcIBCTransferTx.getTimeoutHeight(),
      timeoutTimestamp: grpcIBCTransferTx.getTimeoutTimestamp(),
      packetSequence: grpcIBCTransferTx.getPacketSequence(),
      dataHex: grpcIBCTransferTx.getDataHex(),
      state: grpcIBCTransferTx.getState(),
      txHashesList: grpcIBCTransferTx.getTxHashesList(),
      createdAt: grpcIBCTransferTx.getCreatedAt(),
      updatedAt: grpcIBCTransferTx.getUpdatedAt(),
    }
  }

  static grpcPeggyDepositTx(
    grpcPeggyDepositTx: GrpcPeggyDepositTx,
  ): PeggyDepositTx {
    return {
      sender: grpcPeggyDepositTx.getSender(),
      receiver: grpcPeggyDepositTx.getReceiver(),
      eventNonce: grpcPeggyDepositTx.getEventNonce(),
      eventHeight: grpcPeggyDepositTx.getEventHeight(),
      amount: grpcPeggyDepositTx.getAmount(),
      denom: grpcPeggyDepositTx.getDenom(),
      orchestratorAddress: grpcPeggyDepositTx.getOrchestratorAddress(),
      state: grpcPeggyDepositTx.getState(),
      claimType: grpcPeggyDepositTx.getClaimType(),
      txHashesList: grpcPeggyDepositTx.getTxHashesList(),
      createdAt: grpcPeggyDepositTx.getCreatedAt(),
      updatedAt: grpcPeggyDepositTx.getUpdatedAt(),
    }
  }

  static grpcPeggyWithdrawalTx(
    grpcPeggyWithdrawalTx: GrpcPeggyWithdrawalTx,
  ): PeggyWithdrawalTx {
    return {
      sender: grpcPeggyWithdrawalTx.getSender(),
      receiver: grpcPeggyWithdrawalTx.getReceiver(),
      amount: grpcPeggyWithdrawalTx.getAmount(),
      denom: grpcPeggyWithdrawalTx.getDenom(),
      bridgeFee: grpcPeggyWithdrawalTx.getBridgeFee(),
      outgoingTxId: grpcPeggyWithdrawalTx.getOutgoingTxId(),
      batchTimeout: grpcPeggyWithdrawalTx.getBatchTimeout(),
      batchNonce: grpcPeggyWithdrawalTx.getBatchNonce(),
      orchestratorAddress: grpcPeggyWithdrawalTx.getOrchestratorAddress(),
      eventNonce: grpcPeggyWithdrawalTx.getEventNonce(),
      eventHeight: grpcPeggyWithdrawalTx.getEventHeight(),
      state: grpcPeggyWithdrawalTx.getState(),
      claimType: grpcPeggyWithdrawalTx.getClaimType(),
      txHashesList: grpcPeggyWithdrawalTx.getTxHashesList(),
      createdAt: grpcPeggyWithdrawalTx.getCreatedAt(),
      updatedAt: grpcPeggyWithdrawalTx.getUpdatedAt(),
    }
  }
}
