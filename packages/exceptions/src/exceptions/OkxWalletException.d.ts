import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class OkxWalletException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
    parse(): void;
}
//# sourceMappingURL=OkxWalletException.d.ts.map