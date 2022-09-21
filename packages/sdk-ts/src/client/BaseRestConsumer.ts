import { HttpClient } from '@injectivelabs/utils'
import axios, { AxiosError } from 'axios'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
  HttpRequestMethod,
} from '@injectivelabs/exceptions'
import { StatusCodes } from 'http-status-codes'

/**
 * @hidden
 */
export default class BaseRestConsumer {
  protected client: HttpClient

  constructor(endpoint: string) {
    this.client = new HttpClient(endpoint)
  }

  protected async get<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    try {
      return this.client.get(endpoint, params)
    } catch (e: unknown) {
      const error = e as Error | AxiosError

      if (axios.isAxiosError(error)) {
        const message = error.response
          ? typeof error.response.data === 'string'
            ? error.response.data
            : error.response.statusText
          : `The request to ${endpoint} has failed.`

        throw new HttpRequestException(new Error(message), {
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          method: HttpRequestMethod.Get,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: HttpRequestMethod.Get,
      })
    }
  }

  protected async post<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    try {
      return this.client.post(endpoint, params)
    } catch (e: unknown) {
      const error = e as Error | AxiosError

      if (axios.isAxiosError(error)) {
        const message = error.response
          ? typeof error.response.data === 'string'
            ? error.response.data
            : error.response.statusText
          : `The request to ${endpoint} has failed.`

        throw new HttpRequestException(new Error(message), {
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          contextModule: HttpRequestMethod.Post,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: HttpRequestMethod.Post,
      })
    }
  }
}
