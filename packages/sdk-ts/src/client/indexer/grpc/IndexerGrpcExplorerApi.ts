import { IndexerGrpcExplorerTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { InjectiveExplorerRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcExplorerApi {
  protected module: string = IndexerModule.Explorer

  protected client: InjectiveExplorerRpc.InjectiveExplorerRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveExplorerRpc.InjectiveExplorerRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchTxByHash(hash: string) {
    const request = InjectiveExplorerRpc.GetTxByTxHashRequest.create()

    request.hash = hash

    try {
      const response = await this.client.GetTxByTxHash(request)

      return IndexerGrpcExplorerTransformer.getTxByTxHashResponseToTx(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchAccountTx({
    address,
    limit,
    type,
  }: {
    address: string
    limit?: number
    type?: string
  }) {
    const request = InjectiveExplorerRpc.GetAccountTxsRequest.create()
    request.address = address

    if (limit) {
      request.limit = limit
    }

    if (type) {
      request.type = type
    }

    try {
      const response = await this.client.GetAccountTxs(request)

      return IndexerGrpcExplorerTransformer.getAccountTxsResponseToAccountTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchValidator(validatorAddress: string) {
    const request = InjectiveExplorerRpc.GetValidatorRequest.create()

    request.address = validatorAddress

    try {
      const response = await this.client.GetValidator(request)

      return IndexerGrpcExplorerTransformer.validatorResponseToValidator(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchValidatorUptime(validatorAddress: string) {
    const request = InjectiveExplorerRpc.GetValidatorUptimeRequest.create()

    request.address = validatorAddress

    try {
      const response = await this.client.GetValidatorUptime(request)

      return IndexerGrpcExplorerTransformer.getValidatorUptimeResponseToValidatorUptime(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
      const response = await this.client.GetPeggyDepositTxs(request)

      return IndexerGrpcExplorerTransformer.getPeggyDepositTxsResponseToPeggyDepositTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
      const response = await this.client.GetPeggyWithdrawalTxs(request)

      return IndexerGrpcExplorerTransformer.getPeggyWithdrawalTxsResponseToPeggyWithdrawalTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBlocks({
    before,
    after,
    limit,
  }: {
    before?: number
    after?: number
    limit?: number
  }) {
    const request = InjectiveExplorerRpc.GetBlocksRequest.create()

    if (before) {
      request.before = before.toString()
    }

    if (after) {
      request.after = after.toString()
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response = await this.client.GetBlocks(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBlock(id: string) {
    const request = InjectiveExplorerRpc.GetBlockRequest.create()

    request.id = id

    try {
      const response = await this.client.GetBlock(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
    module,
  }: {
    before?: number
    after?: number
    limit?: number
    skip?: number
    type?: string
    module?: string
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

    if (module) {
      request.module = module
    }

    try {
      const response = await this.client.GetTxs(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
      const response = await this.client.GetIBCTransferTxs(request)

      return IndexerGrpcExplorerTransformer.getIBCTransferTxsResponseToIBCTransferTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveExplorerRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
