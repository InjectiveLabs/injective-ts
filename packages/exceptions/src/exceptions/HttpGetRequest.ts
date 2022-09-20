import { Exception } from '../exception'
import { ErrorContext, ErrorType } from '../types'

export class HttpGetRequest extends Exception {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.HttpGetRequest
  }
}
