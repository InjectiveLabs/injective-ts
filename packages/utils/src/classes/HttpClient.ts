import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export default class HttpClient {
  private readonly client: AxiosInstance

  private config: AxiosRequestConfig = {}

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

  get<T, P>(endpoint: string, params: T = {} as T): Promise<P> {
    return this.client.get(endpoint, { params, ...this.config })
  }

  post<T, P>(endpoint: string, data: T = {} as T): Promise<P> {
    return this.client.post(endpoint, data, this.config)
  }

  put<T, P>(endpoint: string, data: T = {} as T): Promise<P> {
    return this.client.put(endpoint, data, this.config)
  }

  delete<T, P>(endpoint: string, params: T = {} as T): Promise<P> {
    return this.client.delete(endpoint, { params, ...this.config })
  }
}
