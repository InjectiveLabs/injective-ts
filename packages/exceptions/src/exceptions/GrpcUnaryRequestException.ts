import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'

export class GrpcUnaryRequestException extends ConcreteException {
  public errorClass: string = 'GrpcUnaryRequestException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.GrpcUnaryRequest
  }
}
