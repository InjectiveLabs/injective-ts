import {
  GetTxByTxHashRequest,
  GetTxByTxHashResponse,
  GetAccountTxsRequest,
  GetAccountTxsResponse,
  GetValidatorRequest,
  GetValidatorResponse,
  GetValidatorUptimeRequest,
  GetValidatorUptimeResponse,
  GetPeggyDepositTxsRequest,
  GetPeggyDepositTxsResponse,
  GetPeggyWithdrawalTxsRequest,
  GetPeggyWithdrawalTxsResponse,
  GetIBCTransferTxsRequest,
  GetIBCTransferTxsResponse,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import { InjectiveExplorerRPC } from '@injectivelabs/exchange-api/injective_explorer_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'

export class ExplorerApi extends BaseConsumer {
  async txByHash(hash: string) {
    const request = new GetTxByTxHashRequest()
    request.setHash(hash)

    try {
      const response = await this.request<
        GetTxByTxHashRequest,
        GetTxByTxHashResponse,
        typeof InjectiveExplorerRPC.GetTxByTxHash
      >(request, InjectiveExplorerRPC.GetTxByTxHash)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async accountTx({
    address,
    limit,
    type,
  }: {
    address: string
    limit: number
    type?: string
  }) {
    const request = new GetAccountTxsRequest()
    request.setAddress(address)

    if (limit) {
      request.setLimit(limit)
    }

    if (type) {
      request.setType(type)
    }

    try {
      const response = await this.request<
        GetAccountTxsRequest,
        GetAccountTxsResponse,
        typeof InjectiveExplorerRPC.GetAccountTxs
      >(request, InjectiveExplorerRPC.GetAccountTxs)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async validator(validatorAddress: string) {
    const request = new GetValidatorRequest()
    request.setAddress(validatorAddress)

    try {
      const response = await this.request<
        GetValidatorRequest,
        GetValidatorResponse,
        typeof InjectiveExplorerRPC.GetValidator
      >(request, InjectiveExplorerRPC.GetValidator)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async validatorUptime(validatorAddress: string) {
    const request = new GetValidatorUptimeRequest()
    request.setAddress(validatorAddress)

    try {
      const response = await this.request<
        GetValidatorUptimeRequest,
        GetValidatorUptimeResponse,
        typeof InjectiveExplorerRPC.GetValidatorUptime
      >(request, InjectiveExplorerRPC.GetValidatorUptime)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async peggyDepositTxs({
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async peggyWithdrawalTxs({
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async iBCTransferTxs({
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
