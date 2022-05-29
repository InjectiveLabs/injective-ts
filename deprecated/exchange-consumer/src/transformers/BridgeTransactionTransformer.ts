import {
  IBCTransferTx,
  PeggyDepositTx,
  PeggyWithdrawalTx,
  GrpcIBCTransferTx,
  GrpcPeggyDepositTx,
  GrpcPeggyWithdrawalTx,
} from '../types'

export class BridgeTransactionTransformer {
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
