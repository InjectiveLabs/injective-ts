import { BaseWasmQuery } from './BaseWasmQuery'
import { GetConfigResponse, Config } from '../types'

export class QueryConfig extends BaseWasmQuery {
  toPayload() {
    return this.encodeToBase64({ config: {} })
  }

  toData({ data }: { data: string }): Config {
    const response = this.decodeFromBase64(data) as GetConfigResponse

    return {
      distributionContract: response.distribution_contract,
      ninjaToken: response.ninja_token,
      owner: response.owner,
    }
  }
}
