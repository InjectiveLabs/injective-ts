/* eslint-disable camelcase */
import {
  GasFee as GrpcGasFee,
  ValidatorUptime as GrpcValidatorUptime,
  ValidatorDescription as GrpcValidatorDescription,
  SlashingEvent as GrpcValidatorSlashingEvent,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'

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

export interface ValidatorDescription {
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

export interface Validator {
  id: string
  moniker: string
  operatorAddress: string
  consensusAddress: string
  jailed: boolean
  status: number
  tokens: string
  delegatorShares: string
  description?: ValidatorDescription
  unbondingHeight: number
  unbondingTime: string
  commissionRate: string
  commissionMaxRate: string
  commissionMaxChangeRate: string
  commissionUpdateTime: string
  proposed: number
  signed: number
  missed: number
  timestamp: string
  uptimesList: ValidatorUptime[]
  slashingEventsList: ValidatorSlashingEvent[]
}

export {
  GrpcGasFee,
  GrpcValidatorSlashingEvent,
  GrpcValidatorDescription,
  GrpcValidatorUptime,
}
