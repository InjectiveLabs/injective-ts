export abstract class BaseWasmQuery<Params> {
  params: Params

  constructor(params: Params) {
    this.params = params
  }

  public abstract toPayload(): string
}
