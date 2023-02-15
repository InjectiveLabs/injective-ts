import {
  BlockInfo,
  GetTxByTxHashResponse as TxData,
  StreamTxsResponse,
  TxDetailData,
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
      txs: IndexerGrpcExplorerTransformer.grpcTransactionsToTransactionsFromDetail(
        txs,
      ),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static getValidatorUptimeResponseToValidatorUptime(
    response: GetValidatorUptimeResponse,
  ) {
    const data = response.getDataList()

    return data.map((field) =>
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
    const data = validator.getData()!

    return {
      id: data.getId(),
      moniker: data.getMoniker(),
      operatorAddress: data.getOperatorAddress(),
      consensusAddress: data.getConsensusAddress(),
      jailed: data.getJailed(),
      status: data.getStatus(),
      tokens: data.getTokens(),
      delegatorShares: data.getDelegatorShares(),
      description:
        IndexerGrpcExplorerTransformer.grpcValidatorDescriptionToValidatorDescription(
          data.getDescription()!,
        ),
      unbondingHeight: data.getUnbondingHeight(),
      unbondingTime: data.getUnbondingTime(),
      commissionRate: data.getCommissionRate(),
      commissionMaxRate: data.getCommissionMaxRate(),
      commissionMaxChangeRate: data.getCommissionMaxChangeRate(),
      commissionUpdateTime: data.getCommissionUpdateTime(),
      proposed: data.getProposed(),
      signed: data.getSigned(),
      missed: data.getMissed(),
      uptimePercentage: data.getUptimePercentage(),
      timestamp: data.getTimestamp(),
      uptimesList: data
        .getUptimesList()
        .map(
          IndexerGrpcExplorerTransformer.grpcValidatorUptimeToValidatorUptime,
        ),
      slashingEventsList: data
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
    const data = tx.getData()!
    const [message] = JSON.parse(
      data.getMessages() as string,
    ) as GrpcBankMsgSendMessage[]

    return {
      blockNumber: data.getBlockNumber(),
      blockTimestamp: data.getBlockTimestamp(),
      hash: data.getHash(),
      amount: message.value.amount[0].amount,
      denom: message.value.amount[0].denom,
      sender: message.value.from_address,
      receiver: message.value.to_address,
    }
  }

  static grpcTransactionToTransaction(tx: TxData): Transaction {
    const data = tx.getData()!
    const gasFee = data.getGasFee()

    return {
      id: data.getId(),
      blockNumber: data.getBlockNumber(),
      blockTimestamp: data.getBlockTimestamp(),
      hash: data.getHash(),
      code: data.getCode(),
      info: data.getInfo(),
      gasWanted: data.getGasWanted(),
      gasUsed: data.getGasUsed(),
      codespace: data.getCodespace(),
      data: data.getData(),
      gasFee: gasFee
        ? IndexerGrpcExplorerTransformer.grpcGasFeeToGasFee(data.getGasFee()!)
        : {
            gasLimit: 0,
            payer: '',
            granter: '',
            amounts: [],
          },
      txType: data.getTxType(),
      signatures: data.getSignaturesList().map((signature) => ({
        pubkey: signature.getPubkey(),
        address: signature.getAddress(),
        sequence: signature.getSequence(),
        signature: signature.getSignature(),
      })),
      events: data.getEventsList().map((event) => ({
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
      messages: JSON.parse(data.getMessages() as string),
    }
  }

  static grpcTransactionsToTransactions(
    txs: Array<TxData>,
  ): Array<Transaction> {
    return txs.map((tx) =>
      IndexerGrpcExplorerTransformer.grpcTransactionToTransaction(tx),
    )
  }

  static grpcTransactionToTransactionFromDetail(tx: TxDetailData): Transaction {
    const messages = JSON.parse(Buffer.from(tx.getMessages()).toString('utf8'))

    return {
      ...tx.toObject(),
      signatures: tx.getSignaturesList().map((signature) => ({
        pubkey: signature.getPubkey(),
        address: signature.getAddress(),
        sequence: signature.getSequence(),
        signature: signature.getSignature(),
      })),
      gasFee: tx.getGasFee()
        ? IndexerGrpcExplorerTransformer.grpcGasFeeToGasFee(tx.getGasFee()!)
        : {
            gasLimit: 0,
            payer: '',
            granter: '',
            amounts: [],
          },
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
      messages,
    }
  }

  static grpcTransactionsToTransactionsFromDetail(
    txs: TxDetailData[],
  ): Array<Transaction> {
    return txs.map(
      IndexerGrpcExplorerTransformer.grpcTransactionToTransactionFromDetail,
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
