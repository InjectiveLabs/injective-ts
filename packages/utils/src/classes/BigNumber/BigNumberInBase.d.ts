import type BigNumberInWei from './BigNumberInWei';
import BigNumber from './BigNumber';
export default class BigNumberInBase extends BigNumber {
    static make(number: BigNumber.Value): BigNumberInBase;
    minus(n: BigNumber.Value, base?: number): BigNumberInBase;
    plus(n: BigNumber.Value, base?: number): BigNumberInBase;
    dividedBy(n: BigNumber.Value, base?: number): BigNumberInBase;
    div(n: BigNumber.Value, base?: number): BigNumberInBase;
    multipliedBy(n: BigNumber.Value, base?: number): BigNumberInBase;
    times(n: BigNumber.Value, base?: number): BigNumberInBase;
    pow(n: BigNumber.Value, base?: number): BigNumberInBase;
    toWei(decimals?: number): BigNumberInWei;
}
//# sourceMappingURL=BigNumberInBase.d.ts.map