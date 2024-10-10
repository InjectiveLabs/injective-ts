import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class TransactionException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
    parse(): void;
}
//# sourceMappingURL=TransactionException.d.ts.map