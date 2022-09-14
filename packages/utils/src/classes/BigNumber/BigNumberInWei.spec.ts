import BigNumberInWei from './BigNumberInWei'

describe('bigNumberInWei', () => {
  it('should convert base to wei', () => {
    expect(new BigNumberInWei(1000000000000000000).toBase().toFixed()).toBe('1')
  })
})
