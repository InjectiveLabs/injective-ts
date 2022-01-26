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

export { GrpcIBCTransferTx, GrpcPeggyDepositTx, GrpcPeggyWithdrawalTx }
