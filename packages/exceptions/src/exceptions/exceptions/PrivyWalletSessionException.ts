import { ConcreteException } from '../base.js'

export class PrivyWalletSessionException extends ConcreteException {
  public static errorClass: string = 'PrivyWalletSessionException'

  public parse(): void {
    this.setName(PrivyWalletSessionException.errorClass)
  }
}
