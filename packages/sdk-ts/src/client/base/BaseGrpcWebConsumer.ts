import { getGrpcTransport } from '../../utils/grpc'
import { GrpcWebImpl } from './GrpcWebImpl'

/**
 * @hidden
 */
export default class BaseGrpcWebConsumer extends GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, {
      transport: getGrpcTransport(),
      setCookieMetadata: true
    })
  }

  static getGrpcWebImpl = (endpoint: string) =>
    new BaseGrpcWebConsumer(endpoint)
}
