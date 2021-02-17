import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpException } from '@injectivelabs/exceptions'

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
    try {
      return this.client.get(endpoint, { params, ...this.config })
    } catch (e) {
      throw new HttpException(e.message)
    }
  }

  post<T, P>(endpoint: string, data: T = {} as T): Promise<P> {
    try {
      return this.client.post(endpoint, data, this.config)
    } catch (e) {
      throw new HttpException(e.message)
    }
  }

  delete<T, P>(endpoint: string, params: T = {} as T): Promise<P> {
    try {
      return this.client.delete(endpoint, { params, ...this.config })
    } catch (e) {
      throw new HttpException(e.message)
    }
  }
}
