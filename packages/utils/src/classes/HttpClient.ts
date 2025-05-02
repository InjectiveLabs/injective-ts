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

  async get<T, P extends Record<string, any>>(
    endpoint: string,
    params: P = {} as P,
  ): Promise<T> {
    return this.client.get(endpoint, { params, ...this.config })
  }

  /**
   * This functions parses the `data` property from the response
   * and returns the data as a typed object.
   */
  async $get<T, P extends Record<string, any>>(
    endpoint: string,
    params: P = {} as P,
  ): Promise<T> {
    const response = await this.client.get(endpoint, {
      params,
      ...this.config,
    })

    return 'data' in response ? response.data : response
  }

  async post<T, P extends Record<string, any>>(
    endpoint: string,
    data: P = {} as P,
  ): Promise<T> {
    return this.client.post(endpoint, data, this.config)
  }

  /**
   * This functions parses the `data` property from the response
   * and returns the data as a typed object.
   */
  async $post<T, P extends Record<string, any>>(
    endpoint: string,
    data: P = {} as P,
  ): Promise<T> {
    const response = await this.client.post(endpoint, data, this.config)

    return 'data' in response ? response.data : response
  }

  async put<T, P extends Record<string, any>>(
    endpoint: string,
    data: P = {} as P,
  ): Promise<T> {
    return this.client.put(endpoint, data, this.config)
  }

  async delete<T, P extends Record<string, any>>(
    endpoint: string,
    params: P = {} as P,
  ): Promise<T> {
    return this.client.delete(endpoint, { params, ...this.config })
  }
}
