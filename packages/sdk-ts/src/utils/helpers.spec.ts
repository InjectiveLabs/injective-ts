import { bigIntReplacer, safeBigIntStringify } from './helpers.js'

describe('bigIntReplacer', () => {
  it('converts BigInt to string', () => {
    expect(bigIntReplacer('key', BigInt(123))).toBe('123')
    expect(bigIntReplacer('key', BigInt('9007199254740991'))).toBe(
      '9007199254740991',
    )
  })

  it('handles negative BigInt values', () => {
    expect(bigIntReplacer('key', BigInt(-12345))).toBe('-12345')
    expect(bigIntReplacer('key', BigInt('-9007199254740991'))).toBe(
      '-9007199254740991',
    )
  })

  it('handles zero BigInt', () => {
    expect(bigIntReplacer('key', BigInt(0))).toBe('0')
  })

  it('preserves non-BigInt values', () => {
    expect(bigIntReplacer('key', 'string')).toBe('string')
    expect(bigIntReplacer('key', 123)).toBe(123)
    expect(bigIntReplacer('key', null)).toBe(null)
    expect(bigIntReplacer('key', undefined)).toBe(undefined)
    expect(bigIntReplacer('key', { nested: 'object' })).toEqual({
      nested: 'object',
    })
    expect(bigIntReplacer('key', [1, 2, 3])).toEqual([1, 2, 3])
  })
})

describe('safeBigIntStringify', () => {
  it('handles simple objects with BigInt', () => {
    const obj = { amount: BigInt(1000000000000000000n) }
    const result = safeBigIntStringify(obj)
    expect(result).toBe('{"amount":"1000000000000000000"}')
    expect(() => JSON.parse(result)).not.toThrow()
  })

  it('handles nested objects with BigInt', () => {
    const obj = {
      outer: {
        inner: {
          value: BigInt(123456789),
        },
      },
    }
    const result = safeBigIntStringify(obj)
    const parsed = JSON.parse(result)
    expect(parsed.outer.inner.value).toBe('123456789')
  })

  it('handles arrays with BigInt values', () => {
    const arr = [BigInt(1), BigInt(2), BigInt(3)]
    const result = safeBigIntStringify(arr)
    expect(result).toBe('["1","2","3"]')
  })

  it('handles mixed types', () => {
    const obj = {
      bigint: BigInt(999),
      string: 'hello',
      number: 42,
      boolean: true,
      null: null,
      array: [BigInt(1), 'two', 3],
      nested: { deep: BigInt(100) },
    }
    const result = safeBigIntStringify(obj)
    const parsed = JSON.parse(result)

    expect(parsed.bigint).toBe('999')
    expect(parsed.string).toBe('hello')
    expect(parsed.number).toBe(42)
    expect(parsed.boolean).toBe(true)
    expect(parsed.null).toBe(null)
    expect(parsed.array).toEqual(['1', 'two', 3])
    expect(parsed.nested.deep).toBe('100')
  })

  it('works with custom replacer combined with BigInt handling', () => {
    const obj = { amount: BigInt(100), secret: 'hidden' }
    const customReplacer = (key: string, value: unknown) => {
      if (key === 'secret') return '[REDACTED]'
      return value
    }
    const result = safeBigIntStringify(obj, customReplacer)
    const parsed = JSON.parse(result)

    expect(parsed.amount).toBe('100')
    expect(parsed.secret).toBe('[REDACTED]')
  })

  it('handles pretty printing with space parameter', () => {
    const obj = { value: BigInt(42) }
    const result = safeBigIntStringify(obj, null, 2)
    expect(result).toBe('{\n  "value": "42"\n}')
  })

  it('handles objects without BigInt values', () => {
    const obj = { name: 'test', count: 5 }
    const result = safeBigIntStringify(obj)
    expect(result).toBe('{"name":"test","count":5}')
  })

  it('handles empty objects and arrays', () => {
    expect(safeBigIntStringify({})).toBe('{}')
    expect(safeBigIntStringify([])).toBe('[]')
  })

  it('handles negative BigInt values', () => {
    const obj = { amount: BigInt(-12345) }
    const result = safeBigIntStringify(obj)
    expect(result).toBe('{"amount":"-12345"}')
  })

  it('handles zero BigInt', () => {
    const obj = { amount: BigInt(0) }
    const result = safeBigIntStringify(obj)
    expect(result).toBe('{"amount":"0"}')
  })

  it('handles BigInt larger than MAX_SAFE_INTEGER', () => {
    const largeNum = BigInt('99999999999999999999999999999999')
    const obj = { value: largeNum }
    const result = safeBigIntStringify(obj)
    const parsed = JSON.parse(result)
    expect(parsed.value).toBe('99999999999999999999999999999999')
  })

  it('handles negative BigInt larger than MIN_SAFE_INTEGER', () => {
    const largeNegNum = BigInt('-99999999999999999999999999999999')
    const obj = { value: largeNegNum }
    const result = safeBigIntStringify(obj)
    const parsed = JSON.parse(result)
    expect(parsed.value).toBe('-99999999999999999999999999999999')
  })
})
