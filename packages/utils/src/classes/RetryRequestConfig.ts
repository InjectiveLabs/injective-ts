import type { AxiosRequestConfig } from 'axios'

const RETRY_REQUEST_CONFIG_BRAND = Symbol(
  '@injectivelabs/utils/RetryRequestConfig',
)

/**
 * Optional retry callback request config.
 *
 * It is a regular Axios request config that carries an internal cancellation
 * scope. Forward it directly to HttpClient methods:
 *
 * ```ts
 * client.retry(
 *   (requestConfig) =>
 *     client.get(endpoint, params, requestConfig),
 *   3,
 *   1000,
 *   options,
 * )
 * ```
 *
 * The scoped signal pins cancellation for the whole retry operation. Later
 * `setConfig` changes still apply to headers/auth/adapter/timeouts/params but
 * cannot retarget the operation's cancellation.
 */
export interface RetryRequestConfig extends AxiosRequestConfig {
  readonly [RETRY_REQUEST_CONFIG_BRAND]?: {
    readonly signal?: AbortSignal
  }
}

export interface RetryRequestCancellation {
  readonly signal?: AbortSignal
}

/**
 * @internal
 */
export const createRetryRequestConfig = (
  signal?: AbortSignal,
): RetryRequestConfig => {
  const config: RetryRequestConfig = { signal }

  Object.defineProperty(config, RETRY_REQUEST_CONFIG_BRAND, {
    configurable: false,
    enumerable: true,
    value: Object.freeze({ signal }),
    writable: false,
  })

  return config
}

/**
 * @internal
 *
 * Returns undefined for ordinary request configs. A branded config with no
 * signal intentionally means "do not compose the current config signal".
 */
export const getRetryRequestCancellation = (
  config?: AxiosRequestConfig | null,
): RetryRequestCancellation | undefined => {
  if (!config || typeof config !== 'object') {
    return undefined
  }

  return (config as RetryRequestConfig)[RETRY_REQUEST_CONFIG_BRAND]
}

/**
 * @internal
 *
 * The brand is only meaningful to HttpClient. Remove it from the final Axios
 * config so it is never forwarded to the transport.
 */
export const clearRetryRequestConfigBrand = (
  config?: AxiosRequestConfig | null,
): void => {
  if (!config || typeof config !== 'object') {
    return
  }

  Reflect.deleteProperty(config, RETRY_REQUEST_CONFIG_BRAND)
}
