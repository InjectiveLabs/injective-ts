import type BigNumberInBase from './BigNumberInBase';
import BigNumber from './BigNumber';
export default class BigNumberInWei extends BigNumber {
    static make(number: BigNumber.Value): BigNumberInWei;
    minus(n: BigNumber.Value, base?: number): BigNumberInWei;
    plus(n: BigNumber.Value, base?: number): BigNumberInWei;
    dividedBy(n: BigNumber.Value, base?: number): BigNumberInWei;
    div(n: BigNumber.Value, base?: number): BigNumberInWei;
    multipliedBy(n: BigNumber.Value, base?: number): BigNumberInWei;
    times(n: BigNumber.Value, base?: number): BigNumberInWei;
    pow(n: BigNumber.Value, base?: number): BigNumberInWei;
    toBase(decimals?: number): BigNumberInBase;
}
//# sourceMappingURL=BigNumberInWei.d.ts.map