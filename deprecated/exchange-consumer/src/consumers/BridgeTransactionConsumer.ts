import { GrpcException } from '@injectivelabs/exceptions'
import {
  GetPeggyDepositTxsRequest,
  GetPeggyDepositTxsResponse,
  GetPeggyWithdrawalTxsRequest,
  GetPeggyWithdrawalTxsResponse,
  GetIBCTransferTxsRequest,
  GetIBCTransferTxsResponse,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import { InjectiveExplorerRPC } from '@injectivelabs/exchange-api/injective_explorer_rpc_pb_service'
import BaseConsumer from '../BaseConsumer'

export class BridgeTransactionConsumer extends BaseConsumer {
  async fetchPeggyDepositTxs({
    sender,
    receiver,
    limit,
    skip,
  }: {
    receiver: string
    sender?: string
    limit?: number
    skip?: number
  }) {
    const request = new GetPeggyDepositTxsRequest()

    if (sender) {
      request.setSender(sender)
    }

    if (receiver) {
      request.setReceiver(receiver)
    }

    if (limit) {
      request.setLimit(limit)
    }

    if (skip) {
      request.setSkip(skip)
    }

    try {
      const response = await this.request<
        GetPeggyDepositTxsRequest,
        GetPeggyDepositTxsResponse,
        typeof InjectiveExplorerRPC.GetPeggyDepositTxs
      >(request, InjectiveExplorerRPC.GetPeggyDepositTxs)

      return response.getFieldList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchPeggyWithdrawalTxs({
    sender,
    receiver,
    limit,
    skip,
  }: {
    sender: string
    receiver?: string
    limit?: number
    skip?: number
  }) {
    const request = new GetPeggyWithdrawalTxsRequest()

    if (sender) {
      request.setSender(sender)
    }

    if (receiver) {
      request.setReceiver(receiver)
    }

    if (limit) {
      request.setLimit(limit)
    }

    if (skip) {
      request.setSkip(skip)
    }

    try {
      const response = await this.request<
        GetPeggyWithdrawalTxsRequest,
        GetPeggyWithdrawalTxsResponse,
        typeof InjectiveExplorerRPC.GetPeggyWithdrawalTxs
      >(request, InjectiveExplorerRPC.GetPeggyWithdrawalTxs)

      return response.getFieldList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchIBCTransferTxs({
    sender,
    receiver,
    srcChannel,
    srcPort,
    destChannel,
    destPort,
    limit,
    skip,
  }: {
    sender: string
    receiver: string
    srcChannel?: string
    srcPort?: string
    destChannel?: string
    destPort?: string
    limit?: number
    skip?: number
  }) {
    const request = new GetIBCTransferTxsRequest()

    if (sender) {
      request.setSender(sender)
    }

    if (receiver) {
      request.setReceiver(receiver)
    }

    if (limit) {
      request.setLimit(limit)
    }

    if (skip) {
      request.setSkip(skip)
    }

    if (srcChannel) {
      request.setSrcChannel(srcChannel)
    }
    if (srcPort) {
      request.setSrcPort(srcPort)
    }
    if (destChannel) {
      request.setDestChannel(destChannel)
    }
    if (destPort) {
      request.setDestPort(destPort)
    }

    try {
      const response = await this.request<
        GetIBCTransferTxsRequest,
        GetIBCTransferTxsResponse,
        typeof InjectiveExplorerRPC.GetIBCTransferTxs
      >(request, InjectiveExplorerRPC.GetIBCTransferTxs)

      return response.getFieldList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
