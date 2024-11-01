import { ConcreteException } from '../base'


export class WalletException extends ConcreteException {
  public errorClass: string = 'WalletException'
}
