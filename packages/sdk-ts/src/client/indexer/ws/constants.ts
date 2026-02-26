import type { WsReconnectConfig } from '../types'

export const DEFAULT_RECONNECT_CONFIG: WsReconnectConfig = {
  enabled: true,
  maxAttempts: 10,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
}

export const DEFAULT_TRANSPORT_CONFIG = {
  protocol: 'grpc-ws',
  connectionTimeoutMs: 10000, // 10 seconds
}

export const RFQ_GRPC_PATHS = {
  TakerStream: '/injective_rfq_rpc.InjectiveRfqRPC/TakerStream',
  MakerStream: '/injective_rfq_rpc.InjectiveRfqRPC/MakerStream',
} as const
