import type { RequestOptions } from './abort.js'

/** Options shared by HTTP and gRPC retry operations. */
export interface RetryOptions extends RequestOptions {
  /** Maximum number of attempts, including the initial call. Defaults to 3. */
  retries?: number
  /** Base backoff delay in milliseconds, multiplied by the attempt. Defaults to 1000. */
  delay?: number
}
