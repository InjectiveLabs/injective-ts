import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class TrustWalletException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
    parse(): void;
}
//# sourceMappingURL=TrustWalletException.d.ts.map