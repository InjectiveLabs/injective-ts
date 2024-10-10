import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class LedgerException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
    parse(): void;
}
//# sourceMappingURL=LedgerException.d.ts.map