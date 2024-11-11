/* eslint-disable class-methods-use-this */
import {
  Exception,
  ErrorType,
  ErrorContext,
  ErrorCode,
  UnspecifiedErrorCode,
  ErrorContextCode,
} from './types/index.js'

/**
 * we have to define it here as
 * well as in @injectivelabs/utils as that package is
 * importing the exceptions package
 * */
const toPascalCase = (str: string): string => {
  return `${str}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      (_$1, $2, $3) => `${$2.toUpperCase() + $3}`,
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

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
    this.name = name
    this.errorClass = name
    super.name = name
  }

  public setMessage(message: string) {
    this.message = message
    super.message = message
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
        type: this.type,
        code: this.code,
        errorClass: name,
        message: this.message,
        context: this.context,
        contextCode: this.contextCode,
        contextModule: this.contextModule,
        originalMessage: this.originalMessage,
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
      code: this.code,
      type: this.type,
      errorClass: name,
      message: this.message,
      context: this.context,
      contextCode: this.contextCode,
      contextModule: this.contextModule,
      originalMessage: this.originalMessage,
      stack: (this.stack || '').split('\n').map((line) => line.trim()),
    }
  }

  public toString() {
    return this.message
  }
}
