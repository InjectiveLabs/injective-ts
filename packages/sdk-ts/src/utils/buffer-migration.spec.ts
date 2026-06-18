import {
  toUtf8,
  fromUtf8,
  toBase64,
  hexToBuff,
  fromBase64,
  hexToBase64,
  base64ToUtf8,
  binaryToBase64,
  hexToUint8Array,
  uint8ArrayToHex,
  base64ToUint8Array,
  uint8ArrayToBase64,
  stringToUint8Array,
  uint8ArrayToString,
} from './encoding.js'

// todo: remove this file once the migration passes QA regression

describe('Buffer Migration - Encoding Utilities', () => {
  describe('hexToUint8Array', () => {
    it('should convert hex string without 0x prefix', () => {
      const hex = 'deadbeef'
      const result = hexToUint8Array(hex)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(4)
      expect(Array.from(result)).toEqual([0xde, 0xad, 0xbe, 0xef])
    })

    it('should convert hex string with 0x prefix', () => {
      const hex = '0xdeadbeef'
      const result = hexToUint8Array(hex)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(4)
      expect(Array.from(result)).toEqual([0xde, 0xad, 0xbe, 0xef])
    })

    it('should handle empty hex string after 0x', () => {
      const hex = '0x'
      const result = hexToUint8Array(hex)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(0)
    })

    it('should throw error for invalid hex string', () => {
      expect(() => hexToUint8Array('not hex')).toThrow()
      expect(() => hexToUint8Array('0xZZZZ')).toThrow()
    })

    it('should throw error for empty string', () => {
      expect(() => hexToUint8Array('')).toThrow()
      expect(() => hexToUint8Array('  ')).toThrow()
    })

    it('should handle long hex strings', () => {
      const hex = '0x' + 'ff'.repeat(1000)
      const result = hexToUint8Array(hex)

      expect(result.length).toBe(1000)
      expect(result.every((byte) => byte === 0xff)).toBe(true)
    })
  })

  describe('uint8ArrayToHex', () => {
    it('should convert Uint8Array to hex string', () => {
      const arr = new Uint8Array([0xde, 0xad, 0xbe, 0xef])
      const result = uint8ArrayToHex(arr)

      expect(result).toBe('deadbeef')
      expect(result.startsWith('0x')).toBe(false)
    })

    it('should handle empty Uint8Array', () => {
      const arr = new Uint8Array([])
      const result = uint8ArrayToHex(arr)

      expect(result).toBe('')
    })

    it('should convert large Uint8Array', () => {
      const arr = new Uint8Array(1000).fill(0xff)
      const result = uint8ArrayToHex(arr)

      expect(result).toBe('ff'.repeat(1000))
    })

    it('should be reversible with hexToUint8Array', () => {
      const original = '0xdeadbeef1234567890abcdef'
      const arr = hexToUint8Array(original)
      const result = uint8ArrayToHex(arr)

      expect(result).toBe(original.slice(2)) // Without 0x prefix
    })
  })

  describe('base64ToUint8Array', () => {
    it('should convert base64 string to Uint8Array', () => {
      const base64 = 'SGVsbG8gV29ybGQ=' // "Hello World"
      const result = base64ToUint8Array(base64)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe('Hello World')
    })

    it('should handle padding variations', () => {
      const tests = [
        { input: 'YQ==', expected: 'a' },
        { input: 'YWI=', expected: 'ab' },
        { input: 'YWJj', expected: 'abc' },
      ]

      tests.forEach(({ input, expected }) => {
        const result = base64ToUint8Array(input)
        expect(new TextDecoder().decode(result)).toBe(expected)
      })
    })

    it('should throw error for invalid base64', () => {
      expect(() => base64ToUint8Array('not base64!!!')).toThrow()
      expect(() => base64ToUint8Array('')).toThrow()
    })

    it('should handle large base64 strings', () => {
      const largeData = new Uint8Array(10000).fill(0x42)
      const base64 = uint8ArrayToBase64(largeData)
      const result = base64ToUint8Array(base64)

      expect(result.length).toBe(10000)
      expect(result.every((byte) => byte === 0x42)).toBe(true)
    })
  })

  describe('uint8ArrayToBase64', () => {
    it('should convert Uint8Array to base64 string', () => {
      const arr = new TextEncoder().encode('Hello World')
      const result = uint8ArrayToBase64(arr)

      expect(result).toBe('SGVsbG8gV29ybGQ=')
    })

    it('should handle empty Uint8Array', () => {
      const arr = new Uint8Array([])
      const result = uint8ArrayToBase64(arr)

      expect(result).toBe('')
    })

    it('should be reversible with base64ToUint8Array', () => {
      const original = new Uint8Array([
        0xde, 0xad, 0xbe, 0xef, 0x12, 0x34, 0x56, 0x78,
      ])
      const base64 = uint8ArrayToBase64(original)
      const result = base64ToUint8Array(base64)

      expect(Array.from(result)).toEqual(Array.from(original))
    })
  })

  describe('stringToUint8Array', () => {
    it('should convert ASCII string to Uint8Array', () => {
      const str = 'Hello World'
      const result = stringToUint8Array(str)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe(str)
    })

    it('should handle UTF-8 characters', () => {
      const str = 'Hello 世界 🚀'
      const result = stringToUint8Array(str)

      expect(new TextDecoder().decode(result)).toBe(str)
    })

    it('should handle empty string', () => {
      const result = stringToUint8Array('')

      expect(result.length).toBe(0)
    })

    it('should handle special characters', () => {
      const str = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const result = stringToUint8Array(str)

      expect(new TextDecoder().decode(result)).toBe(str)
    })
  })

  describe('hexToBuff', () => {
    it('should convert hex to Uint8Array (buffer-like)', () => {
      const hex = 'deadbeef'
      const result = hexToBuff(hex)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(Array.from(result)).toEqual([0xde, 0xad, 0xbe, 0xef])
    })

    it('should handle hex with 0x prefix', () => {
      const hex = '0xdeadbeef'
      const result = hexToBuff(hex)

      expect(Array.from(result)).toEqual([0xde, 0xad, 0xbe, 0xef])
    })
  })

  describe('hexToBase64', () => {
    it('should convert hex to base64', () => {
      const hex = '48656c6c6f' // "Hello" in hex
      const result = hexToBase64(hex)

      expect(result).toBe('SGVsbG8=')
    })

    it('should handle hex with 0x prefix', () => {
      const hex = '0x48656c6c6f'
      const result = hexToBase64(hex)

      expect(result).toBe('SGVsbG8=')
    })
  })

  describe('base64ToUtf8', () => {
    it('should convert base64 string to UTF-8 string', () => {
      const base64 = 'SGVsbG8gV29ybGQ=' // "Hello World" in base64
      const result = base64ToUtf8(base64)

      expect(result).toBe('Hello World')
    })

    it('should handle emoji and special characters', () => {
      const base64 = '8J+YgCBIZWxsbyDwn5iB' // "😀 Hello 😁" in base64
      const result = base64ToUtf8(base64)

      expect(result).toBe('😀 Hello 😁')
    })

    it('should throw error for invalid base64', () => {
      expect(() => base64ToUtf8('not-valid-base64!!!')).toThrow()
    })

    it('should throw error for empty string', () => {
      expect(() => base64ToUtf8('')).toThrow()
    })
  })

  describe('fromUtf8', () => {
    it('should convert string to Uint8Array', () => {
      const str = 'Hello World'
      const result = fromUtf8(str)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(new TextDecoder().decode(result)).toBe(str)
    })

    it('should return Uint8Array as-is', () => {
      const arr = new Uint8Array([1, 2, 3])
      const result = fromUtf8(arr)

      expect(result).toBe(arr)
      expect(Array.from(result)).toEqual([1, 2, 3])
    })
  })

  describe('toUtf8', () => {
    it('should convert Uint8Array to string', () => {
      const arr = new TextEncoder().encode('Hello World')
      const result = toUtf8(arr)

      expect(result).toBe('Hello World')
    })

    it('should return string as-is', () => {
      const str = 'Hello World'
      const result = toUtf8(str)

      expect(result).toBe(str)
    })
  })

  describe('uint8ArrayToString', () => {
    it('should convert Uint8Array to string', () => {
      const arr = new TextEncoder().encode('Hello')
      const result = uint8ArrayToString(arr)

      expect(result).toBe('Hello')
    })

    it('should convert Uint8Array subclasses to string', () => {
      class CustomUint8Array extends Uint8Array {}

      const arr = new CustomUint8Array([72, 101, 108, 108, 111])
      const result = uint8ArrayToString(arr)

      expect(result).toBe('Hello')
    })

    it('should return string as-is', () => {
      const str = 'Hello'
      const result = uint8ArrayToString(str)

      expect(result).toBe(str)
    })

    it('should return empty string for null', () => {
      const result = uint8ArrayToString(null)

      expect(result).toBe('')
    })

    it('should return empty string for undefined', () => {
      const result = uint8ArrayToString(undefined)

      expect(result).toBe('')
    })
  })

  describe('binaryToBase64', () => {
    it('should convert Uint8Array to base64', () => {
      const arr = new TextEncoder().encode('Hello')
      const result = binaryToBase64(arr)

      expect(result).toBe('SGVsbG8=')
    })

    it('should return string as-is', () => {
      const str = 'AlreadyBase64=='
      const result = binaryToBase64(str)

      expect(result).toBe(str)
    })
  })

  describe('toBase64', () => {
    it('should convert JSON object to base64', () => {
      const obj = { message: 'Hello', value: 42 }
      const result = toBase64(obj)

      const decoded = fromBase64(result)
      expect(decoded).toEqual(obj)
    })

    it('should handle nested objects', () => {
      const obj = {
        outer: {
          inner: {
            value: 'test',
          },
        },
      }
      const result = toBase64(obj)

      const decoded = fromBase64(result)
      expect(decoded).toEqual(obj)
    })

    it('should handle arrays', () => {
      const obj = { items: [1, 2, 3, 'test'] }
      const result = toBase64(obj)

      const decoded = fromBase64(result)
      expect(decoded).toEqual(obj)
    })

    it('should handle bigint values', () => {
      const result = toBase64({ amount: 123n })

      const decoded = fromBase64(result)
      expect(decoded).toEqual({ amount: '123' })
    })
  })

  describe('fromBase64', () => {
    it('should convert base64 to JSON object', () => {
      const obj = { message: 'Hello', value: 42 }
      const base64 = toBase64(obj)
      const result = fromBase64(base64)

      expect(result).toEqual(obj)
    })

    it('should throw error for invalid base64', () => {
      expect(() => fromBase64('not base64!!!')).toThrow()
    })

    it('should throw error for empty string', () => {
      expect(() => fromBase64('')).toThrow()
    })

    it('should throw error for base64 with invalid JSON', () => {
      const invalidJson = uint8ArrayToBase64(stringToUint8Array('not json'))
      expect(() => fromBase64(invalidJson)).toThrow()
    })
  })

  describe('Cross-function compatibility', () => {
    it('should convert hex -> Uint8Array -> base64 -> Uint8Array -> hex', () => {
      const original = '0xdeadbeef'
      const arr1 = hexToUint8Array(original)
      const base64 = uint8ArrayToBase64(arr1)
      const arr2 = base64ToUint8Array(base64)
      const final = uint8ArrayToHex(arr2)

      expect(final).toBe(original.slice(2))
    })

    it('should convert string -> Uint8Array -> base64 -> Uint8Array -> string', () => {
      const original = 'Hello World 🚀'
      const arr1 = stringToUint8Array(original)
      const base64 = uint8ArrayToBase64(arr1)
      const arr2 = base64ToUint8Array(base64)
      const final = new TextDecoder().decode(arr2)

      expect(final).toBe(original)
    })

    it('should handle JSON -> base64 -> JSON round trip', () => {
      const original = {
        nested: {
          array: [1, 2, 3],
          string: 'test',
          bool: true,
        },
      }
      const base64 = toBase64(original)
      const final = fromBase64(base64)

      expect(final).toEqual(original)
    })
  })

  describe('Buffer compatibility patterns', () => {
    it('should match old Buffer.from(hex, "hex") behavior', () => {
      const hex = 'deadbeef'
      const result = hexToUint8Array(hex)

      // Old: Buffer.from(hex, 'hex')
      // New: hexToUint8Array(hex)
      expect(Array.from(result)).toEqual([0xde, 0xad, 0xbe, 0xef])
    })

    it('should match old Buffer.from(base64, "base64") behavior', () => {
      const base64 = 'SGVsbG8='
      const result = base64ToUint8Array(base64)

      // Old: Buffer.from(base64, 'base64')
      // New: base64ToUint8Array(base64)
      expect(new TextDecoder().decode(result)).toBe('Hello')
    })

    it('should match old Buffer.toString("hex") behavior', () => {
      const arr = new Uint8Array([0xde, 0xad, 0xbe, 0xef])
      const result = uint8ArrayToHex(arr)

      // Old: Buffer.from(arr).toString('hex')
      // New: uint8ArrayToHex(arr)
      expect(result).toBe('deadbeef')
    })

    it('should match old Buffer.toString("base64") behavior', () => {
      const arr = new TextEncoder().encode('Hello')
      const result = uint8ArrayToBase64(arr)

      // Old: Buffer.from(arr).toString('base64')
      // New: uint8ArrayToBase64(arr)
      expect(result).toBe('SGVsbG8=')
    })
  })

  describe('Edge cases', () => {
    it('should handle single byte arrays', () => {
      const arr = new Uint8Array([0x42])
      const hex = uint8ArrayToHex(arr)
      const back = hexToUint8Array(hex)

      expect(Array.from(back)).toEqual([0x42])
    })

    it('should handle all possible byte values', () => {
      const arr = new Uint8Array(256)
      for (let i = 0; i < 256; i++) {
        arr[i] = i
      }

      const hex = uint8ArrayToHex(arr)
      const back = hexToUint8Array(hex)

      expect(Array.from(back)).toEqual(Array.from(arr))
    })

    it('should handle Unicode characters in JSON', () => {
      const obj = {
        emoji: '🚀',
        chinese: '你好',
        arabic: 'مرحبا',
      }

      const base64 = toBase64(obj)
      const result = fromBase64(base64)

      expect(result).toEqual(obj)
    })
  })
})
