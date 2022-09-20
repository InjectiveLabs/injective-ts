/* eslint-disable class-methods-use-this */
import {
  Exception,
  ErrorType,
  ErrorContext,
  ErrorCode,
  UnspecifiedErrorCode,
  ErrorContextCode,
} from './types'

export abstract class ConcreteException extends Error implements Exception {
  /**
   * The type of the Error
   */
  public type: ErrorType = ErrorType.Unspecified

  /**
   * Error specific code (HttpStatus, GrpcStatus, etc)
   */
  public code: ErrorCode = UnspecifiedErrorCode

  /**
   * The name of the error (the name of the instance of the Exception)
   */
  public name!: string

  /**
   * Providing more context as to where the exception was thrown
   * (ex: on-chain module, etc)
   */
  public contextModule?: string

  /**
   * Providing more context as to why the exception was thrown
   * (ex: on-chain error code, etc)
   */
  public contextCode?: ErrorContextCode = UnspecifiedErrorCode

  /**
   * Parsed message of the exception
   */
  public message: string = ''

  /**
   * The original stack of the error
   */
  public stack?: string = ''

  /**
   * The original message of the error
   */
  public errorMessage: string = ''

  constructor(error: Error, context?: ErrorContext) {
    super(error.message)
    this.parseError(error)
    this.parseContext(context)
    this.parse()
  }

  public parse(): void {
    //
  }

  public parseError(error: Error) {
    this.setName(this.constructor.name)
    this.setStack(error.stack || '')
    this.setMessage(error.message)
    this.errorMessage = error.message
  }

  public parseContext(context?: ErrorContext) {
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

  public setStack(stack: string) {
    super.stack = stack
    this.stack = stack
  }

  public setName(name: string) {
    super.name = name
    this.name = name
  }

  public setMessage(message: string) {
    super.message = message
    this.message = message
  }

  public setContextModule(contextModule: string) {
    this.contextModule = contextModule
  }

  public setContextCode(code: ErrorContextCode) {
    this.contextCode = code
  }

  public toOriginalError(): Error {
    const error = new Error(this.errorMessage)
    error.stack = this.stack
    error.name = this.name || ''

    return error
  }

  public toError(): Error {
    const error = new Error(this.message)
    error.stack = this.stack
    error.name = this.name || ''

    return error
  }

  public toJson(): string {
    return JSON.stringify({ error: this.message, stack: this.stack })
  }

  public toString() {
    return this.message
  }
}
