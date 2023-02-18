import { ConcreteException } from '../exception'

export class GeneralException extends ConcreteException {
  public errorClass: string = 'GeneralException'
}
