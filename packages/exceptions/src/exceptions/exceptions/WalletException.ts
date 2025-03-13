import { ConcreteException } from '../base.js'

export class WalletException extends ConcreteException {
  public static errorClass: string = 'WalletException'

  public parse(): void {
    this.setName(WalletException.errorClass)
  }
}
