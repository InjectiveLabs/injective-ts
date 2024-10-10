import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class TrezorException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
}
//# sourceMappingURL=TrezorException.d.ts.map