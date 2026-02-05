# WebSocket RFQ Streaming Implementation

## Overview

This module implements gRPC-over-WebSocket bidirectional streaming for RFQ (Request for Quote) functionality in the `injective-ts` SDK.

## Files Created

| File                        | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `types.ts`                  | Type definitions, enums, and constants            |
| `GrpcWebSocketCodec.ts`     | Binary encoding/decoding with 5-byte gRPC framing |
| `GrpcWebSocketTransport.ts` | Low-level WebSocket lifecycle management          |
| `IndexerWsTakerStream.ts`   | High-level taker API                              |
| `IndexerWsMakerStream.ts`   | High-level maker API                              |
| `index.ts`                  | Module exports                                    |

## Files Modified

| File                                          | Change                                |
| --------------------------------------------- | ------------------------------------- |
| `packages/sdk-ts/src/client/indexer/index.ts` | Added `export * from './ws/index.js'` |

## Key Features

### GrpcWebSocketCodec

Handles binary gRPC framing with 5-byte header:

- 1 byte: compression flag (0x00 = none, 0x80 = trailer)
- 4 bytes: big-endian payload length
- N bytes: protobuf payload

### GrpcWebSocketTransport

Manages WebSocket connection lifecycle with:

- Automatic reconnection with exponential backoff
- State machine: `Idle → Connecting → Connected → Reconnecting → Disconnected`
- Isomorphic support (Browser + Node.js)
- Event-based API

### IndexerWsTakerStream

High-level API for takers:

**Methods:**

- `connect()` - Connect to the stream
- `disconnect()` - Disconnect from the stream
- `destroy()` - Permanently destroy the stream
- `sendRequest(request: RFQRequestInput)` - Send an RFQ request
- `getState()` - Get current connection state
- `isConnected()` - Check if connected

**Events:**

- `quote` - Received a quote from a maker
- `request_ack` - Request was acknowledged
- `error` - Error received from server
- `pong` - Pong received (response to ping)
- `connect` - Connection established
- `disconnect` - Connection closed
- `state_change` - State changed

### IndexerWsMakerStream

High-level API for makers:

**Methods:**

- `connect()` - Connect to the stream
- `disconnect()` - Disconnect from the stream
- `destroy()` - Permanently destroy the stream
- `sendQuote(quote: RFQQuoteInput)` - Send a quote
- `getState()` - Get current connection state
- `isConnected()` - Check if connected

**Events:**

- `request` - Received an RFQ request from a taker
- `quote_ack` - Quote was acknowledged
- `error` - Error received from server
- `pong` - Pong received (response to ping)
- `connect` - Connection established
- `disconnect` - Connection closed
- `state_change` - State changed

## Usage Examples

### Taker Example

```typescript
import { IndexerWsTakerStream } from '@injectivelabs/sdk-ts/client/indexer'

const takerStream = new IndexerWsTakerStream({
  url: 'wss://devnet.api.injective.dev',
})

// Set up event listeners
takerStream.on('quote', ({ quote, operation }) => {
  console.log('Received quote:', quote)
})

takerStream.on('request_ack', ({ rfqId, status }) => {
  console.log('Request acknowledged:', rfqId, status)
})

takerStream.on('error', ({ code, message }) => {
  console.error('Stream error:', code, message)
})

// Connect to the stream
await takerStream.connect()

// Send an RFQ request
takerStream.sendRequest({
  rfqId: '12345',
  marketId: '0x...',
  direction: 'LONG',
  margin: '1000000000',
  quantity: '10000000000',
  worstPrice: '50000000000',
  requestAddress: 'inj1...',
  expiry: Math.floor(Date.now() / 1000) + 300,
  status: 'open',
})

// Later, disconnect
takerStream.disconnect()
```

### Maker Example

```typescript
import { IndexerWsMakerStream } from '@injectivelabs/sdk-ts/client/indexer'

const makerStream = new IndexerWsMakerStream({
  url: 'wss://devnet.api.injective.dev',
})

// Set up event listeners
makerStream.on('request', ({ request, operation }) => {
  console.log('Received RFQ request:', request)

  // Respond with a quote
  makerStream.sendQuote({
    marketId: request.marketId,
    rfqId: request.rfqId,
    takerDirection: request.direction,
    margin: request.margin,
    quantity: request.quantity,
    price: '50000000000',
    expiry: request.expiry,
    maker: 'inj1maker...',
    taker: request.requestAddress,
    signature: '0x...',
    status: 'pending',
  })
})

makerStream.on('quote_ack', ({ rfqId, status }) => {
  console.log('Quote acknowledged:', rfqId, status)
})

makerStream.on('error', ({ code, message }) => {
  console.error('Stream error:', code, message)
})

// Connect to the stream
await makerStream.connect()

// Later, disconnect
makerStream.disconnect()
```

## Configuration Options

### TakerStreamConfig / MakerStreamConfig

```typescript
interface StreamConfig {
  /** Base WebSocket URL (e.g., 'wss://devnet.api.injective.dev') */
  url: string

  /** Ping interval in milliseconds (default: 1000, server timeout is 2 seconds) */
  pingIntervalMs?: number

  /** Connection timeout in milliseconds (default: 10000) */
  connectionTimeoutMs?: number

  /** Reconnection configuration */
  reconnect?: {
    /** Enable automatic reconnection (default: true) */
    enabled?: boolean

    /** Maximum number of reconnection attempts (default: 10, 0 = infinite) */
    maxAttempts?: number

    /** Initial delay before first reconnection attempt in ms (default: 1000) */
    initialDelayMs?: number

    /** Maximum delay between reconnection attempts in ms (default: 30000) */
    maxDelayMs?: number

    /** Multiplier for exponential backoff (default: 2) */
    backoffMultiplier?: number
  }
}
```

## Technical Details

### gRPC-over-WebSocket Protocol

The implementation uses the `grpc-ws` WebSocket subprotocol with binary framing:

```
Frame format:
[compressionFlag: 1 byte][length: 4 bytes BE][payload: N bytes]

- compressionFlag = 0x00: no compression (data frame)
- compressionFlag = 0x80: trailer frame (end of stream)
- length: big-endian uint32 payload length
- payload: protobuf-encoded message
```

### Protobuf Types

The implementation uses types from `@injectivelabs/indexer-proto-ts-v2`:

- `TakerStreamStreamingRequest` - Client → Server (taker)
- `TakerStreamResponse` - Server → Client (taker)
- `MakerStreamStreamingRequest` - Client → Server (maker)
- `MakerStreamResponse` - Server → Client (maker)

### WebSocket Endpoints

- Taker Stream: `/injective_rfqrpc.InjectiveRFQRPC/TakerStream`
- Maker Stream: `/injective_rfqrpc.InjectiveRFQRPC/MakerStream`

### Connection Keep-Alive

The server has a 2-second ping timeout, so the client sends pings every 1 second (configurable via `pingIntervalMs`).
