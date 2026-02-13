import {
  RFQQuoteType,
  RFQRequestType,
  TakerStreamResponse,
  MakerStreamResponse,
  TakerStreamStreamingRequest,
  MakerStreamStreamingRequest,
} from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb.js'
import { GrpcDecodeError } from './types.js'
import type { GrpcFrame, RFQQuoteInput, RFQRequestInput } from './types.js'

const COMPRESSION_FLAG_NONE = 0x00
const COMPRESSION_FLAG_TRAILER = 0x80
const GRPC_HEADER_SIZE = 5

/**
 * Codec for encoding/decoding gRPC-over-WebSocket messages for RFQ streams.
 */
export const GrpcWebSocketCodec = {
  // ============================================
  // Taker Stream Encoding/Decoding
  // ============================================

  encodeTakerPing(): Uint8Array {
    const message = TakerStreamStreamingRequest.create({
      messageType: 'ping',
    })
    return encodeGrpcFrame(TakerStreamStreamingRequest.toBinary(message))
  },

  encodeTakerRequest(input: RFQRequestInput): Uint8Array {
    const request = RFQRequestType.create({
      rfqId: BigInt(input.rfqId),
      marketId: input.marketId,
      direction: input.direction,
      margin: input.margin,
      quantity: input.quantity,
      worstPrice: input.worstPrice,
      requestAddress: input.requestAddress,
      expiry: BigInt(input.expiry),
      status: input.status,
      // Server-side fields (set to 0/defaults for client requests)
      createdAt: 0n,
      updatedAt: 0n,
      transactionTime: 0n,
      height: 0n,
    })

    const message = TakerStreamStreamingRequest.create({
      messageType: 'request',
      request,
    })

    return encodeGrpcFrame(TakerStreamStreamingRequest.toBinary(message))
  },

  decodeTakerResponse(
    data: ArrayBuffer | Uint8Array,
  ): GrpcFrame<TakerStreamResponse> {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
    return decodeGrpcFrame(bytes, TakerStreamResponse)
  },

  // ============================================
  // Maker Stream Encoding/Decoding
  // ============================================

  encodeMakerPing(): Uint8Array {
    const message = MakerStreamStreamingRequest.create({
      messageType: 'ping',
    })
    return encodeGrpcFrame(MakerStreamStreamingRequest.toBinary(message))
  },

  encodeMakerQuote(input: RFQQuoteInput): Uint8Array {
    const quote = RFQQuoteType.create({
      chainId: input.chainId,
      contractAddress: input.contractAddress,
      marketId: input.marketId,
      rfqId: BigInt(input.rfqId),
      takerDirection: input.takerDirection,
      margin: input.margin,
      quantity: input.quantity,
      price: input.price,
      expiry: BigInt(input.expiry),
      maker: input.maker,
      taker: input.taker,
      signature: input.signature,
      status: input.status,
      // Server-side fields (set to 0/defaults for client requests)
      createdAt: 0n,
      updatedAt: 0n,
      height: 0n,
      eventTime: 0n,
      transactionTime: 0n,
    })

    const message = MakerStreamStreamingRequest.create({
      messageType: 'quote',
      quote,
    })

    return encodeGrpcFrame(MakerStreamStreamingRequest.toBinary(message))
  },

  decodeMakerResponse(
    data: ArrayBuffer | Uint8Array,
  ): GrpcFrame<MakerStreamResponse> {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
    return decodeGrpcFrame(bytes, MakerStreamResponse)
  },

  // ============================================
  // Utility functions
  // ============================================

  isTrailerFrame(data: ArrayBuffer | Uint8Array): boolean {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
    if (bytes.length < 1) {
      return false
    }
    return (bytes[0] & COMPRESSION_FLAG_TRAILER) !== 0
  },

  getPayloadLength(data: ArrayBuffer | Uint8Array): number {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
    if (bytes.length < GRPC_HEADER_SIZE) {
      return -1
    }
    return (bytes[1] << 24) | (bytes[2] << 16) | (bytes[3] << 8) | bytes[4]
  },

  isCompleteFrame(data: ArrayBuffer | Uint8Array): boolean {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
    if (bytes.length < GRPC_HEADER_SIZE) {
      return false
    }
    const payloadLength = this.getPayloadLength(bytes)
    return bytes.length >= GRPC_HEADER_SIZE + payloadLength
  },

  HEADER_SIZE: GRPC_HEADER_SIZE,
}

function encodeGrpcFrame(payload: Uint8Array): Uint8Array {
  const frame = new Uint8Array(GRPC_HEADER_SIZE + payload.length)

  frame[0] = COMPRESSION_FLAG_NONE

  new DataView(frame.buffer).setUint32(1, payload.length, false)

  frame.set(payload, GRPC_HEADER_SIZE)

  return frame
}

function decodeGrpcFrame<T>(
  data: Uint8Array,
  messageType: { fromBinary(bytes: Uint8Array): T },
): GrpcFrame<T> {
  if (data.byteLength < GRPC_HEADER_SIZE) {
    throw new GrpcDecodeError(
      `Frame too short: expected at least ${GRPC_HEADER_SIZE} bytes, got ${data.byteLength}`,
    )
  }

  // DataView over the *exact bytes* in this Uint8Array (handles non-zero byteOffset)
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)

  const compressionFlag = view.getUint8(0)
  const isTrailer = (compressionFlag & COMPRESSION_FLAG_TRAILER) !== 0
  const payloadLength = view.getUint32(1, false) // false = big-endian

  const totalLength = GRPC_HEADER_SIZE + payloadLength
  if (data.byteLength < totalLength) {
    throw new GrpcDecodeError(
      `Incomplete frame: expected ${totalLength} bytes, got ${data.byteLength}`,
    )
  }

  const payload = data.subarray(GRPC_HEADER_SIZE, totalLength)

  // Trailer frames: return raw payload (you likely parse it elsewhere)
  if (isTrailer) {
    return { isTrailer: true, payload }
  }

  // For non-trailer messages, require "no compression"
  // If you want to allow other bits, mask instead of strict compare.
  if (compressionFlag !== COMPRESSION_FLAG_NONE) {
    throw new GrpcDecodeError(
      `Unsupported compression flag: 0x${compressionFlag.toString(16)}`,
    )
  }

  try {
    const message = messageType.fromBinary(payload)
    return { isTrailer: false, message, payload }
  } catch (error) {
    throw new GrpcDecodeError(
      `Failed to decode protobuf message: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}
