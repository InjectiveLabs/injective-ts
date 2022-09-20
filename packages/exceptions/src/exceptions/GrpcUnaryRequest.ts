import { Exception } from '../exception'
import { ErrorContext, ErrorType } from '../types'

export class GrpcUnaryRequestException extends Exception {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.GrpcUnaryRequest
  }

  /**
   * Custom implementation for setting the message based on the error
   *
   * protected parseMessage() {
   *    //
   * }
   *
   */
}
