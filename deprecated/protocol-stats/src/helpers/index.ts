import { HttpClient } from '@injectivelabs/utils'

export const getHttpClientFromEndpoint = (endpoint: string): HttpClient =>
  new HttpClient(endpoint)

export const sleep = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout))
