import {
  ErrorType,
  ErrorContext,
  ErrorCode,
  UnspecifiedErrorCode,
} from './types'

export abstract class Exception {
  __proto__ = Error

  public type: ErrorType = ErrorType.Unspecified

  public contextModule?: string

  public code: ErrorCode = UnspecifiedErrorCode

  public message: string = ''

  public stack?: string

  constructor(error: Error, context?: ErrorContext) {
    this.parseError(error)
    this.parseContext(context)
    Object.setPrototypeOf(this, Exception.prototype)
  }

  protected parseError(error: Error) {
    this.message = error.message
    this.stack = error.stack
  }

  protected parseContext(context?: ErrorContext) {
    const { contextModule, type, code } = context || {
      contextModule: '',
      code: UnspecifiedErrorCode,
      type: ErrorType.Unspecified,
    }

    this.contextModule = contextModule
    this.type = type || ErrorType.Unspecified
    this.code = code || UnspecifiedErrorCode
  }

  public setType(type: ErrorType) {
    this.type = type
  }

  public setCode(code: ErrorCode) {
    this.code = code
  }

  public setMessage(message: string) {
    this.message = message
  }

  public setContextModule(contextModule: string) {
    this.contextModule = contextModule
  }
}
