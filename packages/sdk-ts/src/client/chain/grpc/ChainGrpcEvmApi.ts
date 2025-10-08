import { InjectiveEvmV1Query } from '@injectivelabs/core-proto-ts'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcEvmTransformer } from '../transformers/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcEvmApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Evm

  protected client: InjectiveEvmV1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveEvmV1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchAccount(ethAddress: string) {
    const request = InjectiveEvmV1Query.QueryAccountRequest.create()

    request.address = ethAddress

    try {
      const response =
        await this.retry<InjectiveEvmV1Query.QueryAccountResponse>(() =>
          this.client.Account(request, this.metadata),
        )

      return ChainGrpcEvmTransformer.accountResponseToAccount(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveEvmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EvmAccount',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EvmAccount',
        contextModule: this.module,
      })
    }
  }

  async fetchCosmosAccount(ethAddress: string) {
    const request = InjectiveEvmV1Query.QueryCosmosAccountRequest.create()

    request.address = ethAddress

    try {
      const response =
        await this.retry<InjectiveEvmV1Query.QueryCosmosAccountResponse>(() =>
          this.client.CosmosAccount(request, this.metadata),
        )

      return ChainGrpcEvmTransformer.cosmosAccountResponseToCosmosAccount(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveEvmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'CosmosAccount',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'CosmosAccount',
        contextModule: this.module,
      })
    }
  }

  async fetchValidatorAccount(consAddress: string) {
    const request = InjectiveEvmV1Query.QueryValidatorAccountRequest.create()

    request.consAddress = consAddress

    try {
      const response =
        await this.retry<InjectiveEvmV1Query.QueryValidatorAccountResponse>(
          () => this.client.ValidatorAccount(request, this.metadata),
        )

      return ChainGrpcEvmTransformer.validatorAccountResponseToValidatorAccount(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveEvmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EvmValidatorAccount',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EvmValidatorAccount',
        contextModule: this.module,
      })
    }
  }

  async fetchBalance(ethAddress: string) {
    const request = InjectiveEvmV1Query.QueryBalanceRequest.create()

    request.address = ethAddress

    try {
      const response =
        await this.retry<InjectiveEvmV1Query.QueryBalanceResponse>(() =>
          this.client.Balance(request, this.metadata),
        )

      return response.balance
    } catch (e: unknown) {
      if (e instanceof InjectiveEvmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EvmBalance',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EvmBalance',
        contextModule: this.module,
      })
    }
  }

  async fetchStorage(ethAddress: string, key: string) {
    const request = InjectiveEvmV1Query.QueryStorageRequest.create()

    request.address = ethAddress
    request.key = key

    try {
      const response =
        await this.retry<InjectiveEvmV1Query.QueryStorageResponse>(() =>
          this.client.Storage(request, this.metadata),
        )

      return response.value
    } catch (e: unknown) {
      if (e instanceof InjectiveEvmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EvmStorage',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EvmStorage',
        contextModule: this.module,
      })
    }
  }

  async fetchCode(ethAddress: string) {
    const request = InjectiveEvmV1Query.QueryCodeRequest.create()

    request.address = ethAddress

    try {
      const response = await this.retry<InjectiveEvmV1Query.QueryCodeResponse>(
        () => this.client.Code(request, this.metadata),
      )

      return response.code
    } catch (e: unknown) {
      if (e instanceof InjectiveEvmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EvmCode',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EvmCode',
        contextModule: this.module,
      })
    }
  }

  async fetchParams() {
    const request = InjectiveEvmV1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveEvmV1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return ChainGrpcEvmTransformer.paramsResponseToParams(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveEvmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EvmParams',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EvmParams',
        contextModule: this.module,
      })
    }
  }

  async fetchBaseFee() {
    const request = InjectiveEvmV1Query.QueryBaseFeeRequest.create()

    try {
      const response =
        await this.retry<InjectiveEvmV1Query.QueryBaseFeeResponse>(() =>
          this.client.BaseFee(request, this.metadata),
        )

      return response.baseFee
    } catch (e: unknown) {
      if (e instanceof InjectiveEvmV1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'EvmBaseFee',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'EvmBaseFee',
        contextModule: this.module,
      })
    }
  }
}
