import { ConcreteException } from '../base.js'

export class GeneralException extends ConcreteException {
  public static errorClass: string = 'GeneralException'

  public parse(): void {
    this.setName(GeneralException.errorClass)
  }
}
