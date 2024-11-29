import { ConcreteException } from '../base.js'
import { ErrorContext, ErrorType, HttpRequestMethod } from '../types/index.js'

export class HttpRequestException extends ConcreteException {
  public static errorClass: string = 'HttpRequestException'

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

  public parse(): void {
    this.setName(HttpRequestException.errorClass)
  }
}
