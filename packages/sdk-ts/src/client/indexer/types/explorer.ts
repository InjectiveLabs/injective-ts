import { BigNumberInBase } from '@injectivelabs/utils'
import type { CosmWasmChecksum, CosmWasmPermission } from './explorer-rest'
import { InjectiveExplorerRpc } from '@injectivelabs/indexer-proto-ts'
import { Coin } from '@injectivelabs/ts-types'
import { TokenStatic } from '../../../types/token'

export interface IBCTransferTx {
  sender: string
  receiver: string
  sourcePort: string
  sourceChannel: string
  destinationPort: string
  destinationChannel: string
  amount: string
  denom: string
  timeoutHeight: string
  timeoutTimestamp: number
  packetSequence: number
  dataHex: Uint8Array | string
  state: string
  txHashesList: string[]
  createdAt: string
  updatedAt: string
}

export interface PeggyDepositTx {
  sender: string
  receiver: string
  eventNonce: number
  eventHeight: number
  amount: string
  denom: string
  orchestratorAddress: string
  state: string
  claimType: number
  txHashesList: string[]
  createdAt: string
  updatedAt: string
}

export interface PeggyWithdrawalTx {
  sender: string
  receiver: string
  amount: string
  denom: string
  bridgeFee: string
  outgoingTxId: number
  batchTimeout: number
  batchNonce: number
  orchestratorAddress: string
  eventNonce: number
  eventHeight: number
  state: string
  claimType: number
  txHashesList: string[]
  createdAt: string
  updatedAt: string
}

export interface GasFee {
  amounts: {
    amount: string
    denom: string
  }[]
  gasLimit: number
  payer: string
  granter: string
}

export interface TxMessage {
  key: string
  value: string
}

export interface GrpcBankMsgSendMessage {
  type: string
  value: {
    amount: [
      {
        amount: string
        denom: string
      },
    ]
    from_address: string
    to_address: string
  }
}

export interface BankMsgSendTransaction {
  blockNumber: number
  blockTimestamp: string
  hash: string
  amount: string
  denom: string
  sender: string
  receiver: string
}

export interface Transaction {
  id: string
  blockNumber: number
  blockTimestamp: string
  hash: string
  memo?: string
  code: number
  data?: Uint8Array | string
  info: string
  gasWanted: number
  gasFee: GasFee
  gasUsed: number
  events?: Array<{
    type: string
    attributes: Record<string, string>
  }>
  txType: string
  signatures: Array<{
    pubkey: string
    address: string
    sequence: number
    signature: string
  }>
  codespace: string
  messages?: Array<TxMessage>
  errorLog?: string
}

export interface IndexerStreamTransaction {
  id: string
  blockNumber: number
  blockTimestamp: string
  hash: string
  codespace: string
  messages: string
  txNumber: number
  errorLog: string
  code: number
}

export interface Block {
  height: number
  proposer: string
  moniker: string
  blockHash: string
  parentHash: string
  numPreCommits: number
  numTxs: number
  timestamp: string
}

export interface BlockWithTxs {
  height: number
  proposer: string
  moniker: string
  blockHash: string
  parentHash: string
  numPreCommits: number
  numTxs: number
  txs?: Transaction[]
  timestamp: string
}

export interface ExplorerValidatorDescription {
  moniker: string
  identity: string
  website: string
  securityContact: string
  details: string
}

export interface ValidatorUptime {
  blockNumber: number
  status: string
}

export interface ValidatorSlashingEvent {
  blockNumber: number
  blockTimestamp: string
  address: string
  power: number
  reason: string
  jailed: string
  missedBlocks: number
}

export interface ExplorerValidator {
  id: string
  moniker: string
  operatorAddress: string
  consensusAddress: string
  jailed: boolean
  status: number
  tokens: string
  delegatorShares: string
  description?: ExplorerValidatorDescription
  unbondingHeight: number
  unbondingTime: string
  commissionRate: string
  commissionMaxRate: string
  commissionMaxChangeRate: string
  commissionUpdateTime: string
  proposed: number
  signed: number
  uptimePercentage: number
  missed: number
  timestamp: string
  uptimesList: ValidatorUptime[]
  slashingEventsList: ValidatorSlashingEvent[]
  imageUrl: string
}

export interface CW20Message {
  decimals: number
  initial_balances: [
    {
      address: string
      amount: string
    },
  ]
  marketing: {}
  mint: {
    minter: string
  }
  name: string
  symbol: string
}

export interface ExplorerCW20BalanceWithToken {
  contractAddress: string
  account: string
  balance: string
  updatedAt: number
  token: TokenStatic
}

export interface Contract {
  label: string
  address: string
  txHash: string
  creator: string
  executes: number
  instantiatedAt: number
  lastExecutedAt: number
  funds?: number
  codeId: number
  admin?: string
  initMessage?: CW20Message
  currentMigrateMessage?: CW20Message
  cw20_metadata?: {
    token_info?: {
      name: string
      symbol: string
      decimals: number
      total_supply: string
    }
  }
}

export interface ContractTransaction {
  txHash: string
  type: string
  code: number
  amount: BigNumberInBase
  fee: BigNumberInBase
  height: number
  time: number
  data: string
  memo: string
  tx_number: number
  error_log: string
}

export interface ContractTransactionWithMessages extends ContractTransaction {
  messages: Array<{
    type: string
    value: {
      sender: string
      contract: string
      msg: Record<string, any>
      funds: string
    }
  }>
}

export interface WasmCode {
  id: number
  txHash: string
  creator: string
  contractType: string
  version: string
  instantiates: number
  creationDate: number
  checksum?: CosmWasmChecksum
  permission?: CosmWasmPermission
  proposalId?: number
}

export interface BankTransferFromExplorerApiResponse {
  sender: string
  recipient: string
  amounts: Coin[]
  block_number: number
  block_timestamp: string
}

export interface BankTransfer {
  sender: string
  recipient: string
  amounts: Coin[]
  blockNumber: number
  blockTimestamp: number
}

export type GrpcIBCTransferTx = InjectiveExplorerRpc.IBCTransferTx
export type GrpcPeggyDepositTx = InjectiveExplorerRpc.PeggyDepositTx
export type GrpcPeggyWithdrawalTx = InjectiveExplorerRpc.PeggyWithdrawalTx
export type GrpcGasFee = InjectiveExplorerRpc.GasFee
export type GrpcValidatorUptime = InjectiveExplorerRpc.ValidatorUptime
export type GrpcIndexerValidatorDescription =
  InjectiveExplorerRpc.ValidatorDescription
export type GrpcValidatorSlashingEvent = InjectiveExplorerRpc.SlashingEvent
