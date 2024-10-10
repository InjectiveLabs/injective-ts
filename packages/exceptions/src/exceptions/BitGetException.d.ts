import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class BitGetException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
    parse(): void;
}
//# sourceMappingURL=BitGetException.d.ts.map