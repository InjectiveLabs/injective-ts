import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class LedgerCosmosException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
    parse(): void;
}
//# sourceMappingURL=LedgerCosmosException.d.ts.map