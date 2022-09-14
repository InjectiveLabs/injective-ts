import BigNumberInBase from './BigNumberInBase'

describe('bigNumberInBase', () => {
  it('should convert base to wei', () => {
    expect(new BigNumberInBase(1).toWei().toFixed()).toBe('1000000000000000000')
  })
})
