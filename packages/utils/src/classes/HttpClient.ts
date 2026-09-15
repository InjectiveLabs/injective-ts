import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

export default class HttpClient {
  private readonly client: AxiosInstance

  private config: AxiosRequestConfig = {}

  private headerProvider?: () => Record<string, string>

  constructor(
    endpoint: string,
    options: Record<string, any> = {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ) {
    this.client = axios.create({
      baseURL: endpoint,
      timeout: 15000,
      ...options,
    })

    this.config = {}
  }

  setConfig(config: AxiosRequestConfig): HttpClient {
    this.config = config

    return this
  }

  /**
   * Registers a function that is invoked on every request to supply default
   * headers (e.g. a client-reported IP resolved asynchronously after this
   * client was constructed). Headers from `config` (set via setConfig) take
   * precedence over headers from the provider.
   */
  setHeaderProvider(provider: () => Record<string, string>): HttpClient {
    this.headerProvider = provider

    return this
  }

  private getRequestConfig(): AxiosRequestConfig {
    return {
      ...this.config,
      headers: {
        ...(this.headerProvider?.() || {}),
        ...(this.config.headers || {}),
      },
    }
  }

  get<T, P>(endpoint: string, params: T = {} as T): Promise<P> {
    return this.client.get(endpoint, { params, ...this.getRequestConfig() })
  }

  post<T, P>(endpoint: string, data: T = {} as T): Promise<P> {
    return this.client.post(endpoint, data, this.getRequestConfig())
  }

  put<T, P>(endpoint: string, data: T = {} as T): Promise<P> {
    return this.client.put(endpoint, data, this.getRequestConfig())
  }

  delete<T, P>(endpoint: string, params: T = {} as T): Promise<P> {
    return this.client.delete(endpoint, {
      params,
      ...this.getRequestConfig(),
    })
  }
}
