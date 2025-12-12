import { prepareSignBytes } from './utils.js'

describe('prepareSignBytes', () => {
  it('converts BigInt values to strings', () => {
    const obj = { amount: BigInt(1000) }
    const result = prepareSignBytes(obj)
    expect(result.amount).toBe('1000')
  })

  it('handles negative BigInt values', () => {
    const obj = { amount: BigInt(-12345) }
    const result = prepareSignBytes(obj)
    expect(result.amount).toBe('-12345')
  })

  it('handles zero BigInt', () => {
    const obj = { amount: BigInt(0) }
    const result = prepareSignBytes(obj)
    expect(result.amount).toBe('0')
  })

  it('handles BigInt larger than MAX_SAFE_INTEGER', () => {
    const largeNum = BigInt('99999999999999999999999999999999')
    const obj = { value: largeNum }
    const result = prepareSignBytes(obj)
    expect(result.value).toBe('99999999999999999999999999999999')
  })

  it('handles nested objects with BigInt', () => {
    const obj = { amount: BigInt(1000), nested: { value: BigInt(2000) } }
    const result = prepareSignBytes(obj)
    expect(result.amount).toBe('1000')
    expect(result.nested.value).toBe('2000')
  })

  it('handles arrays with BigInt values', () => {
    const arr = [BigInt(1), BigInt(2), BigInt(3)]
    const result = prepareSignBytes(arr)
    expect(result).toEqual(['1', '2', '3'])
  })

  it('handles mixed arrays with BigInt and other types', () => {
    const arr = [BigInt(1), 'two', 3, { nested: BigInt(4) }]
    const result = prepareSignBytes(arr)
    expect(result[0]).toBe('1')
    expect(result[1]).toBe('two')
    expect(result[2]).toBe(3)
    expect(result[3].nested).toBe('4')
  })

  it('preserves non-BigInt primitive values', () => {
    const obj = {
      string: 'hello',
      number: 42,
      boolean: true,
    }
    const result = prepareSignBytes(obj)
    expect(result.string).toBe('hello')
    expect(result.number).toBe(42)
    expect(result.boolean).toBe(true)
  })

  it('removes null and undefined values', () => {
    const obj = {
      valid: 'value',
      nullValue: null,
      undefinedValue: undefined,
    }
    const result = prepareSignBytes(obj)
    expect(result.valid).toBe('value')
    expect(result.nullValue).toBeUndefined()
    expect(result.undefinedValue).toBeUndefined()
  })

  it('sorts object keys alphabetically', () => {
    const obj = { z: 1, a: 2, m: 3 }
    const result = prepareSignBytes(obj)
    const keys = Object.keys(result)
    expect(keys).toEqual(['a', 'm', 'z'])
  })

  it('returns the result that can be JSON stringified', () => {
    const obj = {
      bigint: BigInt(999),
      nested: { deep: BigInt(100) },
      array: [BigInt(1), BigInt(2)],
    }
    const result = prepareSignBytes(obj)
    expect(() => JSON.stringify(result)).not.toThrow()
    const stringified = JSON.stringify(result)
    expect(stringified).toBe(
      '{"array":["1","2"],"bigint":"999","nested":{"deep":"100"}}',
    )
  })
})
