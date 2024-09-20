export abstract class TokenPriceUtilBase {
  public abstract fetchPrice(
    symbol: string,
    options: any,
  ): Promise<{
    chf?: number
    eur?: number
    gbp?: number
    usd: number
  }>

  public abstract fetchUsdPrice(symbol: string, options: any): Promise<number>
}
