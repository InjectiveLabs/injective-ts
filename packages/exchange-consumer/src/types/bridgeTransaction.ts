import {
  IBCTransferTx as GrpcIBCTransferTx,
  PeggyDepositTx as GrpcPeggyDepositTx,
  PeggyWithdrawalTx as GrpcPeggyWithdrawalTx,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'

export interface IBCTransferTx {
  sender: string
  receiver: string
  sourcePort: string
  sourceChannel: string
  destinationPort: string
  destinationChannel: string
  amount: number
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
  amount: number
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
  amount: number
  denom: string
  bridgeFee: number
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

export { GrpcIBCTransferTx, GrpcPeggyDepositTx, GrpcPeggyWithdrawalTx }
