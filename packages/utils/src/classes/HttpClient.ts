import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export default class HttpClient {
  private readonly client: AxiosInstance

  private config: AxiosRequestConfig = {}

  constructor(endpoint: string) {
    this.client = axios.create({
      baseURL: endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
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

  delete<T, P>(endpoint: string, params: T = {} as T): Promise<P> {
    return this.client.delete(endpoint, { params, ...this.config })
  }
}
