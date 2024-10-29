import { ConcreteException } from '../exception'

export class WalletException extends ConcreteException {
  public errorClass: string = 'WalletException'
}
