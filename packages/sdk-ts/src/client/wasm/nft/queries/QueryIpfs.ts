import BaseRestConsumer from '../../../BaseRestConsumer'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IpfsTokenResponse } from '../types'
import { RestApiResponse } from '../../../chain/types'

export class QueryIpfs extends BaseRestConsumer {
  constructor(endpoint: string) {
    super(endpoint)
  }

  public async fetchJson(ipfsPath: string): Promise<IpfsTokenResponse> {
    try {
      const response = await this.retry<RestApiResponse<IpfsTokenResponse>>(
        () => {
          return this.get(ipfsPath)
        },
        3,
        1000,
      )

      return response.data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${ipfsPath}`,
      })
    }
  }
}
