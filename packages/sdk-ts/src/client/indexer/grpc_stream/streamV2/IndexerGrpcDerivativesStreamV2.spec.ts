import { vi } from 'vitest'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcDerivativesStreamV2 } from './IndexerGrpcDerivativesStreamV2.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const mockMarketId =
  '0x17ef48032cb24375ba7c2e39f384e56433bcab20cbee9a7357e4cba2eb00abe6'

describe('IndexerGrpcDerivativesStreamV2', () => {
  let derivativesStream: IndexerGrpcDerivativesStreamV2

  beforeEach(() => {
    derivativesStream = new IndexerGrpcDerivativesStreamV2(endpoints.indexer)
  })

  describe('streamOrderbooksV2', () => {
    it('should pass an abort signal to the generated stream and abort it on unsubscribe', () => {
      const streamOrderbookV2 = vi.fn().mockReturnValue({
        responses: (async function* emptyStream() {})(),
      })

      ;(derivativesStream as any).client = { streamOrderbookV2 }

      const subscription = derivativesStream.streamOrderbooksV2({
        marketIds: [mockMarketId],
        callback: () => {},
      })

      const [request, options] = streamOrderbookV2.mock.calls[0]

      expect(request.marketIds).toEqual([mockMarketId])
      expect(options.abort).toBeDefined()
      expect(options.abort.aborted).toBe(false)

      subscription.unsubscribe()

      expect(options.abort.aborted).toBe(true)
    })
  })
})
