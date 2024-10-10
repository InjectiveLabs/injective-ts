import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class MetamaskException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
    parse(): void;
}
//# sourceMappingURL=MetamaskException.d.ts.map