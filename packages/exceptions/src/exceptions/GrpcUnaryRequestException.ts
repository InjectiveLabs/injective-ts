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
        'Product is under heavy load, refresh the page in a few seconds.',
      )
      this.setOriginalMessage(
        `The product is experiencing higher than usual demand. Hang tight, engineers are doing their best to improve the performance and efficiency.`,
      )
    }
  }
}
