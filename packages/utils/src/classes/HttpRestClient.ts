import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
  HttpRequestMethod,
} from '@injectivelabs/exceptions'
import { StatusCodes } from 'http-status-codes'
import HttpClient from './HttpClient'

const getErrorMessage = (error: any, endpoint: string): string => {
  if (!error.response) {
    return `The request to ${endpoint} has failed.`
  }

  return error.response.data
    ? error.response.data.message || error.response.data
    : error.response.statusText
}

/**
 * @hidden
 */
export default class HttpRestClient {
  protected client: HttpClient

  protected endpoint: string

  constructor(endpoint: string, options: Record<string, any> = {}) {
    this.client = new HttpClient(endpoint, options)
    this.endpoint = endpoint
  }

  setConfig(config: AxiosRequestConfig): HttpRestClient {
    this.client.setConfig(config)

    return this
  }

  public async get<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    try {
      return await this.client.get(endpoint, params)
    } catch (e: unknown) {
      const error = e as Error | AxiosError

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new HttpRequestException(new Error(error.message), {
            code: StatusCodes.REQUEST_TOO_LONG,
            context: endpoint,
            method: HttpRequestMethod.Get,
          })
        }

        const message = getErrorMessage(error, endpoint)

        throw new HttpRequestException(new Error(message), {
          context: endpoint,
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          method: HttpRequestMethod.Get,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        context: endpoint,
        contextModule: HttpRequestMethod.Get,
      })
    }
  }

  public async post<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    try {
      return await this.client.post(endpoint, params)
    } catch (e: unknown) {
      const error = e as Error | AxiosError

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new HttpRequestException(new Error(error.message), {
            code: StatusCodes.REQUEST_TOO_LONG,
            method: HttpRequestMethod.Post,
          })
        }

        const message = getErrorMessage(error, endpoint)

        throw new HttpRequestException(new Error(message), {
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          context: endpoint,
          contextModule: HttpRequestMethod.Post,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        context: endpoint,
        contextModule: HttpRequestMethod.Post,
      })
    }
  }
}
