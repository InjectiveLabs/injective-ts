import { GeneralException } from './exceptions/GeneralException.js'
import { GrpcUnaryRequestException } from './exceptions/GrpcUnaryRequestException.js'

describe('ConcreteException - Issue #259 Regression', () => {
  it('does not throw TypeError when constructing from Error', () => {
    expect(() => {
      new GrpcUnaryRequestException(new Error('test error'))
    }).not.toThrow()
  })

  it('preserves stack trace from original error', () => {
    const original = new Error('test error')
    const ex = new GrpcUnaryRequestException(original)
    expect(ex.stack).toBe(original.stack)
  })

  it('preserves stack in toObject()', () => {
    const original = new Error('test error')
    const ex = new GrpcUnaryRequestException(original)
    const obj = ex.toObject()
    expect(obj.stack).toBeDefined()
    expect(obj.stack.length).toBeGreaterThan(0)
  })

  it('preserves stack in toError()', () => {
    const original = new Error('test error')
    const ex = new GrpcUnaryRequestException(original)
    const err = ex.toError()
    expect(err.stack).toBe(original.stack)
  })

  it('omits undefined contextCode in toObject()', () => {
    const exception = new GrpcUnaryRequestException(new Error('test error'))
    const object = exception.toObject()

    expect('contextCode' in object).toBe(false)
  })

  it('preserves defined contextCode in toObject()', () => {
    const exception = new GrpcUnaryRequestException(new Error('test error'), {
      contextCode: 5,
    })
    const object = exception.toObject()

    expect(object.contextCode).toBe(5)
  })

  it('omits undefined contextCode in toCompactError() details', () => {
    const exception = new GrpcUnaryRequestException(new Error('test error'))
    const compactError = exception.toCompactError()
    const [, rawDetails] = compactError.message.split(' | ')
    const details = JSON.parse(rawDetails)

    expect('contextCode' in details).toBe(false)
  })
})

describe('ConcreteException - setName and setMessage', () => {
  it('setName updates both name and errorClass', () => {
    const ex = new GeneralException(new Error('test'))
    ex.setName('CustomError')
    expect(ex.name).toBe('CustomError')
    expect(ex.errorClass).toBe('CustomError')
  })

  it('setMessage updates message', () => {
    const ex = new GeneralException(new Error('original'))
    ex.setMessage('updated message')
    expect(ex.message).toBe('updated message')
  })

  it('originalMessage is preserved after setMessage', () => {
    const ex = new GeneralException(new Error('original'))
    ex.setMessage('updated')
    expect(ex.originalMessage).toBe('original')
  })
})
