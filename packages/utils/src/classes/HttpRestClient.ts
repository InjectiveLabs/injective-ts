import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import {
  HttpRequestMethod,
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import HttpClient from './HttpClient.js'
import { createRetryRequestConfig } from './RetryRequestConfig.js'
import {
  AbortError,
  isAbortError,
  raceWithAbort,
  abortableSleep,
  throwIfAborted,
  createAbortError,
} from '../abort.js'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { RetryOptions } from '../retry.js'
import type { RequestOptions } from '../abort.js'
import type { RetryRequestConfig } from './RetryRequestConfig.js'

const getErrorMessage = (error: any, endpoint: string): string => {
  if (!error.response) {
    return `The request to ${endpoint} has failed.`
  }

  return error.response.data
    ? error.response.data.message ||
        error.response.data.statusMessage ||
        error.response.data
    : error.response.statusText
}

const getLocalAbortError = (
  error: unknown,
  signal?: AbortSignal,
): AbortError | undefined => {
  const axiosSignal = axios.isAxiosError(error)
    ? (error.config?.signal as AbortSignal | undefined)
    : undefined

  if (isAbortError(error)) {
    if (error instanceof AbortError) {
      return error
    }

    const reason = signal?.aborted
      ? signal.reason
      : axiosSignal?.aborted
        ? axiosSignal.reason
        : (error as { reason?: unknown }).reason

    return new AbortError(reason)
  }

  if (signal?.aborted) {
    return createAbortError(signal)
  }

  if (axiosSignal?.aborted) {
    return createAbortError(axiosSignal)
  }

  return undefined
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
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    // Keep runtime compatibility for JS callers passing nullish config.
    const requestConfig = config || {}

    try {
      return await this.client.get(endpoint, params, requestConfig)
    } catch (e: unknown) {
      const error = e as Error | AxiosError
      const abortError = getLocalAbortError(
        error,
        requestConfig.signal as AbortSignal | undefined,
      )

      if (abortError) {
        throw abortError
      }

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new HttpRequestException(new Error(error.message), {
            code: StatusCodes.REQUEST_TOO_LONG,
            context: endpoint,
          })
        }

        const message = getErrorMessage(error, endpoint)

        throw new HttpRequestException(new Error(message), {
          context: endpoint,
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        context: endpoint,
      })
    }
  }

  public async retry<TResponse>(
    httpCall: (
      requestConfig: RetryRequestConfig,
    ) => TResponse | PromiseLike<TResponse>,
    options: RetryOptions,
  ): Promise<TResponse>
  public async retry<TResponse>(
    httpCall: Function,
    options: RetryOptions,
  ): Promise<TResponse>
  /** @deprecated Pass a RetryOptions object instead of positional retry settings. */
  public async retry<TResponse>(
    httpCall: () => TResponse | PromiseLike<TResponse>,
    retries?: number,
    delay?: number,
    options?: RequestOptions,
  ): Promise<TResponse>
  public async retry<TResponse>(
    httpCall: Function,
    retries?: number,
    delay?: number,
    options?: RequestOptions,
  ): Promise<TResponse>
  public async retry<TResponse>(
    httpCall: Function,
    retriesOrOptions?: number | RetryOptions,
    legacyDelay?: number,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const withRequestConfig =
      typeof retriesOrOptions === 'object' && retriesOrOptions !== null
    const {
      retries = 3,
      delay = 1000,
      signal: requestSignal,
    } = !withRequestConfig
      ? { ...options, retries: retriesOrOptions, delay: legacyDelay }
      : {
          ...options,
          ...retriesOrOptions,
          delay: retriesOrOptions.delay ?? legacyDelay,
        }
    const { signal, dispose } = this.client.getAbortSignal(requestSignal)

    const retryHttpCall = async (attempt = 1): Promise<TResponse> => {
      throwIfAborted(signal)

      try {
        // The options-object form explicitly opts into a config argument.
        // Legacy callbacks may have optional parameters with unrelated meaning.
        const responsePromise = withRequestConfig
          ? httpCall(createRetryRequestConfig(signal))
          : httpCall()
        const response = await raceWithAbort(
          Promise.resolve(responsePromise),
          signal,
        )

        return response as TResponse
      } catch (e: any) {
        const abortError = getLocalAbortError(e, signal)

        if (abortError) {
          throw abortError
        }

        throwIfAborted(signal)

        if (e instanceof HttpRequestException) {
          if (e.code === StatusCodes.REQUEST_TOO_LONG) {
            throw e
          }
        }

        if (attempt >= retries) {
          throw e
        }

        await abortableSleep(delay * attempt, signal)

        return retryHttpCall(attempt + 1)
      }
    }

    try {
      return await retryHttpCall()
    } finally {
      dispose()
    }
  }

  public async post<T>(
    endpoint: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    // Keep runtime compatibility for JS callers passing nullish config.
    const requestConfig = config || {}

    try {
      return await this.client.post(endpoint, params, requestConfig)
    } catch (e: unknown) {
      const error = e as Error | AxiosError
      const abortError = getLocalAbortError(
        error,
        requestConfig.signal as AbortSignal | undefined,
      )

      if (abortError) {
        throw abortError
      }

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
