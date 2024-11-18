import BigNumberInWei from './BigNumberInWei.js'

describe('bigNumberInWei', () => {
  it('should convert base to wei', () => {
    expect(new BigNumberInWei(1000000000000000000).toBase().toFixed()).toBe('1')
  })
})
