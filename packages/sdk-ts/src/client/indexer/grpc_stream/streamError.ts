import { GrpcStatusCode } from '../../../types/index.js'
import type { StreamError } from '../../../types/index.js'

/**
 * Extracts a gRPC-shaped error into the SDK stream error shape.
 *
 * Preserve the V2 numeric-only code contract. protobuf-ts RpcError codes are
 * strings; normalizing them would change existing retry decisions and events.
 * Local cancellation is determined by the subscription's own lifecycle.
 */
export function extractGrpcError(error: unknown): StreamError {
  const defaultError: StreamError = {
    code: GrpcStatusCode.UNKNOWN,
    details: 'Unknown stream error',
    metadata: undefined,
  }

  if (!error || typeof error !== 'object') {
    return defaultError
  }

  const errorObj = error as Record<string, unknown>
  const code =
    typeof errorObj.code === 'number' ? errorObj.code : GrpcStatusCode.UNKNOWN

  let details = 'Unknown stream error'

  if (typeof errorObj.message === 'string') {
    details = errorObj.message
  } else if (typeof errorObj.details === 'string') {
    details = errorObj.details
  }

  return {
    code,
    details,
    metadata: {
      originalError: error,
      ...('name' in errorObj && { errorName: errorObj.name }),
      ...('methodName' in errorObj && { methodName: errorObj.methodName }),
      ...('serviceName' in errorObj && { serviceName: errorObj.serviceName }),
      ...('metadata' in errorObj && { grpcMetadata: errorObj.metadata }),
    },
  }
}
