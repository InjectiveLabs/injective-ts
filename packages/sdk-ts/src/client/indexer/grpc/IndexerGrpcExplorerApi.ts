import {
  InjectiveExplorerRpcPb,
  InjectiveExplorerRPCClient,
} from '@injectivelabs/indexer-proto-ts-v2'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcExplorerTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumerV2 from '../../base/BaseIndexerGrpcConsumerV2.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcExplorerApi extends BaseIndexerGrpcConsumerV2 {
  protected module: string = IndexerModule.Explorer
  private client: InjectiveExplorerRPCClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveExplorerRPCClient(this.transport)
  }

  async fetchTxByHash(hash: string, isEvmHash: boolean = false) {
    const request = InjectiveExplorerRpc.GetTxByTxHashRequest.create()

    request.hash = hash

    request.isEvmHash = isEvmHash

    try {
      const response = await this.client.GetTxByTxHash(request, this.metadata)
  async fetchTxByHash(hash: string, isEvmHash: boolean = false) {
    const request = InjectiveExplorerRpcPb.GetTxByTxHashRequest.create()

    request.hash = hash
    request.isEvmHash = isEvmHash

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetTxByTxHashRequest,
      InjectiveExplorerRpcPb.GetTxByTxHashResponse
    >(request, this.client.getTxByTxHash.bind(this.client))

    return IndexerGrpcExplorerTransformer.getTxByTxHashResponseToTx(response)
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
    const request = InjectiveExplorerRpcPb.GetAccountTxsRequest.create()

    request.address = address

    if (limit) {
      request.limit = limit
    }

    if (before) {
      request.before = BigInt(before)
    }

    if (after) {
      request.after = BigInt(after)
    }

    if (startTime) {
      request.startTime = BigInt(startTime)
    }

    if (endTime) {
      request.endTime = BigInt(endTime)
    }

    if (type) {
      request.type = type
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetAccountTxsRequest,
      InjectiveExplorerRpcPb.GetAccountTxsResponse
    >(request, this.client.getAccountTxs.bind(this.client))

    return IndexerGrpcExplorerTransformer.getAccountTxsResponseToAccountTxs(
      response,
    )
  }

  async fetchValidator(validatorAddress: string) {
    const request = InjectiveExplorerRpcPb.GetValidatorRequest.create()

    request.address = validatorAddress

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetValidatorRequest,
      InjectiveExplorerRpcPb.GetValidatorResponse
    >(request, this.client.getValidator.bind(this.client))

    return IndexerGrpcExplorerTransformer.validatorResponseToValidator(response)
  }

  async fetchValidatorUptime(validatorAddress: string) {
    const request = InjectiveExplorerRpcPb.GetValidatorUptimeRequest.create()

    request.address = validatorAddress

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetValidatorUptimeRequest,
      InjectiveExplorerRpcPb.GetValidatorUptimeResponse
    >(request, this.client.getValidatorUptime.bind(this.client))

    return IndexerGrpcExplorerTransformer.getValidatorUptimeResponseToValidatorUptime(
      response,
    )
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
    const request = InjectiveExplorerRpcPb.GetPeggyDepositTxsRequest.create()

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
      request.skip = BigInt(skip)
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetPeggyDepositTxsRequest,
      InjectiveExplorerRpcPb.GetPeggyDepositTxsResponse
    >(request, this.client.getPeggyDepositTxs.bind(this.client))

    return IndexerGrpcExplorerTransformer.getPeggyDepositTxsResponseToPeggyDepositTxs(
      response,
    )
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
    const request = InjectiveExplorerRpcPb.GetPeggyWithdrawalTxsRequest.create()

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
      request.skip = BigInt(skip)
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetPeggyWithdrawalTxsRequest,
      InjectiveExplorerRpcPb.GetPeggyWithdrawalTxsResponse
    >(request, this.client.getPeggyWithdrawalTxs.bind(this.client))

    return IndexerGrpcExplorerTransformer.getPeggyWithdrawalTxsResponseToPeggyWithdrawalTxs(
      response,
    )
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
    const request = InjectiveExplorerRpcPb.GetBlocksRequest.create()

    if (before) {
      request.before = BigInt(before)
    }

    if (after) {
      request.after = BigInt(after)
    }

    if (from) {
      request.from = BigInt(from)
    }

    if (to) {
      request.to = BigInt(to)
    }

    if (limit) {
      request.limit = limit
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetBlocksRequest,
      InjectiveExplorerRpcPb.GetBlocksResponse
    >(request, this.client.getBlocks.bind(this.client))

    return response
  }

  async fetchBlock(id: string) {
    const request = InjectiveExplorerRpcPb.GetBlockRequest.create()

    request.id = id

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetBlockRequest,
      InjectiveExplorerRpcPb.GetBlockResponse
    >(request, this.client.getBlock.bind(this.client))

    return response
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
    const request = InjectiveExplorerRpcPb.GetTxsRequest.create()

    if (before) {
      request.before = BigInt(before)
    }

    if (after) {
      request.after = BigInt(after)
    }

    if (limit) {
      request.limit = limit
    }

    if (skip) {
      request.skip = BigInt(skip)
    }

    if (type) {
      request.type = type
    }

    if (chainModule) {
      request.module = chainModule
    }

    if (startTime) {
      request.startTime = BigInt(startTime)
    }

    if (endTime) {
      request.endTime = BigInt(endTime)
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetTxsRequest,
      InjectiveExplorerRpcPb.GetTxsResponse
    >(request, this.client.getTxs.bind(this.client))

    return response
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
    const request = InjectiveExplorerRpcPb.GetIBCTransferTxsRequest.create()

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
      request.skip = BigInt(skip)
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

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetIBCTransferTxsRequest,
      InjectiveExplorerRpcPb.GetIBCTransferTxsResponse
    >(request, this.client.getIBCTransferTxs.bind(this.client))

    return IndexerGrpcExplorerTransformer.getIBCTransferTxsResponseToIBCTransferTxs(
      response,
    )
  }

  async fetchExplorerStats() {
    const request = InjectiveExplorerRpcPb.GetStatsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetStatsRequest,
      InjectiveExplorerRpcPb.GetStatsResponse
    >(request, this.client.getStats.bind(this.client))

    return IndexerGrpcExplorerTransformer.getExplorerStatsResponseToExplorerStats(
      response,
    )
  }

  async fetchTxsV2({
    type,
    token,
    status,
    perPage,
    endTime,
    startTime,
    blockNumber,
  }: {
    type?: string
    token?: string
    status?: string
    perPage?: number
    endTime?: number
    startTime?: number
    blockNumber?: number
  }) {
    const request = InjectiveExplorerRpcPb.GetTxsV2Request.create()

    if (token) {
      request.token = token
    }

    if (blockNumber) {
      request.blockNumber = BigInt(blockNumber)
    }

    if (endTime) {
      request.endTime = BigInt(endTime)
    }

    if (startTime) {
      request.startTime = BigInt(startTime)
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (status) {
      request.status = status
    }

    if (type) {
      request.type = type
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetTxsV2Request,
      InjectiveExplorerRpcPb.GetTxsV2Response
    >(request, this.client.getTxsV2.bind(this.client))

    return IndexerGrpcExplorerTransformer.getTxsV2ResponseToTxs(response)
  }

  async fetchAccountTxsV2({
    type,
    token,
    address,
    endTime,
    perPage,
    startTime,
  }: {
    type?: string
    token?: string
    address: string
    endTime?: number
    perPage?: number
    startTime?: number
  }) {
    const request = InjectiveExplorerRpcPb.GetAccountTxsV2Request.create()

    request.address = address

    if (startTime) {
      request.startTime = BigInt(startTime)
    }

    if (endTime) {
      request.endTime = BigInt(endTime)
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    if (type) {
      request.type = type
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetAccountTxsV2Request,
      InjectiveExplorerRpcPb.GetAccountTxsV2Response
    >(request, this.client.getAccountTxsV2.bind(this.client))

    return IndexerGrpcExplorerTransformer.getAccountTxsV2ResponseToAccountTxs(
      response,
    )
  }

  async fetchBlocksV2({
    token,
    perPage,
  }: {
    token?: string
    perPage?: number
  }) {
    const request = InjectiveExplorerRpcPb.GetBlocksV2Request.create({})

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetBlocksV2Request,
      InjectiveExplorerRpcPb.GetBlocksV2Response
    >(request, this.client.getBlocksV2.bind(this.client))

    return IndexerGrpcExplorerTransformer.getBlocksV2ResponseToBlocks(response)
  }

  async fetchContractTxsV2({
    to,
    from,
    token,
    height,
    status,
    perPage,
    contractAddress,
  }: {
    to?: number
    from?: number
    token?: string
    height?: string
    status?: string
    perPage?: number
    contractAddress: string
  }) {
    const request = InjectiveExplorerRpcPb.GetContractTxsV2Request.create()

    request.address = contractAddress

    if (from) {
      request.from = BigInt(from)
    }

    if (to) {
      request.to = BigInt(to)
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    if (height) {
      request.height = BigInt(height)
    }

    if (status) {
      request.status = status
    }

    const response = await this.executeGrpcCall<
      InjectiveExplorerRpcPb.GetContractTxsV2Request,
      InjectiveExplorerRpcPb.GetContractTxsV2Response
    >(request, this.client.getContractTxsV2.bind(this.client))

    return IndexerGrpcExplorerTransformer.getContractTxsV2ResponseToContractTxs(
      response,
    )
  }
}
