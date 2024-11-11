import {
  spotPriceFromChainPriceToFixed,
  spotQuantityFromChainQuantityToFixed,
} from './numbers.js'

describe('formatSpotChainNumbersToProperFormat', () => {
  it('formats the number properly', () => {
    expect(
      spotQuantityFromChainQuantityToFixed({
        value: '3000000000000000000000',
        baseDecimals: 18,
      }),
    ).toEqual('3000')
    expect(
      spotPriceFromChainPriceToFixed({
        value: '0.000000000001437',
        quoteDecimals: 6,
        baseDecimals: 18,
      }),
    ).toEqual('1.437')
  })
})
