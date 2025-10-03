import { GrpcWebImpl } from './IndexerGrpcWebImpl.js'
import { grpc, getGrpcTransport } from '../../utils/grpc.js'

/**
 * @hidden
 */
export default class BaseIndexerGrpcWebConsumer extends GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string, metadata: Record<string, string> = {}) {
    const grpcMetadata = new grpc.Metadata()

    Object.keys(metadata).forEach((key) => grpcMetadata.set(key, metadata[key]))

    super(endpoint, { transport: getGrpcTransport(), metadata: grpcMetadata })
  }
}

export const getGrpcIndexerWebImpl = (
  endpoint: string,
  metadata?: Record<string, string>,
) => new BaseIndexerGrpcWebConsumer(endpoint, metadata)
