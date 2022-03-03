import {
  BlockInfo,
  GetValidatorResponse,
  TxData,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import {
  BankMsgSendTransaction,
  Block,
  BlockWithTxs,
  GasFee,
  GrpcBankMsgSendMessage,
  GrpcGasFee,
  GrpcValidatorDescription,
  GrpcValidatorSlashingEvent,
  GrpcValidatorUptime,
  Transaction,
  Validator,
  ValidatorDescription,
  ValidatorSlashingEvent,
  ValidatorUptime,
} from '../types/index'

export class ExplorerTransformer {
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
      gasFee: ExplorerTransformer.grpcGasFeeToGasFee(tx.getGasFee()!),
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
    return txs.map((tx) => ExplorerTransformer.grpcTransactionToTransaction(tx))
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
    return blocks.map((block) => ExplorerTransformer.grpcBlockToBlock(block))
  }

  static grpcBlocksToBlocksWithTxs(
    blocks: Array<BlockInfo>,
  ): Array<BlockWithTxs> {
    return blocks.map((block) =>
      ExplorerTransformer.grpcBlockToBlockWithTxs(block),
    )
  }

  static grpcValidatorDescriptionToValidatorDescription(
    validatorDescription: GrpcValidatorDescription,
  ): ValidatorDescription {
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

  static grpcValidatorToValidator(validator: GetValidatorResponse): Validator {
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
        ExplorerTransformer.grpcValidatorDescriptionToValidatorDescription(
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
      timestamp: validator.getTimestamp(),
      uptimesList: validator
        .getUptimesList()
        .map(ExplorerTransformer.grpcValidatorUptimeToValidatorUptime),
      slashingEventsList: validator
        .getSlashingEventsList()
        .map(
          ExplorerTransformer.grpcValidatorSlashingEventToValidatorSlashingEvent,
        ),
    }
  }
}
