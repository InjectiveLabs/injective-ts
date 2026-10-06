import { it, expect, describe } from 'vitest'
import * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'
import { IndexerGrpcTcDerivativesTransformer } from './IndexerGrpcTcDerivativesTransformer.js'
import { IndexerTcDerivativesStreamTransformer } from './IndexerTcDerivativesStreamTransformer.js'

describe('IndexerGrpcTcDerivativesTransformer', () => {
  it.each(['-12345678901234567890.123456789012345678', ''])(
    'preserves cumulativeMargin %j in direct, unary and stream mapping',
    (cumulativeMargin) => {
      const position = InjectiveTCDerivativesRpcPb.DerivativePositionV2.create()

      if (cumulativeMargin) {
        position.cumulativeMargin = cumulativeMargin
      }

      expect(position.cumulativeMargin).toBe(cumulativeMargin)
      expect(
        IndexerGrpcTcDerivativesTransformer.grpcPositionToPosition(position)
          .cumulativeMargin,
      ).toBe(cumulativeMargin)

      const response = InjectiveTCDerivativesRpcPb.PositionsResponse.create({
        positions: [position],
      })

      expect(
        IndexerGrpcTcDerivativesTransformer.positionsResponseToPositions(
          response,
        ).positions,
      ).toMatchObject([{ cumulativeMargin }])

      const streamResponse =
        InjectiveTCDerivativesRpcPb.StreamPositionsResponse.create({
          position,
          timestamp: 123n,
          operationType: 'update',
        })

      expect(
        IndexerTcDerivativesStreamTransformer.positionsStreamCallback(
          streamResponse,
        ),
      ).toMatchObject({
        position: { cumulativeMargin },
        timestamp: 123,
        operationType: 'update',
      })
    },
  )

  it('preserves an absent stream position and response metadata', () => {
    const response =
      InjectiveTCDerivativesRpcPb.StreamPositionsResponse.create({
        timestamp: 123n,
        operationType: 'delete',
      })

    expect(
      IndexerTcDerivativesStreamTransformer.positionsStreamCallback(response),
    ).toEqual({
      position: undefined,
      timestamp: 123,
      operationType: 'delete',
    })
  })
})
