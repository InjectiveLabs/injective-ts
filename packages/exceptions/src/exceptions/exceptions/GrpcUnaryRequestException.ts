import { ConcreteException } from '../base.js'
import { ErrorContext, ErrorType, GRPC_REQUEST_FAILED } from '../types/index.js'

export class GrpcUnaryRequestException extends ConcreteException {
  public static errorClass: string = 'GrpcUnaryRequestException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.GrpcUnaryRequest
  }

  public parse(): void {
    const { message } = this

    if (message.toLowerCase().includes('response closed without headers')) {
      this.setMessage(
        'The request has failed. The server has closed the connection without sending any headers.',
      )
      this.setContextCode(GRPC_REQUEST_FAILED)
    }

    this.setName(GrpcUnaryRequestException.errorClass)
  }
}
