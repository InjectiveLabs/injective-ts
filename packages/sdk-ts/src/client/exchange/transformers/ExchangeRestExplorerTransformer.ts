import { BigNumberInBase, BigNumberInWei } from '@injectivelabs/utils'
import { Block, ExplorerValidator } from '../types/explorer'
import { TokenType } from '@injectivelabs/token-metadata'
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
  ContractTransaction,
  CW20Message,
  CW20BalanceWithToken,
  WasmCode,
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

  if (!msg.transfer) {
    return ZERO_IN_BASE
  }

  return new BigNumberInWei(msg.transfer.amount).toBase()
}

const parseCW20Message = (jsonObject: string): CW20Message | undefined => {
  if (!jsonObject) {
    return undefined
  }

  return JSON.parse(jsonObject) as CW20Message
}

/**
 * @category Exchange Grpc Transformer
 */
export class ExchangeRestExplorerTransformer {
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
    return blocks.map(ExchangeRestExplorerTransformer.blockToBlock)
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
      messages: (transaction.messages || []).map((message) => ({
        type: message.type,
        message: message.value,
      })),
    }
  }

  static transactionsToTransactions(
    transactions: TransactionFromExplorerApiResponse[],
  ): ExplorerTransaction[] {
    return transactions.map(
      ExchangeRestExplorerTransformer.transactionToTransaction,
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
        ? ExchangeRestExplorerTransformer.transactionsToTransactions(block.txs)
        : [],
    }
  }

  static blocksWithTxsToBlocksWithTxs(
    blocks: BlockFromExplorerApiResponse[],
  ): ExplorerBlockWithTxs[] {
    return blocks.map(ExchangeRestExplorerTransformer.blockWithTxToBlockWithTx)
  }

  static baseTransactionToTransaction(
    transaction: BaseTransaction,
  ): ExplorerTransaction {
    return {
      ...transaction,
      messages: (transaction.messages || []).map((message) => ({
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
        operatorAddress: validator.operator_address,
        proposed: validator.proposed,
        signed: validator.signed,
        missed: validator.missed,
        uptimePercentage: validator.uptime_percentage,
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
      height: transaction.block_number,
      time: transaction.block_unix_timestamp,
      type: transaction.messages[0].type,
      fee: transaction.gas_fee.amount
        ? new BigNumberInWei(transaction.gas_fee.amount[0].amount).toBase()
        : ZERO_IN_BASE,
      amount: getContractTransactionAmount(transaction),
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
    }
  }

  static CW20BalanceToExplorerCW20Balance(
    balance: CW20BalanceExplorerApiResponse,
  ): CW20BalanceWithToken {
    const {
      marketing_info: { logo },
      token_info: { name, symbol, decimals },
    } = balance.cw20_metadata

    return {
      contractAddress: balance.contract_address,
      account: balance.account,
      balance: balance.balance,
      updatedAt: balance.updated_at,
      token: {
        decimals,
        name,
        symbol,
        logo: logo || '',
        address: balance.contract_address,
        coinGeckoId: name,
        denom: '',
        tokenType: TokenType.Cw20,
      },
    }
  }
}
