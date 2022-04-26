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

export class MetaApi extends BaseConsumer {
  async ping() {
    const request = new PingRequest()

    try {
      const response = await this.request<
        PingRequest,
        PingResponse,
        typeof InjectiveMetaRPC.Ping
      >(request, InjectiveMetaRPC.Ping)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async version() {
    const request = new VersionRequest()

    try {
      const response = await this.request<
        VersionRequest,
        VersionResponse,
        typeof InjectiveMetaRPC.Version
      >(request, InjectiveMetaRPC.Version)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async info() {
    const request = new InfoRequest()

    try {
      const response = await this.request<
        InfoRequest,
        InfoResponse,
        typeof InjectiveMetaRPC.Info
      >(request, InjectiveMetaRPC.Info)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
