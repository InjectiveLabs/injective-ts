import { HttpRestClient } from '@injectivelabs/utils'
import type { RequestOptions } from '@injectivelabs/utils'

/**
 * @hidden
 */
export default class BaseRestConsumer extends HttpRestClient {
  /**
   * GET with retries, forwarding the retry-scoped request config so the
   * operation's cancellation applies to every attempt.
   */
  protected getWithRetry<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<T> {
    return this.retry<T>(
      (requestConfig) => this.get<T>(endpoint, params, requestConfig),
      toRetryOptions(options),
    )
  }

  /**
   * POST with retries, forwarding the retry-scoped request config so the
   * operation's cancellation applies to every attempt.
   */
  protected postWithRetry<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<T> {
    return this.retry<T>(
      (requestConfig) => this.post<T>(endpoint, params, requestConfig),
      toRetryOptions(options),
    )
  }
}

/**
 * Forward only the caller's signal. Always passing an object selects the
 * request-config overload, and a stray JS argument (e.g. a string passed to a
 * method that used to take none) can never become a retry count.
 */
const toRetryOptions = (options?: RequestOptions) => ({
  signal: options?.signal,
})
