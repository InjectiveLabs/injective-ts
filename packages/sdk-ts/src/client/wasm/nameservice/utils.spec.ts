import { nameToNode, normalizeName } from './utils'

describe('inj name utils', () => {
  it('name to node', () => {
    expect(nameToNode('999.inj')).toStrictEqual([
      243, 87, 103, 48, 162, 32, 198, 33, 34, 235, 164, 156, 23, 95, 45, 165,
      30, 194, 109, 244, 116, 237, 31, 55, 196, 73, 11, 45, 153, 172, 64, 40,
    ])
    expect(nameToNode('')).toStrictEqual([])
  })
  it('normalize name', () => {
    expect(normalizeName('999.inj')).toBe('999.inj')
    expect(normalizeName('AAA.INJ')).toBe('aaa.inj')
  })
  it('normalize illegal length name', () => {
    expect(() => normalizeName('99.inj')).toThrow('Invalid Domain')
    expect(() => normalizeName('')).toThrow('Invalid Domain')
    expect(() => normalizeName(' ')).toThrow('Invalid Domain')
    expect(() => normalizeName('.inj')).toThrow(
      'Domain cannot have empty labels',
    )
  })
  it('normalize unsupported characters', () => {
    expect(() => normalizeName('aaa甲.inj')).toThrow('Invalid Domain')
    expect(() => normalizeName('99 9.inj')).toThrow('Invalid Domain')
    expect(() => normalizeName('99_9.inj')).toThrow('Invalid Domain')
    expect(() => normalizeName('99*9.inj')).toThrow('Invalid Domain')
    expect(() => normalizeName('999.999.inj')).toThrow('Invalid Domain')
  })
})
