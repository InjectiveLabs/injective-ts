import { GrpcStatusCode } from '../../../types/index.js'
import type { StreamError } from '../../../types/index.js'

/**
 * Normalizes gRPC status codes that can arrive as numbers or strings.
 *
 * protobuf-ts surfaces numeric codes, while some transports and proxies use
 * status names (for example "UNAVAILABLE") or numeric strings ("14").
 */
export function normalizeGrpcCode(code: unknown): number | undefined {
  if (typeof code === 'number') {
    return Number.isFinite(code) ? code : undefined
  }

  if (typeof code !== 'string') {
    return undefined
  }

  const value = code.trim()

  if (!value) {
    return undefined
  }

  if (/^-?\d+$/.test(value)) {
    return Number(value)
  }

  const statusName = value
    .replace(/^grpc[._-]?status[._-]?code[._-]?/i, '')
    .replace(/^status[._-]?code[._-]?/i, '')
    .toUpperCase()

  const statusCode = (
    GrpcStatusCode as unknown as Record<string, number | undefined>
  )[statusName]

  return typeof statusCode === 'number' ? statusCode : undefined
}

/**
 * Extracts a gRPC-shaped error into the SDK stream error shape.
 *
 * Local abort errors must be handled by the caller before using this helper:
 * abort-shaped errors are intentionally not assigned a gRPC status here.
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
  const code = normalizeGrpcCode(errorObj.code) ?? GrpcStatusCode.UNKNOWN

  let details = 'Unknown stream error'

  if (typeof errorObj.details === 'string' && errorObj.details) {
    details = errorObj.details
  } else if (typeof errorObj.message === 'string' && errorObj.message) {
    details = errorObj.message
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
