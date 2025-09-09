import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import type { ErrorContext} from '../types/index.js';

export class Web3Exception extends ConcreteException {
  public static errorClass: string = 'Web3Exception'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.Web3
  }

  public parse(): void {
    this.setName(Web3Exception.errorClass)
  }
}
