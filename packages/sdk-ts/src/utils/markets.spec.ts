import {
  getDerivativeMarketDecimals,
  getDerivativeMarketTensMultiplier,
  getSpotMarketDecimals,
  getSpotMarketTensMultiplier,
} from './markets.js'

describe('derivativeMarketTickSizes', () => {
  it('formats the tick sizes properly using getDerivativeMarketDecimals', () => {
    expect(
      getDerivativeMarketDecimals({
        minPriceTickSize: '0.0001',
        minQuantityTickSize: '0.1',
        quoteDecimals: 6,
      }),
    ).toStrictEqual({
      quantityDecimals: 1,
      priceDecimals: 10,
    })
    expect(
      getDerivativeMarketDecimals({
        minPriceTickSize: '10000',
        minQuantityTickSize: '0.01',
        quoteDecimals: 6,
      }),
    ).toStrictEqual({
      quantityDecimals: 2,
      priceDecimals: 2,
    })
  })

  it('formats the tick sizes properly using getDerivativeMarketTensMultiplier', () => {
    expect(
      getDerivativeMarketTensMultiplier({
        minPriceTickSize: '0.0001',
        minQuantityTickSize: '0.1',
        quoteDecimals: 6,
      }),
    ).toStrictEqual({
      quantityTensMultiplier: -1,
      priceTensMultiplier: -10,
    })
    expect(
      getDerivativeMarketTensMultiplier({
        minPriceTickSize: '10000',
        minQuantityTickSize: '0.01',
        quoteDecimals: 6,
      }),
    ).toStrictEqual({
      quantityTensMultiplier: -2,
      priceTensMultiplier: -2,
    })
  })
})

describe('spotMarketTickSizes', () => {
  it('formats the tick sizes properly using getSpotMarketDecimals', () => {
    expect(
      getSpotMarketDecimals({
        minPriceTickSize: '0.000000000000001',
        minQuantityTickSize: '1000000000000000',
        quoteDecimals: 6,
        baseDecimals: 18,
      }),
    ).toStrictEqual({
      quantityDecimals: 3,
      priceDecimals: 3,
    })
    expect(
      getSpotMarketDecimals({
        minPriceTickSize: '0.0001',
        minQuantityTickSize: '1000000',
        quoteDecimals: 6,
        baseDecimals: 6,
      }),
    ).toStrictEqual({
      quantityDecimals: 0,
      priceDecimals: 4,
    })
  })

  it('formats the tick sizes properly using getSpotMarketTensMultiplier', () => {
    expect(
      getSpotMarketTensMultiplier({
        minPriceTickSize: '0.000000000000001',
        minQuantityTickSize: '1000000000000000',
        quoteDecimals: 6,
        baseDecimals: 18,
      }),
    ).toStrictEqual({
      quantityTensMultiplier: -3,
      priceTensMultiplier: -3,
    })
    expect(
      getSpotMarketTensMultiplier({
        minPriceTickSize: '0.0001',
        minQuantityTickSize: '1000000',
        quoteDecimals: 6,
        baseDecimals: 6,
      }),
    ).toStrictEqual({
      quantityTensMultiplier: 0,
      priceTensMultiplier: -4,
    })
  })
})
