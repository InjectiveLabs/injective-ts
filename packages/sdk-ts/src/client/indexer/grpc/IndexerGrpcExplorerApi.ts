import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveExplorerRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcExplorerTransformer } from '../transformers/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcExplorerApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Explorer

  protected client: InjectiveExplorerRpc.InjectiveExplorerRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveExplorerRpc.InjectiveExplorerRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchTxByHash(hash: string) {
    const request = InjectiveExplorerRpc.GetTxByTxHashRequest.create()

    request.hash = hash

    try {
      const response = await this.client.GetTxByTxHash(request, this.metadata)

      return IndexerGrpcExplorerTransformer.getTxByTxHashResponseToTx(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetTxByTxHash',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetTxByTxHash',
        contextModule: this.module,
      })
    }
  }

  async fetchAccountTx({
    address,
    limit,
    type,
    before,
    after,
    startTime,
    endTime,
  }: {
    address: string
    limit?: number
    type?: string
    before?: number
    after?: number
    startTime?: number
    endTime?: number
  }) {
    const request = InjectiveExplorerRpc.GetAccountTxsRequest.create()

    request.address = address

    if (limit) {
      request.limit = limit
    }

    if (before) {
      request.before = before.toString()
    }

    if (after) {
      request.after = after.toString()
    }

    if (before) {
      request.before = before.toString()
    }

    if (startTime) {
      request.startTime = startTime.toString()
    }

    if (endTime) {
      request.endTime = endTime.toString()
    }

    if (type) {
      request.type = type
    }

    try {
      const response =
        await this.retry<InjectiveExplorerRpc.GetAccountTxsResponse>(() =>
          this.client.GetAccountTxs(request, this.metadata),
        )

      return IndexerGrpcExplorerTransformer.getAccountTxsResponseToAccountTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetAccountTxs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetAccountTxs',
        contextModule: this.module,
      })
    }
  }

  async fetchValidator(validatorAddress: string) {
    const request = InjectiveExplorerRpc.GetValidatorRequest.create()

    request.address = validatorAddress

    try {
      const response =
        await this.retry<InjectiveExplorerRpc.GetValidatorResponse>(() =>
          this.client.GetValidator(request, this.metadata),
        )

      return IndexerGrpcExplorerTransformer.validatorResponseToValidator(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetValidator',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetValidator',
        contextModule: this.module,
      })
    }
  }

  async fetchValidatorUptime(validatorAddress: string) {
    const request = InjectiveExplorerRpc.GetValidatorUptimeRequest.create()

    request.address = validatorAddress

    try {
      const response =
        await this.retry<InjectiveExplorerRpc.GetValidatorUptimeResponse>(() =>
          this.client.GetValidatorUptime(request, this.metadata),
        )

      return IndexerGrpcExplorerTransformer.getValidatorUptimeResponseToValidatorUptime(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetValidatorUptime',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetValidatorUptime',
        contextModule: this.module,
      })
    }
  }

  async fetchPeggyDepositTxs({
    sender,
    receiver,
    limit,
    skip,
  }: {
    receiver?: string
    sender?: string
    limit?: number
    skip?: number
  }) {
    const request = InjectiveExplorerRpc.GetPeggyDepositTxsRequest.create()

    if (sender) {
      request.sender = sender
    }

    if (receiver) {
      request.receiver = receiver
    }

    if (limit) {
      request.limit = limit
    }

    if (skip) {
      request.skip = skip.toString()
    }

    try {
      const response =
        await this.retry<InjectiveExplorerRpc.GetPeggyDepositTxsResponse>(() =>
          this.client.GetPeggyDepositTxs(request, this.metadata),
        )

      return IndexerGrpcExplorerTransformer.getPeggyDepositTxsResponseToPeggyDepositTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetPeggyDepositTxs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetPeggyDepositTxs',
        contextModule: this.module,
      })
    }
  }

  async fetchPeggyWithdrawalTxs({
    sender,
    receiver,
    limit,
    skip,
  }: {
    sender?: string
    receiver?: string
    limit?: number
    skip?: number
  }) {
    const request = InjectiveExplorerRpc.GetPeggyWithdrawalTxsRequest.create()

    if (sender) {
      request.sender = sender
    }

    if (receiver) {
      request.receiver = receiver
    }

    if (limit) {
      request.limit = limit
    }

    if (skip) {
      request.skip = skip.toString()
    }

    try {
      const response =
        await this.retry<InjectiveExplorerRpc.GetPeggyWithdrawalTxsResponse>(
          () => this.client.GetPeggyWithdrawalTxs(request, this.metadata),
        )

      return IndexerGrpcExplorerTransformer.getPeggyWithdrawalTxsResponseToPeggyWithdrawalTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetPeggyWithdrawalTxs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetPeggyWithdrawalTxs',
        contextModule: this.module,
      })
    }
  }

  async fetchBlocks({
    before,
    after,
    limit,
    from,
    to,
  }: {
    before?: number
    after?: number
    limit?: number
    from?: number
    to?: number
  }) {
    const request = InjectiveExplorerRpc.GetBlocksRequest.create()

    if (before) {
      request.before = before.toString()
    }

    if (after) {
      request.after = after.toString()
    }

    if (from) {
      request.from = from.toString()
    }

    if (to) {
      request.to = to.toString()
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response = await this.retry<InjectiveExplorerRpc.GetBlocksResponse>(
        () => this.client.GetBlocks(request, this.metadata),
      )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetBlocks',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetBlocks',
        contextModule: this.module,
      })
    }
  }

  async fetchBlock(id: string) {
    const request = InjectiveExplorerRpc.GetBlockRequest.create()

    request.id = id

    try {
      const response = await this.retry<InjectiveExplorerRpc.GetBlockResponse>(
        () => this.client.GetBlock(request, this.metadata),
      )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetBlock',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetBlock',
        contextModule: this.module,
      })
    }
  }

  async fetchTxs({
    before,
    after,
    limit,
    skip,
    type,
    chainModule,
    startTime,
    endTime,
  }: {
    before?: number
    after?: number
    limit?: number
    skip?: number
    type?: string
    startTime?: number
    endTime?: number
    chainModule?: string
  }) {
    const request = InjectiveExplorerRpc.GetTxsRequest.create()

    if (before) {
      request.before = before.toString()
    }

    if (after) {
      request.after = after.toString()
    }

    if (limit) {
      request.limit = limit
    }

    if (skip) {
      request.skip = skip.toString()
    }

    if (type) {
      request.type = type
    }

    if (chainModule) {
      request.module = chainModule
    }

    if (before) {
      request.before = before.toString()
    }

    if (startTime) {
      request.startTime = startTime.toString()
    }

    if (endTime) {
      request.endTime = endTime.toString()
    }

    try {
      const response = await this.retry<InjectiveExplorerRpc.GetTxsResponse>(
        () => this.client.GetTxs(request, this.metadata),
      )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetTxs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetTxs',
        contextModule: this.module,
      })
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
    sender?: string
    receiver?: string
    srcChannel?: string
    srcPort?: string
    destChannel?: string
    destPort?: string
    limit?: number
    skip?: number
  }) {
    const request = InjectiveExplorerRpc.GetIBCTransferTxsRequest.create()

    if (sender) {
      request.sender = sender
    }

    if (receiver) {
      request.receiver = receiver
    }

    if (limit) {
      request.limit = limit
    }

    if (skip) {
      request.skip = skip.toString()
    }

    if (srcChannel) {
      request.srcChannel = srcChannel
    }

    if (srcPort) {
      request.srcPort = srcPort
    }

    if (destChannel) {
      request.destChannel = destChannel
    }

    if (destPort) {
      request.destPort = destPort
    }

    try {
      const response =
        await this.retry<InjectiveExplorerRpc.GetIBCTransferTxsResponse>(() =>
          this.client.GetIBCTransferTxs(request, this.metadata),
        )

      return IndexerGrpcExplorerTransformer.getIBCTransferTxsResponseToIBCTransferTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetIBCTransferTxs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetIBCTransferTxs',
        contextModule: this.module,
      })
    }
  }

  async fetchExplorerStats() {
    const request = InjectiveExplorerRpc.GetStatsRequest.create()

    try {
      const response = await this.retry<InjectiveExplorerRpc.GetStatsResponse>(
        () => this.client.GetStats(request, this.metadata),
      )

      return IndexerGrpcExplorerTransformer.getExplorerStatsResponseToExplorerStats(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'GetExplorerStats',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'GetExplorerStats',
        contextModule: this.module,
      })
    }
  }
}
