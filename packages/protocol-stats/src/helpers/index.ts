import { HttpClient } from '@injectivelabs/utils'

export const getHttpClientFromEndpoint = (endpoint: string): HttpClient =>
  new HttpClient(endpoint)
