import { Token } from '@injectivelabs/token-metadata'
import { BigNumberInBase } from '@injectivelabs/utils'
import {
  IBCTransferTx as GrpcIBCTransferTx,
  PeggyDepositTx as GrpcPeggyDepositTx,
  PeggyWithdrawalTx as GrpcPeggyWithdrawalTx,
  GasFee as GrpcGasFee,
  ValidatorUptime as GrpcValidatorUptime,
  ValidatorDescription as GrpcIndexerValidatorDescription,
  SlashingEvent as GrpcValidatorSlashingEvent,
} from '@injectivelabs/indexer-api/injective_explorer_rpc_pb'
import { CosmWasmChecksum, CosmWasmPermission } from './explorer-rest'

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

export interface CW20BalanceWithToken {
  contractAddress: string
  account: string
  balance: string
  updatedAt: number
  token: Token
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
}

export interface ContractTransaction {
  txHash: string
  type: string
  code: number
  amount: BigNumberInBase
  fee: BigNumberInBase
  height: number
  time: number
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
}

export { GrpcIBCTransferTx, GrpcPeggyDepositTx, GrpcPeggyWithdrawalTx }
export {
  GrpcGasFee,
  GrpcValidatorSlashingEvent,
  GrpcIndexerValidatorDescription,
  GrpcValidatorUptime,
}
