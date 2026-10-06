import { it, expect, describe } from 'vitest'
import * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import { IndexerGrpcDerivativeTransformer } from './IndexerGrpcDerivativeTransformer.js'
import { IndexerDerivativeStreamTransformer } from './IndexerDerivativeStreamTransformer.js'

describe('IndexerGrpcDerivativeTransformer', () => {
  it.each(['12345678901234567890.123456789012345678', ''])(
    'preserves cumulativeMargin %j in direct, unary and stream mapping',
    (cumulativeMargin) => {
      const position =
        InjectiveDerivativeExchangeRpcPb.DerivativePositionV2.create()

      if (cumulativeMargin) {
        position.cumulativeMargin = cumulativeMargin
      }

      expect(position.cumulativeMargin).toBe(cumulativeMargin)
      expect(
        IndexerGrpcDerivativeTransformer.grpcPositionV2ToPositionV2(position)
          .cumulativeMargin,
      ).toBe(cumulativeMargin)

      const response =
        InjectiveDerivativeExchangeRpcPb.PositionsV2Response.create({
          positions: [position],
        })

      expect(
        IndexerGrpcDerivativeTransformer.positionsV2ResponseToPositionsV2(
          response,
        ).positions,
      ).toMatchObject([{ cumulativeMargin }])

      const streamResponse =
        InjectiveDerivativeExchangeRpcPb.StreamPositionsV2Response.create({
          position,
          timestamp: 123n,
          operationType: 'update',
        })

      expect(
        IndexerDerivativeStreamTransformer.positionV2StreamCallback(
          streamResponse,
        ),
      ).toMatchObject({
        position: { cumulativeMargin },
        timestamp: 123n,
        operationType: 'update',
      })
    },
  )

  it('preserves an absent stream position and response metadata', () => {
    const response =
      InjectiveDerivativeExchangeRpcPb.StreamPositionsV2Response.create({
        timestamp: 123n,
        operationType: 'delete',
      })

    expect(
      IndexerDerivativeStreamTransformer.positionV2StreamCallback(response),
    ).toEqual({
      position: undefined,
      timestamp: 123n,
      operationType: 'delete',
    })
  })
})
