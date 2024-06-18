/* eslint-disable class-methods-use-this */
import {
  Exception,
  ErrorType,
  ErrorContext,
  ErrorCode,
  UnspecifiedErrorCode,
  ErrorContextCode,
} from './types'
import { toPascalCase } from './utils'

export abstract class ConcreteException extends Error implements Exception {
  /**
   * The name of the error class as it the constructor.name might
   * give a minified class name when we bundle using webpack
   */
  public static errorClass = ''

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
   * The name of the error (the name of the instance of the Exception)
   * Needed for reporting reasons, ex: bugsnag
   */
  public errorClass!: string

  /**
   * Providing more context
   * (ex: endpoint on http request)
   */
  public context?: string

  /**
   * Providing more context as to where the exception was thrown
   * (ex: on-chain module, etc)
   */
  public contextModule?: string

  /**
   * Providing more context as to why the exception was thrown
   * (ex: on-chain error code, etc)
   */
  public contextCode?: ErrorContextCode

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
  public originalMessage: string = ''

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
    this.setName(this.errorClass || this.constructor.name)
    this.setStack(error.stack || '')
    this.setMessage(error.message)
    this.originalMessage = error.message
  }

  public parseContext(errorContext?: ErrorContext) {
    const { contextModule, type, code, context } = errorContext || {
      contextModule: 'Unknown',
      context: 'Unknown',
      code: UnspecifiedErrorCode,
      type: ErrorType.Unspecified,
    }

    this.context = context
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

  public setContext(context: string) {
    this.context = context
  }

  public setOriginalMessage(message: string) {
    this.originalMessage = message
  }

  public setStack(stack: string) {
    try {
      this.stack = stack
    } catch (e) {
      // throw nothing here
    }
  }

  public setName(name: string) {
    super.name = name
    this.name = name
    this.errorClass = name
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
    const error = new Error(this.originalMessage)
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

  public toCompactError(): Error {
    const name = this.name || toPascalCase(this.type)

    const error = new Error(
      `${this.message} | ${JSON.stringify({
        originalMessage: this.originalMessage,
        message: this.message,
        errorClass: name,
        code: this.code,
        type: this.type,
        context: this.context,
        contextModule: this.contextModule,
        contextCode: this.contextCode,
        stack: (this.stack || '').split('\n').map((line) => line.trim()),
      })}`,
    )
    error.stack = this.stack
    error.name = this.name || toPascalCase(this.type)

    return error
  }

  public toJson(): string {
    return JSON.stringify({ error: this.message, stack: this.stack })
  }

  public toObject() {
    const name = this.name || toPascalCase(this.type)

    return {
      message: this.message,
      originalMessage: this.originalMessage,
      errorClass: name,
      code: this.code,
      type: this.type,
      context: this.context,
      contextModule: this.contextModule,
      contextCode: this.contextCode,
      stack: (this.stack || '').split('\n').map((line) => line.trim()),
    }
  }

  public toString() {
    return this.message
  }
}
