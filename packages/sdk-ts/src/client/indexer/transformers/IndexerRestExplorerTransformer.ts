import { BigNumberInBase, BigNumberInWei } from '@injectivelabs/utils'
import {
  Block,
  ContractTransactionWithMessages,
  ExplorerValidator,
} from '../types/explorer'
import { TokenType, TokenVerification } from '../../../types/token'
import {
  BaseTransaction,
  BlockFromExplorerApiResponse,
  ContractExplorerApiResponse,
  ContractTransactionExplorerApiResponse,
  CW20BalanceExplorerApiResponse,
  ExplorerBlockWithTxs,
  ExplorerTransaction,
  ExplorerValidatorUptime,
  TransactionFromExplorerApiResponse,
  ValidatorUptimeFromExplorerApiResponse,
  WasmCodeExplorerApiResponse,
} from '../types/explorer-rest'
import {
  Contract,
  WasmCode,
  CW20Message,
  BankTransfer,
  ContractTransaction,
  ExplorerCW20BalanceWithToken,
  BankTransferFromExplorerApiResponse,
} from '../types/explorer'

const ZERO_IN_BASE = new BigNumberInBase(0)

const getContractTransactionAmount = (
  ApiTransaction: ContractTransactionExplorerApiResponse,
): BigNumberInBase => {
  const {
    type,
    value: { msg },
  } = ApiTransaction.messages[0]

  if (!type.includes('MsgExecuteContract')) {
    return ZERO_IN_BASE
  }

  const msgObj = typeof msg === 'string' ? JSON.parse(msg) : msg

  if (!msgObj.transfer) {
    return ZERO_IN_BASE
  }

  return new BigNumberInWei(msgObj.transfer.amount).toBase()
}

const parseCW20Message = (jsonObject: string): CW20Message | undefined => {
  if (!jsonObject) {
    return undefined
  }

  return JSON.parse(jsonObject) as CW20Message
}

/**
 * @category Indexer Rest Transformer
 */
export class IndexerRestExplorerTransformer {
  static blockToBlock(block: BlockFromExplorerApiResponse): Block {
    return {
      height: block.height,
      proposer: block.proposer,
      moniker: block.moniker,
      blockHash: block.block_hash,
      parentHash: block.parent_hash,
      numPreCommits: block.num_pre_commits,
      numTxs: block.num_txs,
      timestamp: block.timestamp,
    }
  }

  static blocksToBlocks(blocks: BlockFromExplorerApiResponse[]): Block[] {
    return blocks.map(IndexerRestExplorerTransformer.blockToBlock)
  }

  static transactionToTransaction(
    transaction: TransactionFromExplorerApiResponse,
  ): ExplorerTransaction {
    return {
      id: transaction.id,
      blockNumber: transaction.block_number,
      blockTimestamp: transaction.block_timestamp,
      hash: transaction.hash,
      code: transaction.code,
      info: transaction.info,
      memo: transaction.memo || '',
      gasWanted: transaction.gas_wanted,
      gasFee: {
        amounts: transaction.gas_fee?.amount,
        gasLimit: transaction.gas_fee?.gas_limit,
        payer: transaction.gas_fee?.payer,
        granter: transaction.gas_fee?.granter,
      },
      gasUsed: transaction.gas_used,
      codespace: transaction.codespace,
      signatures: transaction.signatures,
      txType: transaction.tx_type,
      data: transaction.data,
      events: transaction.events || [],
      messages: (transaction.messages || [])
        .filter((m) => m)
        .map((message) => ({
          type: message.type,
          message: message.value,
        })),
      logs: transaction.logs,
      errorLog: transaction.error_log,
      claimIds: transaction.claim_id || [],
    }
  }

  static transactionsToTransactions(
    transactions: TransactionFromExplorerApiResponse[],
  ): ExplorerTransaction[] {
    return transactions.map(
      IndexerRestExplorerTransformer.transactionToTransaction,
    )
  }

  static blockWithTxToBlockWithTx(
    block: BlockFromExplorerApiResponse,
  ): ExplorerBlockWithTxs {
    return {
      height: block.height,
      proposer: block.proposer,
      moniker: block.moniker,
      blockHash: block.block_hash,
      parentHash: block.parent_hash,
      numPreCommits: block.num_pre_commits,
      numTxs: block.num_txs,
      timestamp: block.timestamp,
      txs: block.txs
        ? IndexerRestExplorerTransformer.transactionsToTransactions(block.txs)
        : [],
    }
  }

  static blocksWithTxsToBlocksWithTxs(
    blocks: BlockFromExplorerApiResponse[],
  ): ExplorerBlockWithTxs[] {
    return blocks.map(IndexerRestExplorerTransformer.blockWithTxToBlockWithTx)
  }

  static baseTransactionToTransaction(
    transaction: BaseTransaction,
  ): ExplorerTransaction {
    return {
      ...transaction,
      messages: (transaction.messages || [])
        .filter((m) => m)
        .map((message) => ({
          type: (message as any).type,
          message: message.value,
        })),
      memo: transaction.memo || '',
    }
  }

  static validatorExplorerToValidator(
    validators: any[],
  ): Partial<ExplorerValidator>[] {
    return validators.map((validator) => {
      return {
        id: validator.id,
        moniker: validator.moniker,
        consensusAddress: validator.consensus_address,
        operatorAddress: validator.operator_address,
        proposed: validator.proposed,
        signed: validator.signed,
        missed: validator.missed,
        uptimePercentage: validator.uptime_percentage,
        imageUrl: validator.imageURL,
      }
    })
  }

  static validatorUptimeToExplorerValidatorUptime(
    validatorUptimeList: ValidatorUptimeFromExplorerApiResponse[],
  ): ExplorerValidatorUptime[] {
    return validatorUptimeList.map(
      (validatorUptime: ValidatorUptimeFromExplorerApiResponse) => ({
        blockNumber: validatorUptime.block_number,
        status: validatorUptime.status,
      }),
    )
  }

  static contractToExplorerContract(
    contract: ContractExplorerApiResponse,
  ): Contract {
    return {
      label: contract.label,
      address: contract.address,
      txHash: contract.tx_hash,
      creator: contract.creator,
      executes: contract.executes,
      instantiatedAt: contract.instantiated_at,
      lastExecutedAt: contract.last_executed_at,
      funds: contract.funds,
      codeId: contract.code_id,
      admin: contract.admin,
      cw20_metadata: contract.cw20_metadata,
      initMessage: parseCW20Message(contract.init_message),
      currentMigrateMessage: parseCW20Message(contract.current_migrate_message),
    }
  }

  static contractTransactionToExplorerContractTransaction(
    transaction: ContractTransactionExplorerApiResponse,
  ): ContractTransaction {
    return {
      txHash: transaction.hash,
      code: transaction.code,
      data: transaction.data,
      memo: transaction.memo,
      tx_number: transaction.tx_number,
      error_log: transaction.error_log,
      height: transaction.block_number,
      time: transaction.block_unix_timestamp,
      type: transaction.messages[0].type,
      logs: transaction.logs,
      signatures: transaction.signatures,
      fee: transaction.gas_fee.amount
        ? new BigNumberInWei(transaction.gas_fee.amount[0].amount).toBase()
        : ZERO_IN_BASE,
      amount: getContractTransactionAmount(transaction),
    }
  }

  static contractTransactionToExplorerContractTransactionWithMessages(
    transaction: ContractTransactionExplorerApiResponse,
  ): ContractTransactionWithMessages {
    return {
      ...IndexerRestExplorerTransformer.contractTransactionToExplorerContractTransaction(
        transaction,
      ),
      messages: (transaction.messages || []).map((message) => {
        return {
          type: message.type,
          value: {
            ...message.value,
            msg:
              typeof message.value.msg === 'string'
                ? (JSON.parse(message.value.msg) as Record<string, any>)
                : message.value.msg,
          },
        }
      }),
    }
  }

  static wasmCodeToExplorerWasmCode(
    wasmCode: WasmCodeExplorerApiResponse,
  ): WasmCode {
    return {
      id: wasmCode.code_id,
      txHash: wasmCode.tx_hash,
      creator: wasmCode.creator,
      contractType: wasmCode.contract_type,
      version: wasmCode.version,
      instantiates: wasmCode.instantiates,
      creationDate: wasmCode.created_at,
      checksum: wasmCode.checksum,
      permission: wasmCode.permission,
      proposalId: wasmCode.proposal_id,
    }
  }

  static CW20BalanceToExplorerCW20Balance(
    balance: CW20BalanceExplorerApiResponse,
  ): ExplorerCW20BalanceWithToken {
    const {
      marketing_info,
      token_info: { name, symbol, decimals },
    } = balance.cw20_metadata || { token_info: {} }

    return {
      contractAddress: balance.contract_address,
      account: balance.account,
      balance: balance.balance,
      updatedAt: balance.updated_at,
      token: {
        address: balance.contract_address,
        denom: balance.contract_address,
        decimals,
        name,
        symbol,
        tokenVerification: TokenVerification.Internal,
        logo: marketing_info?.logo || '',
        coinGeckoId: name,
        tokenType: TokenType.Cw20,
      },
    }
  }

  static bankTransferToBankTransfer(
    transfer: BankTransferFromExplorerApiResponse,
  ): BankTransfer {
    return {
      sender: transfer.sender,
      recipient: transfer.recipient,
      amounts: transfer.amounts,
      blockNumber: transfer.block_number,
      blockTimestamp: new Date(transfer.block_timestamp).getTime(),
    }
  }

  static bankTransfersToBankTransfers(
    transfers: BankTransferFromExplorerApiResponse[],
  ): BankTransfer[] {
    return transfers.map(
      IndexerRestExplorerTransformer.bankTransferToBankTransfer,
    )
  }
}
