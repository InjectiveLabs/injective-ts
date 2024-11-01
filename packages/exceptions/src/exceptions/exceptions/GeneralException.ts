import { ConcreteException } from '../base'


export class GeneralException extends ConcreteException {
  public errorClass: string = 'GeneralException'
}
