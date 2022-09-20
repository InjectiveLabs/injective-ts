import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType, HttpRequestMethod } from '../types'

export class HttpRequestException extends ConcreteException {
  public method: HttpRequestMethod = HttpRequestMethod.Get

  constructor(
    error: Error,
    context?: ErrorContext & { method?: HttpRequestMethod },
  ) {
    super(error, context)

    this.type = ErrorType.HttpRequest
    this.method = context
      ? context.method || HttpRequestMethod.Get
      : HttpRequestMethod.Get
  }
}
