import { vi } from 'vitest'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpcWsPriceOracleApi } from './IndexerGrpcWsPriceOracleApi.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const marketId = mockFactory.derivativeMarketId

describe('IndexerGrpcWsPriceOracleApi', () => {
  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      const api = new IndexerGrpcWsPriceOracleApi(endpoints.indexer)

      expect(api).toBeDefined()
      expect(api).toBeInstanceOf(IndexerGrpcWsPriceOracleApi)
    })
  })

  describe('fetchLatestMarketPrices', () => {
    it('should forward filters and transform latest market prices', async () => {
      const api = new IndexerGrpcWsPriceOracleApi(endpoints.indexer)
      const executeGrpcCall = vi
        .spyOn(api as any, 'executeGrpcCall')
        .mockResolvedValue({
          prices: [
            {
              type: 'price',
              marketId,
              marketTicker: 'BTC/USDT PERP',
              oracleBase: 'BTC',
              oracleQuote: 'USDT',
              oracleType: 'pyth',
              oracleScaleFactor: 6,
              active: true,
              price: '100000000',
              timestamp: '1700000000000',
              receivedAt: '1700000001000',
              sequence: 12n,
              legs: [
                {
                  oracleType: 'pyth',
                  base: 'BTC',
                  quote: 'USDT',
                  price: '100000000',
                  timestamp: '1700000000000',
                  source: 'pyth',
                },
              ],
              verificationStatus: 'verified',
              raw: {
                provider: 'pyth',
                feedId: 'feed-id',
                encoding: 'hex',
                data: '0x1234',
              },
            },
          ],
        })

      const response = await api.fetchLatestMarketPrices({
        marketIds: [marketId],
        oracleTypes: ['pyth'],
        includeInactive: false,
      })

      const [request] = executeGrpcCall.mock.calls[0]

      expect(request).toMatchObject({
        marketIds: [marketId],
        oracleTypes: ['pyth'],
        includeInactive: false,
      })
      expect(response).toEqual({
        prices: [
          {
            type: 'price',
            marketId,
            marketTicker: 'BTC/USDT PERP',
            oracleBase: 'BTC',
            oracleQuote: 'USDT',
            oracleType: 'pyth',
            oracleScaleFactor: 6,
            active: true,
            price: '100000000',
            timestamp: '1700000000000',
            receivedAt: '1700000001000',
            sequence: 12,
            legs: [
              {
                oracleType: 'pyth',
                base: 'BTC',
                quote: 'USDT',
                price: '100000000',
                timestamp: '1700000000000',
                source: 'pyth',
              },
            ],
            verificationStatus: 'verified',
            raw: {
              provider: 'pyth',
              feedId: 'feed-id',
              encoding: 'hex',
              data: '0x1234',
            },
          },
        ],
      })

      executeGrpcCall.mockRestore()
    })
  })

  describe('fetchLatestMarketPricesV2', () => {
    it('should forward filters and mode and transform all response modes', async () => {
      const api = new IndexerGrpcWsPriceOracleApi(endpoints.indexer)
      const executeGrpcCall = vi
        .spyOn(api as any, 'executeGrpcCall')
        .mockResolvedValue({
          mode: 'light',
          prices: [
            {
              type: 'price',
              marketId,
              marketTicker: 'BTC/USDT PERP',
              oracleBase: 'BTC',
              oracleQuote: 'USDT',
              oracleType: 'pyth',
              oracleScaleFactor: 6,
              active: true,
              price: '100000000',
              timestamp: '1700000000000',
              receivedAt: '1700000001000',
              sequence: 12n,
              legs: [],
              verificationStatus: 'verified',
            },
          ],
          lightPrices: [
            {
              marketId,
              price: '100000000',
              timestamp: '1700000000000',
              type: 'price',
            },
          ],
          slimPrices: {
            [marketId]: '100000000',
          },
        })

      const response = await api.fetchLatestMarketPricesV2({
        marketIds: [marketId],
        oracleTypes: ['pyth'],
        includeInactive: false,
        mode: 'light',
      })

      const [request] = executeGrpcCall.mock.calls[0]

      expect(request).toMatchObject({
        marketIds: [marketId],
        oracleTypes: ['pyth'],
        includeInactive: false,
        mode: 'light',
      })
      expect(response).toEqual({
        mode: 'light',
        prices: [
          {
            type: 'price',
            marketId,
            marketTicker: 'BTC/USDT PERP',
            oracleBase: 'BTC',
            oracleQuote: 'USDT',
            oracleType: 'pyth',
            oracleScaleFactor: 6,
            active: true,
            price: '100000000',
            timestamp: '1700000000000',
            receivedAt: '1700000001000',
            sequence: 12,
            legs: [],
            verificationStatus: 'verified',
            raw: undefined,
          },
        ],
        lightPrices: [
          {
            marketId,
            price: '100000000',
            timestamp: '1700000000000',
            type: 'price',
          },
        ],
        slimPrices: {
          [marketId]: '100000000',
        },
      })

      executeGrpcCall.mockRestore()
    })
  })
})
