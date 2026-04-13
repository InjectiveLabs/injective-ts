import { ConcreteException } from '../base.js'

export class TurnkeyWalletSessionException extends ConcreteException {
  public static errorClass: string = 'TurnkeyWalletSessionException'

  public parse(): void {
    this.setName(TurnkeyWalletSessionException.errorClass)
  }
}
