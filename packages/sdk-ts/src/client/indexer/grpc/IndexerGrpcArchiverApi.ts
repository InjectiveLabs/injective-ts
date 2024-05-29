import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveArchiverRPC } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer'
import { IndexerModule } from '../types'
import { IndexerGrpcArchiverTransformer } from '../transformers'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcArchiverApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Archiver

  protected client: InjectiveArchiverRPC.InjectiveArchiverRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveArchiverRPC.InjectiveArchiverRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchHistoricalBalance({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRPC.BalanceRequest.create()

    request.account = account
    request.resolution = resolution

    try {
      const response = await this.retry<InjectiveArchiverRPC.BalanceResponse>(
        () => this.client.Balance(request),
      )

      return IndexerGrpcArchiverTransformer.grpcHistoricalBalanceResponseToHistoricalBalances(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRPC.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Historical Balance',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Historical Balance',
        contextModule: this.module,
      })
    }
  }

  async fetchHistoricalRpnl({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRPC.RpnlRequest.create()

    request.account = account
    request.resolution = resolution

    try {
      const response = await this.retry<InjectiveArchiverRPC.RpnlResponse>(() =>
        this.client.Balance(request),
      )

      return IndexerGrpcArchiverTransformer.grpcHistoricalRPNLResponseToHistoricalRPNL(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRPC.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Historical Rpnl',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Historical Rpnl',
        contextModule: this.module,
      })
    }
  }

  async fetchHistoricalVolumes({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRPC.VolumesRequest.create()

    request.account = account
    request.resolution = resolution

    try {
      const response = await this.retry<InjectiveArchiverRPC.VolumesResponse>(
        () => this.client.Balance(request),
      )

      return IndexerGrpcArchiverTransformer.grpcHistoricalVolumesResponseToHistoricalVolumes(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRPC.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Historical Volumes',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Historical Volumes',
        contextModule: this.module,
      })
    }
  }
}
