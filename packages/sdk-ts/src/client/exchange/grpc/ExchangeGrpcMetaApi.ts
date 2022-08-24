import {
  InfoRequest,
  InfoResponse,
  PingRequest,
  PingResponse,
  VersionRequest,
  VersionResponse,
} from '@injectivelabs/exchange-api/injective_meta_rpc_pb'
import { InjectiveMetaRPC } from '@injectivelabs/exchange-api/injective_meta_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'

/**
 * @category Exchange Grpc API
 */
export class ExchangeGrpcMetaApi extends BaseConsumer {
  async fetchPing() {
    const request = new PingRequest()

    try {
      const response = await this.request<
        PingRequest,
        PingResponse,
        typeof InjectiveMetaRPC.Ping
      >(request, InjectiveMetaRPC.Ping)

      return response.toObject()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchVersion() {
    const request = new VersionRequest()

    try {
      const response = await this.request<
        VersionRequest,
        VersionResponse,
        typeof InjectiveMetaRPC.Version
      >(request, InjectiveMetaRPC.Version)

      return response.toObject()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchInfo() {
    const request = new InfoRequest()

    try {
      const response = await this.request<
        InfoRequest,
        InfoResponse,
        typeof InjectiveMetaRPC.Info
      >(request, InjectiveMetaRPC.Info)

      return response.toObject()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
