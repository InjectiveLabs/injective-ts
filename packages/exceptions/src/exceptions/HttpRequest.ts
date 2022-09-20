import { Exception } from '../exception'
import { ErrorContext, ErrorType, HttpRequestMethod } from '../types'

export class HttpRequestException extends Exception {
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

  // eslint-disable-next-line class-methods-use-this
  protected parseMessage(): void {
    //
  }
}
