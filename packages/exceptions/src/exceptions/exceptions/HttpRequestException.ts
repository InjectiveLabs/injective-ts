import { ConcreteException } from '../base'

import { ErrorContext, ErrorType, HttpRequestMethod } from '../types'

export class HttpRequestException extends ConcreteException {
  public errorClass: string = 'HttpRequestException'

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
    this.context = context?.context || 'Unknown'
  }
}
