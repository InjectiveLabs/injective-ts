import {
  MarketType as IndexerMarketType,
  GridStrategyType as IndexerGridStrategyType,
} from '../client/indexer/types/trading.js'
import {
  MarketType,
  OrderTypeMap,
  OracleTypeMap,
  GridStrategyType,
  GrpcOrderTypeMap,
  GrpcMarketStatusMap,
} from './light.js'
import {
  OrderTypeMap as ChainOrderTypeMap,
  OracleTypeMap as ChainOracleTypeMap,
  GrpcOrderTypeMap as ChainGrpcOrderTypeMap,
  GrpcMarketStatusMap as ChainGrpcMarketStatusMap,
} from '../client/chain/index.js'

describe('light types', () => {
  it('keeps proto enum maps aligned with chain exports', () => {
    expect(OrderTypeMap).toEqual(ChainOrderTypeMap)
    expect(OracleTypeMap).toEqual(ChainOracleTypeMap)
    expect(GrpcOrderTypeMap).toEqual(ChainGrpcOrderTypeMap)
    expect(GrpcMarketStatusMap).toEqual(ChainGrpcMarketStatusMap)
  })

  it('keeps indexer enum constants aligned with indexer exports', () => {
    expect(MarketType).toEqual(IndexerMarketType)
    expect(GridStrategyType).toEqual(IndexerGridStrategyType)
  })
})
