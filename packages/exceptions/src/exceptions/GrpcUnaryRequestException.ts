import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'

export class GrpcUnaryRequestException extends ConcreteException {
  public errorClass: string = 'GrpcUnaryRequestException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.GrpcUnaryRequest
  }

  public parse(): void {
    const { message } = this

    if (message.toLowerCase().includes('response closed without headers')) {
      this.setMessage(
        "Hang tight, we're under heavy load, refresh the page in a few seconds.",
      )
      this.setOriginalMessage(
        `Hang tight, we're experiencing higher than usual demand, and are doing everything we can to improve performance. In the meantime, try refreshing the page until our code monkeys at our headquarters fix this.`,
      )
    }
  }
}
