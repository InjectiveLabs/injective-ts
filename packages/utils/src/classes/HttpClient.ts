import axios from 'axios'
import {
  getRetryRequestCancellation,
  clearRetryRequestConfigBrand,
} from './RetryRequestConfig.js'
import {
  AbortError,
  isAbortError,
  raceWithAbort,
  throwIfAborted,
  createAbortError,
  combineAbortSignals,
} from '../abort.js'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

const getAbortReason = (error: unknown): unknown => {
  if (!error || typeof error !== 'object') {
    return undefined
  }

  if ('reason' in error) {
    return (error as { reason?: unknown }).reason
  }

  if ('cause' in error) {
    return (error as { cause?: unknown }).cause
  }

  return undefined
}

export default class HttpClient {
  private readonly client: AxiosInstance

  private readonly abortSignal?: AbortSignal

  private config: AxiosRequestConfig = {}

  constructor(
    endpoint: string,
    options: Record<string, any> = {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ) {
    const { signal, ...axiosOptions } = options || {}

    this.client = axios.create({
      baseURL: endpoint,
      timeout: 15000,
      ...axiosOptions,
    })

    this.abortSignal = signal as AbortSignal | undefined
    this.config = {}
  }

  setConfig(config: AxiosRequestConfig): HttpClient {
    // Keep runtime compatibility for JS callers despite the strict TS API.
    this.config = config || {}

    return this
  }

  /**
   * @internal
   *
   * Current constructor/config cancellation constraint, optionally combined
   * with an operation-level signal. Callers must invoke `dispose` after the
   * operation settles.
   */
  getAbortSignal(
    signal?: AbortSignal,
    config: AxiosRequestConfig = this.config,
  ): {
    signal: AbortSignal | undefined
    dispose(): void
  } {
    return combineAbortSignals([
      this.abortSignal,
      config?.signal as AbortSignal | undefined,
      signal,
    ])
  }

  private prepareRequest(
    baseConfig: AxiosRequestConfig = {},
    perCallConfig: AxiosRequestConfig = {},
  ): { config: AxiosRequestConfig; dispose(): void } {
    const base = baseConfig || {}
    const perCall = perCallConfig || {}
    const retryCancellation = getRetryRequestCancellation(perCall)
    const config: AxiosRequestConfig = {
      ...base,
      ...perCall,
    }

    if (base.headers && perCall.headers) {
      config.headers = {
        ...base.headers,
        ...perCall.headers,
      }
    }

    const { signal, dispose } = combineAbortSignals([
      this.abortSignal,
      retryCancellation
        ? retryCancellation.signal
        : (base.signal as AbortSignal | undefined),
      perCall.signal as AbortSignal | undefined,
    ])

    if (signal) {
      config.signal = signal
    } else {
      delete config.signal
    }

    clearRetryRequestConfigBrand(config)

    return { config, dispose }
  }

  private async executeRequest<T>(
    request: (config: AxiosRequestConfig) => Promise<T>,
    baseConfig: AxiosRequestConfig,
    perCallConfig?: AxiosRequestConfig,
  ): Promise<T> {
    const { config, dispose } = this.prepareRequest(baseConfig, perCallConfig)
    const signal = config.signal as AbortSignal | undefined

    try {
      throwIfAborted(signal)

      return await raceWithAbort(request(config), signal)
    } catch (error: unknown) {
      if (signal?.aborted) {
        throw createAbortError(signal)
      }

      if (isAbortError(error)) {
        throw error instanceof AbortError
          ? error
          : new AbortError(getAbortReason(error))
      }

      throw error
    } finally {
      dispose()
    }
  }

  get<T, P>(
    endpoint: string,
    params: T = {} as T,
    config: AxiosRequestConfig = {},
  ): Promise<P> {
    return this.executeRequest(
      (requestConfig) => this.client.get(endpoint, requestConfig),
      { params, ...this.config },
      config,
    )
  }

  post<T, P>(
    endpoint: string,
    data: T = {} as T,
    config: AxiosRequestConfig = {},
  ): Promise<P> {
    return this.executeRequest(
      (requestConfig) => this.client.post(endpoint, data, requestConfig),
      this.config,
      config,
    )
  }

  put<T, P>(
    endpoint: string,
    data: T = {} as T,
    config: AxiosRequestConfig = {},
  ): Promise<P> {
    return this.executeRequest(
      (requestConfig) => this.client.put(endpoint, data, requestConfig),
      this.config,
      config,
    )
  }

  delete<T, P>(
    endpoint: string,
    params: T = {} as T,
    config: AxiosRequestConfig = {},
  ): Promise<P> {
    return this.executeRequest(
      (requestConfig) => this.client.delete(endpoint, requestConfig),
      { params, ...this.config },
      config,
    )
  }
}
